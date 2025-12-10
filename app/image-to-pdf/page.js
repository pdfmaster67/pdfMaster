'use client';

import { useState } from 'react';
import { jsPDF } from 'jspdf';
import { useDropzone } from 'react-dropzone';
import { Image as ImageIcon, CheckCircle, X } from 'lucide-react';

export default function ImageToPDF() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Helper function to read file as Base64 (Fixes the "UNKNOWN" error)
  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const onDrop = async (acceptedFiles) => {
    // Process files immediately to be ready for PDF
    const processedImages = await Promise.all(acceptedFiles.map(async (file) => {
      const base64 = await readFileAsBase64(file);
      return {
        file,
        preview: URL.createObjectURL(file), // For display only
        base64: base64, // For PDF generation
        type: file.type === 'image/png' ? 'PNG' : 'JPEG'
      };
    }));
    
    setImages((prev) => [...prev, ...processedImages]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png']
    },
    onDrop
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
        // Calculate dimensions
        const imgProps = doc.getImageProperties(image.base64);
        const pdfWidth = doc.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        if (index > 0) doc.addPage();
        
        // Use the Base64 data which prevents "UNKNOWN" errors
        doc.addImage(image.base64, image.type, 0, 0, pdfWidth, pdfHeight);
      });

      doc.save('converted-images.pdf');
    } catch (err) {
      console.error(err);
      alert("Error creating PDF. Try using standard JPG or PNG images.");
    }
    
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-2">Convert Images to PDF</h1>
      <p className="text-center text-gray-500 mb-8">Turn your JPG and PNG photos into a single PDF document.</p>
      
      <div className="w-full h-24 bg-gray-100 mb-8 flex items-center justify-center text-gray-400 text-sm">Ad Space (728x90)</div>

      <div {...getRootProps()} className="border-2 border-dashed border-blue-300 bg-blue-50 rounded-xl p-10 text-center cursor-pointer mt-8 hover:bg-blue-100 transition">
        <input {...getInputProps()} />
        <p className="text-blue-600 font-medium">Drag & Drop JPG/PNG images here, or click to select</p>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mt-8">
          {images.map((item, idx) => (
            <div key={idx} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm group">
              <img 
                src={item.preview} 
                className="object-cover w-full h-full" 
                alt="preview" 
              />
              <button 
                onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-100 text-red-500"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <div className="mt-8">
          <button 
            onClick={convertToPDF}
            disabled={loading}
            className="bg-blue-600 text-white w-full py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Converting...' : 'Convert Images to PDF'}
          </button>
        </div>
      )}

      <article className="mt-16 prose prose-blue max-w-none text-gray-600">
        <h3>Fast Image to PDF Converter</h3>
        <p>Easily convert your photos into a professional PDF document. Perfect for submitting receipts or ID cards.</p>
      </article>
    </div>
  );
}