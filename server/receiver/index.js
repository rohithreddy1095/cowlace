/**
 * TCP Receiver — listens for GPS tracker connections
 *
 * Each tracker opens a persistent TCP connection and sends binary packets
 * (GT06 protocol). We parse them, send ACKs, and store positions in the DB.
 */

const net = require('net');
const gt06 = require('./gt06');
const db = require('../db');

// Track connected devices: socket -> { imei, deviceId, buffer }
const connections = new Map();

async function getOrCreateDevice(imei) {
  // Try to find existing device
  const existing = await db.query(
    'SELECT id FROM devices WHERE imei = $1',
    [imei]
  );
  if (existing.rows.length > 0) return existing.rows[0].id;

  // Auto-register new device
  const result = await db.query(
    'INSERT INTO devices (imei, name) VALUES ($1, $2) RETURNING id',
    [imei, `Tracker-${imei.slice(-4)}`]
  );
  console.log(`[receiver] New device registered: ${imei}`);
  return result.rows[0].id;
}

async function savePosition(deviceId, location) {
  await db.query(
    `INSERT INTO positions (device_id, timestamp, lat, lng, speed, heading, satellites)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      deviceId,
      location.timestamp,
      location.lat,
      location.lng,
      location.speed,
      location.heading,
      location.satellites,
    ]
  );
}

function handleConnection(socket) {
  const addr = `${socket.remoteAddress}:${socket.remotePort}`;
  console.log(`[receiver] Connection from ${addr}`);

  connections.set(socket, { imei: null, deviceId: null, buffer: Buffer.alloc(0) });

  socket.on('data', async (data) => {
    const conn = connections.get(socket);
    conn.buffer = Buffer.concat([conn.buffer, data]);

    const { packets, remainder } = gt06.extractPackets(conn.buffer);
    conn.buffer = remainder;

    for (const packet of packets) {
      try {
        // Always send ACK
        const ack = gt06.buildAck(packet.protocol, packet.serial);
        socket.write(ack);

        switch (packet.type) {
          case 'login': {
            const { imei } = packet.data;
            conn.imei = imei;
            conn.deviceId = await getOrCreateDevice(imei);
            console.log(`[receiver] Device login: ${imei} (id=${conn.deviceId})`);
            break;
          }

          case 'location':
          case 'alarm': {
            if (!conn.deviceId) {
              console.log(`[receiver] Location from unregistered device, ignoring`);
              break;
            }
            await savePosition(conn.deviceId, packet.data);
            const { lat, lng, speed, satellites } = packet.data;
            console.log(
              `[receiver] ${conn.imei} → ${lat.toFixed(6)}, ${lng.toFixed(6)} ` +
              `speed=${speed}km/h sats=${satellites}`
            );
            break;
          }

          case 'heartbeat':
            // Just ACK, already sent above
            break;

          case 'status': {
            if (conn.deviceId && packet.data.battery !== undefined) {
              console.log(`[receiver] ${conn.imei} battery=${packet.data.battery}%`);
            }
            break;
          }

          default:
            console.log(`[receiver] Unknown packet type=${packet.type} proto=0x${packet.protocol.toString(16)}`);
        }
      } catch (err) {
        console.error(`[receiver] Error processing packet:`, err.message);
      }
    }
  });

  socket.on('close', () => {
    const conn = connections.get(socket);
    console.log(`[receiver] Disconnected: ${conn?.imei || addr}`);
    connections.delete(socket);
  });

  socket.on('error', (err) => {
    console.error(`[receiver] Socket error (${addr}):`, err.message);
    connections.delete(socket);
  });

  // Timeout inactive connections after 5 minutes
  socket.setTimeout(5 * 60 * 1000);
  socket.on('timeout', () => {
    console.log(`[receiver] Timeout: ${addr}`);
    socket.end();
  });
}

function startReceiver(port) {
  const server = net.createServer(handleConnection);
  server.listen(port, () => {
    console.log(`[receiver] TCP server listening on port ${port}`);
  });
  server.on('error', (err) => {
    console.error(`[receiver] Server error:`, err.message);
  });
  return server;
}

module.exports = { startReceiver };
