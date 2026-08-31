import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { saveDB } from '../../../lib/db';

export const dynamic = 'force-dynamic';

// Default fresh data — used to reset KV store
const defaultData = {
  appointments: [],
  reviews: [
    {
      id: "1",
      name: "Ali Raza",
      text: "Great clinic! Very professional staff and excellent treatment.",
      status: "Published",
      rating: 5,
      createdAt: new Date().toISOString()
    },
    {
      id: "2",
      name: "Sara Noor",
      text: "Braces treatment was excellent. The clinic is very hygienic and staff is professional. Very happy with the results!",
      status: "Published",
      rating: 5,
      createdAt: new Date().toISOString()
    },
    {
      id: "3",
      name: "Usman Tariq",
      text: "Root canal ho gaya bilkul dard ke bina. Dr. Ahmad ne bahut achha kaam kiya. Clinic ka environment bhi bohot acha hai.",
      status: "Published",
      rating: 5,
      createdAt: new Date().toISOString()
    }
  ],
  messages: [],
  doctors: [
    {
      id: "dr-fazal",
      slug: "dr-fazal",
      name: "Dr. Fazal ur Rehman",
      title: "BDS, FCPS (Orthodontics)",
      specialization: "Orthodontist & Chief Dental Surgeon",
      experience: "15+ Years",
      photo: "/doctors/dr-nextgenstudio.png",
      bio: "Dr. Fazal ur Rehman is the founder and chief dental surgeon. With over 15 years of experience in orthodontics and general dentistry, he has treated thousands of patients with compassionate care and modern techniques.",
      qualifications: ["BDS – University of Health Sciences, Lahore", "FCPS (Orthodontics) – College of Physicians & Surgeons Pakistan", "Member – Pakistan Dental Association"],
      services: ["Braces & Aligners", "Orthodontic Treatment", "Dental Implants", "Smile Makeover"],
      clinicTimings: "Mon–Sat: 5:00 PM – 9:00 PM",
      onlineTimings: "Mon–Fri: 12:00 PM – 2:00 PM",
      clinicFee: "1500",
      onlineFee: "1000",
      whatsapp: "03001234567",
      phone: "03001234567",
      googleReviewUrl: "https://g.page/r/nextgenstudiodentalclinic/review"
    },
    {
      id: "dr-ahmad",
      slug: "dr-ahmad",
      name: "Dr. Ahmad Bilal",
      title: "BDS, MCPS (Endodontics)",
      specialization: "Endodontist — Root Canal Specialist",
      experience: "10+ Years",
      photo: "/doctors/dr-ahmad.png",
      bio: "Dr. Ahmad Bilal specializes in root canal treatments and endodontic procedures. He uses the latest rotary endodontic techniques ensuring pain-free, precise treatment. He has performed over 5,000 successful root canal procedures.",
      qualifications: ["BDS – Dow University of Health Sciences", "MCPS (Endodontics) – CPSP Pakistan", "Certified in Rotary Endodontics"],
      services: ["Root Canal Treatment", "Dental Crowns", "Tooth Extractions", "Periapical Surgery"],
      clinicTimings: "Mon–Fri: 6:00 PM – 9:00 PM",
      onlineTimings: "Tue–Thu: 11:00 AM – 1:00 PM",
      clinicFee: "1500",
      onlineFee: "1000",
      whatsapp: "03021234567",
      phone: "03021234567",
      googleReviewUrl: "https://g.page/r/nextgenstudiodentalclinic/review"
    },
    {
      id: "dr-sana",
      slug: "dr-sana",
      name: "Dr. Sana Malik",
      title: "BDS, Diploma Pedodontics",
      specialization: "Pediatric Dentist",
      experience: "8+ Years",
      photo: "/doctors/dr-sana.png",
      bio: "Dr. Sana Malik is our dedicated pediatric dentist who specializes in making dental visits a positive experience for children.",
      qualifications: ["BDS – King Edward Medical University", "Diploma in Pedodontics – PGMI Lahore", "Certified Pediatric Sedation Specialist"],
      services: ["Children's Dental Care", "Milk Teeth Treatment", "Fluoride Application", "Dental Sealants", "Space Maintainers"],
      clinicTimings: "Mon–Sat: 4:00 PM – 8:00 PM",
      onlineTimings: "Mon, Wed, Fri: 10:00 AM – 12:00 PM",
      clinicFee: "1200",
      onlineFee: "800",
      whatsapp: "03031234567",
      phone: "03031234567",
      googleReviewUrl: "https://g.page/r/nextgenstudiodentalclinic/review"
    },
    {
      id: "dr-usman",
      slug: "dr-usman",
      name: "Dr. Usman Ghani",
      title: "BDS, Prosthodontics",
      specialization: "Prosthodontist & Cosmetic Dentist",
      experience: "12+ Years",
      photo: "/doctors/dr-usman.png",
      bio: "Dr. Usman Ghani is an expert in cosmetic dentistry and dental prosthetics. He transforms smiles with veneers, teeth whitening, and complete smile makeovers.",
      qualifications: ["BDS – Allama Iqbal Medical College", "Training in Aesthetic Dentistry – Lahore", "Certified in Digital Smile Design"],
      services: ["Teeth Whitening", "Dental Veneers", "Dentures & Bridges", "Dental Implants", "Smile Makeover", "Composite Bonding"],
      clinicTimings: "Tue–Sun: 5:00 PM – 9:00 PM",
      onlineTimings: "Mon–Wed: 2:00 PM – 4:00 PM",
      clinicFee: "2000",
      onlineFee: "1500",
      whatsapp: "03041234567",
      phone: "03041234567",
      googleReviewUrl: "https://g.page/r/nextgenstudiodentalclinic/review"
    }
  ],
  settings: {
    clinicName: "NextGenStudio Dental Clinic",
    tagline: "Your Smile, Our Priority",
    phone: "0332-3284294",
    email: "drasimatiq@hotmail.com",
    address: "Shop no #05, Crescent Arcade, Sector 5-K, North Karachi",
    whatsappNumber: "923323284294",
    onlineFee: "1000",
    inClinicFee: "1500",
    timingsMonToThu: "05:00 PM - 09:00 PM",
    timingsFriday: "03:00 PM - 07:00 PM",
    timingsSaturday: "11:00 AM - 03:00 PM",
    timingsSunday: "Closed",
    googleReviewUrl: "https://g.page/r/nextgenstudiodentalclinic/review",
    googleMapsUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3401.234567890!2d74.34567!3d31.51234!2m3!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sNextGenStudio+Dental+Clinic!5e0!3m2!1sen!2spk!4v1234567890",
    googleMapsLink: "https://maps.google.com/?q=Crescent+Arcade+Sector+5-K+North+Karachi",
    clinicImages: []
  }
};

export async function GET(request) {
  // Secret key check — prevents accidental reset
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (secret !== 'reset-ngs-2024') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Try to preserve existing appointments and messages
    let existingData = null;
    try {
      existingData = await kv.get('clinic_db');
    } catch {}

    const freshData = {
      ...defaultData,
      // Keep existing appointments & messages if any
      appointments: existingData?.appointments || [],
      messages: existingData?.messages || [],
    };

    await saveDB(freshData);

    return NextResponse.json({
      success: true,
      message: 'Database reset successfully with correct doctor IDs',
      doctors: freshData.doctors.map(d => ({ id: d.id, name: d.name }))
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Reset failed',
      detail: error?.message || String(error)
    }, { status: 500 });
  }
}
