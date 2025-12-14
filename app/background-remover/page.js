'use client';

import { useState, useRef, useEffect } from 'react';
import { removeBackground } from "@imgly/background-removal";
import { 
  FiScissors, FiDownload, FiRefreshCw, FiCheckCircle, 
  FiUploadCloud, FiShield, FiZap, FiLayers, FiShare2, FiX 
} from 'react-icons/fi'; 

export default function BackgroundRemoverPage() {
  const [file, setFile] = useState(null);
  const [processedBlob, setProcessedBlob] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Create a temporary URL for the uploaded file to show the "blinking" effect
  const [originalPreview, setOriginalPreview] = useState(null);

  const fileInputRef = useRef(null);
  const isCancelled = useRef(false);

  // --- HELPER: AGGRESSIVE RESIZE FOR SPEED ---
  const resizeImage = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        
        // SPEED SETTING: Cap max dimension to 720px
        // This makes it significantly faster than 1500px
        const maxDim = 720; 
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Compress to 0.8 quality (helps AI speed)
        canvas.toBlob((blob) => {
          resolve(blob);
        }, file.type, 0.8);
      };
    });
  };

  // --- HANDLE FILE UPLOAD ---
  const handleFile = async (inputFile) => {
    if (inputFile && inputFile.type.startsWith('image/')) {
      setFile(inputFile);
      setOriginalPreview(URL.createObjectURL(inputFile)); // Set preview for blinking effect
      setProcessedBlob(null);
      setPreviewUrl(null);
      
      isCancelled.current = false;
      
      // 1. Resize immediately
      const optimizedBlob = await resizeImage(inputFile);
      
      // 2. Process
      processImage(optimizedBlob);
    } else {
      alert("Please upload a valid image file (JPG, PNG).");
    }
  };

  // --- AI PROCESSING ---
  const processImage = async (imageFile) => {
    setIsProcessing(true);

    try {
      const config = {
        debug: false,
        model: 'small', // 'small' is the fastest model available
        // Progress callback removed to speed up React rendering
      };

      const blob = await removeBackground(imageFile, config);
      
      if (isCancelled.current) return;

      const url = URL.createObjectURL(blob);
      setProcessedBlob(blob);
      setPreviewUrl(url);

    } catch (error) {
      if (!isCancelled.current) {
        console.error(error);
        alert("Failed to process. Try a simpler image.");
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
    setOriginalPreview(null);
  };

  // --- MANUAL DOWNLOAD HANDLER ---
  const downloadImage = async (quality) => {
    if (!processedBlob) return;

    let blobToDownload = processedBlob;
    let filename = `toolsmatrix_nobg_${file.name.split('.')[0]}.png`;

    if (quality === 'low') {
      const img = new Image();
      img.src = previewUrl;
      await new Promise(resolve => { img.onload = resolve; });

      const canvas = document.createElement('canvas');
      const scale = 0.7; 
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      blobToDownload = await new Promise(resolve => canvas.toBlob(resolve, 'image/png', 0.7));
      filename = `toolsmatrix_nobg_low_${file.name.split('.')[0]}.png`;
    }

    const url = URL.createObjectURL(blobToDownload);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // --- SHARE HANDLER ---
  const shareImage = async () => {
    if (!processedBlob) return;
    try {
      const fileObj = new File([processedBlob], 'sticker.png', { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [fileObj] })) {
        await navigator.share({
          files: [fileObj],
          title: 'Background Removed',
          text: 'Check out this sticker created with Tools Matrix!',
        });
      } else {
        alert("Sharing not supported on this device.");
      }
    } catch (err) {
      console.error("Share failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-50 font-sans">
      
      {/* --- HERO TOOL SECTION --- */}
      <div className="flex flex-col items-center p-6 pt-16 pb-24">
        <div className="w-full max-w-lg text-center mb-10">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-3">Remove Background</h1>
          <p className="text-lg text-gray-500 font-medium">Fast AI-powered background removal.</p>
        </div>

        <div className="w-full max-w-lg bg-white shadow-2xl rounded-3xl p-10 transition-all hover:scale-[1.01]">
          
          {!file ? (
            <div 
              onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
              onDragOver={(e) => e.preventDefault()}
              className="border-3 border-dashed border-yellow-300 bg-white hover:border-yellow-500 hover:bg-yellow-50 rounded-2xl p-12 text-center transition-all cursor-pointer group"
              onClick={() => fileInputRef.current.click()}
            >
              <input type="file" ref={fileInputRef} onChange={(e) => handleFile(e.target.files[0])} accept="image/*" className="hidden" />
              <div className="w-20 h-20 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <FiScissors size={36} />
              </div>
              <p className="text-gray-900 font-extrabold text-2xl mb-2">Drag Image Here</p>
              <p className="text-gray-400 font-medium text-sm">JPG, PNG, WEBP</p>
            </div>
          ) : isProcessing ? (
             /* --- PROCESSING STATE (BLINKING IMAGE) --- */
             <div className="text-center py-6 relative">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center justify-center gap-2">
                   <FiZap className="animate-bounce text-yellow-500"/> AI Processing...
                </h3>
                
                {/* BLINKING IMAGE CONTAINER */}
                <div className="relative w-full h-64 mb-8 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                    <img 
                        src={originalPreview} 
                        alt="Processing" 
                        className="w-full h-full object-contain animate-pulse opacity-70 blur-sm transition-all duration-700" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-white border-t-yellow-500 rounded-full animate-spin"></div>
                    </div>
                </div>

                <button 
                  onClick={cancelProcess}
                  className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-6 py-2 rounded-full font-bold hover:bg-red-100 transition-colors border border-red-200"
                >
                  <FiX /> Cancel
                </button>
             </div>
          ) : (
            <div className="text-center animate-fade-in">
              <div className="mx-auto w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                <FiCheckCircle size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Background Removed!</h3>
              
              <div className="relative w-full h-64 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/e9/Transparency_demonstration_1.png')] bg-cover rounded-xl overflow-hidden border border-gray-200 mb-8 shadow-inner">
                <img src={previewUrl} alt="Processed" className="w-full h-full object-contain relative z-10" />
              </div>
              
              <div className="space-y-3">
                <button onClick={() => downloadImage('high')} className="w-full flex items-center justify-center gap-3 bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-6 rounded-xl font-bold text-lg shadow-lg shadow-yellow-200 transition-transform hover:-translate-y-1">
                  <FiDownload size={20} /> Download PNG <span className="text-xs opacity-70 ml-1">(Original)</span>
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button onClick={shareImage} className="flex items-center justify-center gap-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 py-3 px-4 rounded-xl font-bold transition-colors">
                    <FiShare2 /> Share
                  </button>
                  <button onClick={() => { setFile(null); setProcessedBlob(null); }} className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-bold transition-colors">
                    <FiRefreshCw /> New Image
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
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6">How to Remove Backgrounds</h2>
            <p className="text-xl text-gray-500">Professional cutouts in seconds.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
            <div className="relative">
              <div className="w-24 h-24 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                <FiUploadCloud size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Upload</h3>
              <p className="text-gray-500 text-lg leading-relaxed">Select a photo with a clearly defined subject (person, product, or car).</p>
            </div>
            <div className="relative">
              <div className="w-24 h-24 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                <FiZap size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">AI Processing</h3>
              <p className="text-gray-500 text-lg leading-relaxed">Our advanced AI detects the foreground and transparentizes the background instantly.</p>
            </div>
            <div className="relative">
              <div className="w-24 h-24 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                <FiDownload size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Download PNG</h3>
              <p className="text-gray-500 text-lg leading-relaxed">Get your image as a transparent PNG, ready for design or e-commerce.</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- SEO CONTENT BLOCK --- */}
      <div className="bg-white py-24 px-6 border-t border-gray-100">
        <div className="max-w-4xl mx-auto prose prose-lg prose-yellow text-gray-500">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Free Online Background Remover</h2>
          <p className="mb-6">
            Removing backgrounds from images used to require hours of work with the Pen Tool in Photoshop. 
            With <strong>Tools Matrix</strong>, you can achieve professional results in seconds using artificial intelligence.
          </p>
          <p className="mb-6">
            Our tool creates a transparent background (PNG) which is essential for placing objects on new backgrounds, creating stickers, or designing marketing banners. 
            Because it runs <strong>Client-Side</strong>, your photos are processed on your own device and never uploaded to a cloud server, ensuring privacy for your personal or client photos.
          </p>
        </div>
      </div>

    </div>
  );
}