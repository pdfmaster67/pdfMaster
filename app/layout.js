import './globals.css';
import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'PDFMaster - Free PDF Tools',
  description: 'Merge, Compress, and Convert PDFs for free.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen flex flex-col`}>
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <Link href="/" className="text-2xl font-bold text-red-600 flex items-center gap-2">
                📄 PDFMaster
              </Link>
            </div>
          </div>
        </nav>
        <main className="flex-grow">{children}</main>
        <footer className="bg-gray-900 text-white py-10 mt-12 text-center">
          <p>© 2024 PDFMaster. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}