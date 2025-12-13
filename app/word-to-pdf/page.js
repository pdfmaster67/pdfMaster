'use client';

import { useState, useRef } from 'react';
import { 
  FiFileText, FiDownload, FiRefreshCw, FiCheckCircle, 
  FiUploadCloud, FiLayout, FiLock, FiShield, FiZap, FiSmartphone 
} from 'react-icons/fi'; 

export default function WordToPdfPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  // --- DOWNLOAD HELPER ---
  const downloadPdf = (blob, name) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name || "document.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // --- API HANDLER ---
  async function handleFile(file) {
    if (!file) return;
    setIsLoading(true);
    setError("");
    setPdfBlob(null);
    setFileName(file.name.replace(/\.[^/.]+$/, "") + ".pdf");
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Assuming you set up the API route at /api/word-to-pdf
      const response = await fetch('/api/word-to-pdf', { method: 'POST', body: formData });
      
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.details || "Conversion failed.");
      }
      
      const blob = await response.blob();
      setPdfBlob(blob);
      downloadPdf(blob, file.name.replace(/\.[^/.]+$/, "") + ".pdf");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 font-sans">
      
      {/* --- HERO TOOL SECTION --- */}
      <div className="flex flex-col items-center p-6 pt-16 pb-24">
        <div className="w-full max-w-lg text-center mb-10">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-3">Word to PDF</h1>
          <p className="text-lg text-gray-500 font-medium">Convert DOCX documents to PDF instantly.</p>
        </div>

        <div className="w-full max-w-lg bg-white shadow-2xl rounded-3xl p-10 transition-all hover:scale-[1.01]">
          {error && <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-bold">⚠️ {error}</div>}

          {pdfBlob ? (
            <div className="text-center animate-fade-in">
              <div className="mx-auto w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                <FiCheckCircle size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Conversion Complete!</h3>
              <div className="space-y-4 mt-8">
                <button onClick={() => downloadPdf(pdfBlob, fileName)} className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg shadow-blue-200 transition-transform hover:-translate-y-1">
                  <FiDownload size={20} /> Download PDF
                </button>
                <button onClick={() => { setPdfBlob(null); }} className="w-full flex items-center justify-center gap-3 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 px-6 rounded-xl font-bold text-lg">
                  <FiRefreshCw size={20} /> New File
                </button>
              </div>
            </div>
          ) : (
            <div 
              onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
              onDragOver={(e) => e.preventDefault()}
              className={`border-3 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer group ${isLoading ? 'border-gray-200 bg-gray-50' : 'border-blue-200 bg-white hover:border-blue-500 hover:bg-blue-50'}`}
              onClick={() => !isLoading && fileInputRef.current.click()}
            >
              <input type="file" ref={fileInputRef} onChange={(e) => handleFile(e.target.files[0])} accept=".docx, .doc" className="hidden" />
              {isLoading ? (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-500 font-bold text-lg animate-pulse">Converting...</p>
                </div>
              ) : (
                <>
                  <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <FiFileText size={36} />
                  </div>
                  <p className="text-gray-900 font-extrabold text-2xl mb-2">Drag Word File</p>
                  <p className="text-gray-400 font-medium text-sm">Supports .docx and .doc</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* --- HOW IT WORKS --- */}
      <div className="bg-white py-24 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6">How to Convert Word to PDF</h2>
            <p className="text-xl text-gray-500">Three simple steps to lock your formatting.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
            
            <div className="relative">
              <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                <FiFileText size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Upload Doc</h3>
              <p className="text-gray-500 text-lg leading-relaxed">Select your Microsoft Word document (.docx or .doc) from your computer or mobile.</p>
            </div>

            <div className="relative">
              <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                <FiLayout size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Conversion</h3>
              <p className="text-gray-500 text-lg leading-relaxed">We preserve your original fonts, images, and layout, creating an exact replica in PDF format.</p>
            </div>

            <div className="relative">
              <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                <FiDownload size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Download</h3>
              <p className="text-gray-500 text-lg leading-relaxed">Get a print-ready PDF file that looks the same on every single device.</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- WHY CHOOSE US --- */}
      <div className="py-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6">Why use Tools Matrix?</h2>
            <p className="text-xl text-gray-500">The smartest way to share documents.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 flex items-start space-x-6">
              <div className="flex-shrink-0 w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                <FiLock size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Format Locking</h3>
                <p className="text-gray-500 text-lg leading-relaxed">Word docs can look different on different computers. Converting to PDF locks your text in place so it never shifts.</p>
              </div>
            </div>
            <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 flex items-start space-x-6">
              <div className="flex-shrink-0 w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                <FiSmartphone size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Universal View</h3>
                <p className="text-gray-500 text-lg leading-relaxed">Your recipient doesn't need Microsoft Word. PDFs open perfectly on iPhones, Androids, and any web browser.</p>
              </div>
            </div>
            <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 flex items-start space-x-6">
              <div className="flex-shrink-0 w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                <FiShield size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Secure & Private</h3>
                <p className="text-gray-500 text-lg leading-relaxed">We process your resumes, essays, and contracts securely and delete them automatically after 1 hour.</p>
              </div>
            </div>
            <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 flex items-start space-x-6">
              <div className="flex-shrink-0 w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                <FiZap size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Fast & Free</h3>
                <p className="text-gray-500 text-lg leading-relaxed">No software installation, no watermarks, and no sign-up required. Just drag, drop, and done.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- SEO CONTENT BLOCK --- */}
      <div className="bg-white py-24 px-6 border-t border-gray-100">
        <div className="max-w-4xl mx-auto prose prose-lg prose-blue text-gray-500">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Convert DOCX to PDF Free</h2>
          <p className="mb-6">
            Microsoft Word documents are excellent for editing, but they are risky for sharing. A resume that looks perfect on your laptop might look broken on a recruiter's phone. 
            By converting to PDF with <strong>Tools Matrix</strong>, you ensure your document looks exactly the way you intended, everywhere.
          </p>
          <p className="mb-6">
            This tool is essential for students submitting essays, job seekers sending resumes, and professionals sharing contracts. 
            We support both modern <strong>.docx</strong> files and older <strong>.doc</strong> formats.
          </p>
          <p>
            Experience the peace of mind that comes with a standardized document format. Upload your file today and get a professional PDF in seconds.
          </p>
        </div>
      </div>

    </div>
  );
}