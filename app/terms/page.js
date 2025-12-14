'use client';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans py-20 px-6">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 p-10 md:p-16">
        
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Terms and Conditions</h1>
        <p className="text-gray-500 mb-10 border-b border-gray-100 pb-8">Last Updated: December 14, 2025</p>

        <div className="prose prose-slate max-w-none text-gray-600 leading-relaxed">
          
          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h3>
          <p>
            Welcome to <strong>Tools Matrix</strong>. By accessing or using our website located at
              <strong>https://pdf-master-rho.vercel.app/terms</strong> (hereinafter referred to as "the Service"), 
            you agree to comply with and be bound by these Terms and Conditions. If you do not agree with any part of these terms, you are prohibited from using our Service.
          </p>
          <p>
            These Terms constitute a legally binding agreement between you ("User") and Tools Matrix ("Company", "we", "us", or "our"), operating from <strong>Surat, Gujarat, India</strong>.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Services Provided</h3>
          <p>
            Tools Matrix provides a suite of online file manipulation tools, including but not limited to PDF merging, image conversion, background removal, and other tools. 
            We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time without prior notice.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. User Conduct & Restrictions</h3>
          <p>You agree to use the Service only for lawful purposes. You are specifically restricted from:</p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li>Using the Service for any illegal purpose under Indian laws or the laws of your jurisdiction.</li>
            <li>Uploading files containing malware, viruses, trojans, or any malicious code.</li>
            <li>Attempting to reverse engineer, decompile, or hack any part of the Service.</li>
            <li>Using automated systems (bots, scrapers) to access the Service without our permission.</li>
            <li>Processing copyrighted material for which you do not have the necessary permissions or ownership.</li>
          </ul>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Intellectual Property Rights</h3>
          <p>
            <strong>Your Content:</strong> We do not claim ownership of any files, data, or content you upload to Tools Matrix. You retain full copyright and ownership of your original files and the processed output.
          </p>
          <p className="mt-2">
            <strong>Our Content:</strong> The design, layout, graphics, code, and branding of Tools Matrix are the intellectual property of the Company and are protected by copyright and trademark laws.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Data Privacy & Security</h3>
          <p>
            We prioritize your privacy. Most of our tools operate using <strong>Client-Side Processing</strong>, meaning your files are processed locally within your web browser and are not uploaded to our servers.
            For tools that require server-side processing, files are automatically deleted after a short period (typically 1 hour). Please refer to our <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a> for detailed information.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Disclaimer of Warranties</h3>
          <p>
            The Service is provided on an "AS IS" and "AS AVAILABLE" basis. Tools Matrix explicitly disclaims all warranties of any kind, whether express or implied, including but not limited to 
            implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
          </p>
          <p className="mt-2">
            We do not warrant that the Service will be uninterrupted, secure, or error-free. You understand that you use the Service at your own risk.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Limitation of Liability</h3>
          <p>
            In no event shall Tools Matrix, its directors, employees, or agents be liable for any direct, indirect, incidental, special, or consequential damages arising out of:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Errors, mistakes, or inaccuracies of content/output.</li>
            <li>Data loss or corruption resulting from the use of our tools.</li>
            <li>Unauthorized access to our servers.</li>
            <li>Any interruption or cessation of transmission to or from our Service.</li>
          </ul>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Indemnification</h3>
          <p>
            You agree to defend, indemnify, and hold harmless Tools Matrix from and against any and all claims, damages, obligations, losses, liabilities, costs, and expenses (including attorney's fees) arising from your use of the Service or your violation of these Terms.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Governing Law & Jurisdiction</h3>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of <strong>India</strong>. 
            Any disputes relating to these Terms or the Service shall be subject to the exclusive jurisdiction of the courts located in <strong>Surat, Gujarat, India</strong>.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Contact Information</h3>
          <p>
            If you have any questions about these Terms, please contact us at:
          </p>
          <p className="mt-2 font-bold text-gray-800">
            Email: <a href="mailto:pdfmaster67@gmail.com" className="text-blue-600 hover:underline">pdfmaster67@gmail.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}