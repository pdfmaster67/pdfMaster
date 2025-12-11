'use client';

import { useState } from 'react';
import { jsPDF } from 'jspdf';
import { useDropzone } from 'react-dropzone';
import { Image as ImageIcon, CheckCircle, X, Download, Share2, UploadCloud } from 'lucide-react';

export default function ImageToPDF() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generatedBlob, setGeneratedBlob] = useState(null);

  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const onDrop = async (acceptedFiles) => {
    setGeneratedBlob(null);
    const processedImages = await Promise.all(acceptedFiles.map(async (file) => {
      const base64 = await readFileAsBase64(file);
      return {
        id: Math.random().toString(36),
        preview: URL.createObjectURL(file),
        base64: base64,
        type: file.type === 'image/png' ? 'PNG' : 'JPEG'
      };
    }));
    setImages((prev) => [...prev, ...processedImages]);
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    accept: { 'image/jpeg': ['.jpeg', '.jpg'], 'image/png': ['.png'] },
    onDrop,
    noClick: true
  });

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const convertToPDF = () => {
    if (images.length === 0) return;
    setLoading(true);

    try {
      const doc = new jsPDF();

      images.forEach((image, index) => {
        const imgProps = doc.getImageProperties(image.base64);
        const pdfWidth = doc.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        if (index > 0) doc.addPage();
        doc.addImage(image.base64, image.type, 0, 0, pdfWidth, pdfHeight);
      });

      const blob = doc.output('blob');
      setGeneratedBlob(blob);
      doc.save('converted-images.pdf');
    } catch (err) {
      console.error(err);
      alert("Error creating PDF.");
    }
    setLoading(false);
  };

  const handleShare = async () => {
    if (!generatedBlob) return;
    const file = new File([generatedBlob], "converted-images.pdf", { type: "application/pdf" });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: 'Image to PDF',
        text: 'Here is your converted PDF.'
      });
    } else {
      alert("Sharing not supported on this device.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-2">Convert Images to PDF</h1>
      <p className="text-center text-gray-500 mb-8">JPG and PNG to PDF. Free & Private.</p>
      
      {/* Upload Area */}
      {!generatedBlob && (
        <div {...getRootProps()} className="border-2 border-dashed border-blue-300 bg-blue-50 rounded-xl p-8 text-center transition hover:bg-blue-100 relative">
          <input {...getInputProps()} />
          <UploadCloud className="mx-auto text-blue-400 mb-4" size={48} />
          <p className="text-gray-600 mb-6">Drop images here</p>
          <button 
            type="button" 
            onClick={open} 
            className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-blue-700 transition"
          >
            Select Images
          </button>
        </div>
      )}

      {/* Preview Grid */}
      {!generatedBlob && images.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mt-8">
          {images.map((item, idx) => (
            <div key={item.id} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm group">
              <img src={item.preview} className="object-cover w-full h-full" alt="preview" />
              <button 
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-100 text-red-500"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Convert Button */}
      {!generatedBlob && images.length > 0 && (
        <div className="mt-8">
          <button 
            onClick={convertToPDF}
            disabled={loading}
            className="bg-blue-600 text-white w-full py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Converting...' : 'Convert to PDF'}
          </button>
        </div>
      )}

      {/* SUCCESS SCREEN */}
      {generatedBlob && (
        <div className="mt-8 p-8 bg-green-50 border border-green-200 rounded-xl text-center">
          <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
            <CheckCircle className="text-green-600" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-green-800 mb-4">Ready to Download!</h2>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => {
                const url = URL.createObjectURL(generatedBlob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'converted-images.pdf';
                a.click();
              }}
              className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 shadow-lg"
            >
              <Download size={20} /> Download Again
            </button>

            <button 
              onClick={handleShare}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 shadow-lg"
            >
              <Share2 size={20} /> Share File
            </button>
          </div>

          <button 
            onClick={() => { setImages([]); setGeneratedBlob(null); }}
            className="mt-6 text-gray-500 hover:text-gray-700 underline text-sm"
          >
            Convert more images
          </button>
        </div>
      )}
    </div>
  );
}