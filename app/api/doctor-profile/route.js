import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getDB, saveDB } from '../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const cookieStore = await cookies();
  const doctorToken = cookieStore.get('doctor_token')?.value;

  if (!doctorToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const db = await getDB();
  const doctor = db.doctors?.find(d => d.id === doctorToken);

  if (!doctor) {
    return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
  }

  return NextResponse.json({ doctor });
}

export async function PATCH(request) {
  try {
    const cookieStore = await cookies();
    const doctorToken = cookieStore.get('doctor_token')?.value;

    if (!doctorToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const updates = await request.json();
    const db = await getDB();
    
    if (!db.doctors) {
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    const doctorIndex = db.doctors.findIndex(d => d.id === doctorToken);
    
    if (doctorIndex === -1) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    // Only allow updating specific fields
    const allowedFields = ['clinicTimings', 'onlineTimings', 'clinicFee', 'onlineFee', 'offDays'];
    
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        db.doctors[doctorIndex][field] = updates[field];
      }
    });

    await saveDB(db);

    return NextResponse.json({ success: true, doctor: db.doctors[doctorIndex] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
