'use client';

import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { useDropzone } from 'react-dropzone';
import { saveAs } from 'file-saver';
import { ArrowDown, X, FileText } from 'lucide-react';

export default function MergePDF() {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle Drag & Drop
  const onDrop = (acceptedFiles) => {
    // Only add new files to the list
    setFiles((prev) => [...prev, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps } = useDropzone({ 
    accept: { 'application/pdf': ['.pdf'] },
    onDrop 
  });

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  // THE MAGIC: Client-Side Merging
  const handleMerge = async () => {
    if (files.length < 2) return alert('Please select at least 2 PDF files.');
    setIsProcessing(true);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const fileBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(fileBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      saveAs(blob, 'merged-document.pdf');
    } catch (err) {
      console.error(err);
      alert('Error processing files. One might be password protected.');
    }
    
    setIsProcessing(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-2">Merge PDF Files</h1>
      <p className="text-center text-gray-500 mb-8">Combine PDFs in the order you want. 100% Client-side.</p>

      {/* Ad Space */}
      <div className="w-full h-24 bg-gray-100 mb-8 flex items-center justify-center text-gray-400 text-sm">Ad Space (728x90)</div>

      {/* Upload Area */}
      <div {...getRootProps()} className="border-2 border-dashed border-red-300 bg-red-50 rounded-xl p-10 text-center cursor-pointer hover:bg-red-100 transition">
        <input {...getInputProps()} />
        <p className="text-red-600 font-medium">Drag 'n' drop PDF files here, or click to select files</p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-8 space-y-3">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <FileText size={20} className="text-red-500" />
                <span className="text-sm font-medium truncate max-w-xs">{file.name}</span>
              </div>
              <button onClick={() => removeFile(index)} className="text-gray-400 hover:text-red-500"><X size={20} /></button>
            </div>
          ))}
        </div>
      )}

      {/* Action Button */}
      {files.length > 0 && (
        <div className="mt-8 text-center">
          <button 
            onClick={handleMerge}
            disabled={isProcessing}
            className="bg-red-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-red-700 transition flex items-center gap-2 mx-auto disabled:opacity-50"
          >
            {isProcessing ? 'Processing...' : 'Merge PDFs Now'}
            {!isProcessing && <ArrowDown size={20} />}
          </button>
        </div>
      )}

      {/* Content for SEO */}
      <article className="mt-16 prose prose-red max-w-none text-gray-600">
        <h3>How to Merge PDF files free</h3>
        <p>Select multiple PDF files and merge them in seconds. This tool works on Mac, Windows, and Linux. No installation required. Unlike other tools, we do not upload your files to any server.</p>
      </article>
    </div>
  );
}