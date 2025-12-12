'use client';

import { useState, useRef } from 'react';
import { 
  FiMinimize2, FiDownload, FiRefreshCw, FiCheckCircle, 
  FiUploadCloud, FiSettings, FiShield, FiZap, FiSmartphone 
} from 'react-icons/fi'; 

export default function ImageCompressPage() {
  const [file, setFile] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);
  const [quality, setQuality] = useState(0.8); // 80% default
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  // --- HELPER: FORMAT BYTES ---
  const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  const handleFile = (inputFile) => {
    if (inputFile && inputFile.type.startsWith('image/')) {
      setFile(inputFile);
      setOriginalSize(inputFile.size);
      setCompressedImage(null);
    } else {
      alert("Please upload a valid image file (JPG, PNG, WEBP).");
    }
  };

  const compressImage = () => {
    if (!file) return;
    setIsLoading(true);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, img.width, img.height);
        
        // Compress using Canvas API
        canvas.toBlob((blob) => {
          setCompressedImage(blob);
          setCompressedSize(blob.size);
          setIsLoading(false);
        }, 'image/jpeg', quality);
      };
    };
  };

  const downloadImage = () => {
    if (!compressedImage) return;
    const url = URL.createObjectURL(compressedImage);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compressed_${file.name.split('.')[0]}.jpg`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 font-sans">
      
      {/* --- HERO TOOL SECTION --- */}
      <div className="flex flex-col items-center p-6 pt-16 pb-24">
        <div className="w-full max-w-lg text-center mb-10">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-3">Compress Image</h1>
          <p className="text-lg text-gray-500 font-medium">Reduce file size without losing quality.</p>
        </div>

        <div className="w-full max-w-lg bg-white shadow-2xl rounded-3xl p-10 transition-all hover:scale-[1.01]">
          
          {!file ? (
            /* UPLOAD STATE */
            <div 
              onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
              onDragOver={(e) => e.preventDefault()}
              className="border-3 border-dashed border-pink-200 bg-white hover:border-pink-500 hover:bg-pink-50 rounded-2xl p-12 text-center transition-all cursor-pointer group"
              onClick={() => fileInputRef.current.click()}
            >
              <input type="file" ref={fileInputRef} onChange={(e) => handleFile(e.target.files[0])} accept="image/*" className="hidden" />
              <div className="w-20 h-20 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <FiMinimize2 size={36} />
              </div>
              <p className="text-gray-900 font-extrabold text-2xl mb-2">Drag Image Here</p>
              <p className="text-gray-400 font-medium text-sm">JPG, PNG, WEBP</p>
            </div>
          ) : !compressedImage ? (
            /* SETTINGS STATE */
            <div className="text-center">
               <div className="mb-6 flex items-center justify-center gap-3">
                 <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Selected</span>
                 <p className="text-gray-700 font-bold truncate max-w-[200px]">{file.name}</p>
                 <p className="text-gray-400 text-sm">({formatBytes(originalSize)})</p>
               </div>
               
               <div className="mb-8 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                 <div className="flex justify-between items-center mb-4">
                    <label className="text-left font-bold text-gray-700 flex items-center gap-2">
                      <FiSettings /> Compression Level
                    </label>
                    <span className="text-pink-600 font-bold bg-pink-50 px-2 py-1 rounded-lg">{Math.round(quality * 100)}%</span>
                 </div>
                 
                 <input 
                   type="range" min="0.1" max="1" step="0.1" 
                   value={quality} 
                   onChange={(e) => setQuality(parseFloat(e.target.value))}
                   className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-600 hover:accent-pink-500"
                 />
                 <div className="flex justify-between text-xs text-gray-400 mt-2 font-bold uppercase tracking-wider">
                   <span>Max Compression</span>
                   <span>Best Quality</span>
                 </div>
               </div>

               <button onClick={compressImage} className="w-full bg-pink-600 hover:bg-pink-700 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg shadow-pink-200 transition-all hover:-translate-y-1">
                 {isLoading ? "Compressing..." : "Compress Now"}
               </button>
            </div>
          ) : (
            /* DOWNLOAD STATE */
            <div className="text-center animate-fade-in">
              <div className="mx-auto w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                <FiCheckCircle size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Done!</h3>
              
              <div className="flex justify-center items-center gap-4 mb-8 text-sm">
                <div className="text-gray-400 line-through">{formatBytes(originalSize)}</div>
                <div className="text-gray-300">➜</div>
                <div className="text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full">
                  {formatBytes(compressedSize)}
                </div>
              </div>
              
              <div className="space-y-4">
                <button onClick={downloadImage} className="w-full flex items-center justify-center gap-3 bg-pink-600 hover:bg-pink-700 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg shadow-pink-200 transition-transform hover:-translate-y-1">
                  <FiDownload size={20} /> Download Image
                </button>
                <button onClick={() => { setFile(null); setCompressedImage(null); }} className="w-full flex items-center justify-center gap-3 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 px-6 rounded-xl font-bold text-lg">
                  <FiRefreshCw size={20} /> Compress Another
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- HOW IT WORKS --- */}
      <div className="bg-white py-24 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6">How to Compress Images</h2>
            <p className="text-xl text-gray-500">Three simple steps to save storage space.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
            
            <div className="relative">
              <div className="w-24 h-24 bg-pink-50 text-pink-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                <FiMinimize2 size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Upload Image</h3>
              <p className="text-gray-500 text-lg leading-relaxed">Select your large JPG or PNG file. We handle high-resolution photos easily.</p>
            </div>

            <div className="relative">
              <div className="w-24 h-24 bg-pink-50 text-pink-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                <FiSettings size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Adjust Level</h3>
              <p className="text-gray-500 text-lg leading-relaxed">Use the slider to balance between file size and image quality.</p>
            </div>

            <div className="relative">
              <div className="w-24 h-24 bg-pink-50 text-pink-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                <FiDownload size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Download</h3>
              <p className="text-gray-500 text-lg leading-relaxed">Get a lightweight file that loads faster and takes up less space.</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- WHY CHOOSE US --- */}
      <div className="py-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6">Why use PDF Matrix?</h2>
            <p className="text-xl text-gray-500">Optimization without compromise.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 flex items-start space-x-6">
              <div className="flex-shrink-0 w-16 h-16 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center">
                <FiZap size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Web Speed</h3>
                <p className="text-gray-500 text-lg leading-relaxed">Large images slow down websites. Compress your assets to boost page load speed and SEO rankings.</p>
              </div>
            </div>
            <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 flex items-start space-x-6">
              <div className="flex-shrink-0 w-16 h-16 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center">
                <FiShield size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Client-Side Secure</h3>
                <p className="text-gray-500 text-lg leading-relaxed">This tool runs 100% in your browser. Your photos never leave your device, ensuring maximum privacy.</p>
              </div>
            </div>
            <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 flex items-start space-x-6">
              <div className="flex-shrink-0 w-16 h-16 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center">
                <FiSmartphone size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Save Storage</h3>
                <p className="text-gray-500 text-lg leading-relaxed">Free up space on your iPhone or Android by compressing your photo gallery without deleting memories.</p>
              </div>
            </div>
            <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 flex items-start space-x-6">
              <div className="flex-shrink-0 w-16 h-16 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center">
                <FiUploadCloud size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Email Ready</h3>
                <p className="text-gray-500 text-lg leading-relaxed">Struggling to attach photos to an email? Compress them here first to bypass attachment size limits.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- SEO CONTENT BLOCK --- */}
      <div className="bg-white py-24 px-6 border-t border-gray-100">
        <div className="max-w-4xl mx-auto prose prose-lg prose-pink text-gray-500">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Reduce Image Size Online Free</h2>
          <p className="mb-6">
            High-resolution cameras are great, but the massive file sizes they create can be a headache. Large images eat up your storage space, take forever to upload, and slow down your website.
          </p>
          <p className="mb-6">
            <strong>PDF Matrix</strong> offers a powerful image compressor that reduces file size by up to 80% while maintaining visible quality. 
            Whether you are a web developer optimizing a landing page or a photographer sharing a portfolio, our tool gives you the perfect balance.
          </p>
          <p>
            Unlike other tools that upload your files to a server, our compressor runs directly in your browser. This means it is faster, safer, and works even when your internet connection is slow.
          </p>
        </div>
      </div>

    </div>
  );
}