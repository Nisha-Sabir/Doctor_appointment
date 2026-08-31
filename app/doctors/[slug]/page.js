import { getDB } from "../../../lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";

import styles from "./doctor-profile.module.css";

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const db = await getDB();
  const doctor = (db.doctors || []).find(d => d.slug === params.slug);
  if (!doctor) return { title: 'Doctor Not Found' };
  return {
    title: `${doctor.name} — NextGenStudio Dental Clinic`,
    description: doctor.bio,
  };
}

export default async function DoctorProfilePage({ params }) {
  const db = await getDB();
  const doctor = (db.doctors || []).find(d => d.slug === params.slug);
  
  if (!doctor) return notFound();

  const profileUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://nextgenstudiodentalclinic.com'}/doctors/${doctor.slug}`;

  return (
    <main style={{ paddingTop: '72px' }}>
      {/* Hero Banner */}
      <section className={styles.profileHero}>
        <div className={styles.profileHeroBg}></div>
        <div className={`container ${styles.profileHeroContent}`}>
          <div className={styles.profileImgWrap}>
            <img src={doctor.photo} alt={doctor.name} className={styles.profileImg} />
            <div className={styles.profileBadge}>✅ PMDC Verified</div>
          </div>
          <div className={styles.profileMeta}>
            <div className={styles.profileSpecTag}>{doctor.specialization}</div>
            <h1 className={styles.profileName}>{doctor.name}</h1>
            <p className={styles.profileTitle}>{doctor.title}</p>
            <div className={styles.profileStats}>
              <div className={styles.pStat}>
                <strong>{doctor.experience}</strong>
                <span>Experience</span>
              </div>
              <div className={styles.pStatDivider}></div>
              <div className={styles.pStat}>
                <strong>⭐ 4.9</strong>
                <span>Rating</span>
              </div>
              <div className={styles.pStatDivider}></div>
              <div className={styles.pStat}>
                <strong>500+</strong>
                <span>Patients</span>
              </div>
            </div>
            <div className={styles.profileActions}>
              <Link href={`/book-appointment?doctor=${doctor.id}`} className="btn btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Book Appointment
              </Link>
              <a href={`https://wa.me/${doctor.whatsapp}`} target="_blank" rel="noreferrer" className="btn btn-whatsapp">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                WhatsApp
              </a>
              <a href={`tel:${doctor.phone}`} className="btn btn-call">
                Call
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Content */}
      <section className={styles.profileBody}>
        <div className={`container ${styles.profileGrid}`}>
          {/* Left Column */}
          <div className={styles.profileLeft}>

            {/* About */}
            <div className={styles.profileCard}>
              <h2 className={styles.cardTitle}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                About
              </h2>
              <p className={styles.bioText}>{doctor.bio}</p>
            </div>

            {/* Qualifications */}
            <div className={styles.profileCard}>
              <h2 className={styles.cardTitle}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                Qualifications
              </h2>
              <ul className={styles.qualList}>
                {(doctor.qualifications || []).map((q, i) => (
                  <li key={i}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    {q}
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div className={styles.profileCard}>
              <h2 className={styles.cardTitle}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                Services Offered
              </h2>
              <div className={styles.serviceTagsWrap}>
                {(doctor.services || []).map((s, i) => (
                  <span key={i} className={styles.serviceChip}>{s}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className={styles.profileRight}>

            {/* Timings */}
            <div className={styles.profileCard}>
              <h2 className={styles.cardTitle}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Timings
              </h2>
              <div className={styles.timingBlock}>
                <div className={styles.timingHeader}>🏥 In-Clinic Timings</div>
                <div className={styles.timingVal}>{doctor.clinicTimings}</div>
              </div>
              <div className={styles.timingBlock} style={{ marginTop: '1rem' }}>
                <div className={styles.timingHeader}>💻 Online Consultation</div>
                <div className={styles.timingVal}>{doctor.onlineTimings}</div>
              </div>
              {doctor.offDays && (
                <div className={styles.timingBlock} style={{ marginTop: '1rem', borderLeftColor: '#ef4444' }}>
                  <div className={styles.timingHeader} style={{ color: '#ef4444' }}>🚫 Off Dates / Holidays</div>
                  <div className={styles.timingVal}>{doctor.offDays}</div>
                </div>
              )}
            </div>

            {/* Fees */}
            <div className={styles.profileCard}>
              <h2 className={styles.cardTitle}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                Consultation Fees
              </h2>
              <div className={styles.feesGrid}>
                <div className={styles.feeCard}>
                  <span>In-Clinic</span>
                  <strong>Rs. {doctor.clinicFee}</strong>
                </div>
                <div className={styles.feeCard}>
                  <span>Online</span>
                  <strong>Rs. {doctor.onlineFee}</strong>
                </div>
              </div>
              <Link href={`/book-appointment?doctor=${doctor.id}`} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
                Book Now
              </Link>
            </div>



            {/* Google Review */}
            {doctor.googleReviewUrl && (
              <div className={styles.profileCard} style={{ background: 'linear-gradient(135deg, #FFF8E1, #FFF3CD)' }}>
                <h2 className={styles.cardTitle}>
                  ⭐ Share Your Experience
                </h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Had a great experience with {doctor.name}? Leave a Google review and help others!
                </p>
                <a href={doctor.googleReviewUrl} target="_blank" rel="noreferrer" className="btn" style={{ width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg, #FBBC04, #F09300)', color: 'white', boxShadow: '0 4px 15px rgba(251,188,4,0.35)' }}>
                  ⭐ Leave a Google Review
                </a>
              </div>
            )}

            {/* Message Doctor */}
            <div className={styles.profileCard} style={{ background: 'var(--primary-light)' }}>
              <h2 className={styles.cardTitle}>💬 Message the Doctor</h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Have a question? Send a message directly to {doctor.name}.
              </p>
              <Link href={`/messages?doctor=${doctor.id}&doctorName=${encodeURIComponent(doctor.name)}`} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                💬 Send Message
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
