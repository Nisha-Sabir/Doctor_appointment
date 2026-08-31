import Navbar from "./components/Navbar";
import WhatsAppBtn from "./components/WhatsAppBtn";
import { Poppins } from "next/font/google";
import { getDB } from "../lib/db";
import "./globals.css";

const font = Poppins({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata = {
  title: "NextGenStudio Dental Clinic — Expert Dental Care in Karachi",
  description: "Book online dental appointments at NextGenStudio Dental Clinic, North Karachi. Expert dentists for braces, root canal, implants, whitening, pediatric dentistry & more. Call 0332-3284294.",
  keywords: "dental clinic karachi, nextgenstudio dental clinic, dentist karachi, braces karachi, root canal karachi, dental implants karachi, north karachi dentist",
  openGraph: {
    title: "NextGenStudio Dental Clinic — Your Smile, Our Priority",
    description: "Expert dental care in North Karachi — 4 specialist dentists, online appointments, modern clinic.",
    type: "website",
  },
};

export default async function RootLayout({ children }) {
  const db = await getDB();
  const settings = db.settings || {};

  return (
    <html lang="en">
      <body className={font.variable}>
        <Navbar clinicName={settings.clinicName || "NextGenStudio Dental Clinic"} />
        {children}
        <WhatsAppBtn phone={settings.whatsappNumber || settings.phone || ''} />
      </body>
    </html>
  );
}
