'use client';
import Link from "next/link";
import { useState, useEffect } from "react";
import styles from "./Navbar.module.css";

export default function Navbar({ clinicName = "NextGenStudio Dental Clinic" }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.navContainer}`}>
        {/* Logo */}
        <Link href="/" className={styles.logo} onClick={closeMenu}>
          <div className={styles.logoIcon}>
            <img src="/logo.png" alt="NextGenStudio Dental Clinic Logo" width="32" height="32" style={{ objectFit: 'contain', borderRadius: '6px' }} />
          </div>
          <div className={styles.logoText}>
            <span className={styles.logoMain}>NextGenStudio</span>
            <span className={styles.logoDental}> Dental</span>
            <span className={styles.logoClinic}> Clinic</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className={styles.navLinks}>
          <Link href="/" className={styles.navLink}>Home</Link>
          <Link href="/doctors" className={styles.navLink}>Doctors</Link>
          <Link href="/#services" className={styles.navLink}>Services</Link>
          <Link href="/#about" className={styles.navLink}>About</Link>
          <Link href="/#contact" className={styles.navLink}>Contact</Link>
          <Link href="/patient" className={styles.navLink} style={{ color: 'var(--primary-color)', fontWeight: 700 }}>Patient Portal</Link>
        </div>

        {/* Desktop CTA */}
        <div className={styles.navActions}>
          <Link href="/book-appointment" className={`btn btn-primary ${styles.bookBtn}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Book Appointment
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className={`${styles.hamburger} ${isMenuOpen ? styles.hamburgerOpen : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className={styles.mobileOverlay} onClick={closeMenu}>
          <div className={styles.mobileMenu} onClick={e => e.stopPropagation()}>
            <div className={styles.mobileHeader}>
              <div className={styles.logoIcon} style={{background: 'var(--primary-dark)'}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2C9 2 6 5 6 8c0 1.5.5 3 1 4l1 5c.2 1 1 2 2 2h4c1 0 1.8-1 2-2l1-5c.5-1 1-2.5 1-4 0-3-3-6-6-6z"/>
                </svg>
              </div>
              <span style={{fontWeight: 700, fontSize: '1.1rem', color: 'var(--secondary-dark)'}}>NextGenStudio Dental Clinic</span>
              <button className={styles.closeBtn} onClick={closeMenu} aria-label="Close menu">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <nav className={styles.mobileNav}>
              <Link href="/" className={styles.mobileNavLink} onClick={closeMenu}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                Home
              </Link>
              <Link href="/doctors" className={styles.mobileNavLink} onClick={closeMenu}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                Our Doctors
              </Link>
              <Link href="/#services" className={styles.mobileNavLink} onClick={closeMenu}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                Services
              </Link>
              <Link href="/#about" className={styles.mobileNavLink} onClick={closeMenu}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                About
              </Link>
              <Link href="/#contact" className={styles.mobileNavLink} onClick={closeMenu}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                Contact
              </Link>
              <Link href="/patient" className={styles.mobileNavLink} onClick={closeMenu} style={{ color: 'var(--primary-color)', fontWeight: 700 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Patient Portal
              </Link>
            </nav>
            <div className={styles.mobileCta}>
              <Link href="/book-appointment" className={`btn btn-primary`} onClick={closeMenu} style={{width:'100%', justifyContent:'center'}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                Book Appointment
              </Link>
              <a href="tel:+923323284294" className={`btn btn-outline`} style={{width:'100%', justifyContent:'center', marginTop:'0.75rem'}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.38 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                0332-3284294
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
