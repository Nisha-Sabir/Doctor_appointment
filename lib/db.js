import fs from 'fs';
import path from 'path';
import { kv } from '@vercel/kv';

const dbPath = path.join(process.cwd(), 'local-db.json');

// Default initial data
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
    address: "Lahore, Pakistan"
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
      return data;
    }

    // Local fallback
    if (!fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, JSON.stringify(defaultData, null, 2));
      return defaultData;
    }
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
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
