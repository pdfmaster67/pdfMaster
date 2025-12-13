'use client';

import { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import { 
  FiLayers, FiDownload, FiRefreshCw, FiCheckCircle, 
  FiFile, FiPlus, FiShield, FiZap, FiTrash2, FiMenu, FiShare2 
} from 'react-icons/fi'; 

export default function MergePdfPage() {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  // Drag and Drop References
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  // --- DOWNLOAD HELPER ---
  const downloadPdf = (blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'toolsmatrix_merged.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // --- SHARE HELPER ---
  const sharePdf = async () => {
    if (!pdfBlob) return;
    try {
      const file = new File([pdfBlob], 'toolsmatrix_merged.pdf', { type: 'application/pdf' });
      
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Merged PDF',
          text: 'Here is the merged PDF file from Tools Matrix.',
        });
      } else {
        alert("Sharing is not supported on this browser/device. Please use the Download button.");
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  const handleFiles = (newFiles) => {
    if (newFiles) {
      setFiles(prev => [...prev, ...Array.from(newFiles)]);
      setPdfBlob(null);
      setError("");
    }
  };

  // --- DRAG AND DROP LOGIC ---
  const handleSort = () => {
    let _files = [...files];
    const draggedItemContent = _files.splice(dragItem.current, 1)[0];
    _files.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setFiles(_files);
  };
  // ---------------------------

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const mergePdfs = async () => {
    if (files.length < 2) {
      setError("Please add 2 or more PDF files to merge.");
      return;
    }
    setIsProcessing(true);

    try {
      const mergedPdf = await PDFDocument.create();
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setPdfBlob(blob);
      
      // AUTO DOWNLOAD TRIGGER
      downloadPdf(blob);

    } catch (err) {
      console.error(err);
      setError("Error merging PDFs. Ensure files are not password protected.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-50 font-sans">
      
      {/* HERO TOOL SECTION */}
      <div className="flex flex-col items-center p-6 pt-16 pb-24">
        <div className="w-full max-w-lg text-center mb-10">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-3">Merge PDF</h1>
          <p className="text-lg text-gray-500 font-medium">Combine multiple PDF files into one single document.</p>
        </div>

        <div className="w-full max-w-lg bg-white shadow-2xl rounded-3xl p-10 transition-all hover:scale-[1.01]">
          {error && <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-bold">⚠️ {error}</div>}

          {pdfBlob ? (
            <div className="text-center animate-fade-in">
              <div className="mx-auto w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                <FiCheckCircle size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Merge Complete!</h3>
              <p className="text-sm text-gray-500 mb-6">Your download has started automatically.</p>
              
              <div className="space-y-3">
                <button onClick={() => downloadPdf(pdfBlob)} className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-xl font-bold text-lg shadow-lg shadow-red-200 transition-transform hover:-translate-y-1">
                  <FiDownload size={20} /> Download Again
                </button>
                
                <button onClick={sharePdf} className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-bold text-lg shadow-lg shadow-blue-200 transition-transform hover:-translate-y-1">
                  <FiShare2 size={20} /> Share File
                </button>

                <button onClick={() => { setPdfBlob(null); setFiles([]); }} className="w-full flex items-center justify-center gap-3 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-bold text-lg">
                  <FiRefreshCw size={20} /> Merge More
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full">
               
               {/* DRAGGABLE LIST OF FILES */}
               {files.length > 0 && (
                 <div className="mb-6 space-y-2 max-h-64 overflow-y-auto pr-2">
                   <p className="text-xs text-center text-gray-400 mb-2 font-medium">Drag items to reorder</p>
                   {files.map((f, i) => (
                     <div 
                        key={i} 
                        draggable
                        onDragStart={(e) => { dragItem.current = i; e.target.classList.add('opacity-50'); }}
                        onDragEnter={(e) => { dragOverItem.current = i; }}
                        onDragEnd={(e) => { handleSort(); e.target.classList.remove('opacity-50'); }}
                        onDragOver={(e) => e.preventDefault()}
                        className="flex justify-between items-center bg-red-50 hover:bg-red-100 p-3 rounded-lg border border-red-100 text-sm group cursor-move transition-colors"
                     >
                       
                       <div className="flex items-center gap-3 overflow-hidden">
                         <div className="text-red-300 group-hover:text-red-500 cursor-move">
                            <FiMenu /> 
                         </div>
                         <div className="flex items-center gap-3">
                            <div className="bg-white p-1.5 rounded-md text-red-500 shadow-sm">
                                <FiFile />
                            </div>
                            <div className="flex flex-col">
                                <span className="truncate font-bold text-gray-700 max-w-[180px]">{f.name}</span>
                            </div>
                         </div>
                       </div>

                       <button 
                         onClick={() => removeFile(i)} 
                         className="p-2 text-red-300 hover:text-red-600 hover:bg-red-200 rounded-md transition-all"
                         title="Remove File"
                       >
                         <FiTrash2 size={16} />
                       </button>

                     </div>
                   ))}
                 </div>
               )}

               {/* UPLOAD BOX */}
               <div 
                  className={`border-3 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer group ${isProcessing ? 'border-gray-200 bg-gray-50' : 'border-red-200 bg-white hover:border-red-500 hover:bg-red-50'}`}
                  onClick={() => !isProcessing && fileInputRef.current.click()}
               >
                 <input type="file" multiple ref={fileInputRef} onChange={(e) => handleFiles(e.target.files)} accept=".pdf" className="hidden" />
                 {isProcessing ? (
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 border-4 border-red-200 border-t-red-500 rounded-full animate-spin mb-4"></div>
                      <p className="text-gray-500 font-bold text-lg animate-pulse">Merging...</p>
                    </div>
                 ) : (
                    <>
                      <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <FiPlus size={32} />
                      </div>
                      <p className="text-gray-900 font-bold text-xl">Add PDFs</p>
                      <p className="text-gray-400 text-xs mt-2">Add 2 or more files</p>
                    </>
                 )}
               </div>
               
               {/* MERGE BUTTON */}
               {files.length > 0 && !isProcessing && (
                 <button onClick={mergePdfs} className="mt-6 w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-red-200 transition-transform hover:-translate-y-1">
                   <FiLayers /> Merge Now
                 </button>
               )}
            </div>
          )}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="bg-white py-24 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6">How to Merge PDF Files </h2>
            <p className="text-xl text-gray-500">Simple steps to combine documents.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
            <div className="relative">
              <div className="w-24 h-24 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                <FiFile size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Select Files</h3>
              <p className="text-gray-500 text-lg leading-relaxed">Upload two or more PDF documents you want to combine.</p>
            </div>
            <div className="relative">
              <div className="w-24 h-24 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                <FiLayers size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Drag to Reorder</h3>
              <p className="text-gray-500 text-lg leading-relaxed">Simply drag and drop the files in the list to arrange them in the perfect order.</p>
            </div>
            <div className="relative">
              <div className="w-24 h-24 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                <FiDownload size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Download</h3>
              <p className="text-gray-500 text-lg leading-relaxed">Save your new single PDF document instantly.</p>
            </div>
          </div>
        </div>
      </div>

      {/* WHY CHOOSE US */}
      <div className="py-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6">Why use Tools Matrix?</h2>
            <p className="text-xl text-gray-500">The best way to organize documents.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 flex items-start space-x-6">
              <div className="flex-shrink-0 w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center"><FiShield size={32} /></div>
              <div><h3 className="text-xl font-bold text-gray-900 mb-3">100% Secure</h3><p className="text-gray-500 text-lg">Files are processed in your browser. They never leave your device.</p></div>
            </div>
            <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 flex items-start space-x-6">
              <div className="flex-shrink-0 w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center"><FiZap size={32} /></div>
              <div><h3 className="text-xl font-bold text-gray-900 mb-3">Super Fast</h3><p className="text-gray-500 text-lg">Merge unlimited pages in seconds using your own processor.</p></div>
            </div>
          </div>
        </div>
      </div>

      {/* EXPANDED SEO CONTENT BLOCK */}
      <div className="bg-white py-24 px-6 border-t border-gray-100">
        <div className="max-w-4xl mx-auto prose prose-lg prose-red text-gray-500">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Best Free Online PDF Merger</h2>
          
          <p className="mb-6">
            <strong>Tools Matrix</strong> is the ultimate solution for anyone looking to <strong>combine PDF files</strong> securely and quickly. Whether you are a student, a lawyer, or a business professional, managing multiple PDF documents can be a hassle. Our tool allows you to merge multiple PDFs into one cohesive document in just a few clicks.
          </p>

          <h3 className="text-2xl font-bold text-gray-800 mt-10 mb-4">Why Merge PDF Files?</h3>
          <ul className="list-disc pl-5 mb-6 space-y-2">
            <li><strong>Organize Documents:</strong> Keep related documents, like invoices or receipts, in a single file for easy storage and sharing.</li>
            <li><strong>Professional Reports:</strong> Combine cover pages, chapters, and appendices into a polished final report.</li>
            <li><strong>Simplify Sharing:</strong> Send one file instead of ten attachments in your emails.</li>
          </ul>

          <h3 className="text-2xl font-bold text-gray-800 mt-10 mb-4">How to Combine PDFs Online?</h3>
          <ol className="list-decimal pl-5 mb-6 space-y-2">
            <li><strong>Upload Files:</strong> Click "Add PDFs" or drag and drop your files into the box.</li>
            <li><strong>Reorder Pages:</strong> Use our intuitive drag-and-drop interface to arrange your PDFs in the exact order you want them to appear.</li>
            <li><strong>Click Merge:</strong> Hit the "Merge Now" button and watch as our engine processes your request instantly.</li>
            <li><strong>Download:</strong> Save your new, unified PDF document to your device.</li>
          </ol>

          <h3 className="text-2xl font-bold text-gray-800 mt-10 mb-4">Is it Secure?</h3>
          <p className="mb-6">
             Absolutely. Unlike other online tools that upload your private documents to a remote server, <strong>Tools Matrix processes everything Client-Side</strong>. 
             This means your files are merged directly within your browser on your own computer. Your data never leaves your device, guaranteeing 100% privacy and security for your sensitive information.
          </p>
          
          <p>
            Start using the safest and fastest PDF merger on the web today. No registration, no watermarks, and completely free.
          </p>
        </div>
      </div>
    </div>
  );
}