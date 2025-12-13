'use client';

import { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import { 
  FiImage, FiDownload, FiRefreshCw, FiCheckCircle, 
  FiUploadCloud, FiShield, FiZap, FiLayers, FiMaximize, FiX, FiShare2 
} from 'react-icons/fi'; 

export default function ImageToPdfPage() {
  const [images, setImages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [fileName, setFileName] = useState("images.pdf");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  // Drag and Drop Refs
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

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

  // --- SHARE HELPER ---
  const sharePdf = async () => {
    if (!pdfBlob) return;
    try {
      const file = new File([pdfBlob], 'converted_images.pdf', { type: 'application/pdf' });
      
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Converted PDF',
          text: 'Here is the PDF I created using Tools Matrix.',
        });
      } else {
        alert("Sharing is not supported on this browser/device. Please use the Download button.");
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  // --- HANDLE FILES (Create Previews) ---
  const handleFiles = (files) => {
    if (!files || files.length === 0) return;
    const newImages = Array.from(files).map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setImages(prev => [...prev, ...newImages]);
    setPdfBlob(null); // Reset result if adding more files
  };

  // --- DRAG AND DROP LOGIC ---
  const handleSort = () => {
    let _images = [...images];
    const draggedItemContent = _images.splice(dragItem.current, 1)[0];
    _images.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setImages(_images);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // --- CONVERT TO PDF ---
  async function generatePdf() {
    if (images.length === 0) return;
    setIsProcessing(true);
    setError("");

    try {
      const doc = new jsPDF();

      for (let i = 0; i < images.length; i++) {
        const imageObj = images[i];
        if (i > 0) doc.addPage();

        // Load image dimensions
        const imgProps = await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = imageObj.preview;
        });

        // Calculate aspect ratio to fit A4
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const widthRatio = pageWidth / imgProps.width;
        const heightRatio = pageHeight / imgProps.height;
        const ratio = widthRatio < heightRatio ? widthRatio : heightRatio;

        const canvasWidth = imgProps.width * ratio;
        const canvasHeight = imgProps.height * ratio;
        
        // Center image
        const marginX = (pageWidth - canvasWidth) / 2;
        const marginY = (pageHeight - canvasHeight) / 2;

        doc.addImage(imageObj.preview, 'JPEG', marginX, marginY, canvasWidth, canvasHeight);
      }

      const blob = doc.output('blob');
      setPdfBlob(blob);
      setFileName("converted_images.pdf");
      
      // AUTO DOWNLOAD TRIGGER
      downloadPdf(blob, "converted_images.pdf");

    } catch (err) {
      console.error(err);
      setError("Failed to convert images. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 font-sans">
      
      {/* THIS INPUT IS NOW OUTSIDE CONDITIONAL RENDERING TO FIX THE ERROR */}
      <input 
        type="file" 
        multiple 
        ref={fileInputRef} 
        onChange={(e) => handleFiles(e.target.files)} 
        accept="image/*" 
        className="hidden" 
      />

      {/* --- HERO TOOL SECTION --- */}
      <div className="flex flex-col items-center p-6 pt-16 pb-24">
        <div className="w-full max-w-lg text-center mb-10">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-3">Image to PDF</h1>
          <p className="text-lg text-gray-500 font-medium">Combine JPG, PNG & Photos into a single document.</p>
        </div>

        <div className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl p-10 transition-all hover:scale-[1.01]">
          {error && <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-bold">⚠️ {error}</div>}

          {pdfBlob ? (
            <div className="text-center animate-fade-in">
              <div className="mx-auto w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                <FiCheckCircle size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Conversion Complete!</h3>
              <p className="text-sm text-gray-500 mb-6">Your download has started automatically.</p>
              
              <div className="space-y-3 max-w-md mx-auto">
                <button onClick={() => downloadPdf(pdfBlob, fileName)} className="w-full flex items-center justify-center gap-3 bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-xl font-bold text-lg shadow-lg shadow-purple-200 transition-transform hover:-translate-y-1">
                  <FiDownload size={20} /> Download Again
                </button>
                
                <button onClick={sharePdf} className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-bold text-lg shadow-lg shadow-blue-200 transition-transform hover:-translate-y-1">
                  <FiShare2 size={20} /> Share PDF
                </button>

                <button onClick={() => { setPdfBlob(null); setImages([]); }} className="w-full flex items-center justify-center gap-3 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-bold text-lg">
                  <FiRefreshCw size={20} /> Convert More
                </button>
              </div>
            </div>
          ) : (
            <div>
              
              {/* IMAGE GRID (DRAGGABLE) */}
              {images.length > 0 && (
                <div className="mb-8">
                   <p className="text-center text-sm text-gray-400 mb-4 font-bold">Drag images to reorder • {images.length} selected</p>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     {images.map((img, index) => (
                       <div 
                         key={index}
                         draggable
                         onDragStart={(e) => { dragItem.current = index; e.target.classList.add('opacity-50'); }}
                         onDragEnter={(e) => { dragOverItem.current = index; }}
                         onDragEnd={(e) => { handleSort(); e.target.classList.remove('opacity-50'); }}
                         onDragOver={(e) => e.preventDefault()}
                         className="relative group aspect-square bg-gray-100 rounded-xl overflow-hidden cursor-move border-2 border-transparent hover:border-purple-400 transition-all shadow-sm"
                       >
                         {/* THE IMAGE (No Text Overlay) */}
                         <img src={img.preview} alt="preview" className="w-full h-full object-cover" />
                         
                         {/* DELETE BUTTON (Only visible on hover) */}
                         <button 
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                         >
                           <FiX size={14} />
                         </button>
                       </div>
                     ))}
                     
                     {/* ADD MORE BUTTON (Small Square) */}
                     <div 
                        onClick={() => fileInputRef.current.click()}
                        className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 hover:border-purple-300 transition-colors"
                     >
                       <FiUploadCloud size={24} className="text-gray-400" />
                       <span className="text-xs text-gray-500 font-bold mt-2">Add More</span>
                     </div>
                   </div>
                   
                   {/* CONVERT BUTTON */}
                   <button 
                     onClick={generatePdf}
                     disabled={isProcessing}
                     className="mt-8 w-full flex items-center justify-center gap-3 bg-purple-600 hover:bg-purple-700 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg shadow-purple-200 transition-transform hover:-translate-y-1"
                   >
                     {isProcessing ? "Generating PDF..." : "Convert to PDF"}
                   </button>
                </div>
              )}

              {/* EMPTY STATE UPLOAD BOX (Only show if no images) */}
              {images.length === 0 && (
                <div 
                  onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
                  onDragOver={(e) => e.preventDefault()}
                  className={`border-3 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer group ${isProcessing ? 'border-gray-200 bg-gray-50' : 'border-purple-200 bg-white hover:border-purple-500 hover:bg-purple-50'}`}
                  onClick={() => !isProcessing && fileInputRef.current.click()}
                >
                  {isProcessing ? (
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
                      <p className="text-gray-500 font-bold text-lg animate-pulse">Processing...</p>
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
          )}
        </div>
      </div>

      {/* --- HOW IT WORKS (UPDATED ICON) --- */}
      <div className="bg-white py-24 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6">How to Convert Images to PDF </h2>
            <p className="text-xl text-gray-500">Three simple steps to combine your photos.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
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

      {/* --- WHY CHOOSE US --- */}
      <div className="py-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6">Why use Tools Matrix?</h2>
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
            Instead of sending 10 separate attachments, <strong>Tools Matrix</strong> allows you to bundle them into one lightweight document.
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