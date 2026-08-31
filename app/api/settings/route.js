import { NextResponse } from 'next/server';
import { getDB, saveDB } from '../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = await getDB();
    return NextResponse.json(db.settings || {});
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    const db = await getDB();
    
    db.settings = { ...db.settings, ...data };
    await saveDB(db);

    return NextResponse.json({ success: true, settings: db.settings });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
