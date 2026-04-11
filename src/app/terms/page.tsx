import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = { title: 'Terms of Use | i-Realty', description: 'i-Realty terms of use — the rules governing use of our platform.' };

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white mt-20">
        <div className="max-w-2xl mx-auto px-6 py-16 prose prose-sm text-gray-700">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Use</h1>
          <p className="text-gray-400 text-sm mb-8">Effective Date: April 2026</p>

          <p>
            Welcome to i-Realty. By clicking a registration or new account submission button, or by otherwise using our
            websites, mobile applications, or other services (collectively, the "Services"), you agree to be bound by
            these Terms of Use (the "Terms").
          </p>

          <h2 className="text-lg font-semibold mt-8 mb-2">1. i-Realty's Role</h2>
          <p>
            The Services assist you in performing various tasks in a real estate transaction. However, unless explicitly
            specified, the Services are <strong>not intended</strong> to provide you with any financial, real estate, or
            related advice. You understand and agree that the Services may include advertisements, and we may serve
            advertisements based on information we collect through the Services (see our{' '}
            <a href="/privacy" className="text-blue-600">Privacy Notice</a> for details).
          </p>

          <h2 className="text-lg font-semibold mt-8 mb-2">2. Eligibility and Accounts</h2>
          <p>
            You must be at least 18 years old to use the Services. By agreeing to these Terms, you represent that:
            (a) you are at least 18; (b) you have not previously been suspended from the Services; and (c) your use
            complies with all applicable laws.
          </p>
          <p>
            To access certain features, you must register for an account. You agree to provide accurate, current, and
            complete information and to keep it updated. You are solely responsible for maintaining the confidentiality
            of your password and for all activities under your account. You may not share your account with others.
          </p>

          <h2 className="text-lg font-semibold mt-8 mb-2">3. Use of the Services; Restrictions</h2>
          <p>
            As long as you comply with these Terms, we grant you a non-exclusive, limited, revocable, personal,
            non-transferable license to use the Services for your personal use. Real estate professionals acting in
            their professional capacity ("Pro Use") may also use the Services to serve clients, provided they have
            obtained all necessary consents.
          </p>
          <p><strong>Restrictions.</strong> You may not:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Use the Services for commercial real estate transactions (e.g., commercially zoned properties or vacation rentals).</li>
            <li>Copy, modify, distribute, sell, or lease any part of the Services.</li>
            <li>Reverse engineer or attempt to extract the source code of any software.</li>
            <li>Use the Services in any way that violates applicable laws or infringes the rights of others.</li>
          </ul>

          <h2 className="text-lg font-semibold mt-8 mb-2">4. User Content</h2>
          <p>
            You retain ownership of any content you submit, post, or display on the Services ("User Materials"). By
            submitting User Materials, you grant i-Realty a worldwide, royalty-free, perpetual, irrevocable,
            non-exclusive license to use, reproduce, modify, adapt, publish, and distribute such content in connection
            with the Services.
          </p>
          <p>
            You represent that you own or have the necessary licenses, rights, and permissions to grant this license.
            We are not obligated to edit or control User Materials, but we reserve the right to remove any content that
            violates these Terms or is otherwise objectionable.
          </p>

          <h2 className="text-lg font-semibold mt-8 mb-2">5. Third-Party Services</h2>
          <p>
            The Services may contain links to third-party websites or services. We do not endorse or control those
            third parties, and we are not responsible for their practices. Your dealings with third parties are solely
            between you and them. If you submit information to a third party through our Services, you may receive
            communications from that party, and we are not responsible for their use of your information.
          </p>

          <h2 className="text-lg font-semibold mt-8 mb-2">6. Intellectual Property</h2>
          <p>
            The Services and all content, features, and functionality (including software, text, graphics, logos, and
            databases) are owned by i-Realty or its licensors and are protected by copyright, trademark, and other
            intellectual property laws. You may not use any i-Realty trademark or logo without our prior written consent.
          </p>

          <h2 className="text-lg font-semibold mt-8 mb-2">7. Feedback</h2>
          <p>
            If you provide suggestions, comments, or other feedback regarding the Services, you grant us an unrestricted,
            perpetual, irrevocable, royalty-free license to use that feedback for any purpose, including improving our
            Services.
          </p>

          <h2 className="text-lg font-semibold mt-8 mb-2">8. Copyright Infringement (DMCA)</h2>
          <p>
            We respect the intellectual property rights of others. If you believe that your work has been copied on our
            Services in a way that constitutes copyright infringement, please provide our Copyright Agent with the following:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>A physical or electronic signature.</li>
            <li>Identification of the copyrighted work claimed to have been infringed.</li>
            <li>Identification of the material that is claimed to be infringing and information reasonably sufficient to permit us to locate it.</li>
            <li>Your contact information (name, address, telephone number, and email address).</li>
            <li>A statement that you have a good faith belief that the use is not authorized.</li>
            <li>A statement, made under penalty of perjury, that the information in the notice is accurate and that you are the copyright owner or authorized to act on behalf of the owner.</li>
          </ul>
          <p>
            <strong>Copyright Agent:</strong> i-Realty, Ltd. – Legal Department, Copyright Agent<br />
            Email:{' '}
            <a href="mailto:info@i-realty.app" className="text-blue-600">info@i-realty.app</a>
          </p>

          <h2 className="text-lg font-semibold mt-8 mb-2">9. Deactivation and Deletion</h2>
          <p>
            You may deactivate your account at any time through your account settings. To delete your account and all
            associated data, submit a request at{' '}
            <a href="mailto:privacy@i-realty.com" className="text-blue-600">privacy@i-realty.com</a>.
            Deactivation or deletion does not relieve you of any outstanding payment obligations.
          </p>

          <h2 className="text-lg font-semibold mt-8 mb-2">10. Disclaimer of Warranties</h2>
          <p className="uppercase text-xs leading-relaxed">
            The services are provided "as is" and "as available." To the fullest extent permitted by law, i-Realty
            disclaims all warranties, express or implied, including implied warranties of merchantability, fitness for
            a particular purpose, and non-infringement. We do not warrant that the services will be uninterrupted,
            error-free, or secure.
          </p>

          <h2 className="text-lg font-semibold mt-8 mb-2">11. Limitation of Liability</h2>
          <p className="uppercase text-xs leading-relaxed">
            To the maximum extent permitted by applicable law, i-Realty and its affiliates, officers, employees, and
            agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or
            for loss of profits, revenue, or data, arising out of or in connection with your use of the services. Our
            total liability to you for any claim arising from these terms or the services shall not exceed the amount
            you have paid to us (if any) in the past 12 months.
          </p>

          <h2 className="text-lg font-semibold mt-8 mb-2">12. Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless i-Realty and its affiliates, officers, employees, and
            agents from any claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys'
            fees) arising out of or related to your violation of these Terms, your use of the Services, or your User
            Materials.
          </p>

          <h2 className="text-lg font-semibold mt-8 mb-2">13. Governing Law and Dispute Resolution</h2>
          <p>
            These Terms shall be governed by and construed in accordance with applicable law, without regard to its
            conflict of laws principles. Any dispute arising from or relating to these Terms or the Services shall be
            resolved exclusively through binding arbitration, and judgment upon the award may be entered in any court
            having jurisdiction. You agree to waive any right to a jury trial or to participate in a class action.
          </p>

          <h2 className="text-lg font-semibold mt-8 mb-2">14. Changes to These Terms</h2>
          <p>
            We may modify these Terms from time to time. If we make material changes, we will notify you by email or
            through a notice on our website. Your continued use of the Services after the effective date constitutes
            acceptance of the revised Terms.
          </p>

          <h2 className="text-lg font-semibold mt-8 mb-2">15. Miscellaneous</h2>
          <p>
            These Terms constitute the entire agreement between you and i-Realty regarding your use of the Services.
            If any provision is found to be unenforceable, the remaining provisions remain in full force and effect.
            Our failure to enforce any right or provision does not waive that right.
          </p>

          <h2 className="text-lg font-semibold mt-8 mb-2">16. Contact Us</h2>
          <p>For questions about these Terms, please contact us at:</p>
          <p>
            <strong>i-Realty, Ltd.</strong><br />
            Email:{' '}
            <a href="mailto:info@i-realty.app" className="text-blue-600">info@i-realty.app</a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
