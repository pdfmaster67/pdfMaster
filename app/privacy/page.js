'use client';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans py-20 px-6">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 p-10 md:p-16">
        
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Privacy Policy for Tools Matrix</h1>
        <p className="text-gray-500 mb-10 border-b border-gray-100 pb-8">Last Updated: December 14, 2025</p>

        <div className="prose prose-slate max-w-none text-gray-600 leading-relaxed">
          <p>
            At <strong>Tools Matrix</strong>, accessible from <strong>https://pdf-master-rho.vercel.app</strong>, one of our main priorities is the privacy of our visitors. 
            This Privacy Policy document contains types of information that is collected and recorded by Tools Matrix and how we use it.
          </p>

          <p>
            If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at <strong>pdfmaster67@gmail.com</strong>.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Log Files</h3>
          <p>
            Tools Matrix follows a standard procedure of using log files. These files log visitors when they visit websites. 
            All hosting companies do this as a part of hosting services' analytics. The information collected by log files include 
            internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, 
            and possibly the number of clicks. These are not linked to any information that is personally identifiable.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Cookies and Web Beacons</h3>
          <p>
            Like any other website, Tools Matrix uses 'cookies'. These cookies are used to store information including visitors' 
            preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize 
            the users' experience by customizing our web page content based on visitors' browser type and/or other information.
          </p>

          {/* CRITICAL SECTION FOR ADSENSE */}
          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Google DoubleClick DART Cookie</h3>
          <p>
            Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site 
            visitors based upon their visit to <strong>pdf-master-rho.vercel.app</strong> and other sites on the internet. However, visitors may choose to decline 
            the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL – 
            <a href="https://policies.google.com/technologies/ads" target="_blank" rel="nofollow" className="text-blue-600 underline ml-1">https://policies.google.com/technologies/ads</a>
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Our Advertising Partners</h3>
          <p>
            Some of advertisers on our site may use cookies and web beacons. Our advertising partners are listed below. 
            Each of our advertising partners has their own Privacy Policy for their policies on user data.
          </p>
          <ul className="list-disc pl-5 mt-2">
            <li>
              <strong>Google:</strong> <a href="https://policies.google.com/technologies/ads" target="_blank" rel="nofollow" className="text-blue-600">https://policies.google.com/technologies/ads</a>
            </li>
          </ul>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Client-Side Processing (Data Security)</h3>
          <p>
            Unlike many other online tools, Tools Matrix prioritizes client-side processing. This means that for tools such as our 
            Image Converter, PDF Merger, and Voice Transcriber, your files <strong>are processed directly within your web browser</strong> using WebAssembly technology. 
            Your files are not uploaded to our servers for processing, ensuring maximum privacy and security.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">CCPA Privacy Rights (Do Not Sell My Personal Information)</h3>
          <p>Under the CCPA, among other rights, California consumers have the right to:</p>
          <ul className="list-disc pl-5 mt-2">
            <li>Request that a business that collects a consumer's personal data disclose the categories and specific pieces of personal data that a business has collected about consumers.</li>
            <li>Request that a business delete any personal data about the consumer that a business has collected.</li>
            <li>Request that a business that sells a consumer's personal data, not sell the consumer's personal data.</li>
          </ul>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">GDPR Data Protection Rights</h3>
          <p>We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:</p>
          <ul className="list-disc pl-5 mt-2">
            <li>The right to access – You have the right to request copies of your personal data.</li>
            <li>The right to rectification – You have the right to request that we correct any information you believe is inaccurate.</li>
            <li>The right to erasure – You have the right to request that we erase your personal data, under certain conditions.</li>
          </ul>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Children's Information</h3>
          <p>
            Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.
            Tools Matrix does not knowingly collect any Personal Identifiable Information from children under the age of 13.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Contact Information</h3>
          <p>
            If you have any questions about this Privacy Policy, please contact us via email:
          </p>
          <p className="mt-2 font-bold text-gray-800">
             Email: <a href="mailto:pdfmaster67@gmail.com" className="text-blue-600 hover:underline">pdfmaster67@gmail.com</a>
          </p>

        </div>
      </div>
    </div>
  );
}