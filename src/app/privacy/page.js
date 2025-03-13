import Footer from '@/components/lp/shared/Footer';
import Header from '@/components/lp/shared/Header';
import React from 'react';

const PrivacyContent = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 mt-28 py-8">
      <h1 className="text-4xl font-bold mb-6">Content Policy</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
        <p className="">
          Welcome to Take Off Yachts ("we," "our," "us"). We value your Content and are committed to protecting your personal information. This Content Policy outlines how we collect, use, disclose, and safeguard your information when you visit our website [yourwebsite.com], including any other media form, media channel, mobile website, or mobile application related or connected thereto.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
        <h3 className="text-xl font-medium mb-2">Personal Data</h3>
        <p className=" mb-4">
          We may collect personally identifiable information that you voluntarily provide to us when registering on the website, expressing an interest in obtaining information about us or our products and services, when participating in activities on the website or otherwise contacting us. This information may include:
        </p>
        <ul className="list-disc list-inside  mb-4">
          <li>Full Name</li>
          <li>Email Address</li>
          <li>Phone Number</li>
          <li>Address</li>
          <li>Payment Information</li>
          <li>Yacht Preferences</li>
        </ul>

        <h3 className="text-xl font-medium mb-2">Usage Data</h3>
        <p className="">
          We may also collect information that your browser sends whenever you visit our website or when you access the website by or through a mobile device ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol (IP) address, browser type, browser version, the pages of our website that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers, and other diagnostic data.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
        <p className=" mb-4">
          We use the collected data for various purposes:
        </p>
        <ul className="list-disc list-inside ">
          <li>To provide and maintain our service</li>
          <li>To manage your account</li>
          <li>To perform analytics and improve our services</li>
          <li>To communicate with you, including customer service and support</li>
          <li>To process your transactions</li>
          <li>To send you marketing and promotional communications</li>
          <li>To enforce our terms, conditions, and policies</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Sharing Your Information</h2>
        <p className=" mb-4">
          We may share your information in the following situations:
        </p>
        <ul className="list-disc list-inside ">
          <li><strong>Service Providers:</strong> We may share your information with third-party vendors who perform services on our behalf.</li>
          <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred.</li>
          <li><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities.</li>
          <li><strong>With Your Consent:</strong> We may share your information for any other purpose with your consent.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
        <p className="">
          We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Your Content Rights</h2>
        <p className=" mb-4">
          Depending on your location, you may have the following rights regarding your personal information:
        </p>
        <ul className="list-disc list-inside ">
          <li><strong>Access:</strong> You have the right to request access to your personal data.</li>
          <li><strong>Correction:</strong> You have the right to request correction of inaccurate personal data.</li>
          <li><strong>Deletion:</strong> You have the right to request deletion of your personal data.</li>
          <li><strong>Restriction:</strong> You have the right to request restriction of processing your personal data.</li>
          <li><strong>Portability:</strong> You have the right to request transfer of your personal data.</li>
          <li><strong>Object:</strong> You have the right to object to processing your personal data.</li>
        </ul>
        <p className=" mt-4">
          To exercise any of these rights, please contact us using the information provided below.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. Changes to This Privacy Policy</h2>
        <p className="">
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
        <p className="">
          If you have any questions about this Privacy Policy, please contact us:
        </p>
        <ul className="list-disc list-inside ">
          <li>Email: support@yourwebsite.com</li>
          <li>Phone: +1 (234) 567-890</li>
          <li>Address: 123 Yacht Avenue, Dubai, UAE</li>
        </ul>
      </section>
    </div>
  );
};




const Privacy = () => {
  return (
    <>
      <Header />
      <div className="mt-10 md:mt-0">
      <PrivacyContent/>
      <Footer />
        </div>
   
    </>
  );
};

export default Privacy;