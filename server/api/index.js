const express = require('express');
const path = require('path');
const db = require('../db');

function createApp() {
  const app = express();
  app.use(express.json());

  // Serve dashboard
  app.use(express.static(path.join(__dirname, '../../public')));

  // --- Devices ---

  // List all devices with their latest position
  app.get('/api/devices', async (req, res) => {
    const result = await db.query(`
      SELECT d.id, d.imei, d.name, d.status, d.farmer_id,
        p.lat, p.lng, p.speed, p.heading, p.battery, p.satellites,
        p.timestamp as last_seen
      FROM devices d
      LEFT JOIN LATERAL (
        SELECT lat, lng, speed, heading, battery, satellites, timestamp
        FROM positions
        WHERE device_id = d.id
        ORDER BY timestamp DESC
        LIMIT 1
      ) p ON true
      ORDER BY d.id
    `);
    res.json(result.rows);
  });

  // Update device name or assign to farmer
  app.patch('/api/devices/:id', async (req, res) => {
    const { name, farmer_id } = req.body;
    const sets = [];
    const vals = [];
    let idx = 1;
    if (name !== undefined) { sets.push(`name = $${idx++}`); vals.push(name); }
    if (farmer_id !== undefined) { sets.push(`farmer_id = $${idx++}`); vals.push(farmer_id); }
    if (sets.length === 0) return res.status(400).json({ error: 'Nothing to update' });
    vals.push(req.params.id);
    const result = await db.query(
      `UPDATE devices SET ${sets.join(', ')} WHERE id = $${idx} RETURNING *`,
      vals
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Device not found' });
    res.json(result.rows[0]);
  });

  // --- Positions ---

  // Latest position for all devices
  app.get('/api/positions/latest', async (req, res) => {
    const result = await db.query(`
      SELECT DISTINCT ON (device_id)
        p.device_id, d.imei, d.name,
        p.lat, p.lng, p.speed, p.heading, p.battery, p.satellites,
        p.timestamp
      FROM positions p
      JOIN devices d ON d.id = p.device_id
      ORDER BY device_id, timestamp DESC
    `);
    res.json(result.rows);
  });

  // Position history for a device
  app.get('/api/positions/:deviceId/history', async (req, res) => {
    const { deviceId } = req.params;
    const hours = parseInt(req.query.hours) || 24;
    const result = await db.query(
      `SELECT lat, lng, speed, heading, battery, satellites, timestamp
       FROM positions
       WHERE device_id = $1 AND timestamp > NOW() - INTERVAL '1 hour' * $2
       ORDER BY timestamp ASC`,
      [deviceId, hours]
    );
    res.json(result.rows);
  });

  // --- Geofences ---

  // List geofences
  app.get('/api/geofences', async (req, res) => {
    const result = await db.query(`
      SELECT id, farmer_id, name, active,
        ST_AsGeoJSON(boundary)::json as boundary_geojson
      FROM geofences
      ORDER BY id
    `);
    res.json(result.rows);
  });

  // Create geofence (expects GeoJSON polygon)
  app.post('/api/geofences', async (req, res) => {
    const { farmer_id, name, boundary } = req.body;
    if (!name || !boundary) {
      return res.status(400).json({ error: 'name and boundary (GeoJSON) required' });
    }
    const result = await db.query(
      `INSERT INTO geofences (farmer_id, name, boundary)
       VALUES ($1, $2, ST_GeomFromGeoJSON($3)::geography)
       RETURNING id, name, active`,
      [farmer_id || null, name, JSON.stringify(boundary)]
    );
    res.status(201).json(result.rows[0]);
  });

  // Delete geofence
  app.delete('/api/geofences/:id', async (req, res) => {
    await db.query('DELETE FROM geofences WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  });

  // --- Alerts ---

  app.get('/api/alerts', async (req, res) => {
    const limit = parseInt(req.query.limit) || 50;
    const result = await db.query(
      `SELECT a.id, a.type, a.message, a.created_at, d.name as device_name, d.imei
       FROM alerts a
       JOIN devices d ON d.id = a.device_id
       ORDER BY a.created_at DESC
       LIMIT $1`,
      [limit]
    );
    res.json(result.rows);
  });

  // --- Farmers ---

  app.get('/api/farmers', async (req, res) => {
    const result = await db.query('SELECT * FROM farmers ORDER BY id');
    res.json(result.rows);
  });

  app.post('/api/farmers', async (req, res) => {
    const { name, phone, language } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ error: 'name and phone required' });
    }
    const result = await db.query(
      'INSERT INTO farmers (name, phone, language) VALUES ($1, $2, $3) RETURNING *',
      [name, phone, language || 'te']
    );
    res.status(201).json(result.rows[0]);
  });

  return app;
}

module.exports = { createApp };
