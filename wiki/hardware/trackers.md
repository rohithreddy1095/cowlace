# GPS Trackers — Evaluated Options

> Production-ready 4G GPS trackers suitable for cattle, available in India.

## Decision

**Buy 1-2 ready-made trackers for Phase 1 validation.** Build own hardware only
after proving the concept works in the field.

---

## Recommended: iCar IK145

- **Price:** ~$129 (₹10,800) + shipping
- **Battery:** 20,000mAh Li-Polymer — massive, designed for months of operation
- **Solar:** Built-in solar charging
- **Waterproof:** IP68 (submersion-rated, handles monsoon + cattle wading)
- **Connectivity:** 4G LTE (B1/B3/B5/B8/B34/B38/B39/B40/B41 — all India bands)
- **GPS:** GPS + GLONASS + AGPS + LBS, <10m accuracy
- **SIM:** Nano SIM (bring your own)
- **Weight:** 540g
- **Dimensions:** 120×87×30mm
- **Custom server:** Yes — SMS command `adminip123456 YOUR_IP PORT`
- **APN config:** SMS command `SL APNjionet,,` (for Jio)
- **Platform:** Free web platform included, but we'll use our own
- **Buy:** [icargps.com](https://www.icargps.com/products/4g-solar-gps-tracker-for-cow-ik145)

**Why this one:** Biggest battery + solar = deploy and forget. IP68 handles Telangana
monsoon. Confirmed custom server support. Purpose-built for cattle.

---

## Alternative: FETACA Livestock Tracker

- **Price:** ₹8,999-12,999 on Amazon.in
- **Battery:** 6,000mAh
- **Waterproof:** IP67
- **Connectivity:** 4G
- **SIM:** Pre-installed 4G SIM (6-12 months free)
- **Indian brand** — local support (+91-8440060609)
- **Buy:** [Amazon.in](https://www.amazon.in/Waterproof-Livestock-Real-Time-Anti-Lost-Geo-Fence/dp/B0FRY28K1W)

**Concern:** May be locked to their app. Need to confirm custom server support
before buying. Smaller battery than IK145.

---

## Budget Alternative: Generic GT06 4G Solar Trackers

- **Price:** ₹3,000-6,000 on Amazon.in / AliExpress
- **Protocol:** GT06 (well-documented, Traccar-compatible)
- **Quality:** Hit or miss
- **Custom server:** Usually yes, via SMS
- **Search:** "4G solar GPS tracker cattle" on Amazon.in

---

## Ruled Out

| Option | Why Ruled Out |
|---|---|
| OSR GPS Collar | Data-logger only, no wireless transmission |
| LoRa-based | Range limited to ~15-20km line-of-sight, cattle go beyond |
| Satellite (GSatSolar) | Too expensive ($250/unit + $15/month) for validation |
| Halter Cowgorithm | $5-8/cow/month subscription, not available in India |
| DIY ESP32 + A7670E | Not production-grade, Phase 3 consideration |

## Open Questions

- Does FETACA allow custom server configuration?
- What exact protocol does iCar IK145 use? (GT06? Proprietary?)
- How does the tracker behave in no-signal areas? (Buffer & retry? Or drop data?)
- What's the actual battery life in Telangana summer heat (40°C+)?

## Related Pages

- [[protocols]] — GPS tracker communication protocols
- [[telangana-conditions]] — local environment challenges
- [[power-management]] — battery and solar considerations
