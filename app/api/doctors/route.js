import { getDB } from "../../../lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = await getDB();
    return NextResponse.json({ doctors: db.doctors || [] });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch doctors" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { doctor } = await request.json();
    const db = await getDB();
    
    const { saveDB } = await import("../../../lib/db");
    const idx = db.doctors.findIndex(d => d.id === doctor.id);
    if (idx === -1) {
      db.doctors.push(doctor);
    } else {
      db.doctors[idx] = { ...db.doctors[idx], ...doctor };
    }
    await saveDB(db);
    return NextResponse.json({ success: true, doctor: db.doctors[idx] });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update doctor" }, { status: 500 });
  }
}
