'use client';

import { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import { 
  FiLayout, FiDownload, FiRefreshCw, FiCheckCircle, 
  FiUploadCloud, FiShield, FiZap, FiFileText, FiShare2, FiX, FiScissors 
} from 'react-icons/fi'; 

export default function SplitPDFPage() {
  const [file, setFile] = useState(null);
  const [processedBlob, setProcessedBlob] = useState(null); // This will be the ZIP file
  const [isProcessing, setIsProcessing] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  
  const fileInputRef = useRef(null);
  const isCancelled = useRef(false);

  // --- HANDLE FILE UPLOAD ---
  const handleFile = async (inputFile) => {
    if (inputFile && inputFile.type === 'application/pdf') {
      setFile(inputFile);
      setProcessedBlob(null);
      isCancelled.current = false;
      
      // Load PDF just to count pages quickly
      try {
        const arrayBuffer = await inputFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        setPageCount(pdfDoc.getPageCount());
      } catch (err) {
        alert("Invalid PDF file.");
        setFile(null);
      }

    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  // --- SPLIT PROCESSING (Extract all pages to ZIP) ---
  const startSplit = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const zip = new JSZip();
      const numPages = pdfDoc.getPageCount();

      // Loop through all pages
      for (let i = 0; i < numPages; i++) {
        if (isCancelled.current) break;

        // Create a new document for a single page
        const newPdf = await PDFDocument.create();
        const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
        newPdf.addPage(copiedPage);
        
        const pdfBytes = await newPdf.save();
        
        // Add to zip folder: file_page_1.pdf
        const name = `${file.name.replace('.pdf', '')}_page_${i + 1}.pdf`;
        zip.file(name, pdfBytes);
      }

      if (isCancelled.current) return;

      // Generate the ZIP file
      const zipContent = await zip.generateAsync({ type: 'blob' });
      setProcessedBlob(zipContent);

    } catch (error) {
      if (!isCancelled.current) {
        console.error(error);
        alert("Failed to split PDF.");
      }
    } finally {
      if (!isCancelled.current) {
        setIsProcessing(false);
      }
    }
  };

  // --- CANCEL HANDLER ---
  const cancelProcess = () => {
    isCancelled.current = true;
    setIsProcessing(false);
    setFile(null);
    setProcessedBlob(null);
  };

  // --- DOWNLOAD HANDLER ---
  const downloadZip = () => {
    if (!processedBlob) return;
    const url = URL.createObjectURL(processedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `toolsmatrix_split_${file.name.replace('.pdf', '')}.zip`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // --- SHARE HANDLER ---
  const shareFile = async () => {
    if (!processedBlob) return;
    try {
      const fileObj = new File([processedBlob], 'split_files.zip', { type: 'application/zip' });
      if (navigator.canShare && navigator.canShare({ files: [fileObj] })) {
        await navigator.share({
          files: [fileObj],
          title: 'Split PDF Files',
          text: 'Here are the extracted PDF pages from Tools Matrix!',
        });
      } else {
        alert("Sharing ZIP files is not supported on this device/browser.");
      }
    } catch (err) {
      console.error("Share failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 font-sans">
      
      {/* --- HERO TOOL SECTION --- */}
      <div className="flex flex-col items-center p-6 pt-16 pb-24">
        <div className="w-full max-w-lg text-center mb-10">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-3">Split PDF</h1>
          <p className="text-lg text-gray-500 font-medium">Extract every page into a separate file instantly.</p>
        </div>

        <div className="w-full max-w-lg bg-white shadow-2xl rounded-3xl p-10 transition-all hover:scale-[1.01]">
          
          {!file ? (
            /* STATE 1: UPLOAD */
            <div 
              onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
              onDragOver={(e) => e.preventDefault()}
              className="border-3 border-dashed border-blue-300 bg-white hover:border-blue-500 hover:bg-blue-50 rounded-2xl p-12 text-center transition-all cursor-pointer group"
              onClick={() => fileInputRef.current.click()}
            >
              <input type="file" ref={fileInputRef} onChange={(e) => handleFile(e.target.files[0])} accept="application/pdf" className="hidden" />
              <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <FiLayout size={36} />
              </div>
              <p className="text-gray-900 font-extrabold text-2xl mb-2">Drag PDF Here</p>
              <p className="text-gray-400 font-medium text-sm">PDF Files Only</p>
            </div>
          ) : isProcessing ? (
             /* STATE 2: PROCESSING (BLINKING) */
             <div className="text-center py-6 relative">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center justify-center gap-2">
                   <FiZap className="animate-bounce text-blue-500"/> Splitting PDF...
                </h3>
                
                {/* BLINKING PDF ICON */}
                <div className="relative w-full h-48 mb-8 rounded-xl overflow-hidden bg-gray-50 border border-gray-200 flex flex-col items-center justify-center">
                    <FiFileText size={80} className="text-blue-300 animate-pulse transition-all duration-700" />
                    <p className="mt-4 text-gray-400 font-medium animate-pulse">{file.name}</p>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-white border-t-blue-500 rounded-full animate-spin"></div>
                    </div>
                </div>

                <button 
                  onClick={cancelProcess}
                  className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-6 py-2 rounded-full font-bold hover:bg-red-100 transition-colors border border-red-200"
                >
                  <FiX /> Cancel
                </button>
             </div>
          ) : !processedBlob ? (
            /* STATE 3: CONFIRM SPLIT (Pre-processing) */
            <div className="text-center animate-fade-in">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiFileText size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 truncate px-4">{file.name}</h3>
              
              <p className="text-gray-500 mb-8">{pageCount} Pages detected</p>

              <button 
                onClick={startSplit}
                className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg shadow-blue-200 transition-transform hover:-translate-y-1"
              >
                <FiScissors size={20} /> Extract All Pages
              </button>
              
              <button 
                onClick={() => setFile(null)}
                className="mt-4 text-gray-400 hover:text-red-500 text-sm font-bold"
              >
                Remove File
              </button>
            </div>
          ) : (
            /* STATE 4: SUCCESS / DOWNLOAD */
            <div className="text-center animate-fade-in">
              <div className="mx-auto w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                <FiCheckCircle size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">PDF Split Successfully!</h3>
              <p className="text-sm text-gray-500 mb-8">Your pages are ready in a ZIP archive.</p>
              
              <div className="space-y-3">
                <button onClick={downloadZip} className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-bold text-lg shadow-lg shadow-blue-200 transition-transform hover:-translate-y-1">
                  <FiDownload size={20} /> Download ZIP File
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button onClick={shareFile} className="flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 py-3 px-4 rounded-xl font-bold transition-colors">
                    <FiShare2 /> Share
                  </button>
                  <button onClick={() => { setFile(null); setProcessedBlob(null); }} className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-bold transition-colors">
                    <FiRefreshCw /> Split Another
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- HOW IT WORKS (SEO) --- */}
      <div className="bg-white py-24 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6">How to Split PDF Files</h2>
            <p className="text-xl text-gray-500">Separate pages in seconds.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
            <div className="relative">
              <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                <FiUploadCloud size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Upload</h3>
              <p className="text-gray-500 text-lg leading-relaxed">Select any PDF document you want to split into separate pages.</p>
            </div>
            <div className="relative">
              <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                <FiZap size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Processing</h3>
              <p className="text-gray-500 text-lg leading-relaxed">Our client-side engine extracts every page as a standalone PDF file instantly.</p>
            </div>
            <div className="relative">
              <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                <FiDownload size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Download ZIP</h3>
              <p className="text-gray-500 text-lg leading-relaxed">Get all your extracted pages neatly packed in a single ZIP file.</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- WHY CHOOSE US (SEO) --- */}
      <div className="py-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6">Why use Tools Matrix?</h2>
            <p className="text-xl text-gray-500">Secure and fast PDF manipulation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 flex items-start space-x-6">
              <div className="flex-shrink-0 w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                <FiShield size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">100% Private</h3>
                <p className="text-gray-500 text-lg leading-relaxed">Your PDFs are processed entirely in your browser. No sensitive data is ever sent to a server.</p>
              </div>
            </div>
            <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 flex items-start space-x-6">
              <div className="flex-shrink-0 w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                <FiLayout size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Organized Output</h3>
                <p className="text-gray-500 text-lg leading-relaxed">We automatically name and number your extracted pages so you can keep your files organized.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- SEO CONTENT BLOCK --- */}
      <div className="bg-white py-24 px-6 border-t border-gray-100">
        <div className="max-w-4xl mx-auto prose prose-lg prose-blue text-gray-500">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Free Online PDF Splitter</h2>
          <p className="mb-6">
            Splitting large PDF documents into individual pages can be a hassle without the right software. 
            With <strong>Tools Matrix</strong>, you can extract pages from your PDF documents in seconds.
          </p>
          <p className="mb-6">
            Whether you need to extract a single invoice from a large billing document or separate chapters of an eBook, our tool handles it all. 
            The output is provided as a convenient ZIP file containing all your separated pages as individual PDF files.
          </p>
        </div>
      </div>

    </div>
  );
}