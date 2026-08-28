import { NextResponse } from 'next/server';
import { getDB } from '../../../lib/db';

export async function POST(request) {
  try {
    const { doctorId, password } = await request.json();

    // Default password for all doctors is 'doctor123'
    if (password !== 'doctor123') {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const db = await getDB();
    const doctor = db.doctors?.find(d => d.id === doctorId);

    if (doctor) {
      const response = NextResponse.json({ success: true, doctor });
      
      // Set secure HTTP-only cookie
      response.cookies.set({
        name: 'doctor_token',
        value: doctor.id,
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 // 1 day
      });
      
      return response;
    }

    return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
