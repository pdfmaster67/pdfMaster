'use client';

import { useState, useRef } from 'react';
import { 
  FiGrid, FiDownload, FiRefreshCw, FiCheckCircle, 
  FiUploadCloud, FiLayout, FiFileText, FiShield, FiZap, FiMaximize 
} from 'react-icons/fi'; 

export default function ExcelToPdfPage() {
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
    a.download = name || "converted.pdf";
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
      const response = await fetch('/api/convert', { method: 'POST', body: formData });
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 font-sans">
      
      {/* --- HERO TOOL SECTION --- */}
      <div className="flex flex-col items-center p-6 pt-16 pb-24">
        <div className="w-full max-w-lg text-center mb-10">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-3">Excel to PDF</h1>
          <p className="text-lg text-gray-500 font-medium">Convert spreadsheets instantly with perfect formatting.</p>
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
                <button onClick={() => downloadPdf(pdfBlob, fileName)} className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg shadow-green-200 transition-transform hover:-translate-y-1">
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
              className={`border-3 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer group ${isLoading ? 'border-gray-200 bg-gray-50' : 'border-green-200 bg-white hover:border-green-500 hover:bg-green-50'}`}
              onClick={() => !isLoading && fileInputRef.current.click()}
            >
              <input type="file" ref={fileInputRef} onChange={(e) => handleFile(e.target.files[0])} accept=".xlsx, .xls" className="hidden" />
              {isLoading ? (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-500 font-bold text-lg animate-pulse">Converting...</p>
                </div>
              ) : (
                <>
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <FiGrid size={36} />
                  </div>
                  <p className="text-gray-900 font-extrabold text-2xl mb-2">Drag Excel File</p>
                  <p className="text-gray-400 font-medium text-sm">Supports .xlsx and .xls</p>
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
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6">How to Convert Excel to PDF</h2>
            <p className="text-xl text-gray-500">Three simple steps to professional reports.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
            
            <div className="relative">
              <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                <FiGrid size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Upload Spreadsheet</h3>
              <p className="text-gray-500 text-lg leading-relaxed">Drag and drop your Microsoft Excel file (.xlsx or .xls) into the box above.</p>
            </div>

            <div className="relative">
              <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                <FiLayout size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Auto-Formatting</h3>
              <p className="text-gray-500 text-lg leading-relaxed">We automatically fit your columns to the page, ensuring no data gets cut off.</p>
            </div>

            <div className="relative">
              <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                <FiDownload size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Download PDF</h3>
              <p className="text-gray-500 text-lg leading-relaxed">Download a professional, printable PDF document instantly.</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- WHY CHOOSE US --- */}
      <div className="py-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6">Why use Tools Matrix?</h2>
            <p className="text-xl text-gray-500">The smartest way to handle financial documents.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 flex items-start space-x-6">
              <div className="flex-shrink-0 w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                <FiLayout size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Layout</h3>
                <p className="text-gray-500 text-lg leading-relaxed">Unlike standard converters, we intelligently detect text vs. tables, ensuring your PDF looks like a professional report.</p>
              </div>
            </div>
            <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 flex items-start space-x-6">
              <div className="flex-shrink-0 w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                <FiFileText size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Universal PDF</h3>
                <p className="text-gray-500 text-lg leading-relaxed">The resulting file can be opened on any device (Mobile, Desktop, Tablet) without needing Microsoft Office.</p>
              </div>
            </div>
            <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 flex items-start space-x-6">
              <div className="flex-shrink-0 w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                <FiShield size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Private Data</h3>
                <p className="text-gray-500 text-lg leading-relaxed">Financial data is sensitive. We process your files securely and delete them automatically after conversion.</p>
              </div>
            </div>
            <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 flex items-start space-x-6">
              <div className="flex-shrink-0 w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                <FiMaximize size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">No Page Limits</h3>
                <p className="text-gray-500 text-lg leading-relaxed">Whether your sheet has 10 rows or 10,000 rows, we convert it all into a neat, paginated document.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- SEO CONTENT BLOCK --- */}
      <div className="bg-white py-24 px-6 border-t border-gray-100">
        <div className="max-w-4xl mx-auto prose prose-lg prose-green text-gray-500">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Convert Spreadsheets to PDF</h2>
          <p className="mb-6">
            Excel spreadsheets are great for data analysis, but terrible for printing or sharing. Formatting often breaks when opened on different computers, and cells can be accidentally edited. 
            By using <strong>Tools Matrix</strong>, you lock in your formatting, fonts, and column widths.
          </p>
          <p className="mb-6">
            This tool is perfect for invoices, balance sheets, inventory lists, and financial reports where data integrity and professional presentation are key.
          </p>
          <p>
            Simply upload your .xlsx file, and our smart engine will handle the rest, giving you a clean, easy-to-read PDF document in seconds.
          </p>
        </div>
      </div>

    </div>
  );
}