# Software Architecture

> Cowlace platform — from tracker GPS ping to farmer's phone.

## Data Flow

```
┌──────────────┐     4G/TCP      ┌──────────────┐
│  GPS Tracker  │───────────────►│  TCP Receiver │
│  (on cow)     │  GT06 protocol │  (port 7700)  │
└──────────────┘                 └──────┬───────┘
                                        │ parsed GPS data
                                        ▼
                                 ┌──────────────┐
                                 │   Database    │
                                 │  (PostgreSQL  │
                                 │   + PostGIS)  │
                                 └──────┬───────┘
                                        │
                          ┌─────────────┼─────────────┐
                          ▼             ▼             ▼
                   ┌───────────┐ ┌───────────┐ ┌───────────┐
                   │  REST API │ │  Alerts   │ │  Web Map  │
                   │           │ │  (SMS +   │ │ Dashboard │
                   │           │ │   Push)   │ │           │
                   └─────┬─────┘ └───────────┘ └───────────┘
                         │
                         ▼
                   ┌───────────┐
                   │ Mobile App│
                   │ (future)  │
                   └───────────┘
```

## Components

### 1. TCP Receiver (`receiver/`)
- Listens on a public port (e.g., 7700)
- Accepts TCP connections from GPS trackers
- Parses GT06 / iCar binary protocol
- Sends ACK responses (required — tracker disconnects without them)
- Writes parsed data to database
- Handles: connection drops, reconnects, offline buffer replay
- **Tech:** Node.js (net module) or Python (asyncio)

### 2. Database
- **PostgreSQL + PostGIS** for geo queries
- Tables: `devices`, `positions`, `geofences`, `alerts`, `farmers`
- PostGIS enables: point-in-polygon (geofence), distance queries, trail rendering
- Index on (device_id, timestamp) for fast history lookups

### 3. REST API (`api/`)
- CRUD for devices, farmers, geofences
- GET /positions/latest — all cattle current positions
- GET /positions/history/:device_id — trail for one animal
- POST /geofences — create geofence boundary
- GET /alerts — recent alerts
- Auth: simple API key to start, JWT later
- **Tech:** Node.js (Express/Fastify) or Python (FastAPI)

### 4. Web Dashboard (`web/`)
- Map view (Leaflet.js + OpenStreetMap — free, no API key needed)
- Show all cattle as markers, color-coded by herd/farmer
- Click cattle → show trail, battery, last seen
- Draw geofence polygons on map
- Alert history panel
- **Tech:** HTML + JS + Leaflet.js (keep it simple)

### 5. Alert System (`alerts/`)
- **Geofence breach:** cattle leaves boundary → SMS to farmer
- **Low battery:** tracker reports low charge → SMS
- **Tamper/offline:** tracker goes silent for >1 hour → SMS
- **Night movement:** position change between 10pm-5am → SMS
- **SMS gateway:** MSG91 or Textlocal (Indian providers, Telugu SMS support)

## Database Schema (initial)

```sql
-- Farmers
CREATE TABLE farmers (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,          -- for SMS alerts
    language TEXT DEFAULT 'te'    -- te=Telugu, en=English
);

-- Devices (trackers)
CREATE TABLE devices (
    id SERIAL PRIMARY KEY,
    imei TEXT UNIQUE NOT NULL,    -- tracker IMEI
    name TEXT,                    -- "Lakshmi", "Brown cow"
    farmer_id INTEGER REFERENCES farmers(id),
    status TEXT DEFAULT 'active'
);

-- GPS positions
CREATE TABLE positions (
    id BIGSERIAL PRIMARY KEY,
    device_id INTEGER REFERENCES devices(id),
    timestamp TIMESTAMPTZ NOT NULL,
    location GEOGRAPHY(POINT, 4326) NOT NULL,  -- PostGIS
    speed FLOAT,
    battery INTEGER,             -- percentage
    signal INTEGER,              -- GSM signal strength
    satellites INTEGER
);

-- Geofences
CREATE TABLE geofences (
    id SERIAL PRIMARY KEY,
    farmer_id INTEGER REFERENCES farmers(id),
    name TEXT,
    boundary GEOGRAPHY(POLYGON, 4326) NOT NULL,
    active BOOLEAN DEFAULT true
);

-- Alerts
CREATE TABLE alerts (
    id BIGSERIAL PRIMARY KEY,
    device_id INTEGER REFERENCES devices(id),
    type TEXT NOT NULL,           -- 'geofence', 'battery', 'tamper', 'night'
    message TEXT,
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    sms_sent BOOLEAN DEFAULT false
);
```

## Deployment

- **Phase 1 (validation):** Single VPS (DigitalOcean/AWS Lightsail, ₹500-1500/month)
  - All components on one server
  - PostgreSQL on same server
  - Enough for 50-100 trackers

- **Phase 2 (scale):** Separate services
  - TCP receiver on its own server (stateful connections)
  - API + Web on app server
  - Managed PostgreSQL (AWS RDS or similar)
  - Enough for 1000+ trackers

## Tech Stack Decision

**Node.js** recommended because:
- TCP server (net module) and HTTP API (Express) in same language
- Good async I/O for handling many tracker connections
- Large ecosystem for Indian SMS gateways
- User can build mobile app later with React Native (same language)

## Open Questions

- Which SMS gateway has best Telugu support and rural delivery?
- Do we need WebSocket for real-time map updates?
- How to handle tracker protocol discovery (first packet identifies protocol)?
- Offline-first mobile app for areas with bad farmer phone signal?

## Related Pages

- [[../hardware/protocols]] — GT06 binary format
- [[../hardware/trackers]] — which devices we support
- [[receiver]] — TCP server implementation details
