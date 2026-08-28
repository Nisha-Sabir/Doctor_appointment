import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getDB } from '../../lib/db';
import DashboardClient from './DashboardClient';

export const dynamic = 'force-dynamic';

export default async function DoctorDashboard() {
  const cookieStore = await cookies();
  const doctorToken = cookieStore.get('doctor_token')?.value;

  if (!doctorToken) {
    redirect('/doctor/login');
  }

  const db = await getDB();
  const doctor = db.doctors?.find(d => d.id === doctorToken);

  if (!doctor) {
    redirect('/doctor/login');
  }

  const allAppointments = db.appointments || [];
  const doctorAppointments = allAppointments
    .filter(a => a.doctorId === doctorToken)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <DashboardClient
      initialDoctor={doctor}
      initialAppointments={doctorAppointments}
    />
  );
}
