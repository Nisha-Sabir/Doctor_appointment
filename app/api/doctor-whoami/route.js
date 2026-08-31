import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  const cookieStore = await cookies();
  const doctorToken = cookieStore.get('doctor_token')?.value;

  if (doctorToken) {
    return NextResponse.json({ doctorId: doctorToken });
  }

  return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
}
