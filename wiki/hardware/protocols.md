# GPS Tracker Communication Protocols

> How GPS trackers send data to your server over TCP.

## How It Works

```
Tracker (on cow)                     Your Server
     │                                    │
     │──── TCP connection ───────────────►│
     │     (to YOUR_IP:PORT)              │
     │                                    │
     │──── Binary packet ───────────────►│
     │     (login, GPS data, heartbeat)   │
     │                                    │
     │◄─── ACK response ────────────────│
     │     (server confirms receipt)      │
     │                                    │
     └── repeats every N minutes ─────────┘
```

The tracker opens a TCP socket to your server IP and port.
It sends binary-encoded packets containing GPS coordinates, speed,
battery level, signal strength, etc. Your server must parse these
packets and send acknowledgment replies.

## GT06 Protocol (Most Common)

Used by: Concox, generic Chinese trackers, many OEM devices.
Traccar port: 5023

### Packet Structure

```
Start    Length   Protocol   Data          Checksum   End
78 78    XX       XX         ...           XX XX      0D 0A
```

### Key Message Types

| Protocol # | Type | Content |
|---|---|---|
| 0x01 | Login | Device IMEI, used for identification |
| 0x12 | Location | Lat, lng, speed, heading, GPS satellites |
| 0x13 | Status | Battery, GSM signal, charging state |
| 0x23 | Heartbeat | Keep-alive, device is still on |
| 0x94 | WiFi/LBS | Cell tower positioning (when no GPS) |

### Sample Login Packet (hex)

```
78 78 0D 01 03 51 60 80 80 56 21 40 01 00 01 8C DD 0D 0A
            └─ IMEI bytes ──────────┘
```

### Server Must Reply

The server MUST send an ACK for every packet, otherwise the tracker
will disconnect and retry. ACK format:

```
78 78 05 01 00 01 D9 DC 0D 0A
         └─ protocol # echoed back
```

## iCar Protocol

Less documented than GT06. May use a variant of GT06 or their own format.

**To determine:** Buy the tracker, point it at a raw TCP listener, capture
the binary data, and compare against known protocols. Likely GT06 variant
based on the SMS command format.

## What We Need to Build

A TCP server that:
1. Listens on a port (e.g., 7700)
2. Accepts connections from trackers
3. Parses the binary protocol (GT06 at minimum)
4. Extracts: device_id, lat, lng, speed, battery, timestamp
5. Sends ACK replies
6. Stores parsed data in database
7. Handles connection drops and reconnects gracefully

## Reference Implementations

- [Traccar GT06 decoder (Java)](https://github.com/traccar/traccar) — most complete
- [gps-tracker-server (Python)](https://github.com/rdkls/gps-tracker-server) — simpler
- [GPS-Tracker (Laravel)](https://github.com/eusonlito/GPS-Tracker) — PHP-based
- [GT06 protocol spec PDF](https://www.traccar.org/protocol/5023-gt06/GT06_GPS_Tracker_Communication_Protocol_v1.8.1.pdf)

## Open Questions

- Confirm which protocol iCar IK145 uses
- Does the tracker buffer data when TCP connection fails?
- What's the reconnect behavior? (Immediate retry? Backoff?)
- Maximum packet size for location batches?

## Related Pages

- [[trackers]] — which trackers we're using
- [[../software/receiver]] — our TCP server implementation
