'use client';

import { useState, useRef } from 'react';
import { 
  FiMaximize2, FiDownload, FiRefreshCw, FiCheckCircle, 
  FiUploadCloud, FiSettings, FiPrinter, FiTarget, FiLayers, FiZap, FiShare2 
} from 'react-icons/fi'; 

export default function ResizeImagePage() {
  const [file, setFile] = useState(null);
  const [resizedBlob, setResizedBlob] = useState(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [unit, setUnit] = useState('px'); // px, cm, mm, inch
  const [dpi, setDpi] = useState(96); // Default Web DPI
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Load image dimensions on upload
  const handleFile = (inputFile) => {
    if (inputFile && inputFile.type.startsWith('image/')) {
      setFile(inputFile);
      setResizedBlob(null);
      const img = new Image();
      img.src = URL.createObjectURL(inputFile);
      img.onload = () => {
        setWidth(img.width);
        setHeight(img.height);
      };
    } else {
      alert("Please upload a valid image (JPG, PNG).");
    }
  };

  // Helper: Calculate Target Pixels based on Unit + DPI
  const getTargetPixels = (val, u, d) => {
    if (!val) return 0;
    if (u === 'px') return parseInt(val);
    if (u === 'inch') return Math.round(val * d);
    if (u === 'cm') return Math.round((val / 2.54) * d);
    if (u === 'mm') return Math.round((val / 25.4) * d);
    return 0;
  };

  const resizeImage = () => {
    if (!file) return;
    setIsLoading(true);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        
        // Calculate final pixel dimensions based on DPI
        const finalW = getTargetPixels(width, unit, dpi);
        const finalH = getTargetPixels(height, unit, dpi);

        canvas.width = finalW;
        canvas.height = finalH;
        
        const ctx = canvas.getContext('2d');
        // High quality scaling settings
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        ctx.drawImage(img, 0, 0, finalW, finalH);
        
        canvas.toBlob((blob) => {
          setResizedBlob(blob);
          setIsLoading(false);
        }, file.type, 1.0); // 1.0 = Max Quality
      };
    };
  };

  const downloadImage = () => {
    if (!resizedBlob) return;
    const url = URL.createObjectURL(resizedBlob);
    const a = document.createElement('a');
    a.href = url;
    // Add dimensions to filename
    a.download = `resized_${width}${unit}_${dpi}dpi_${file.name}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // --- NEW SHARE FUNCTION ---
  const shareImage = async () => {
    if (navigator.share && resizedBlob) {
      try {
        const fileToShare = new File([resizedBlob], `resized_${file.name}`, { type: file.type });
        await navigator.share({
          title: 'Resized Image',
          text: 'Here is your resized image from PDF Matrix.',
          files: [fileToShare],
        });
      } catch (err) {
        console.log('Share canceled or failed', err);
      }
    } else {
      alert("Sharing is not supported on this browser/device.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-teal-50 font-sans">
      
      {/* --- HERO TOOL SECTION --- */}
      <div className="flex flex-col items-center p-6 pt-16 pb-24">
        <div className="w-full max-w-lg text-center mb-10">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-3">Resize Image</h1>
          <p className="text-lg text-gray-500 font-medium">Change dimensions & DPI for Print or Web.</p>
        </div>

        <div className="w-full max-w-lg bg-white shadow-2xl rounded-3xl p-10 transition-all hover:scale-[1.01]">
          
          {!file ? (
            /* UPLOAD STATE */
            <div 
              onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
              onDragOver={(e) => e.preventDefault()}
              className="border-3 border-dashed border-cyan-200 bg-white hover:border-cyan-500 hover:bg-cyan-50 rounded-2xl p-12 text-center transition-all cursor-pointer group"
              onClick={() => fileInputRef.current.click()}
            >
              <input type="file" ref={fileInputRef} onChange={(e) => handleFile(e.target.files[0])} accept="image/*" className="hidden" />
              <div className="w-20 h-20 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <FiMaximize2 size={36} />
              </div>
              <p className="text-gray-900 font-extrabold text-2xl mb-2">Drag Image Here</p>
              <p className="text-gray-400 font-medium text-sm">JPG, PNG, WEBP</p>
            </div>
          ) : !resizedBlob ? (
            /* SETTINGS STATE */
            <div>
              <div className="text-center mb-6">
                <span className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Editing</span>
                <p className="text-gray-700 font-bold mt-2 truncate">{file.name}</p>
              </div>

              <div className="space-y-6">
                
                {/* Dimensions Inputs */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-1">Width</label>
                    <input 
                      type="number" value={width} onChange={(e) => setWidth(e.target.value)}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-800 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-1">Height</label>
                    <input 
                      type="number" value={height} onChange={(e) => setHeight(e.target.value)}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-800 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all"
                    />
                  </div>
                </div>

                {/* Unit Selection */}
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">Unit</label>
                  <div className="flex bg-gray-100 p-1 rounded-xl">
                    {['px', 'cm', 'mm', 'inch'].map((u) => (
                      <button
                        key={u}
                        onClick={() => setUnit(u)}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${unit === u ? 'bg-white text-cyan-600 shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        {u.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* DPI Selection */}
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2 flex items-center gap-2">
                    <FiPrinter /> DPI (Resolution)
                  </label>
                  <select 
                    value={dpi} 
                    onChange={(e) => setDpi(Number(e.target.value))}
                    className="w-full p-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 focus:outline-none focus:border-cyan-500"
                  >
                    <option value={72}>72 DPI (Screen / Web)</option>
                    <option value={96}>96 DPI (Standard Monitors)</option>
                    <option value={150}>150 DPI (Low Quality Print)</option>
                    <option value={300}>300 DPI (High Quality Print)</option>
                    <option value={600}>600 DPI (Ultra High Res)</option>
                  </select>
                  <p className="text-xs text-gray-400 mt-2">
                    *Changing DPI will calculate the correct pixel size for printing.
                  </p>
                </div>

                {/* Action Button */}
                <button onClick={resizeImage} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg shadow-cyan-200 transition-all hover:-translate-y-1">
                  {isLoading ? "Resizing..." : "Resize Image"}
                </button>
              </div>
            </div>
          ) : (
            /* DOWNLOAD STATE */
            <div className="text-center animate-fade-in">
              <div className="mx-auto w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                <FiCheckCircle size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Resized Successfully!</h3>
              <p className="text-gray-500 mb-8 font-medium">
                {getTargetPixels(width, unit, dpi)} x {getTargetPixels(height, unit, dpi)} px
              </p>
              
              <div className="space-y-4">
                <button onClick={downloadImage} className="w-full flex items-center justify-center gap-3 bg-cyan-600 hover:bg-cyan-700 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg shadow-cyan-200 transition-transform hover:-translate-y-1">
                  <FiDownload size={20} /> Download Image
                </button>
                
                <div className="flex gap-3">
                  <button onClick={shareImage} className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 px-6 rounded-xl font-bold text-lg transition-colors">
                    <FiShare2 size={20} /> Share
                  </button>
                  <button onClick={() => { setFile(null); setResizedBlob(null); }} className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 px-6 rounded-xl font-bold text-lg transition-colors">
                    <FiRefreshCw size={20} /> New
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- HOW IT WORKS --- */}
      <div className="bg-white py-24 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6">How to Resize Images</h2>
            <p className="text-xl text-gray-500">Three simple steps to perfect dimensions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
            
            <div className="relative">
              <div className="w-24 h-24 bg-cyan-50 text-cyan-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                <FiUploadCloud size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Upload</h3>
              <p className="text-gray-500 text-lg leading-relaxed">Upload your JPG, PNG or WEBP image. We process high-resolution files instantly.</p>
            </div>

            <div className="relative">
              <div className="w-24 h-24 bg-cyan-50 text-cyan-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                <FiSettings size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Set Dimensions</h3>
              <p className="text-gray-500 text-lg leading-relaxed">Enter your desired Width and Height. Choose between Pixels, CM, MM, or Inches.</p>
            </div>

            <div className="relative">
              <div className="w-24 h-24 bg-cyan-50 text-cyan-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                <FiDownload size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Download</h3>
              <p className="text-gray-500 text-lg leading-relaxed">Get your resized image instantly. Ideal for social media, websites, or printing.</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- WHY CHOOSE US --- */}
      <div className="py-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6">Why use Tools Matrix?</h2>
            <p className="text-xl text-gray-500">Precision resizing tools for professionals.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 flex items-start space-x-6">
              <div className="flex-shrink-0 w-16 h-16 bg-cyan-50 text-cyan-600 rounded-2xl flex items-center justify-center">
                <FiTarget size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Pixel Precision</h3>
                <p className="text-gray-500 text-lg leading-relaxed">Need an image exactly 1080x1080 for Instagram? We give you exact control over pixel dimensions.</p>
              </div>
            </div>
            <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 flex items-start space-x-6">
              <div className="flex-shrink-0 w-16 h-16 bg-cyan-50 text-cyan-600 rounded-2xl flex items-center justify-center">
                <FiPrinter size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Print Ready (DPI)</h3>
                <p className="text-gray-500 text-lg leading-relaxed">Set your dimensions in CM or Inches and choose 300 DPI. We calculate the high-res pixels needed for crisp printing.</p>
              </div>
            </div>
            <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 flex items-start space-x-6">
              <div className="flex-shrink-0 w-16 h-16 bg-cyan-50 text-cyan-600 rounded-2xl flex items-center justify-center">
                <FiZap size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">High Quality Algo</h3>
                <p className="text-gray-500 text-lg leading-relaxed">We use advanced bicubic interpolation logic to ensure your resized images remain sharp, not pixelated.</p>
              </div>
            </div>
            <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 flex items-start space-x-6">
              <div className="flex-shrink-0 w-16 h-16 bg-cyan-50 text-cyan-600 rounded-2xl flex items-center justify-center">
                <FiLayers size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Multiple Formats</h3>
                <p className="text-gray-500 text-lg leading-relaxed">Upload JPG, PNG, or WEBP. We process them all seamlessly without compatibility issues.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- SEO CONTENT BLOCK --- */}
      <div className="bg-white py-24 px-6 border-t border-gray-100">
        <div className="max-w-4xl mx-auto prose prose-lg prose-cyan text-gray-500">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Resize Image for Web and Print</h2>
          <p className="mb-6">
            Changing the size of an image is a common need, whether you are trying to fit a photo into a passport application frame, preparing a banner for a website, or setting up a high-quality print.
          </p>
          <p className="mb-6">
            <strong>Tools Matrix</strong> gives you professional control. Unlike basic tools that only accept pixels, we allow you to define sizes in <strong>Centimeters (cm), Millimeters (mm), and Inches</strong>.
          </p>
          <p>
            Crucially, we support <strong>DPI (Dots Per Inch)</strong> selection. If you need to print an image at 4x6 inches, simply select "Inch", enter the dimensions, and choose 300 DPI. We automatically upscale the resolution to ensure your print comes out crystal clear.
          </p>
        </div>
      </div>

    </div>
  );
}