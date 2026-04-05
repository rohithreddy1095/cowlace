/**
 * GT06 Protocol Parser
 *
 * Parses binary packets from GPS trackers using the GT06 protocol.
 * Reference: Concox GT06 GPS Tracker Communication Protocol v1.8.1
 *
 * Packet format:
 *   Start (2B) | Length (1B) | Protocol (1B) | Data (NB) | Serial (2B) | Checksum (2B) | End (2B)
 *   78 78       XX            XX              ...         XX XX          XX XX            0D 0A
 */

const PROTO = {
  LOGIN: 0x01,
  LOCATION: 0x12,
  STATUS: 0x13,
  HEARTBEAT: 0x23,
  STRING: 0x15,
  ALARM: 0x16,
  GPS_LBS: 0x22,
  GPS_LBS_STATUS: 0x26,
};

function parseLogin(data) {
  // IMEI is 8 bytes starting at offset 0, BCD encoded
  const imeiBytes = data.subarray(0, 8);
  let imei = '';
  for (const b of imeiBytes) {
    imei += b.toString(16).padStart(2, '0');
  }
  // Remove leading zero if present (IMEI is 15 digits)
  if (imei.startsWith('0')) imei = imei.slice(1);
  return { imei };
}

function parseLocation(data) {
  let offset = 0;

  // Date/time (6 bytes): YY MM DD HH MM SS
  const year = 2000 + data[offset++];
  const month = data[offset++];
  const day = data[offset++];
  const hour = data[offset++];
  const minute = data[offset++];
  const second = data[offset++];
  const timestamp = new Date(Date.UTC(year, month - 1, day, hour, minute, second));

  // GPS info length + satellites (2 bytes)
  const gpsInfoLength = data[offset] >> 4;
  const satellites = data[offset] & 0x0f;
  offset++;

  // Latitude (4 bytes, unit: 1/30000 minute)
  const latRaw = data.readUInt32BE(offset);
  offset += 4;
  let lat = latRaw / 30000.0 / 60.0;

  // Longitude (4 bytes, unit: 1/30000 minute)
  const lngRaw = data.readUInt32BE(offset);
  offset += 4;
  let lng = lngRaw / 30000.0 / 60.0;

  // Speed (1 byte, km/h)
  const speed = data[offset++];

  // Course/status (2 bytes)
  const courseStatus = data.readUInt16BE(offset);
  offset += 2;

  const heading = courseStatus & 0x03ff;
  const isRealtime = !((courseStatus >> 13) & 1);
  const isGpsPositioned = !((courseStatus >> 12) & 1);
  const isSouthLat = (courseStatus >> 10) & 1;
  const isWestLng = !((courseStatus >> 11) & 1);

  if (isSouthLat) lat = -lat;
  if (isWestLng) lng = -lng;

  return {
    timestamp,
    lat,
    lng,
    speed,
    heading,
    satellites,
    isRealtime,
    isGpsPositioned,
  };
}

function parseStatus(data) {
  // Battery level and signal info
  const info = data[0];
  const voltage = data[1];
  const signal = data[2];

  // Battery percentage estimate from voltage byte
  // Common mapping: 0x00=0%, 0x01=10%, ..., 0x06=100%
  const battery = Math.min(Math.round((voltage / 6) * 100), 100);

  return { battery, signal };
}

function buildAck(protocol, serial) {
  const buf = Buffer.alloc(10);
  buf[0] = 0x78;
  buf[1] = 0x78;
  buf[2] = 0x05; // length
  buf[3] = protocol;
  buf[4] = serial[0];
  buf[5] = serial[1];
  // CRC-ITU checksum over bytes [2..5]
  const crc = crcItu(buf.subarray(2, 6));
  buf[6] = (crc >> 8) & 0xff;
  buf[7] = crc & 0xff;
  buf[8] = 0x0d;
  buf[9] = 0x0a;
  return buf;
}

function crcItu(data) {
  let crc = 0xffff;
  for (const byte of data) {
    crc ^= byte;
    for (let i = 0; i < 8; i++) {
      if (crc & 1) {
        crc = (crc >> 1) ^ 0x8408;
      } else {
        crc >>= 1;
      }
    }
  }
  return crc ^ 0xffff;
}

/**
 * Parse a complete GT06 packet buffer.
 * Returns { protocol, data, serial } or null if invalid.
 */
function parsePacket(buf) {
  if (buf.length < 10) return null;
  if (buf[0] !== 0x78 || buf[1] !== 0x78) return null;
  if (buf[buf.length - 2] !== 0x0d || buf[buf.length - 1] !== 0x0a) return null;

  const length = buf[2];
  const protocol = buf[3];
  const data = buf.subarray(4, 4 + length - 5);
  const serial = buf.subarray(4 + length - 5, 4 + length - 3);

  let parsed = { protocol, serial };

  switch (protocol) {
    case PROTO.LOGIN:
      parsed.type = 'login';
      parsed.data = parseLogin(data);
      break;
    case PROTO.LOCATION:
    case PROTO.GPS_LBS:
    case PROTO.GPS_LBS_STATUS:
      parsed.type = 'location';
      parsed.data = parseLocation(data);
      break;
    case PROTO.HEARTBEAT:
      parsed.type = 'heartbeat';
      parsed.data = {};
      break;
    case PROTO.STATUS:
      parsed.type = 'status';
      parsed.data = parseStatus(data);
      break;
    case PROTO.ALARM:
      parsed.type = 'alarm';
      parsed.data = parseLocation(data);
      break;
    default:
      parsed.type = 'unknown';
      parsed.data = { raw: data.toString('hex') };
  }

  return parsed;
}

/**
 * Extract complete packets from a buffer that may contain multiple packets
 * or partial packets. Returns { packets: [], remainder: Buffer }.
 */
function extractPackets(buffer) {
  const packets = [];
  let offset = 0;

  while (offset < buffer.length - 1) {
    // Find start marker
    if (buffer[offset] !== 0x78 || buffer[offset + 1] !== 0x78) {
      offset++;
      continue;
    }

    // Need at least 3 bytes to read length
    if (offset + 3 > buffer.length) break;

    const length = buffer[offset + 2];
    const totalLength = length + 5; // start(2) + length(1) + data + end(2)

    // Check if we have the full packet
    if (offset + totalLength > buffer.length) break;

    const packet = buffer.subarray(offset, offset + totalLength);
    const parsed = parsePacket(packet);
    if (parsed) packets.push(parsed);

    offset += totalLength;
  }

  return {
    packets,
    remainder: buffer.subarray(offset),
  };
}

module.exports = {
  parsePacket,
  extractPackets,
  buildAck,
  PROTO,
};
