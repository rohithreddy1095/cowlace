# Scaling & Business

> From personal cattle tracking to a product for Telangana farmers.

## Phased Approach

### Phase 1 — Validate (Budget: ₹15-25K, Timeline: 2-4 weeks)
- Buy 1-2 GPS trackers (iCar IK145 or similar)
- Get Jio SIM cards
- Build basic TCP receiver + web map
- Deploy on own cattle
- **Success criteria:** Can I find my cattle? Does the tracker last in the field?

### Phase 2 — Product (Budget: ₹50K-1L, Timeline: 2-3 months)
- Build full platform (geofencing, SMS alerts, multi-farmer)
- Telugu language support
- Test with 5-10 neighboring farmers, 20-30 cattle
- Iterate based on real feedback
- **Success criteria:** Do other farmers find it useful? Will they pay?

### Phase 3 — Scale (Budget: ₹5-15L, Timeline: 6-12 months)
- OEM hardware from China (₹1,500-3,000/unit at 500+ qty)
- OR design own hardware + manufacture
- Get certifications (WPC, BIS) if selling commercially
- Partner with dairy cooperatives
- Approach Telangana Animal Husbandry Department
- **Success criteria:** Sustainable unit economics, growing farmer base

## Unit Economics (at scale)

| Item | Cost |
|---|---|
| Tracker hardware (OEM, 500+ qty) | ₹2,000-3,000 |
| SIM data (annual) | ₹600-1,200 |
| Server cost (per device/year) | ₹100-200 |
| Support/maintenance | ₹200-500 |
| **Total cost/device/year** | **₹3,000-5,000** |

**Pricing models:**
- Sell tracker + annual subscription: ₹5,000 device + ₹1,000/year
- All-inclusive annual: ₹3,000/year (tracker on loan, return if cancelled)
- Pay-per-season: ₹1,500 for summer season only (Mar-Jun)

## Potential Partners

- **Dairy cooperatives:** Already organized, trusted by farmers
- **Livestock insurance companies:** GPS data reduces fraud, could subsidize trackers
- **Telangana Animal Husbandry Dept:** Government cattle tagging programs
- **NABARD:** Agricultural technology grants
- **Veterinary colleges:** Research partnerships (cattle behavior data)

## Regulatory Requirements (for commercial sale)

| Certification | Cost | Time | Needed When |
|---|---|---|---|
| WPC ETA | ₹2-5L | 4-8 weeks | Selling RF-transmitting device |
| BIS CRS | ₹1-3L | 4-12 weeks | Selling electronics in India |
| TEC MTCTE | ₹1-3L | 6-12 weeks | Telecom equipment |
| IMEI Registration | ₹50K-1L | 2-4 weeks | Cellular device |

> **Not needed for Phase 1-2** (personal use + informal testing).
> Only needed if you're commercially selling the device.
> If you sell just the software + farmers buy their own trackers, you skip all hardware certs.

## Competitive Landscape in India

| Competitor | Model | Price | Gap |
|---|---|---|---|
| FETACA | Tracker + app | ₹9-13K | No custom software, locked platform |
| Vyncx | Ear tag + collar | Unknown | Generic, not cattle-optimized |
| JioGauSamriddhi | Smart neck tag | Unknown | Jio ecosystem lock-in |
| **Cowlace** | Your tracker + your platform | ₹5-8K target | Telugu, cattle-specific, farmer-friendly |

## Open Questions

- How many cattle in user's village/mandal? (Total addressable market)
- Do dairy cooperatives in Telangana have tech adoption budgets?
- Is there a state government scheme we can piggyback on?
- What would farmers actually pay for this? (Need conversations)

## Related Pages

- [[../hardware/trackers]] — hardware options and costs
- [[../field/telangana-conditions]] — deployment environment
- [[../software/architecture]] — platform design
