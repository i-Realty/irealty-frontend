import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = { title: 'Privacy Notice | i-Realty', description: 'i-Realty privacy notice — how we collect, use, and protect your personal data.' };

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white mt-20">
        <div className="max-w-2xl mx-auto px-6 py-16 prose prose-sm text-gray-700">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Notice</h1>
          <p className="text-gray-400 text-sm mb-8">Effective Date: April 2026</p>

          <p>
            When you use i-Realty services to find, buy, rent, or sell your home, or connect to a real estate professional,
            we know you're trusting us with your data. We also know we have a responsibility to respect your privacy, and we
            work hard to do just that. This Privacy Notice explains what personal data we collect, why we use it, who we
            share it with, and how we protect it, along with the tools you can use to manage your privacy.
          </p>

          <p>
            <strong>Who We Are.</strong> i-Realty offers a range of services focused on all stages of your home journey:
            searching, renting, buying, selling, and connecting with real estate professionals. When we use the terms
            "i-Realty," "we," "us," or "our" in this Privacy Notice, we are referring to i-Realty and its affiliated brands.
          </p>

          <p>
            <strong>Our Services.</strong> When we use the terms "services" or "offerings," we are referring to our websites,
            mobile applications, and other services that link to this Privacy Notice, including rental applications, leases,
            payments, and connections to lenders or agents.
          </p>

          <p>
            <strong>What Is Personal Data?</strong> "Personal data" means information that identifies, relates to, describes,
            or could reasonably be linked to an individual or household. It does not include aggregated or de-identified information.
          </p>

          <h2 className="text-lg font-semibold mt-8 mb-2">Our Collection and Use of Personal Data</h2>
          <p>
            The personal data we collect, the way we collect it, and how we use it depends on how you interact with us.
          </p>

          <h3 className="text-base font-semibold mt-6 mb-2">Information You Give Us or Create Using Our Services</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Account Registration and Profile Information.</strong> When you register for an account, we collect
              identifiers such as your email address, username, and password. We may link this to your account history,
              log-in activity, and transactions to administer your account and provide customer support.
            </li>
            <li>
              <strong>Feedback Information.</strong> When you submit a review or feedback, we collect your contact information
              and any ratings or comments you provide.
            </li>
            <li>
              <strong>Inquiries and Communications.</strong> When you fill out a form or contact us (including via phone or
              chat), we collect your contact information and the content of your communication.
            </li>
            <li>
              <strong>Geolocation Data.</strong> We may collect general location information from your IP address. With your
              permission, we may collect precise GPS data to facilitate services such as showing nearby properties.
            </li>
          </ul>

          <h3 className="text-base font-semibold mt-6 mb-2">Information Collected Automatically</h3>
          <p>
            When you interact with our services, we automatically collect information such as your IP address, browser type,
            device identifiers, browsing activity, search history, and interaction data. We use this information to improve
            our services, personalize your experience, and serve relevant advertisements.
          </p>

          <h3 className="text-base font-semibold mt-6 mb-2">Information from Third Parties</h3>
          <p>We may receive personal data from:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Business Partners</strong>, such as real estate professionals or lenders you contact through our services.</li>
            <li><strong>Service Providers</strong>, including payment processors and marketing platforms.</li>
            <li>
              <strong>Publicly Available Sources</strong>, such as public records and government databases, to verify
              information or prevent fraud.
            </li>
          </ul>

          <h2 className="text-lg font-semibold mt-8 mb-2">How We Use Your Personal Data</h2>
          <p>In addition to the purposes described above, we use your personal data to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Facilitate day-to-day operations (e.g., helping you find a home or connect with a professional).</li>
            <li>Create, maintain, and improve our services and develop new products.</li>
            <li>Communicate with you about your account, services, and promotional offers.</li>
            <li>Personalize your experience and provide recommendations.</li>
            <li>Detect, prevent, and investigate fraud or other illegal activities.</li>
            <li>Comply with legal obligations and enforce our terms.</li>
          </ul>

          <h2 className="text-lg font-semibold mt-8 mb-2">Sharing Your Personal Data</h2>
          <p>We may share your personal data in the following circumstances:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>With Real Estate Professionals and Lenders.</strong> When you express interest in a property or
              service, we may share your information with the relevant professional to fulfill your request.
            </li>
            <li>
              <strong>With Service Providers.</strong> We engage vendors to perform services on our behalf (e.g., payment
              processing, data hosting, analytics). We contractually restrict them from using your data for other purposes.
            </li>
            <li>
              <strong>For Legal Compliance and Protection.</strong> We may disclose your data to comply with laws, respond
              to legal process, protect our rights or the safety of others, or prevent fraud.
            </li>
            <li>
              <strong>In Business Transfers.</strong> If we are involved in a merger, acquisition, or sale of assets, your
              data may be transferred as part of that transaction.
            </li>
            <li>
              <strong>With Your Consent or at Your Direction.</strong> You may choose to share your data publicly (e.g.,
              posting a review) or with third parties at your instruction.
            </li>
          </ul>

          <h2 className="text-lg font-semibold mt-8 mb-2">Your Choices and Rights</h2>
          <p>Depending on your jurisdiction, you may have the right to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Access, correct, or delete your personal data.</li>
            <li>Opt out of the sale or sharing of your data for targeted advertising.</li>
            <li>Restrict or object to certain processing activities.</li>
            <li>Receive a copy of your data in a portable format.</li>
            <li>Withdraw consent at any time.</li>
          </ul>
          <p>
            To exercise your rights, please visit your account settings or contact us at{' '}
            <a href="mailto:privacy@i-realty.com" className="text-blue-600">privacy@i-realty.com</a>.
            We will respond within the timeframes required by applicable law.
          </p>

          <h2 className="text-lg font-semibold mt-8 mb-2">Data Security and Retention</h2>
          <p>
            We implement reasonable administrative, technical, and physical safeguards to protect your personal data.
            However, no method of transmission over the internet is completely secure. We retain your data only as long as
            necessary to fulfill the purposes described in this Privacy Notice, comply with legal obligations, resolve
            disputes, and enforce our agreements.
          </p>

          <h2 className="text-lg font-semibold mt-8 mb-2">Children's Privacy</h2>
          <p>
            Our services are not directed to individuals under 18. We do not knowingly collect personal data from children.
            If you believe a child has provided us with data, please contact us.
          </p>

          <h2 className="text-lg font-semibold mt-8 mb-2">International Data Transfers</h2>
          <p>
            Your personal data may be transferred to, stored, or processed in countries other than your own. We will take
            appropriate measures to ensure that your data receives adequate protection as required by applicable law.
          </p>

          <h2 className="text-lg font-semibold mt-8 mb-2">Changes to This Privacy Notice</h2>
          <p>
            We may update this Privacy Notice from time to time. If we make material changes, we will notify you by email
            or through a notice on our website. Your continued use of our services after the effective date constitutes
            acceptance of the updated Notice.
          </p>

          <h2 className="text-lg font-semibold mt-8 mb-2">Contact Us</h2>
          <p>
            If you have questions or concerns about this Privacy Notice or our data practices, please contact us at:
          </p>
          <p>
            <strong>i-Realty Privacy</strong><br />
            Email:{' '}
            <a href="mailto:privacy@i-realty.com" className="text-blue-600">privacy@i-realty.com</a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
