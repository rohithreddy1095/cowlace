# Power Management

> Battery life, solar charging, and thermal considerations for field deployment.

## The Equation

```
Battery life = Battery capacity / Daily consumption
Daily consumption = (cycles per day) × (energy per cycle)
```

## Typical Cycle (15-minute interval)

| Phase | Current | Duration | Energy |
|---|---|---|---|
| Wake + GPS fix | ~100mA | 30-90s | ~2.5mAh |
| 4G transmit | ~500mA avg (2A peak) | 5-10s | ~1mAh |
| Deep sleep | ~0.01mA | 14 min | ~0.002mAh |
| **Total per cycle** | | ~2 min active | **~3.5mAh** |

**Daily:** 96 cycles × 3.5mAh = **~336mAh/day**

## Battery Life Estimates (no solar)

| Battery | Capacity | Days |
|---|---|---|
| 6,000mAh (FETACA) | 6,000mAh | ~18 days |
| 20,000mAh (iCar IK145) | 20,000mAh | ~60 days |

## Solar Contribution

A 1W solar panel in Telangana (good sun ~6-8 hours/day):
- Theoretical: ~200mA × 6h = 1,200mAh/day
- Real-world (angle, clouds, dust, cattle movement): ~200-400mAh/day
- **Net daily consumption with solar:** 336 - 300 = ~36mAh/day
- **With solar, 20,000mAh battery lasts:** effectively indefinite in summer

## Telangana Heat Problem

Li-ion batteries degrade above 45°C. Telangana summer regularly hits 42-46°C.
Direct sun on the enclosure can push internal temp to 60°C+.

**Mitigations:**
- Light-colored (white) enclosure reflects heat
- Mount tracker on top of neck (air gap between collar and skin provides some insulation)
- Solar panel on top acts as a heat shield for the enclosure below
- The 20,000mAh IK145 has thermal headroom — even at 30% capacity loss, it's still 14,000mAh

## Monsoon Impact

- Less solar during monsoon (June-Oct) — cloudy skies
- But cooler temperatures = better battery health
- With 20,000mAh, should survive monsoon months even with reduced solar
- Consider increasing sleep interval to 30 min during monsoon to conserve power

## Recommendations

1. **Use the biggest battery available** — the IK145's 20,000mAh is ideal
2. **15-minute intervals** for summer (good solar recharge)
3. **30-minute intervals** for monsoon (conserve battery, less solar)
4. **Track battery level** in software — alert farmer when battery drops below 20%
5. **White/light enclosure** to reduce heat absorption

## Open Questions

- Actual solar panel output on a moving cow in Telangana summer?
- Does IK145 report battery percentage in its protocol data?
- Can we remotely change the reporting interval via SMS?
- Battery replacement — is IK145 battery user-replaceable?

## Related Pages

- [[trackers]] — hardware specs
- [[../field/telangana-conditions]] — local climate details
