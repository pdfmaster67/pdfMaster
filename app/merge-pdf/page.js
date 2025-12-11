'use client';

import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { useDropzone } from 'react-dropzone';
import { saveAs } from 'file-saver';
import { ArrowDown, X, FileText, Share2, Download, UploadCloud } from 'lucide-react';

export default function MergePDF() {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedPdfBlob, setGeneratedPdfBlob] = useState(null);

  const onDrop = (acceptedFiles) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
    setGeneratedPdfBlob(null); // Reset if new files are added
  };

  const { getRootProps, getInputProps, open } = useDropzone({ 
    accept: { 'application/pdf': ['.pdf'] },
    onDrop,
    noClick: true // We will connect the click to the button manually
  });

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

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
      
      setGeneratedPdfBlob(blob); // Save it so we can share it
      saveAs(blob, 'merged-document.pdf'); // Auto-download
    } catch (err) {
      console.error(err);
      alert('Error processing files.');
    }
    
    setIsProcessing(false);
  };

  const handleShare = async () => {
    if (!generatedPdfBlob) return;
    
    const file = new File([generatedPdfBlob], "merged-document.pdf", { type: "application/pdf" });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: 'Merged PDF',
          text: 'Here is your merged PDF file.'
        });
      } catch (error) {
        console.log('Error sharing', error);
      }
    } else {
      alert("Sharing is not supported on this browser/device.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-2">Merge PDF Files</h1>
      <p className="text-center text-gray-500 mb-8">Combine multiple PDFs into one. Fast & Secure.</p>

      {/* Upload Area */}
      {!generatedPdfBlob && (
        <div {...getRootProps()} className="border-2 border-dashed border-red-300 bg-red-50 rounded-xl p-8 text-center transition hover:bg-red-100 relative">
          <input {...getInputProps()} />
          <UploadCloud className="mx-auto text-red-400 mb-4" size={48} />
          <p className="text-gray-600 mb-6">Drag & Drop files here</p>
          
          {/* Custom Button */}
          <button 
            type="button" 
            onClick={open} 
            className="bg-red-600 text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-red-700 transition"
          >
            Select PDF Files
          </button>
        </div>
      )}

      {/* File List */}
      {!generatedPdfBlob && files.length > 0 && (
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

      {/* Process Button */}
      {!generatedPdfBlob && files.length > 0 && (
        <div className="mt-8 text-center">
          <button 
            onClick={handleMerge}
            disabled={isProcessing}
            className="bg-gray-900 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-black transition flex items-center gap-2 mx-auto disabled:opacity-50"
          >
            {isProcessing ? 'Processing...' : 'Merge PDFs Now'}
            {!isProcessing && <ArrowDown size={20} />}
          </button>
        </div>
      )}

      {/* SUCCESS SCREEN (Download & Share) */}
      {generatedPdfBlob && (
        <div className="mt-8 p-8 bg-green-50 border border-green-200 rounded-xl text-center animate-fade-in">
          <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
            <Download className="text-green-600" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">Success! Your PDF is ready.</h2>
          <p className="text-green-600 mb-8">The download should have started automatically.</p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => saveAs(generatedPdfBlob, 'merged-document.pdf')}
              className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 shadow-lg"
            >
              <Download size={20} /> Download Again
            </button>

            <button 
              onClick={handleShare}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 shadow-lg"
            >
              <Share2 size={20} /> Share PDF
            </button>
          </div>

          <button 
            onClick={() => { setFiles([]); setGeneratedPdfBlob(null); }}
            className="mt-6 text-gray-500 hover:text-gray-700 underline text-sm"
          >
            Merge more files
          </button>
        </div>
      )}
    </div>
  );
}