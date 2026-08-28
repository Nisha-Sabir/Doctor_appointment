import { getDB, saveDB } from "../../../lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const patientPhone = searchParams.get('patientPhone');
    const doctorId = searchParams.get('doctorId');
    
    const db = await getDB();
    let messages = db.messages || [];
    
    if (patientPhone) {
      messages = messages.filter(m => m.patientPhone === patientPhone);
    }
    if (doctorId) {
      messages = messages.filter(m => m.doctorId === doctorId);
    }
    
    // Sort by createdAt
    messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    
    return NextResponse.json({ messages });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { patientName, patientPhone, doctorId, doctorName, content, sender } = body;
    
    if (!content || !patientPhone || !doctorId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    const db = await getDB();
    if (!db.messages) db.messages = [];
    
    const message = {
      id: Date.now().toString(),
      patientName,
      patientPhone,
      doctorId,
      doctorName,
      content,
      sender: sender || 'patient', // 'patient' or 'doctor'
      isRead: false,
      createdAt: new Date().toISOString()
    };
    
    db.messages.push(message);
    await saveDB(db);
    
    return NextResponse.json({ success: true, message });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { messageId } = await request.json();
    const db = await getDB();
    
    if (!db.messages) db.messages = [];
    const idx = db.messages.findIndex(m => m.id === messageId);
    if (idx !== -1) {
      db.messages[idx].isRead = true;
    }
    await saveDB(db);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to mark as read" }, { status: 500 });
  }
}
