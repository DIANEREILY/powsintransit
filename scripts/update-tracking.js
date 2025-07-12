const fs = require('fs');
const path = require('path');

const shipmentsFilePath = path.join(__dirname, '..', 'data', 'shipments.json');

// Get command line arguments
const [trackingNumber, status, location] = process.argv.slice(2);

if (!trackingNumber || !status || !location) {
  console.error('Error: Missing arguments. Usage: node scripts/update-tracking.js <trackingNumber> <status> <location>');
  process.exit(1);
}

let shipments = [];

// Create data directory if it doesn't exist
const dataDir = path.dirname(shipmentsFilePath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Read existing shipments data
try {
  if (fs.existsSync(shipmentsFilePath)) {
    const fileData = fs.readFileSync(shipmentsFilePath, 'utf-8');
    if (fileData) {
      shipments = JSON.parse(fileData);
    } else {
      shipments = []; // Initialize with empty array if file is empty
    }
  } else {
    // Create shipments.json with an empty array if it doesn't exist
    fs.writeFileSync(shipmentsFilePath, '[]', 'utf-8');
    shipments = [];
  }
} catch (error) {
  if (error instanceof SyntaxError) {
    console.error('Error: Invalid JSON file.');
  } else {
    console.error(`Error reading shipments file: ${error.message}`);
  }
  process.exit(1);
}

// Find and update shipment or add a new one
const existingShipmentIndex = shipments.findIndex(shipment => shipment.trackingNumber === trackingNumber);

if (existingShipmentIndex !== -1) {
  // Update existing shipment
  shipments[existingShipmentIndex].status = status;
  shipments[existingShipmentIndex].location = location;
  // Preserve existing petName and estimatedDelivery if they exist
  shipments[existingShipmentIndex].petName = shipments[existingShipmentIndex].petName || 'Unknown';
  shipments[existingShipmentIndex].estimatedDelivery = shipments[existingShipmentIndex].estimatedDelivery || 'TBD';
} else {
  // Add new shipment
  shipments.push({
    trackingNumber,
    petName: 'Unknown', // Default for new shipments
    status,
    location,
    estimatedDelivery: 'TBD' // Default for new shipments
  });
}

// Write updated shipments data back to the file
try {
  fs.writeFileSync(shipmentsFilePath, JSON.stringify(shipments, null, 2), 'utf-8');
  console.log(`Shipment ${trackingNumber} updated successfully.`);
} catch (error) {
  console.error(`Error writing shipments file: ${error.message}`);
  process.exit(1);
}
