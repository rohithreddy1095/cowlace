-- Cowlace Database Schema
-- Requires PostgreSQL with PostGIS extension

CREATE EXTENSION IF NOT EXISTS postgis;

-- Farmers
CREATE TABLE IF NOT EXISTS farmers (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    language TEXT DEFAULT 'te',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Devices (GPS trackers)
CREATE TABLE IF NOT EXISTS devices (
    id SERIAL PRIMARY KEY,
    imei TEXT UNIQUE NOT NULL,
    name TEXT,
    farmer_id INTEGER REFERENCES farmers(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- GPS positions
CREATE TABLE IF NOT EXISTS positions (
    id BIGSERIAL PRIMARY KEY,
    device_id INTEGER NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    location GEOGRAPHY(POINT, 4326),
    speed DOUBLE PRECISION,
    heading DOUBLE PRECISION,
    battery INTEGER,
    signal_strength INTEGER,
    satellites INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast queries: latest position per device, history by time range
CREATE INDEX IF NOT EXISTS idx_positions_device_time ON positions (device_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_positions_location ON positions USING GIST (location);

-- Auto-populate the PostGIS location column from lat/lng
CREATE OR REPLACE FUNCTION set_position_location()
RETURNS TRIGGER AS $$
BEGIN
    NEW.location := ST_SetSRID(ST_MakePoint(NEW.lng, NEW.lat), 4326)::geography;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_set_position_location
    BEFORE INSERT ON positions
    FOR EACH ROW
    EXECUTE FUNCTION set_position_location();

-- Geofences
CREATE TABLE IF NOT EXISTS geofences (
    id SERIAL PRIMARY KEY,
    farmer_id INTEGER REFERENCES farmers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    boundary GEOGRAPHY(POLYGON, 4326) NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_geofences_boundary ON geofences USING GIST (boundary);

-- Alerts
CREATE TABLE IF NOT EXISTS alerts (
    id BIGSERIAL PRIMARY KEY,
    device_id INTEGER REFERENCES devices(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    message TEXT,
    sms_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alerts_device_time ON alerts (device_id, created_at DESC);
