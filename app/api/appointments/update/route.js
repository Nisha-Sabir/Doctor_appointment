import { getDB, saveDB } from '../../../../lib/db';
import { NextResponse } from 'next/server';

export async function PATCH(request) {
  try {
    const { appointmentId, status } = await request.json();
    if (!appointmentId || !status) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const db = await getDB();
    const idx = (db.appointments || []).findIndex(a => a.id === appointmentId);
    if (idx === -1) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    db.appointments[idx].status = status;
    db.appointments[idx].updatedAt = new Date().toISOString();
    await saveDB(db);

    return NextResponse.json({ success: true, appointment: db.appointments[idx] });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
