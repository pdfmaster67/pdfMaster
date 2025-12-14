'use client';

import { useState } from 'react';
import { FiMail, FiCheckCircle, FiCopy, FiCheck } from 'react-icons/fi';

export default function AboutPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("pdfmaster67@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans py-20 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 p-10 md:p-16">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">About Tools Matrix</h1>
          <p className="text-xl text-gray-500">Simplifying digital workflows, one file at a time.</p>
        </div>

        <div className="prose prose-slate max-w-none text-gray-600">
          <p className="text-lg">
            Welcome to <strong>Tools Matrix</strong>, your number one source for all things related to PDF conversion, image editing, and AI-powered utilities. 
            We're dedicated to providing you the very best of online tools, with an emphasis on speed, privacy, and ease of use.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Who We Are</h3>
          <p>
            Founded in 2025, Tools Matrix has come a long way from its beginnings. When we first started out, our passion for 
            "secure, client-side technology" drove us to start our own business.
          </p>
          <p>
            We hope you enjoy our products as much as we enjoy offering them to you. If you have any questions or comments, please don't hesitate to contact us.
          </p>

          <div className="bg-blue-50 p-8 rounded-2xl mt-10">
            <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
              <FiCheckCircle /> Why AdSense & Users Trust Us
            </h3>
            <ul className="space-y-3 text-blue-800">
              <li>• <strong>Transparent Operations:</strong> We clearly state how files are processed (locally in the browser).</li>
              <li>• <strong>High-Quality Utilities:</strong> We don't just host ads; we provide valuable software tools.</li>
              <li>• <strong>Data Privacy:</strong> We adhere to GDPR and CCPA guidelines to protect user data.</li>
            </ul>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mt-10 mb-6">Contact Us</h3>
          <p>
            We love hearing from our users. Whether you have a suggestion for a new tool, found a bug, or just want to say hi, reach out to us:
          </p>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-6">
            
            {/* 1. MAILTO LINK (Opens Default App) */}
            <a 
              href="mailto:pdfmaster67@gmail.com?subject=Inquiry%20from%20Tools%20Matrix"
              className="flex items-center gap-3 bg-gray-900 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-200"
            >
              <FiMail />
              <span>Email Us</span>
            </a>

            {/* 2. COPY BUTTON (For manual use) */}
            <div className="flex items-center gap-3 bg-gray-100 px-4 py-3 rounded-xl border border-gray-200">
              <span className="font-mono text-gray-700 font-medium">pdfmaster67@gmail.com</span>
              <button 
                onClick={handleCopy}
                className="text-gray-400 hover:text-green-600 transition-colors"
                title="Copy Email"
              >
                {copied ? <FiCheck size={20} className="text-green-600" /> : <FiCopy size={20} />}
              </button>
            </div>

          </div>
          
          <p className="text-sm text-gray-400 mt-4">*Please allow 24-48 hours for a response.</p>

        </div>
      </div>
    </div>
  );
}