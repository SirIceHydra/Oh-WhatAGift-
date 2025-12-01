import HeaderSecondary from '@/components/layout/header-secondary';

export default function PrivacyPolicyPage() {
  return (
    <div className="w-full min-h-screen bg-brand-cream">
      <HeaderSecondary />
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-brand-gold mb-8 text-center text-[38.4px]">
          PRIVACY POLICY
        </h2>
        <div className="max-w-4xl mx-auto space-y-8 text-brand-green">
          <div className="space-y-4">
            <p className="text-body">
              <strong>Last Updated:</strong> January 2025
            </p>
            <p className="text-body">
              At Oh! What a Gift! (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, make a purchase, or interact with our services.
            </p>
          </div>

          <section className="space-y-4">
            <h3 className="text-brand-gold text-h4">1. Information We Collect</h3>
            
            <div className="space-y-3">
              <h4 className="text-brand-gold text-h5">1.1 Personal Information</h4>
              <p className="text-body">
                We collect information that you voluntarily provide to us when you:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-body">
                <li>Create an account or place an order (name, email address, phone number, billing and shipping addresses)</li>
                <li>Subscribe to our newsletter or marketing communications</li>
                <li>Contact us via email, contact forms, or customer service</li>
                <li>Participate in surveys, promotions, or contests</li>
                <li>Request personalization services (custom embroidery details, messages, designs)</li>
                <li>Leave reviews or feedback on our products</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-brand-gold text-h5">1.2 Payment Information</h4>
              <p className="text-body">
                When you make a purchase, we collect payment information through our secure payment processors. We do not store your full credit card details on our servers. Payment information is processed by third-party payment providers who comply with PCI DSS standards.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-brand-gold text-h5">1.3 Automatically Collected Information</h4>
              <p className="text-body">
                When you visit our website, we automatically collect certain information about your device and browsing behavior, including:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-body">
                <li>IP address and location data</li>
                <li>Browser type and version</li>
                <li>Device information (operating system, device type)</li>
                <li>Pages visited, time spent on pages, and navigation patterns</li>
                <li>Referring website addresses</li>
                <li>Cookies and similar tracking technologies (see our Cookies Policy for details)</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-brand-gold text-h4">2. How We Use Your Information</h3>
            <p className="text-body">
              We use the information we collect for the following purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 text-body">
              <li><strong>Order Processing:</strong> To process and fulfill your orders, including personalization requests, shipping, and delivery</li>
              <li><strong>Customer Service:</strong> To respond to your inquiries, provide support, and handle returns or exchanges</li>
              <li><strong>Communication:</strong> To send order confirmations, shipping updates, and important account-related information</li>
              <li><strong>Marketing:</strong> With your consent, to send promotional emails, newsletters, and special offers about our products and services</li>
              <li><strong>Website Improvement:</strong> To analyze website usage, improve user experience, and optimize our website functionality</li>
              <li><strong>Legal Compliance:</strong> To comply with legal obligations, enforce our terms of service, and protect our rights and the rights of our customers</li>
              <li><strong>Fraud Prevention:</strong> To detect and prevent fraudulent transactions and unauthorized access</li>
              <li><strong>Personalization:</strong> To customize your shopping experience and recommend products that may interest you</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-brand-gold text-h4">3. Information Sharing and Disclosure</h3>
            <p className="text-body">
              We do not sell, rent, or trade your personal information. We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 text-body">
              <li><strong>Service Providers:</strong> With trusted third-party service providers who assist us in operating our website, processing payments, shipping orders, managing email communications, and analyzing website usage. These providers are contractually obligated to protect your information and use it only for the purposes we specify.</li>
              <li><strong>Legal Requirements:</strong> When required by law, court order, or government regulation, or to respond to legal process or requests from law enforcement</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets, where your information may be transferred as part of the business transaction</li>
              <li><strong>Protection of Rights:</strong> To protect our rights, property, or safety, or that of our customers or others, including fraud prevention and security measures</li>
              <li><strong>With Your Consent:</strong> When you have explicitly given us permission to share your information</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-brand-gold text-h4">4. Data Security</h3>
            <p className="text-body">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 text-body">
              <li>SSL encryption for data transmission</li>
              <li>Secure payment processing through PCI-compliant providers</li>
              <li>Regular security assessments and updates</li>
              <li>Limited access to personal information on a need-to-know basis</li>
              <li>Secure storage of data with industry-standard protections</li>
            </ul>
            <p className="text-body">
              However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-brand-gold text-h4">5. Your Rights and Choices</h3>
            <p className="text-body">
              Depending on your location, you may have certain rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 text-body">
              <li><strong>Access:</strong> Request access to the personal information we hold about you</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information, subject to legal and operational requirements</li>
              <li><strong>Objection:</strong> Object to certain processing of your information</li>
              <li><strong>Data Portability:</strong> Request a copy of your data in a portable format</li>
              <li><strong>Withdraw Consent:</strong> Withdraw consent for marketing communications at any time by clicking unsubscribe in our emails or contacting us</li>
              <li><strong>Opt-Out:</strong> Opt-out of cookies and tracking technologies (see our Cookies Policy)</li>
            </ul>
            <p className="text-body">
              To exercise these rights, please contact us at <a href="mailto:hello@ohwhatagift.com" className="underline hover:opacity-80">hello@ohwhatagift.com</a>. We will respond to your request within 30 days.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-brand-gold text-h4">6. Data Retention</h3>
            <p className="text-body">
              We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required or permitted by law. For example:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 text-body">
              <li>Order information is retained for at least 7 years for tax and accounting purposes</li>
              <li>Marketing consent information is retained until you withdraw consent</li>
              <li>Customer service communications are retained for up to 3 years</li>
              <li>Website analytics data may be retained in anonymized form</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-brand-gold text-h4">7. Children&apos;s Privacy</h3>
            <p className="text-body">
              Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us immediately, and we will take steps to delete such information.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-brand-gold text-h4">8. International Data Transfers</h3>
            <p className="text-body">
              Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that differ from those in your country. We take appropriate measures to ensure that your information receives an adequate level of protection in accordance with applicable data protection laws.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-brand-gold text-h4">9. Changes to This Privacy Policy</h3>
            <p className="text-body">
              We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date. We encourage you to review this policy periodically.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-brand-gold text-h4">10. Contact Us</h3>
            <p className="text-body">
              If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="ml-4 space-y-2 text-body">
              <p><strong>Email:</strong> <a href="mailto:hello@ohwhatagift.com" className="underline hover:opacity-80">hello@ohwhatagift.com</a></p>
              <p><strong>Subject Line:</strong> Privacy Policy Inquiry</p>
            </div>
            <p className="text-body">
              We are committed to addressing your concerns and will respond to your inquiry as soon as possible.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
