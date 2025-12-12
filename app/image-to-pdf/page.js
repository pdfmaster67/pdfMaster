'use client';

import { useState, useRef } from 'react';
import { 
  FiImage, FiDownload, FiRefreshCw, FiCheckCircle, 
  FiUploadCloud, FiShield, FiZap, FiLayers, FiMaximize 
} from 'react-icons/fi'; 

export default function ImageToPdfPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [fileName, setFileName] = useState("images.pdf");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  // --- DOWNLOAD HELPER ---
  const downloadPdf = (blob, name) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // --- API HANDLER ---
  async function handleFiles(files) {
    if (!files || files.length === 0) return;
    setIsLoading(true);
    setError("");
    setPdfBlob(null);

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const response = await fetch('/api/image-to-pdf', { method: 'POST', body: formData });
      if (!response.ok) throw new Error("Conversion failed.");
      const blob = await response.blob();
      setPdfBlob(blob);
      downloadPdf(blob, "images_converted.pdf");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 font-sans">
      
      {/* --- HERO TOOL SECTION --- */}
      <div className="flex flex-col items-center p-6 pt-16 pb-24">
        <div className="w-full max-w-lg text-center mb-10">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-3">Image to PDF</h1>
          <p className="text-lg text-gray-500 font-medium">Combine JPG, PNG & Photos into a single document.</p>
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
                <button onClick={() => downloadPdf(pdfBlob, fileName)} className="w-full flex items-center justify-center gap-3 bg-purple-600 hover:bg-purple-700 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg shadow-purple-200 transition-transform hover:-translate-y-1">
                  <FiDownload size={20} /> Download PDF
                </button>
                <button onClick={() => { setPdfBlob(null); }} className="w-full flex items-center justify-center gap-3 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 px-6 rounded-xl font-bold text-lg">
                  <FiRefreshCw size={20} /> Convert More
                </button>
              </div>
            </div>
          ) : (
            <div 
              onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
              onDragOver={(e) => e.preventDefault()}
              className={`border-3 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer group ${isLoading ? 'border-gray-200 bg-gray-50' : 'border-purple-200 bg-white hover:border-purple-500 hover:bg-purple-50'}`}
              onClick={() => !isLoading && fileInputRef.current.click()}
            >
              <input type="file" multiple ref={fileInputRef} onChange={(e) => handleFiles(e.target.files)} accept="image/*" className="hidden" />
              {isLoading ? (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-500 font-bold text-lg animate-pulse">Converting...</p>
                </div>
              ) : (
                <>
                  <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <FiImage size={36} />
                  </div>
                  <p className="text-gray-900 font-extrabold text-2xl mb-2">Drag Images Here</p>
                  <p className="text-gray-400 font-medium text-sm">JPG, PNG, GIF supported</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* --- HOW IT WORKS (UPDATED ICON) --- */}
      <div className="bg-white py-24 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6">How to Convert Images to PDF</h2>
            <p className="text-xl text-gray-500">Three simple steps to combine your photos.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
            
            {/* STEP 1: ICON UPDATED HERE */}
            <div className="relative">
              <div className="w-24 h-24 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                <FiImage size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Upload Images</h3>
              <p className="text-gray-500 text-lg leading-relaxed">Select JPG or PNG files from your gallery. You can select multiple files at once.</p>
            </div>

            <div className="relative">
              <div className="w-24 h-24 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                <FiUploadCloud size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Processing</h3>
              <p className="text-gray-500 text-lg leading-relaxed">Our intelligent engine automatically aligns your images and creates pages instantly.</p>
            </div>

            <div className="relative">
              <div className="w-24 h-24 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                <FiDownload size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Download PDF</h3>
              <p className="text-gray-500 text-lg leading-relaxed">Get your consolidated document immediately. No watermarks, no limits.</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- WHY CHOOSE US (Matches Home Page) --- */}
      <div className="py-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6">Why use PDF Matrix?</h2>
            <p className="text-xl text-gray-500">The best way to manage your photo documents.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 flex items-start space-x-6">
              <div className="flex-shrink-0 w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                <FiShield size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">100% Secure</h3>
                <p className="text-gray-500 text-lg leading-relaxed">Your photos are processed via TLS encryption and permanently deleted from our servers after 1 hour.</p>
              </div>
            </div>
            <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 flex items-start space-x-6">
              <div className="flex-shrink-0 w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                <FiZap size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Conversion</h3>
                <p className="text-gray-500 text-lg leading-relaxed">No software installation needed. Convert directly in your browser on iPhone, Android, or PC.</p>
              </div>
            </div>
            <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 flex items-start space-x-6">
              <div className="flex-shrink-0 w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                <FiLayers size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Universal Format</h3>
                <p className="text-gray-500 text-lg leading-relaxed">Convert varied image formats into a single, standardized PDF that looks the same on every device.</p>
              </div>
            </div>
            <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 flex items-start space-x-6">
              <div className="flex-shrink-0 w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                <FiMaximize size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">High Quality</h3>
                <p className="text-gray-500 text-lg leading-relaxed">We optimize the images for file size while maintaining strict visual quality for printing.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- SEO CONTENT BLOCK --- */}
      <div className="bg-white py-24 px-6 border-t border-gray-100">
        <div className="max-w-4xl mx-auto prose prose-lg prose-purple text-gray-500">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Convert JPG to PDF Online Free</h2>
          <p className="mb-6">
            Converting images to PDF is essential for presenting portfolios, organizing receipts, or sharing multiple photos in a single, professional file. 
            Instead of sending 10 separate attachments, <strong>PDF Matrix</strong> allows you to bundle them into one lightweight document.
          </p>
          <p className="mb-6">
            Our tool is browser-based, meaning you don't need to install heavy software like Adobe Acrobat. Whether you are on Windows, Mac, iOS, or Android, 
            you can convert your images in seconds for free.
          </p>
          <p>
            Experience the easiest way to turn your gallery into a document. Simply drag, drop, and download.
          </p>
        </div>
      </div>

    </div>
  );
}