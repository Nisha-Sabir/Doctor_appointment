import { NextResponse } from 'next/server';
import { getDB, saveDB } from '../../../lib/db';

export async function GET() {
  try {
    const db = await getDB();
    return NextResponse.json(db.reviews || []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const db = await getDB();
    
    if (!db.reviews) {
      db.reviews = [];
    }

    const newReview = {
      id: Date.now().toString(),
      ...data,
      status: 'Pending',
      date: new Date().toISOString()
    };

    db.reviews.push(newReview);
    await saveDB(db);

    return NextResponse.json({ success: true, review: newReview });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save review' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { id, status } = await request.json();
    const db = await getDB();
    
    if (!db.reviews) db.reviews = [];
    
    const index = db.reviews.findIndex(r => r.id === id);
    if (index !== -1) {
      db.reviews[index].status = status;
      await saveDB(db);
      return NextResponse.json({ success: true, review: db.reviews[index] });
    }
    
    return NextResponse.json({ error: 'Review not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const db = await getDB();
    
    if (!db.reviews) db.reviews = [];
    
    db.reviews = db.reviews.filter(r => r.id !== id);
    await saveDB(db);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
