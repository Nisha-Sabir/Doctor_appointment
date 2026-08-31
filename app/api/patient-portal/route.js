import { getDB } from '../../../lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');

    if (!phone) {
      return NextResponse.json({ error: 'Phone required' }, { status: 400 });
    }

    const db = await getDB();
    const cleanPhone = phone.replace(/[^0-9]/g, '');

    const appointments = (db.appointments || []).filter(a => {
      const aPhone = (a.phone || '').replace(/[^0-9]/g, '');
      return aPhone === cleanPhone;
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const messages = (db.messages || []).filter(m => {
      const mPhone = (m.patientPhone || '').replace(/[^0-9]/g, '');
      return mPhone === cleanPhone;
    }).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    return NextResponse.json({ appointments, messages });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
