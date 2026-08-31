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
    icon: "🛡️",
    title: "General Dentistry",
    desc: "Routine checkups, cleanings, and preventive care for a healthy smile.",
    img: "/service-general.jpg",
    color: "#E0F7FA"
  },
  {
    icon: "✨",
    title: "Cosmetic Dentistry",
    desc: "Whitening, veneers, and smile makeovers to enhance your confidence.",
    img: "/service-cosmetic.jpg",
    color: "#F3E5F5"
  },
  {
    icon: "🦷",
    title: "Dental Implants",
    desc: "Permanent solutions for missing teeth that look and feel natural.",
    img: "/service-implants.jpg",
    color: "#E3F2FD"
  },
  {
    icon: "😁",
    title: "Orthodontics",
    desc: "Straighten your teeth with braces or clear aligners for a perfect smile.",
    img: "/service-braces.jpg",
    color: "#FFF8E1"
  },
  {
    icon: "👶",
    title: "Pediatric Dentistry",
    desc: "Gentle and caring dental care for kids of all ages.",
    img: "/clinic-1.png",
    color: "#FCE4EC"
  },
  {
    icon: "🚨",
    title: "Emergency Care",
    desc: "Fast and effective treatment when you need it the most.",
    img: "/clinic-2.png",
    color: "#E8F5E9"
  }
];

