import Link from 'next/link';
import { Files, Image as ImageIcon, Minimize2 } from 'lucide-react';

export default function Home() {
  const tools = [
    {
      title: 'Merge PDF',
      desc: 'Combine multiple PDFs into one unified document.',
      icon: <Files size={40} className="text-red-500" />,
      href: '/merge-pdf',
      color: 'bg-red-50'
    },
    {
      title: 'Image to PDF',
      desc: 'Convert JPG & PNG images to PDF files in seconds.',
      icon: <ImageIcon size={40} className="text-blue-500" />,
      href: '/image-to-pdf',
      color: 'bg-blue-50'
    },
    {
      title: 'Compress PDF',
      desc: 'Reduce file size while optimizing for maximal quality.',
      icon: <Minimize2 size={40} className="text-green-500" />,
      href: '#', 
      color: 'bg-green-50'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="w-full h-32 bg-gray-200 mb-12 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300">
        Google AdSense Leaderboard (728x90)
      </div>

      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Every tool you need to work with PDFs</h1>
        <p className="text-xl text-gray-600">100% Free. Secure. Files stay in your browser.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {tools.map((tool) => (
          <Link key={tool.title} href={tool.href} className={`p-8 rounded-xl ${tool.color} hover:shadow-lg transition-all border border-transparent hover:border-gray-200 block`}>
            <div className="mb-4">{tool.icon}</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{tool.title}</h3>
            <p className="text-gray-600">{tool.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}