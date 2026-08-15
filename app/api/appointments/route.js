import { NextResponse } from 'next/server';
import { getDB } from '../../../lib/db';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'local-db.json');

export async function GET() {
  try {
    const db = getDB();
    // Ensure appointments array exists
    if (!db.appointments) {
      db.appointments = [];
    }
    return NextResponse.json(db.appointments);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const db = getDB();
    
    if (!db.appointments) {
      db.appointments = [];
    }

    const newAppointment = {
      id: Date.now().toString(),
      ...data,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    db.appointments.push(newAppointment);
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    return NextResponse.json({ success: true, appointment: newAppointment });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save appointment' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { id, status } = await request.json();
    const db = getDB();
    
    if (!db.appointments) db.appointments = [];
    
    const index = db.appointments.findIndex(app => app.id === id);
    if (index !== -1) {
      db.appointments[index].status = status;
      fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
      return NextResponse.json({ success: true, appointment: db.appointments[index] });
    }
    
    return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
  }
}
