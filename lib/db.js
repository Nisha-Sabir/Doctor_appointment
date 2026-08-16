import fs from 'fs';
import path from 'path';
import { kv } from '@vercel/kv';

const dbPath = path.join(process.cwd(), 'local-db.json');

const defaultData = {
  appointments: [],
  reviews: [
    {
      id: "1",
      name: "Ali Raza",
      text: "The clinic is incredibly professional and caring. Highly recommended!",
      status: "Published",
      date: new Date().toISOString()
    }
  ],
  settings: {
    clinicName: "Al Syed Clinic",
    phone: "0300 1234567",
    email: "info@alsyedclinic.com",
    address: "Lahore, Pakistan",
    onlineFee: "1500",
    inClinicFee: "3000",
    timingsMonToThu: "04:00 PM - 09:00 PM",
    timingsFriday: "03:00 PM - 07:00 PM",
    timingsSaturday: "11:00 AM - 02:00 PM",
    timingsSunday: "Closed"
  }
};

export async function getDB() {
  try {
    // If we are on Vercel and KV is available
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const data = await kv.get('clinic_db');
      if (!data) {
        await kv.set('clinic_db', defaultData);
        return defaultData;
      }
      // Merge default settings to prevent missing fields crashing the UI
      return {
        ...data,
        settings: { ...defaultData.settings, ...(data.settings || {}) }
      };
    }

    // Local fallback
    if (!fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, JSON.stringify(defaultData, null, 2));
      return defaultData;
    }
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    return {
      ...data,
      settings: { ...defaultData.settings, ...(data.settings || {}) }
    };
  } catch (error) {
    console.error("Database read error:", error);
    return defaultData;
  }
}

export async function saveDB(data) {
  try {
    // If we are on Vercel and KV is available
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      await kv.set('clinic_db', data);
      return true;
    }

    // Local fallback
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error("Database write error:", error);
    return false;
  }
}
