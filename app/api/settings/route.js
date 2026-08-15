import { NextResponse } from 'next/server';
import { getDB } from '../../../lib/db';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'local-db.json');

export async function GET() {
  try {
    const db = getDB();
    return NextResponse.json(db.settings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    const db = getDB();
    
    db.settings = { ...db.settings, ...data };
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    
    return NextResponse.json(db.settings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
