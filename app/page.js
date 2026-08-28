import styles from "./page.module.css";
import Link from "next/link";
import { getDB } from "../lib/db";
import ReviewForm from "./components/ReviewForm";
import ScrollReveal from "./components/ScrollReveal";
import AnimatedCounter from "./components/AnimatedCounter";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Fazal Dental Clinic — Expert Dental Care in Karachi",
  description: "Book appointments at Fazal Dental Clinic, North Karachi. Expert dentists for braces, root canal, implants, whitening & more.",
};

const DENTAL_SERVICES = [
  {
    icon: "🦷",
    title: "Dental Implants",
    desc: "Permanent tooth replacement with titanium implants for a natural look and feel.",
    color: "#E3F2FD"
  },
  {
    icon: "😁",
    title: "Braces & Aligners",
    desc: "Orthodontic braces and invisible aligners for a perfectly straight, confident smile.",
    color: "#F3E5F5"
  },
  {
    icon: "🔬",
    title: "Root Canal Treatment",
    desc: "Pain-free root canal procedures using latest rotary endodontic techniques.",
    color: "#E8F5E9"
  },
  {
    icon: "✨",
    title: "Teeth Whitening",
    desc: "Professional laser and bleaching teeth whitening for a dazzling bright smile.",
    color: "#FFF8E1"
  },
  {
    icon: "👶",
    title: "Pediatric Dentistry",
    desc: "Child-friendly dental care in a comfortable environment for kids of all ages.",
    color: "#FCE4EC"
  },
  {
    icon: "🏆",
    title: "Smile Makeover",
    desc: "Complete cosmetic smile transformation with veneers, bonding, and contouring.",
    color: "#E0F2F1"
  },
  {
    icon: "💎",
    title: "Dental Veneers",
    desc: "Ultra-thin porcelain veneers to correct chips, stains, and imperfections.",
    color: "#E8EAF6"
  },
  {
    icon: "🛡️",
    title: "General Checkup",
    desc: "Comprehensive dental examination, cleaning, X-rays, and preventive care.",
    color: "#E0F7FA"
  }
];

