import { NextResponse } from 'next/server';
import { getDB, saveDB } from '../../../lib/db';

export async function GET() {
  try {
    const db = await getDB();
    return NextResponse.json(db.appointments || []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const db = await getDB();
    
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
    await saveDB(db);

    return NextResponse.json({ success: true, appointment: newAppointment });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save appointment' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { id, status } = await request.json();
    const db = await getDB();
    
    if (!db.appointments) db.appointments = [];
    
    const index = db.appointments.findIndex(app => app.id === id);
    if (index !== -1) {
      db.appointments[index].status = status;
      await saveDB(db);
      return NextResponse.json({ success: true, appointment: db.appointments[index] });
    }
    
    return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
  }
}
