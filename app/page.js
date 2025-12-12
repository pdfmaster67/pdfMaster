import Link from 'next/link';
import { 
  FiFileText, FiImage, FiLayers, FiMinimize2, FiMaximize2, FiGrid, 
  FiShield, FiZap, FiGlobe, FiCpu, FiUploadCloud, FiDownload 
} from 'react-icons/fi';

export default function HomePage() {
  // Tools ordered as requested: Image to PDF -> Merge PDF -> Others
  const tools = [
    { 
      name: "Image to PDF", 
      icon: <FiImage size={36} />, 
      href: "/image-to-pdf", 
      desc: "Convert Photos to single PDF", 
      gradient: "from-purple-500 to-indigo-500", 
      text: "text-purple-50", 
      shadow: "shadow-purple-200" 
    },
    { 
      name: "Merge PDF", 
      icon: <FiLayers size={36} />, 
      href: "/merge-pdf", 
      desc: "Combine multiple PDFs", 
      gradient: "from-orange-400 to-pink-500", 
      text: "text-orange-50", 
      shadow: "shadow-orange-200" 
    },
    { 
      name: "Excel to PDF", 
      icon: <FiGrid size={36} />, 
      href: "/excel-to-pdf", 
      desc: "Spreadsheets to PDF", 
      gradient: "from-emerald-400 to-green-600", 
      text: "text-emerald-50", 
      shadow: "shadow-green-200" 
    },
    { 
      name: "Word to PDF", 
      icon: <FiFileText size={36} />, 
      href: "/word-to-pdf", 
      desc: "DOCX files to PDF", 
      gradient: "from-blue-400 to-cyan-500", 
      text: "text-blue-50", 
      shadow: "shadow-blue-200" 
    },
    { 
      name: "Compress Image", 
      icon: <FiMinimize2 size={36} />, 
      href: "/image-compress", 
      desc: "Reduce file size", 
      gradient: "from-pink-500 to-rose-500", 
      text: "text-pink-50", 
      shadow: "shadow-pink-200" 
    },
    { 
      name: "Resize Image", 
      icon: <FiMaximize2 size={36} />, 
      href: "/resize-image", 
      desc: "Resize in px, cm, mm", 
      gradient: "from-cyan-400 to-teal-500", 
      text: "text-cyan-50", 
      shadow: "shadow-cyan-200" 
    },
  ];

  const features = [
    { title: "100% Secure & Private", desc: "We respect your privacy. All files are processed automatically and deleted from our servers permanently after 1 hour.", icon: <FiShield size={32} /> },
    { title: "Lightning Fast", desc: "Powered by advanced cloud servers, our conversion engine processes your Excel, Word, and Image files in milliseconds.", icon: <FiZap size={32} /> },
    { title: "Universal Compatibility", desc: "PDF Matrix works on any device. Whether you are using Windows, Mac, Linux, Android, or iOS, we've got you covered.", icon: <FiGlobe size={32} /> },
    { title: "High Quality Output", desc: "We maintain the original formatting of your documents. No blurred images, broken text, or missing fonts.", icon: <FiCpu size={32} /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 font-sans selection:bg-blue-100">
      
      {/* --- HERO SECTION --- */}
      <div className="pt-24 pb-20 px-6 text-center max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-8 leading-tight">
          Every PDF Tool You Need <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
            In One Place.
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-500 font-medium mb-10 max-w-3xl mx-auto leading-relaxed">
          PDF Matrix is your all-in-one solution. Convert, merge, compress, and resize files securely in the cloud—completely free.
        </p>
      </div>

      {/* --- TOOLS GRID --- */}
      <div className="px-6 pb-28">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {tools.map((tool) => (
            <Link key={tool.name} href={tool.href} className="group">
              <div className="bg-white rounded-[2rem] p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 h-full relative overflow-hidden">
                
                {/* Aesthetic Icon Container */}
                <div className={`w-20 h-20 bg-gradient-to-br ${tool.gradient} ${tool.text} rounded-2xl flex items-center justify-center mb-6 shadow-lg ${tool.shadow} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  {tool.icon}
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-3">{tool.name}</h2>
                <p className="text-gray-500 font-medium text-lg">{tool.desc}</p>

                {/* Subtle Arrow Icon on Hover */}
                <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-gray-300">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* --- HOW IT WORKS SECTION --- */}
      <div className="bg-white py-24 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6">How PDF Matrix Works</h2>
            <p className="text-xl text-gray-500">Three simple steps to perfect documents.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
            <div className="relative">
              <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 text-3xl font-bold shadow-sm">1</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Choose a Tool</h3>
              <p className="text-gray-500 text-lg leading-relaxed">Select the operation you need from our dashboard, such as Image to PDF or Merge PDF.</p>
            </div>
            <div className="relative">
              <div className="w-24 h-24 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                <FiUploadCloud size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Upload File</h3>
              <p className="text-gray-500 text-lg leading-relaxed">Drag and drop your document or image. Our secure algorithm processes it instantly.</p>
            </div>
            <div className="relative">
              <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                <FiDownload size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Download Result</h3>
              <p className="text-gray-500 text-lg leading-relaxed">Get your converted or compressed file immediately. No sign-up required.</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- WHY CHOOSE US SECTION --- */}
      <div className="py-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6">Why Choose PDF Matrix?</h2>
            <p className="text-xl text-gray-500">Dedicated to making file conversion easy, fast, and safe.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 flex items-start space-x-6">
                <div className="flex-shrink-0 w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-500 text-lg leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- SEO CONTENT BLOCK --- */}
      <div className="bg-white py-24 px-6 border-t border-gray-100">
        <div className="max-w-4xl mx-auto prose prose-lg prose-indigo text-gray-500">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">The Ultimate Suite of Document Tools</h2>
          <p className="mb-6">
            In today's fast-paced digital environment, managing document formats efficiently is crucial. 
            <strong>PDF Matrix</strong> offers a comprehensive suite of free online tools designed to handle all your 
            file conversion needs. Whether you are a student submitting assignments, a professional handling 
            business reports, or a designer resizing images, our platform ensures high-quality results.
          </p>
          <p className="mb-6">
            We support a wide range of formats including <strong>XLSX, DOCX, JPG, PNG, and PDF</strong>. 
            Unlike other platforms that require cumbersome software installations or expensive subscriptions, 
            PDF Matrix is entirely cloud-based and free to use.
          </p>
          <p>
            Our commitment to security is paramount. We use advanced SSL encryption to ensure your data 
            transfers are safe, and we employ strict data retention policies to automatically purge your 
            files from our systems. Experience the future of file management with PDF Matrix.
          </p>
        </div>
      </div>
      
    </div>
  );
}