export default async function Home() {
  const db = await getDB();
  const settings = db.settings;
  const doctors = db.doctors || [];
  const publishedReviews = (db.reviews || []).filter(r => r.status === 'Published');

  const displayReviews = publishedReviews.length > 0 ? publishedReviews : [
    { name: "Ali Raza", text: "Fazal Dental Clinic ne mera dant bilkul theek kar diya. Dr. Fazal bahut care se treatment karte hain. Highly recommended!", rating: 5 },
    { name: "Sara Noor", text: "Braces treatment excellent tha! Clinic bohot clean aur staff professional hai.", rating: 5 },
    { name: "Usman Tariq", text: "Root canal bilkul dard ke bina. Dr. Ahmad ne bohot acha kaam kiya.", rating: 5 }
  ];

  const whatsappNumber = settings.whatsappNumber || "923323284294";

  return (
    <>
      <main style={{ paddingTop: '72px' }}>

        {/* ─── HERO ─── */}
        <section className={styles.hero}>
          <div className={styles.heroBg}>
            <div className={styles.heroBlob1}></div>
            <div className={styles.heroBlob2}></div>
          </div>
          <div className={`container ${styles.heroContent}`}>
            <div className={`${styles.heroText} animate-fade-in`}>
              <div className={styles.heroBadge}>
                <span>🏆</span>
                Karachi&apos;s Most Trusted Dental Clinic
              </div>
              <h1 className={styles.heroTitle}>
                Your Perfect Smile<br />
                <span className={styles.heroHighlight}>Starts Here.</span>
              </h1>
              <p className={styles.heroDesc}>
                {settings.clinicName} — {settings.tagline}. 
                Expert dental care from 4 specialist dentists. Modern equipment, 
                hygienic environment, and pain-free treatments in North Karachi.
              </p>
              <div className={styles.heroStats}>
                <div className={styles.heroStat}>
                  <strong><AnimatedCounter end={5000} suffix="+" /></strong>
                  <span>Happy Patients</span>
                </div>
                <div className={styles.heroStatDivider}></div>
                <div className={styles.heroStat}>
                  <strong><AnimatedCounter end={4} suffix=" Doctors" /></strong>
                  <span>Specialists</span>
                </div>
                <div className={styles.heroStatDivider}></div>
                <div className={styles.heroStat}>
                  <strong><AnimatedCounter end={15} suffix="+" /></strong>
                  <span>Years Experience</span>
                </div>
              </div>
              <div className={styles.heroActions}>
                <Link href="/book-appointment" className="btn btn-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  Book Appointment
                </Link>
                <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer" className="btn btn-whatsapp">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                  WhatsApp Us
                </a>
                <a href={`tel:${settings.phone}`} className="btn btn-call">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.38 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  Call Now
                </a>
              </div>
            </div>
            <div className={`${styles.heroVisual} animate-fade-in`} style={{ animationDelay: '0.2s' }}>
              <div className={styles.heroImageGrid}>
                <div className={styles.heroImgCard}>
                  <img src="/doctors/dr-fazal.png" alt="Dr. Fazal ur Rehman" />
                  <div className={styles.heroImgLabel}>
                    <span>Dr. Fazal</span>
                    <small>Orthodontist</small>
                  </div>
                </div>
                <div className={styles.heroImgCard} style={{ animationDelay: '0.15s' }}>
                  <img src="/doctors/dr-sana.png" alt="Dr. Sana Malik" />
                  <div className={styles.heroImgLabel}>
                    <span>Dr. Sana</span>
                    <small>Pediatric Dentist</small>
                  </div>
                </div>
                <div className={styles.heroImgCard} style={{ animationDelay: '0.3s' }}>
                  <img src="/doctors/dr-ahmad.png" alt="Dr. Ahmad Bilal" />
                  <div className={styles.heroImgLabel}>
                    <span>Dr. Ahmad</span>
                    <small>Endodontist</small>
                  </div>
                </div>
                <div className={styles.heroImgCard} style={{ animationDelay: '0.45s' }}>
                  <img src="/doctors/dr-usman.png" alt="Dr. Usman Ghani" />
                  <div className={styles.heroImgLabel}>
                    <span>Dr. Usman</span>
                    <small>Cosmetic Dentist</small>
                  </div>
                </div>
              </div>
              {/* Floating badges */}
              <div className={styles.floatingBadge} style={{ top: '10%', right: '-5%' }}>
                <span>⭐</span> 4.9 Rating
              </div>
              <div className={styles.floatingBadge} style={{ bottom: '15%', left: '-5%', animationDelay: '1s' }}>
                <span>✅</span> PMDC Verified
              </div>
            </div>
          </div>
        </section>

        {/* ─── DOCTORS SECTION ─── */}
        <section id="doctors" className={styles.section}>
          <ScrollReveal className="container">
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTag}>Our Team</div>
              <h2 className={styles.sectionTitle}>Meet Our Expert Dentists</h2>
              <div className="divider divider-center"></div>
              <p className={styles.sectionSubtitle}>
                4 highly qualified dental specialists dedicated to giving you the best smile possible.
              </p>
            </div>

            <div className={styles.doctorsGrid}>
              {doctors.map((doctor) => (
                <div key={doctor.id} className={styles.doctorCard}>
                  <div className={styles.doctorImgWrap}>
                    <img src={doctor.photo} alt={doctor.name} className={styles.doctorImg} />
                    <div className={styles.doctorImgOverlay}>
                      <Link href={`/doctors/${doctor.slug}`} className="btn btn-primary btn-sm">View Profile</Link>
                    </div>
                  </div>
                  <div className={styles.doctorInfo}>
                    <div className={styles.doctorBadge}>{doctor.specialization}</div>
                    <h3 className={styles.doctorName}>{doctor.name}</h3>
                    <p className={styles.doctorTitle}>{doctor.title}</p>
                    <p className={styles.doctorExp}>🏅 {doctor.experience} Experience</p>

                    <div className={styles.doctorTimings}>
                      <div className={styles.timingRow}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        <span>Clinic: {doctor.clinicTimings}</span>
                      </div>
                      <div className={styles.timingRow}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><polyline points="8 21 12 17 16 21"/><line x1="12" y1="17" x2="12" y2="3"/></svg>
                        <span>Online: {doctor.onlineTimings}</span>
                      </div>
                    </div>

                    <div className={styles.doctorFees}>
                      <span>In-Clinic: <strong>Rs. {doctor.clinicFee}</strong></span>
                      <span>Online: <strong>Rs. {doctor.onlineFee}</strong></span>
                    </div>

                    <div className={styles.doctorActions}>
                      <Link href={`/book-appointment?doctor=${doctor.id}`} className="btn btn-primary btn-sm">
                        Book Now
                      </Link>
                      <a href={`https://wa.me/${doctor.whatsapp}`} target="_blank" rel="noreferrer" className="btn btn-whatsapp btn-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                        WhatsApp
                      </a>
                      <a href={`tel:${doctor.phone}`} className="btn btn-call btn-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.38 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                        Call
                      </a>

                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
              <Link href="/doctors" className="btn btn-outline">
                View All Doctor Profiles →
              </Link>
            </div>
          </ScrollReveal>
        </section>

        {/* ─── SERVICES SECTION ─── */}
        <section id="services" className={`${styles.section} ${styles.sectionAlt}`}>
          <ScrollReveal className="container">
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTag}>What We Offer</div>
              <h2 className={styles.sectionTitle}>Dental Services & Treatments</h2>
              <div className="divider divider-center"></div>
              <p className={styles.sectionSubtitle}>
                Comprehensive dental services using the latest technology for all ages.
              </p>
            </div>
            <div className={styles.servicesGrid}>
              {DENTAL_SERVICES.map((service, i) => (
                <div key={i} className={styles.serviceCard} style={{ '--card-accent': service.color }}>
                  <div className={styles.serviceIcon}>{service.icon}</div>
                  <h3 className={styles.serviceTitle}>{service.title}</h3>
                  <p className={styles.serviceDesc}>{service.desc}</p>
                  <Link href="/book-appointment" className={styles.serviceLink}>
                    Book Treatment →
                  </Link>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </section>

        {/* ─── ABOUT SECTION ─── */}
        <section id="about" className={styles.section}>
          <ScrollReveal className={`container ${styles.aboutGrid}`}>
            <div className={styles.aboutImgWrap}>
              <img src="/doctors/dr-fazal.png" alt="Fazal Dental Clinic" className={styles.aboutImg} />
              <div className={styles.aboutImgBadge}>
                <div className={styles.badgeNum}>15+</div>
                <div className={styles.badgeLabel}>Years of<br />Excellence</div>
              </div>
            </div>
            <div className={styles.aboutContent}>
              <div className={styles.sectionTag}>About Us</div>
              <h2 className={styles.sectionTitle}>Why Choose Fazal Dental Clinic?</h2>
              <div className="divider"></div>
              <p className={styles.aboutDesc}>
                Fazal Dental Clinic has been North Karachi&apos;s trusted dental destination for over 15 years. 
                Our team of 4 specialist dentists provides world-class dental care using the latest 
                equipment and pain-free techniques. We believe every patient deserves a beautiful, 
                healthy smile — and we make it affordable.
              </p>
              <div className={styles.aboutFeatures}>
                {[
                  { icon: "🏥", title: "Modern Equipment", desc: "Latest dental technology for precise, comfortable treatment" },
                  { icon: "💊", title: "Pain-Free Treatment", desc: "Advanced anesthesia and gentle techniques for zero discomfort" },
                  { icon: "🌿", title: "Hygienic Environment", desc: "Sterile, ISO-standard clinic with fully autoclaved instruments" },
                  { icon: "💰", title: "Affordable Pricing", desc: "Premium care at fair prices with flexible payment options" },
                ].map((f, i) => (
                  <div key={i} className={styles.aboutFeature}>
                    <span className={styles.featureIcon}>{f.icon}</span>
                    <div>
                      <strong>{f.title}</strong>
                      <p>{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/book-appointment" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
                Book an Appointment →
              </Link>
            </div>
          </ScrollReveal>
        </section>

        {/* ─── REVIEWS SECTION ─── */}
        <section id="reviews" className={`${styles.section} ${styles.sectionAlt}`}>
          <ScrollReveal className="container">
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTag}>Patient Stories</div>
              <h2 className={styles.sectionTitle}>What Our Patients Say</h2>
              <div className="divider divider-center"></div>
              {settings.googleReviewUrl && (
                <a href={settings.googleReviewUrl} target="_blank" rel="noreferrer" className={styles.googleReviewBtn}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  Leave a Google Review
                </a>
              )}
            </div>

            <div className={styles.reviewsGrid}>
              {displayReviews.map((rev, idx) => (
                <div key={idx} className={styles.reviewCard}>
                  <div className={styles.reviewStars}>
                    {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#FFC107" stroke="#FFC107" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    ))}
                  </div>
                  <div className={styles.reviewQuote}>&ldquo;</div>
                  <p className={styles.reviewText}>{rev.text}</p>
                  {rev.doctorName && (
                    <div style={{ color: 'var(--primary-color)', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                      🩺 Consulted {rev.doctorName}
                    </div>
                  )}
                  <div className={styles.reviewAuthor}>
                    <div className={styles.authorAvatar}>{rev.name.charAt(0).toUpperCase()}</div>
                    <div>
                      <div className={styles.authorName}>{rev.name}</div>
                      <div className={styles.authorDate}>{rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Recent Patient'}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '3rem' }}>
              <ReviewForm />
            </div>
          </ScrollReveal>
        </section>

        {/* ─── LOCATION SECTION ─── */}
        <section id="contact" className={styles.section}>
          <ScrollReveal className="container">
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTag}>Find Us</div>
              <h2 className={styles.sectionTitle}>Clinic Location & Contact</h2>
              <div className="divider divider-center"></div>
            </div>

            <div className={styles.locationGrid}>
              <div className={styles.mapWrap} style={{ background: 'var(--bg-alt)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '3rem 2rem', borderRadius: '1.25rem', border: '2px dashed var(--border-color)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📍</div>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--secondary-dark)', marginBottom: '0.5rem' }}>Visit Our Clinic</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '400px' }}>
                  Click the button below to get exact directions to our clinic via Google Maps.
                </p>
                <a 
                  href="https://share.google/M1Wj8znn2cX17VUe5" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="btn btn-primary"
                  style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}
                >
                  Get Directions on Google Maps 🗺️
                </a>
              </div>

              <div className={styles.contactCards}>
                {/* Timings Card */}
                <div className={styles.infoCard}>
                  <div className={styles.infoCardIcon}>🕐</div>
                  <h3>Clinic Timings</h3>
                  <div className={styles.timingsTable}>
                    <div className={styles.timingItem}>
                      <span>Mon – Thu</span>
                      <span className={styles.timingValue}>{settings.timingsMonToThu}</span>
                    </div>
                    <div className={styles.timingItem}>
                      <span>Friday</span>
                      <span className={styles.timingValue}>{settings.timingsFriday}</span>
                    </div>
                    <div className={styles.timingItem}>
                      <span>Saturday</span>
                      <span className={styles.timingValue}>{settings.timingsSaturday}</span>
                    </div>
                    <div className={styles.timingItem}>
                      <span>Sunday</span>
                      <span className={`${styles.timingValue} ${settings.timingsSunday?.toLowerCase() === 'closed' ? styles.timingClosed : ''}`}>
                        {settings.timingsSunday}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Card */}
                <div className={styles.infoCard}>
                  <div className={styles.infoCardIcon}>📍</div>
                  <h3>Address & Contact</h3>
                  <div className={styles.contactList}>
                    <div className={styles.contactItem}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      <span>{settings.address}</span>
                    </div>
                    <div className={styles.contactItem}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.38 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      <span>{settings.phone}</span>
                    </div>
                    <div className={styles.contactItem}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                      <span>{settings.email}</span>
                    </div>
                  </div>
                  <div className={styles.contactActions}>
                    <a href={`https://wa.me/${settings.whatsappNumber}`} target="_blank" rel="noreferrer" className="btn btn-whatsapp btn-sm" style={{flex:1, justifyContent:'center'}}>
                      WhatsApp
                    </a>
                    <a href={"https://share.google/M1Wj8znn2cX17VUe5"} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm" style={{flex:1, justifyContent:'center'}}>
                      📍 Maps
                    </a>
                  </div>
                </div>

                {/* Fees Card */}
                <div className={styles.infoCard}>
                  <div className={styles.infoCardIcon}>💳</div>
                  <h3>Consultation Fees</h3>
                  <div className={styles.feesList}>
                    <div className={styles.feeItem}>
                      <span>In-Clinic Consultation</span>
                      <strong>Rs. {settings.inClinicFee}</strong>
                    </div>
                    <div className={styles.feeItem}>
                      <span>Online Consultation</span>
                      <strong>Rs. {settings.onlineFee}</strong>
                    </div>
                  </div>
                  <Link href="/book-appointment" className="btn btn-primary btn-sm" style={{width:'100%', marginTop:'1rem', justifyContent:'center'}}>
                    Book Appointment Now
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>

      </main>

      {/* ─── FOOTER ─── */}
      <footer className={styles.footer}>
        <div className={`container ${styles.footerGrid}`}>
          <div className={styles.footerBrand}>
            <div className={styles.footerLogo}>
              <div className={styles.footerLogoIcon}>🦷</div>
              <div>
                <div className={styles.footerLogoName}>Fazal Dental Clinic</div>
                <div className={styles.footerTagline}>{settings.tagline}</div>
              </div>
            </div>
            <p className={styles.footerDesc}>
              Expert dental care in North Karachi. Modern equipment, experienced dentists, and a warm patient-first approach.
            </p>
            <div className={styles.footerSocial}>
              <a href={`https://wa.me/${settings.whatsappNumber}`} target="_blank" rel="noreferrer" className={styles.socialBtn} aria-label="WhatsApp">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
              </a>
              <a href={`tel:${settings.phone}`} className={styles.socialBtn} aria-label="Call">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.38 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </a>
              {settings.googleReviewUrl && (
                <a href={settings.googleReviewUrl} target="_blank" rel="noreferrer" className={styles.socialBtn} aria-label="Google Review">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </a>
              )}
            </div>
          </div>

          <div className={styles.footerCol}>
            <h4 className={styles.footerHeading}>Quick Links</h4>
            <ul className={styles.footerList}>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/doctors">Our Doctors</Link></li>
              <li><Link href="/#services">Services</Link></li>
              <li><Link href="/book-appointment">Book Appointment</Link></li>
              <li><Link href="/messages">Message a Doctor</Link></li>
            </ul>
          </div>

          <div className={styles.footerCol}>
            <h4 className={styles.footerHeading}>Services</h4>
            <ul className={styles.footerList}>
              <li>Dental Implants</li>
              <li>Braces & Aligners</li>
              <li>Root Canal</li>
              <li>Teeth Whitening</li>
              <li>Pediatric Dentistry</li>
              <li>Smile Makeover</li>
            </ul>
          </div>

          <div className={styles.footerCol}>
            <h4 className={styles.footerHeading}>Contact</h4>
            <ul className={styles.footerList}>
              <li>📍 {settings.address}</li>
              <li>📞 {settings.phone}</li>
              <li>✉️ {settings.email}</li>
              <li style={{ marginTop: '0.75rem' }}>
                <strong>Mon–Thu:</strong> {settings.timingsMonToThu}
              </li>
              <li><strong>Sat:</strong> {settings.timingsSaturday}</li>
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', textAlign: 'center' }}>
          <p>&copy; {new Date().getFullYear()} Fazal Dental Clinic. All Rights Reserved.</p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Powered by <span style={{ fontWeight: '600', color: 'var(--primary-color)' }}>NextGen Studio</span>
          </p>
        </div>
      </footer>
    </>
  );
}
