# powsintransit
website for pet shipping with tracking feature 

## Update Shipment Tracking
Run the following command to update or add a shipment's status and location:
```bash
node scripts/update-tracking.js <trackingNumber> <status> <location>
```
Replace `<trackingNumber>`, `<status>`, and `<location>` with the actual shipment details. For example:
```bash
node scripts/update-tracking.js PET12345 "In Transit" "Chicago, IL"
```

If `data/shipments.json` does not exist, the script will create it.
