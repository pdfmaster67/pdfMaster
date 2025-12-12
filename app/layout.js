import './globals.css';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'; 
import Script from 'next/script';
import Link from 'next/link';
import { FiGlobe, FiChevronDown } from 'react-icons/fi'; 

const inter = Inter({ subsets: ['latin'] });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'] });

export const metadata = {
  title: 'PDF Matrix - The Ultimate PDF Toolkit',
  description: 'Convert, Compress, and Edit PDFs with our free, secure, and private online tools.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_ACTUAL_ID_HERE"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${jakarta.className} bg-slate-50 min-h-screen flex flex-col`}>
        
        {/* Modern Glassy Navbar */}
        <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20 items-center">
              <Link href="/" className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent flex items-center gap-2">
                <span className="text-3xl">❖</span> PDF Matrix
              </Link>
              <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
                <Link href="/merge-pdf" className="hover:text-indigo-600 transition">Merge</Link>
                <Link href="/compress-image" className="hover:text-indigo-600 transition">Compress</Link>
                <Link href="/word-to-pdf" className="hover:text-indigo-600 transition">Convert</Link>
              </div>
            </div>
          </div>
        </nav>

        {children}

        {/* AESTHETIC MINIMAL FOOTER */}
        <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-slate-300 py-24 mt-20">
          <div className="max-w-5xl mx-auto px-4 flex flex-col items-center text-center">
            
            {/* BIG CENTERED LOGO */}
            <div className="mb-10">
              <h2 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight flex items-center justify-center gap-4">
                <span className="text-indigo-500">❖</span> PDF Matrix
              </h2>
            </div>

            {/* NAVIGATION LINKS */}
            <div className="flex flex-wrap justify-center items-center gap-8 mb-8 text-sm font-medium text-slate-400">
              <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
              
            {/* LANGUAGE SELECTOR (New Line) */}
            <div className="mb-16">
              <div className="inline-flex items-center gap-2 bg-slate-800/50 py-2 px-5 rounded-full border border-slate-700 hover:border-slate-500 cursor-pointer transition-all group">
                <FiGlobe className="text-indigo-400" />
                <span className="group-hover:text-white text-sm font-medium">English (US)</span>
                <FiChevronDown className="text-slate-500 group-hover:text-white" />
              </div>
            </div>
            
            {/* BRANDING BADGE (Saif Mulla Only) */}
            <div className="flex items-center gap-4 bg-slate-800/40 py-3 px-8 rounded-full border border-slate-700/50 shadow-2xl backdrop-blur-sm hover:bg-slate-800/60 transition-all cursor-default transform hover:scale-105 duration-300">
              <span className="text-slate-300 text-sm md:text-base uppercase tracking-widest font-bold">
                By <span className="text-indigo-400">Saif Mulla</span>
              </span>
            </div>

          </div>
        </footer>
      </body>
    </html>
  );
}