const FEATURES = [
  { icon: "🦷", title: "Comprehensive Care", desc: "From routine checkups to advanced treatments" },
  { icon: "💻", title: "Advanced Technology", desc: "State-of-the-art equipment for precise diagnosis" },
  { icon: "👨‍⚕️", title: "Expert Dentists", desc: "Our experienced team is dedicated to your comfort" },
  { icon: "❤️", title: "Patient Comfort", desc: "Pain-free, relaxing experience for every patient" },
  { icon: "📅", title: "Flexible Scheduling", desc: "Convenient appointment times that fit your lifestyle" },
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

        {/* ─── TOP ANNOUNCEMENT BAR ─── */}
        <div className={styles.announcementBar}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span>🎉 New Patient Special: Get 15% Off on Your First Visit!</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <span>📍 {settings.address}</span>
              <span>📞 {settings.phone}</span>
            </div>
          </div>
        </div>

        {/* ─── HERO ─── */}
        <section className={styles.hero}>
          <div className={styles.heroBg}>
            <div className={styles.heroBlob1}></div>
            <div className={styles.heroBlob2}></div>
          </div>
          <div className={`container ${styles.heroContent}`}>
            {/* Left: Text */}
            <div className={`${styles.heroText} animate-fade-in`}>
              <div className={styles.heroBadge}>
                <span>✅</span>
                Healthy Smile. Happy Life.
              </div>
              <h1 className={styles.heroTitle}>
                Exceptional Care<br />
                <span className={styles.heroHighlight}>for Every Smile.</span>
              </h1>
              <p className={styles.heroDesc}>
                We combine advanced technology with a gentle touch to provide
                personalized dental care for you and your family.
              </p>

              {/* Trust Avatars */}
              <div className={styles.heroTrust}>
                <div className={styles.trustAvatars}>
                  <img src="/doctors/dr-fazal.png" alt="Doctor" />
                  <img src="/doctors/dr-sana.png" alt="Doctor" />
                  <img src="/doctors/dr-ahmad.png" alt="Doctor" />
                  <img src="/doctors/dr-usman.png" alt="Doctor" />
                </div>
                <div className={styles.trustStars}>
                  <div className={styles.starRow}>
                    {[1,2,3,4,5].map(i => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#FFC107" stroke="#FFC107" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    ))}
                  </div>
                  <span>4.9 (320+ Reviews)</span>
                </div>
              </div>

              <div className={styles.heroActions}>
                <Link href="/book-appointment" className="btn btn-primary" id="hero-book-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  Book Appointment
                </Link>
                <Link href="/#services" className="btn btn-outline" id="hero-services-btn">
                  Our Services →
                </Link>
              </div>
            </div>

            {/* Right: Image + Feature Cards */}
            <div className={`${styles.heroVisual} animate-fade-in`} style={{ animationDelay: '0.2s' }}>
              <div className={styles.heroImgContainer}>
                <img
                  src="/hero-patient.jpg"
                  alt="Happy dental patient"
                  className={styles.heroMainImg}
                />
                {/* Feature Cards Overlay */}
                <div className={styles.heroFeatureCard} style={{ top: '12%', right: '-8%' }}>
                  <span className={styles.featureCardIcon}>🔬</span>
                  <span>Advanced Technology</span>
                </div>
                <div className={styles.heroFeatureCard} style={{ top: '35%', right: '-10%' }}>
                  <span className={styles.featureCardIcon}>💚</span>
                  <span>Gentle &amp; Compassionate Care</span>
                </div>
                <div className={styles.heroFeatureCard} style={{ top: '58%', right: '-8%' }}>
                  <span className={styles.featureCardIcon}>👨‍⚕️</span>
                  <span>Experienced Dentists</span>
                </div>
                <div className={styles.heroFeatureCard} style={{ top: '77%', right: '-10%' }}>
                  <span className={styles.featureCardIcon}>💰</span>
                  <span>Affordable Pricing</span>
                </div>
                <div className={styles.heroFeatureCard} style={{ bottom: '3%', right: '-8%' }}>
                  <span className={styles.featureCardIcon}>📅</span>
                  <span>Convenient Appointments</span>
                </div>

                {/* Floating badge */}
                <div className={styles.floatingBadge}>
                  <span>⭐</span> 4.9 Rating
                </div>
                <div className={styles.floatingBadge2}>
                  <span>✅</span> PMDC Verified
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── FEATURES BAR ─── */}
        <section className={styles.featuresBar}>
          <div className="container">
            <div className={styles.featuresBarGrid}>
              {FEATURES.map((f, i) => (
                <div key={i} className={styles.featureBarItem}>
                  <div className={styles.featureBarIcon}>{f.icon}</div>
                  <div>
                    <strong>{f.title}</strong>
                    <p>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── SERVICES SECTION ─── */}
        <section id="services" className={`${styles.section} ${styles.sectionAlt}`}>
          <ScrollReveal className="container">
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTag}>Our Services</div>
              <h2 className={styles.sectionTitle}>Complete Dental Care Solutions</h2>
              <div className="divider divider-center"></div>
              <p className={styles.sectionSubtitle}>
                Comprehensive dental services using the latest technology for all ages.
              </p>
            </div>
            <div className={styles.servicesGrid}>
              {DENTAL_SERVICES.map((service, i) => (
                <div key={i} className={styles.serviceCard}>
                  <div className={styles.serviceImgWrap}>
                    <img src={service.img} alt={service.title} className={styles.serviceImg} />
                    <div className={styles.serviceImgOverlay}>
                      <div className={styles.serviceIconBadge}>{service.icon}</div>
                    </div>
                  </div>
                  <div className={styles.serviceBody}>
                    <h3 className={styles.serviceTitle}>{service.title}</h3>
                    <p className={styles.serviceDesc}>{service.desc}</p>
                    <Link href="/book-appointment" className={styles.serviceLink}>
                      Learn More →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
              <Link href="/book-appointment" className="btn btn-primary" id="view-all-services-btn">
                View All Services
              </Link>
            </div>
          </ScrollReveal>
        </section>

        {/* ─── ABOUT SECTION ─── */}
        <section id="about" className={styles.section}>
          <ScrollReveal className={`container ${styles.aboutGrid}`}>
            <div className={styles.aboutImgWrap}>
              <div className={styles.aboutImgGrid}>
                <img src="/clinic-interior.jpg" alt="Fazal Dental Clinic Interior" className={styles.aboutImgMain} />
                <img src="/clinic-1.png" alt="Clinic" className={styles.aboutImgSecondary} />
              </div>
              <div className={styles.aboutImgBadge}>
                <div className={styles.badgeNum}>15+</div>
                <div className={styles.badgeLabel}>Years of<br />Excellence</div>
              </div>
            </div>
            <div className={styles.aboutContent}>
              <div className={styles.sectionTag}>About Us</div>
              <h2 className={styles.sectionTitle}>Your Smile is Our Priority</h2>
              <div className="divider"></div>
              <p className={styles.aboutDesc}>
                At Fazal Dental Clinic, we are committed to providing high-quality dental
                care in a comfortable and welcoming environment. Our goal is to help you
                achieve a healthy, beautiful smile that lasts a lifetime.
              </p>

              {/* Stats Row */}
              <div className={styles.aboutStats}>
                <div className={styles.aboutStatItem}>
                  <div className={styles.aboutStatIcon}>📅</div>
                  <strong><AnimatedCounter end={15} suffix="+" /></strong>
                  <span>Years of Experience</span>
                </div>
                <div className={styles.aboutStatItem}>
                  <div className={styles.aboutStatIcon}>👨‍⚕️</div>
                  <strong><AnimatedCounter end={4} suffix="+" /></strong>
                  <span>Expert Doctors</span>
                </div>
                <div className={styles.aboutStatItem}>
                  <div className={styles.aboutStatIcon}>😊</div>
                  <strong><AnimatedCounter end={5000} suffix="+" /></strong>
                  <span>Happy Patients</span>
                </div>
                <div className={styles.aboutStatItem}>
                  <div className={styles.aboutStatIcon}>⭐</div>
                  <strong>4.9</strong>
                  <span>Patient Rating</span>
                </div>
              </div>

              <Link href="/book-appointment" className="btn btn-primary" style={{ marginTop: '1.5rem', width: 'fit-content' }} id="about-book-btn">
                Learn More About Us
              </Link>
            </div>
          </ScrollReveal>
        </section>

        {/* ─── DOCTORS SECTION ─── */}
        <section id="doctors" className={`${styles.section} ${styles.sectionAlt}`}>
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
              <Link href="/doctors" className="btn btn-outline" id="view-all-doctors-btn">
                View All Doctor Profiles →
              </Link>
            </div>
          </ScrollReveal>
        </section>

        {/* ─── REVIEWS SECTION ─── */}
        <section id="reviews" className={styles.section}>
          <ScrollReveal className="container">
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTag}>Patient Testimonials</div>
              <h2 className={styles.sectionTitle}>Loved by Our Patients</h2>
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

        {/* ─── CTA BANNER ─── */}
        <section className={styles.ctaBanner}>
          <div className={`container ${styles.ctaBannerContent}`}>
            <div className={styles.ctaBannerText}>
              <div className={styles.ctaBannerIcon}>📅</div>
              <div>
                <h3>Ready to Transform Your Smile?</h3>
                <p>Book your appointment today and take the first step toward a healthier, brighter smile!</p>
              </div>
            </div>
            <Link href="/book-appointment" className={styles.ctaBannerBtn} id="cta-book-btn">
              Book Appointment →
            </Link>
          </div>
        </section>

        {/* ─── LOCATION SECTION ─── */}
        <section id="contact" className={styles.section}>
          <ScrollReveal className="container">
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTag}>Find Us</div>
              <h2 className={styles.sectionTitle}>Clinic Location &amp; Contact</h2>
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
                  id="get-directions-btn"
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
                  <h3>Address &amp; Contact</h3>
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
                  <Link href="/book-appointment" className="btn btn-primary btn-sm" id="fees-book-btn" style={{width:'100%', marginTop:'1rem', justifyContent:'center'}}>
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
              We provide exceptional dental care with a gentle touch. Your smile, our passion.
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
              <li><Link href="/#about">About Us</Link></li>
              <li><Link href="/#services">Services</Link></li>
              <li><Link href="/book-appointment">For Patients</Link></li>
              <li><Link href="/doctors">Our Doctors</Link></li>
              <li><Link href="/#contact">Contact Us</Link></li>
            </ul>
          </div>

          <div className={styles.footerCol}>
            <h4 className={styles.footerHeading}>Services</h4>
            <ul className={styles.footerList}>
              <li>General Dentistry</li>
              <li>Cosmetic Dentistry</li>
              <li>Dental Implants</li>
              <li>Orthodontics</li>
              <li>Pediatric Dentistry</li>
              <li>Emergency Care</li>
            </ul>
          </div>

          <div className={styles.footerCol}>
            <h4 className={styles.footerHeading}>Contact Us</h4>
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
