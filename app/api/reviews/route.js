import { NextResponse } from 'next/server';
import { getDB, saveDB } from '../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get('doctorId');
    const db = await getDB();
    let reviews = db.reviews || [];
    if (doctorId) {
      reviews = reviews.filter(r => r.doctorId === doctorId);
    }
    return NextResponse.json(reviews);
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
      name: data.name,
      text: data.text,
      rating: data.rating || 5,
      doctorId: data.doctorId || null,
      doctorName: data.doctorName || null,
      status: 'Pending',
      createdAt: new Date().toISOString()
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
