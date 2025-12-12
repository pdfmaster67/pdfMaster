'use client';

import { useState, useRef } from 'react';
import { 
  FiLayers, FiDownload, FiRefreshCw, FiCheckCircle, 
  FiUploadCloud, FiLock, FiCpu, FiFileText 
} from 'react-icons/fi'; 

export default function MergePdfPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  // --- DOWNLOAD HELPER ---
  const downloadPdf = (blob) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "merged_document.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // --- API HANDLER ---
  async function handleFiles(files) {
    if (!files || files.length < 2) {
      setError("Please select at least 2 PDF files to merge.");
      return;
    }
    setIsLoading(true);
    setError("");
    setPdfBlob(null);

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const response = await fetch('/api/merge-pdf', { method: 'POST', body: formData });
      if (!response.ok) throw new Error("Merge failed.");
      
      const blob = await response.blob();
      setPdfBlob(blob);
      downloadPdf(blob);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 font-sans">
      
      {/* --- HERO TOOL SECTION --- */}
      <div className="flex flex-col items-center p-6 pt-16 pb-24">
        <div className="w-full max-w-lg text-center mb-10">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-3">Merge PDF</h1>
          <p className="text-lg text-gray-500 font-medium">Combine multiple documents into one organized file.</p>
        </div>

        <div className="w-full max-w-lg bg-white shadow-2xl rounded-3xl p-10 transition-all hover:scale-[1.01]">
          {error && <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-bold">⚠️ {error}</div>}

          {pdfBlob ? (
            <div className="text-center animate-fade-in">
              <div className="mx-auto w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                <FiCheckCircle size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Merge Complete!</h3>
              <div className="space-y-4 mt-8">
                <button onClick={() => downloadPdf(pdfBlob)} className="w-full flex items-center justify-center gap-3 bg-orange-600 hover:bg-orange-700 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg shadow-orange-200 transition-transform hover:-translate-y-1">
                  <FiDownload size={20} /> Download Merged PDF
                </button>
                <button onClick={() => { setPdfBlob(null); setError(""); }} className="w-full flex items-center justify-center gap-3 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 px-6 rounded-xl font-bold text-lg">
                  <FiRefreshCw size={20} /> Merge More
                </button>
              </div>
            </div>
          ) : (
            <div 
              onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
              onDragOver={(e) => e.preventDefault()}
              className={`border-3 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer group ${isLoading ? 'border-gray-200 bg-gray-50' : 'border-orange-200 bg-white hover:border-orange-500 hover:bg-orange-50'}`}
              onClick={() => !isLoading && fileInputRef.current.click()}
            >
              <input type="file" multiple ref={fileInputRef} onChange={(e) => handleFiles(e.target.files)} accept=".pdf" className="hidden" />
              {isLoading ? (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-500 font-bold text-lg animate-pulse">Merging PDFs...</p>
                </div>
              ) : (
                <>
                  <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <FiLayers size={36} />
                  </div>
                  <p className="text-gray-900 font-extrabold text-2xl mb-2">Drag PDFs Here</p>
                  <p className="text-gray-400 font-medium text-sm">Select 2 or more files</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* --- HOW IT WORKS (Aesthetic Icons) --- */}
      <div className="bg-white py-24 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6">How to Merge PDF Files</h2>
            <p className="text-xl text-gray-500">Three simple steps to combine your documents.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
            
            <div className="relative">
              <div className="w-24 h-24 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                <FiLayers size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Select Files</h3>
              <p className="text-gray-500 text-lg leading-relaxed">Choose two or more PDF documents from your device. You can drag and drop them directly.</p>
            </div>

            <div className="relative">
              <div className="w-24 h-24 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                <FiUploadCloud size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Combine</h3>
              <p className="text-gray-500 text-lg leading-relaxed">Our intelligent merger stitches your documents together preserving page order perfectly.</p>
            </div>

            <div className="relative">
              <div className="w-24 h-24 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                <FiDownload size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Download PDF</h3>
              <p className="text-gray-500 text-lg leading-relaxed">Receive your single combined PDF file instantly. Perfect for reports and e-books.</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- WHY CHOOSE US --- */}
      <div className="py-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6">Why use PDF Matrix?</h2>
            <p className="text-xl text-gray-500">The easiest way to organize your PDFs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 flex items-start space-x-6">
              <div className="flex-shrink-0 w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
                <FiLock size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Private & Encrypted</h3>
                <p className="text-gray-500 text-lg leading-relaxed">We don't read your documents. All processing happens in an isolated environment and files are wiped automatically.</p>
              </div>
            </div>
            <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 flex items-start space-x-6">
              <div className="flex-shrink-0 w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
                <FiCpu size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Fast Processing</h3>
                <p className="text-gray-500 text-lg leading-relaxed">Merge 10, 20, or even 50 pages in seconds. Our cloud infrastructure handles the heavy lifting for you.</p>
              </div>
            </div>
            <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 flex items-start space-x-6">
              <div className="flex-shrink-0 w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
                <FiFileText size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Preserves Formatting</h3>
                <p className="text-gray-500 text-lg leading-relaxed">Your fonts, images, and layouts stay exactly where they are. We simply stitch the pages together.</p>
              </div>
            </div>
            <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 flex items-start space-x-6">
              <div className="flex-shrink-0 w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
                <FiCheckCircle size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Free Forever</h3>
                <p className="text-gray-500 text-lg leading-relaxed">No hidden costs, no watermarks, and no sign-up required. Just upload and merge.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- SEO CONTENT BLOCK --- */}
      <div className="bg-white py-24 px-6 border-t border-gray-100">
        <div className="max-w-4xl mx-auto prose prose-lg prose-orange text-gray-500">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Combine PDF Files Online</h2>
          <p className="mb-6">
            Managing multiple PDF files can be a hassle, especially when you need to submit a single document for an application, assignment, or business report. 
            <strong>PDF Matrix</strong> simplifies this by allowing you to merge separate PDF files into one compact document.
          </p>
          <p className="mb-6">
            Our PDF Merger is completely free and works online. You don't need to purchase expensive software licenses to organize your documents.
            Simply upload, merge, and go.
          </p>
          <p>
            Whether you are merging invoices for accounting or combining chapters for an ebook, our tool ensures your final document is clean, organized, and professional.
          </p>
        </div>
      </div>

    </div>
  );
}