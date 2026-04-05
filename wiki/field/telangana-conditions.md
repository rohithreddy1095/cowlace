# Telangana Field Conditions

> Ground reality for deploying cattle GPS trackers in Telangana.

## Climate

| Season | Months | Temp | Rain | Impact on Tracker |
|---|---|---|---|---|
| Summer | Mar-May | 35-46°C | Dry | Battery heat stress, great solar charging |
| Monsoon | Jun-Oct | 25-35°C | Heavy | IP68 mandatory, reduced solar, cattle wade water |
| Winter | Nov-Feb | 15-30°C | Dry | Ideal conditions, good battery + solar |

**Critical period:** Summer is when cattle go farthest for water and shade.
This is also when tracking is most needed and battery heat degradation is worst.

## Terrain

- **Deccan Plateau:** Generally flat to undulating, rocky scrubland
- **Open sky:** Good GPS signal reception (unlike dense forests)
- **Grazing areas:** Mix of agricultural fields (post-harvest), commons, scrubland, forest edges
- **Water sources:** Tanks (man-made lakes), streams, bore wells — cattle converge here
- **Districts with more forest/hills:** Adilabad, Kumram Bheem, Mulugu, Bhadradri Kothagudem — may have patchier cell coverage

## Cellular Network Coverage

- **Jio:** Best rural coverage in Telangana, 4G in most mandals
- **Airtel:** Good coverage, slightly less rural penetration than Jio
- **BSNL:** Fallback in very remote areas (2G/4G)
- **Dead zones:** Deep forest areas, some valley/hill pockets
- **Recommendation:** Jio Nano SIM as primary, test in your specific grazing area first

## Cattle Behavior (Free Grazing)

- Cattle released in morning, expected back by evening — but some don't return
- They follow water and shade, can travel 10-30km in a day
- Herd mixing: your cattle may join another farmer's herd
- Cattle tend to return to familiar water sources — mapping these helps prediction
- Night movement is rare but happens (disturbance, predators, theft)

## Cattle Theft

- Real issue in rural Telangana
- Trackers must have:
  - **Tamper alert** (powered off or removed from collar)
  - **Low-key design** (not obviously a GPS tracker — thieves may remove it)
  - **Movement alert at night** (unusual night movement = potential theft)

## Practical Deployment

### Collar Considerations
- Cattle necks are thick — need sturdy, wide strap (50-75mm nylon)
- Must survive rubbing against trees, fences, other cattle
- Tracker box on top of neck (not under — gets damaged at feeding troughs)
- Buckle/clasp must be strong but easy for farmer to open (not padlocked)

### Farmer Interaction
- Many farmers have smartphones but are not tech-savvy
- SMS alerts work for everyone
- Telugu language is essential for app
- Village-level training/demo needed for adoption
- Common question will be: "does it work at my X location?" — need coverage check tool

### Seasonal Strategy
- **Deploy trackers:** Start of summer (March) when cattle start roaming far
- **Retrieve for maintenance:** End of monsoon (October) — clean, check battery
- **Monitor battery remotely:** Alert farmer when tracker needs charging/replacement

## Government Schemes

- Telangana Animal Husbandry Department has cattle tagging programs
- Potential synergy: GPS tracking as upgrade to existing RFID ear tags
- Subsidy angle: livestock insurance companies may value GPS tracking data
- **Research:** Check if NABARD or Telangana state has tech-in-agriculture grants

## Open Questions

- Specific grazing areas the user operates in (district/mandal)?
- How many cattle does the user have?
- Are neighboring farmers interested? (determines scaling potential)
- Which water sources do cattle use? (for geofence setup)
- Has the user experienced cattle theft?

## Related Pages

- [[../hardware/trackers]] — hardware options
- [[../hardware/power-management]] — battery life in Telangana heat
- [[../business/scaling]] — growing to more farmers
