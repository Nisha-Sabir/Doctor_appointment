import { getDB } from "../../lib/db";
import Link from "next/link";
import styles from "./doctors.module.css";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Our Doctors — Fazal Dental Clinic",
  description: "Meet our 4 expert dental specialists at Fazal Dental Clinic, North Karachi. Book appointments online.",
};

export default async function DoctorsPage() {
  const db = await getDB();
  const doctors = db.doctors || [];
  const settings = db.settings;

  return (
    <main style={{ paddingTop: '72px' }}>
      {/* Page Header */}
      <section className={styles.pageHeader}>
        <div className="container">
          <div className={styles.headerTag}>Our Team</div>
          <h1 className={styles.headerTitle}>Meet Our Expert Dentists</h1>
          <p className={styles.headerSubtitle}>
            4 highly qualified dental specialists, each bringing expertise in their field 
            to provide you with the best dental care in North Karachi.
          </p>
        </div>
        <div className={styles.headerBg}></div>
      </section>

      {/* Doctors Grid */}
      <section className={styles.doctorsSection}>
        <div className="container">
          <div className={styles.doctorsList}>
            {doctors.map((doctor, idx) => (
              <div key={doctor.id} className={`${styles.doctorRow} ${idx % 2 !== 0 ? styles.doctorRowReverse : ''}`}>
                {/* Photo */}
                <div className={styles.doctorPhotoWrap}>
                  <img src={doctor.photo} alt={doctor.name} className={styles.doctorPhoto} />
                  <div className={styles.doctorPhotoOverlay}>
                    <div className={styles.expBadge}>
                      <strong>{doctor.experience}</strong>
                      <span>Experience</span>
                    </div>
                  </div>

                </div>

                {/* Info */}
                <div className={styles.doctorDetail}>
                  <div className={styles.doctorSpecTag}>{doctor.specialization}</div>
                  <h2 className={styles.doctorName}>{doctor.name}</h2>
                  <p className={styles.doctorTitle}>{doctor.title}</p>
                  
                  <p className={styles.doctorBio}>{doctor.bio}</p>

                  {/* Qualifications */}
                  <div className={styles.qualBox}>
                    <h4>Qualifications</h4>
                    <ul>
                      {(doctor.qualifications || []).map((q, i) => (
                        <li key={i}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          {q}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Services */}
                  <div className={styles.servicesBox}>
                    <h4>Specialties</h4>
                    <div className={styles.serviceTags}>
                      {(doctor.services || []).map((s, i) => (
                        <span key={i} className={styles.serviceTag}>{s}</span>
                      ))}
                    </div>
                  </div>

                  {/* Timings */}
                  <div className={styles.timingsBox}>
                    <div className={styles.timingItem}>
                      <span className={styles.timingIcon}>🏥</span>
                      <div>
                        <strong>Clinic Timings</strong>
                        <p>{doctor.clinicTimings}</p>
                      </div>
                    </div>
                    <div className={styles.timingItem}>
                      <span className={styles.timingIcon}>💻</span>
                      <div>
                        <strong>Online Timings</strong>
                        <p>{doctor.onlineTimings}</p>
                      </div>
                    </div>
                  </div>

                  {/* Fees */}
                  <div className={styles.feesRow}>
                    <div className={styles.feeBox}>
                      <span>In-Clinic</span>
                      <strong>Rs. {doctor.clinicFee}</strong>
                    </div>
                    <div className={styles.feeBox}>
                      <span>Online</span>
                      <strong>Rs. {doctor.onlineFee}</strong>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className={styles.doctorActions}>
                    <Link href={`/book-appointment?doctor=${doctor.id}`} className="btn btn-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      Book Appointment
                    </Link>
                    <a href={`https://wa.me/${doctor.whatsapp}`} target="_blank" rel="noreferrer" className="btn btn-whatsapp">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                      WhatsApp
                    </a>
                    <a href={`tel:${doctor.phone}`} className="btn btn-call">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.38 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      Call
                    </a>
                    <Link href={`/doctors/${doctor.slug}`} className="btn btn-outline">
                      Full Profile
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
