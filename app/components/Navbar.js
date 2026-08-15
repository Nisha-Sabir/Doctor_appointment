import Link from "next/link";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <span style={{color: 'var(--secondary-dark)'}}>Medi</span><span style={{color: 'var(--primary-color)'}}>Care</span>
        </Link>
        
        <div className={styles.navLinks}>
          <Link href="/" className={styles.navLink}>Home</Link>
          <Link href="/#about" className={styles.navLink}>About</Link>
          <Link href="/#services" className={styles.navLink}>Services</Link>
          <Link href="/#reviews" className={styles.navLink}>Reviews</Link>
          <Link href="/#contact" className={styles.navLink}>Contact</Link>
          <Link href="/book-appointment" className={styles.bookBtn}>
            Book Appointment
          </Link>
        </div>
      </div>
    </nav>
  );
}
