import styles from "./page.module.css";
import Link from "next/link";
import { getDB } from "../lib/db";
import ReviewForm from "./components/ReviewForm";
import ScrollReveal from "./components/ScrollReveal";
import AnimatedCounter from "./components/AnimatedCounter";
import ImageSlider from "./components/ImageSlider";

export const dynamic = 'force-dynamic';

export default function Home() {
  const db = getDB();
  const settings = db.settings;
  const publishedReviews = (db.reviews || []).filter(r => r.status === 'Published');

  // fallback reviews if none published
  const displayReviews = publishedReviews.length > 0 ? publishedReviews : [
    { name: "Ali Raza", text: "The clinic is incredibly professional and caring. The online consultation was smooth, and diagnosis was spot on. Highly recommended!" },
    { name: "Sara Khan", text: "The clinic environment is very hygienic. I didn't have to wait long because of the pre-booked appointment system. Very satisfied with the treatment." }
  ];

  return (
    <>
    <main>
      <section className={styles.hero}>
        <div className={styles.heroBackground}></div>
        <div className={`container ${styles.heroContent}`}>
          <div className={`${styles.textContent} animate-fade-in`}>
            <div className={styles.badge}>
              Top Rated Specialist
            </div>
            <h1 className={styles.title}>
              Expert Medical Care, <br />
              <span>Right at Your Fingertips.</span>
            </h1>
            <p className={styles.description}>
              Book an online consultation or visit the clinic. {settings.clinicName} offers compassionate, 
              comprehensive healthcare with over 15 years of experience in specialized medicine.
            </p>
            <div className={styles.actions}>
              <Link href="/book-appointment" className="btn btn-primary">
                Book Appointment
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </Link>
              <Link href="/#about" className="btn btn-outline">
                Learn More
              </Link>
            </div>
          </div>
          
          <div className={`${styles.imageWrapper} animate-fade-in`} style={{animationDelay: '0.2s'}}>
            <div className={styles.floatingBlob}></div>
            <div className={styles.floatingPlus1}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary-light)" strokeWidth="3" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg></div>
            <div className={styles.floatingPlus2}><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary-light)" strokeWidth="3" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg></div>
            {/* AI Doctor Avatar */}
            <img 
              src="/dr-qasim.png" 
              alt="Dr. Qasim - AI Avatar" 
            />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className={`${styles.section} ${styles.sectionLight}`}>
        <ScrollReveal className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Medical Services</h2>
            <p className={styles.sectionSubtitle}>
              Comprehensive healthcare services tailored to your needs, combining advanced medical expertise with compassionate care.
            </p>
          </div>
          
          <div className={styles.servicesGrid}>
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              </div>
              <h3 className={styles.serviceTitle}>General Consultation</h3>
              <p className={styles.serviceDesc}>Complete medical evaluation and treatment plans for various health conditions.</p>
            </div>
            
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
              </div>
              <h3 className={styles.serviceTitle}>Online Video Consult</h3>
              <p className={styles.serviceDesc}>Get medical advice from the comfort of your home through secure video calls.</p>
            </div>
            
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
              </div>
              <h3 className={styles.serviceTitle}>Medical Prescriptions</h3>
              <p className={styles.serviceDesc}>Instant digital prescriptions delivered directly to your phone or email.</p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* About Section */}
      <section id="about" className={styles.section}>
        <ScrollReveal className={`container ${styles.aboutGrid}`}>
          <div className={styles.imageWrapper}>
            <div className={styles.floatingBlob}></div>
            <img 
              src="/dr-qasim.png" 
              alt="Dr. Qasim - AI Avatar" 
            />
          </div>
          
          <div>
            <h2 className={styles.sectionTitle}>Why Choose {settings.clinicName}?</h2>
            <p className={styles.description}>
              With over 15 years of dedicated practice, Dr. Qasim has helped thousands of patients achieve better health. Our clinic is equipped with modern facilities to provide the highest standard of care.
            </p>
            
            <div style={{ display: 'flex', gap: '2rem', margin: '2rem 0' }}>
              <div>
                <AnimatedCounter end={15} suffix="+" />
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Years Experience</div>
              </div>
              <div>
                <AnimatedCounter end={5000} suffix="+" />
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Happy Patients</div>
              </div>
              <div>
                <AnimatedCounter end={24} suffix="/7" />
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Online Support</div>
              </div>
            </div>

            <ul className={styles.aboutList}>
              <li className={styles.aboutListItem}>
                <span className={styles.aboutCheck}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>
                FCPS, MRCP (UK) Qualified
              </li>
              <li className={styles.aboutListItem}>
                <span className={styles.aboutCheck}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>
                Ex-Consultant at Mayo Hospital
              </li>
              <li className={styles.aboutListItem}>
                <span className={styles.aboutCheck}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>
                Modern & Hygienic Clinic Environment
              </li>
            </ul>
            
            <div style={{ marginTop: '2rem' }}>
              <Link href="/#about" className="btn btn-outline">Read Full Profile</Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Clinic Gallery Section */}
      <section className={styles.section}>
        <ScrollReveal className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Our Clinic</h2>
            <p className={styles.sectionSubtitle}>
              Experience our modern, hygienic, and state-of-the-art facilities designed for your comfort.
            </p>
          </div>
          <div style={{ marginTop: '3rem' }}>
            <ImageSlider />
          </div>
        </ScrollReveal>
      </section>

      {/* Reviews & Timings Section */}
      <section id="reviews" className={`${styles.section} ${styles.sectionLight}`}>
        <ScrollReveal className="container">

          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Patient Experiences</h2>
            <p className={styles.sectionSubtitle}>
              Read what our patients have to say about their recovery and consultation experience.
            </p>
          </div>
          
          <div className={styles.reviewsGrid}>
            {displayReviews.map((rev, idx) => (
              <div key={idx} className={styles.reviewCard}>
                <div className={styles.quoteIcon}>"</div>
                <p className={styles.reviewText}>
                  {rev.text}
                </p>
                <div className={styles.reviewAuthor}>
                  <div className={styles.authorAvatar}>{rev.name.charAt(0).toUpperCase()}</div>
                  <div>
                    <div className={styles.authorName}>{rev.name}</div>
                    <div className={styles.authorDate}>{rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Recent'}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <ReviewForm />
          
          <div id="contact" className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <h3 className={styles.serviceTitle} style={{marginBottom: '2rem'}}>Clinic Timings</h3>
              <div className={styles.timingRow}>
                <span>Monday - Thursday</span>
                <span>{settings.timingsMonToThu}</span>
              </div>
              <div className={styles.timingRow}>
                <span>Friday</span>
                <span>{settings.timingsFriday}</span>
              </div>
              <div className={styles.timingRow}>
                <span>Saturday</span>
                <span>{settings.timingsSaturday}</span>
              </div>
              <div className={styles.timingRow}>
                <span>Sunday</span>
                <span className={settings.timingsSunday.toLowerCase() === 'closed' ? styles.timingClosed : ''}>{settings.timingsSunday}</span>
              </div>
            </div>
            
            <div className={styles.infoCard}>
              <h3 className={styles.serviceTitle} style={{marginBottom: '2rem'}}>Location & Contact</h3>
              <p style={{marginBottom: '1rem', color: 'var(--text-muted)'}}>
                <strong>Address:</strong><br/>
                {settings.address.split(',').map((line, i) => <span key={i}>{line.trim()}<br/></span>)}
              </p>
              <p style={{marginBottom: '1rem', color: 'var(--text-muted)'}}>
                <strong>Phone:</strong><br/>
                {settings.phone}
              </p>
              <p style={{marginBottom: '2rem'}} className={styles.reviewText}>
                <strong>Consultation Fee:</strong><br/>
                Rs. {settings.inClinicFee} (In-Clinic) | Rs. {settings.onlineFee} (Online)
              </p>
              <Link href="/#contact" className="btn btn-outline" style={{width: '100%'}}>
                View on Google Maps
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </main>

    {/* Floating Action Buttons */}
    <div className={styles.floatingActions}>
      <a href="https://wa.me/923001234567" target="_blank" rel="noreferrer" className={`${styles.fabBtn} ${styles.fabWhatsapp}`} aria-label="WhatsApp">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
      </a>
      <a href="tel:+923001234567" className={`${styles.fabBtn} ${styles.fabCall}`} aria-label="Call Now">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
      </a>
    </div>

    {/* Footer */}
    <footer className={styles.footer}>
      <div className={`container ${styles.footerGrid}`}>
        <div className={styles.footerCol}>
          <h4>Dr. Smith</h4>
          <p style={{marginBottom: '1rem'}} className={styles.reviewText}>
            Providing expert medical care and online consultations with compassion and excellence.
          </p>
        </div>
        
        <div className={styles.footerCol}>
          <h4>Quick Links</h4>
          <ul className={styles.footerList}>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/#about">About Doctor</Link></li>
            <li><Link href="/#services">Services</Link></li>
            <li><Link href="/book-appointment">Book Appointment</Link></li>
          </ul>
        </div>
        
        <div className={styles.footerCol}>
          <h4>Legal</h4>
          <ul className={styles.footerList}>
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms of Service</Link></li>
            <li><Link href="/cancellation">Cancellation Policy</Link></li>
          </ul>
        </div>
      </div>
      
      <div className={styles.footerBottom}>
        <p>&copy; {new Date().getFullYear()} Dr. Smith Clinic. All rights reserved.</p>
      </div>
    </footer>
    </>
  );
}
