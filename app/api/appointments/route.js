import { NextResponse } from 'next/server';
import { getDB, saveDB } from '../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get('doctorId');
    const db = await getDB();
    let appointments = db.appointments || [];
    if (doctorId) {
      appointments = appointments.filter(a => a.doctorId === doctorId);
    }
    appointments = appointments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return NextResponse.json({ appointments });
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
