import Navbar from "./components/Navbar";
import WhatsAppBtn from "./components/WhatsAppBtn";
import { Nunito } from "next/font/google";
import { getDB } from "../lib/db";
import "./globals.css";

const font = Nunito({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-main',
  display: 'swap',
});

export const metadata = {
  title: "Al Syed Clinic - Premium Healthcare & Consultations",
  description: "Book online appointments with Dr. Qasim. Get premium healthcare services, online consultations, and manage your health efficiently.",
};

export default async function RootLayout({ children }) {
  const db = await getDB();
  const phone = db.settings?.phone || '';

  return (
    <html lang="en">
      <body className={font.variable}>
        <Navbar />
        {children}
        <WhatsAppBtn phone={phone} />
      </body>
    </html>
  );
}
