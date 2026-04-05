# Cowlace Wiki — Log

Chronological record of research, decisions, and ingests.

---

## 2026-04-05 — Project inception

**Source:** User conversation + web research

**What happened:**
- User loses cattle during free-grazing summer periods in Telangana
- Researched OSR GPS Collar (GitHub) — data-logger only, no wireless, ruled out
- Researched Google: cowgram → cowgorithm (Halter) → DIY GPS tracking options
- Explored three communication approaches: LoRa, Cellular, Satellite
- Decided on **cellular (4G)** — user has good cell coverage in grazing area
- Explored DIY vs production-grade hardware
- Decided on **Path 1: buy ready-made trackers + build own software**
- Identified key trackers: iCar IK145, FETACA, generic GT06-protocol trackers
- Confirmed trackers support custom server IP via SMS commands
- Decided to **build own software platform** (not Traccar) for cattle-specific needs and Telangana localization
- Applied Karpathy's LLM Wiki pattern to structure project knowledge

**Pages created:** All initial wiki pages

**Key decisions:**
1. Cellular 4G over LoRa (range > 20km, no line-of-sight)
2. Buy ready-made hardware first, build own later
3. Build custom software (not Traccar) for cattle-specific features
4. Target Telangana conditions first, then expand
