import { NextResponse } from 'next/server';
import { getDB } from '../../../lib/db';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'local-db.json');

export async function GET() {
  try {
    const db = getDB();
    if (!db.reviews) db.reviews = [];
    return NextResponse.json(db.reviews);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const db = getDB();
    
    if (!db.reviews) db.reviews = [];

    const newReview = {
      id: Date.now().toString(),
      ...data,
      status: 'Pending', // Pending | Published
      createdAt: new Date().toISOString()
    };

    db.reviews.push(newReview);
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    return NextResponse.json({ success: true, review: newReview });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save review' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { id, status } = await request.json();
    const db = getDB();
    
    if (!db.reviews) db.reviews = [];
    
    const index = db.reviews.findIndex(rev => rev.id === id);
    if (index !== -1) {
      db.reviews[index].status = status;
      fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
      return NextResponse.json({ success: true, review: db.reviews[index] });
    }
    
    return NextResponse.json({ error: 'Review not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}
