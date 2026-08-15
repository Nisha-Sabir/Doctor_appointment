import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'local-db.json');

export function getDB() {
  if (!fs.existsSync(dbPath)) {
    const defaultData = {
      settings: {
        clinicName: 'Al Syed Clinic',
        phone: '+92 300 1234567',
        address: '123 Health Avenue, Medical Block, Gulberg III, Lahore',
        onlineFee: '1500',
        inClinicFee: '2000',
        timingsMonToThu: '04:00 PM - 09:00 PM',
        timingsFriday: '03:00 PM - 07:00 PM',
        timingsSunday: 'Closed',
      },
      appointments: [],
      reviews: []
    };
    fs.writeFileSync(dbPath, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
  return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}
