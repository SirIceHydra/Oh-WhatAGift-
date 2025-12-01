import HeaderSecondary from '@/components/layout/header-secondary';

export default function CookiesPolicyPage() {
  return (
    <div className="w-full min-h-screen bg-brand-cream">
      <HeaderSecondary />
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-brand-gold mb-8 text-center text-[38.4px]">
          COOKIES POLICY
        </h2>
        <div className="max-w-4xl mx-auto space-y-8 text-brand-green">
          <div className="space-y-4">
            <p className="text-body">
              <strong>Last Updated:</strong> January 2025
            </p>
            <p className="text-body">
              This Cookies Policy explains what cookies are, how we use them on our website, and your choices regarding cookie management. By using our website, you consent to our use of cookies as described in this policy.
            </p>
          </div>

          <section className="space-y-4">
            <h3 className="text-brand-gold text-h4">1. What Are Cookies?</h3>
            <p className="text-body">
              Cookies are small text files that are placed on your device (computer, tablet, or mobile) when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners. Cookies allow websites to recognize your device and remember information about your visit, such as your preferences and actions.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-brand-gold text-h4">2. How We Use Cookies</h3>
            <p className="text-body">
              We use cookies for the following purposes:
            </p>
            <div className="space-y-4">
              <h4 className="text-brand-gold text-h5">2.1 Essential Cookies</h4>
              <p className="text-body">
                These cookies are necessary for the website to function properly. They enable core functionality such as:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-body">
                <li>Remembering items in your shopping cart</li>
                <li>Maintaining your session while browsing</li>
                <li>Processing payments securely</li>
                <li>Remembering your login status</li>
                <li>Ensuring website security</li>
              </ul>
              <p className="text-body">
                These cookies cannot be disabled as they are essential for the website to function.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-brand-gold text-h5">2.2 Performance and Analytics Cookies</h4>
              <p className="text-body">
                These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. They allow us to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-body">
                <li>Count visitors and track page views</li>
                <li>Understand which pages are most popular</li>
                <li>Identify how users navigate through the site</li>
                <li>Measure the effectiveness of our marketing campaigns</li>
                <li>Improve website performance and user experience</li>
              </ul>
              <p className="text-body">
                We may use services like Google Analytics for this purpose. These cookies do not collect personally identifiable information.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-brand-gold text-h5">2.3 Functionality Cookies</h4>
              <p className="text-body">
                These cookies enable enhanced functionality and personalization. They remember:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-body">
                <li>Your language preferences</li>
                <li>Your region or location settings</li>
                <li>Your previous interactions with the website</li>
                <li>Information you&apos;ve entered in forms (so you don&apos;t have to re-enter it)</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-brand-gold text-h5">2.4 Marketing and Advertising Cookies</h4>
              <p className="text-body">
                These cookies are used to deliver relevant advertisements and track the effectiveness of our marketing efforts. They may:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-body">
                <li>Track your browsing habits across different websites</li>
                <li>Build a profile of your interests</li>
                <li>Show you personalized advertisements</li>
                <li>Measure the effectiveness of advertising campaigns</li>
              </ul>
              <p className="text-body">
                These cookies may be set by third-party advertising networks with our permission.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-brand-gold text-h4">3. Types of Cookies We Use</h3>
            <div className="space-y-4">
              <h4 className="text-brand-gold text-h5">3.1 First-Party Cookies</h4>
              <p className="text-body">
                These are cookies set directly by our website. They are used to remember your preferences and provide essential website functionality.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-brand-gold text-h5">3.2 Third-Party Cookies</h4>
              <p className="text-body">
                These are cookies set by third-party services that appear on our website. Examples include:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-body">
                <li><strong>Google Analytics:</strong> For website analytics and performance measurement</li>
                <li><strong>Payment Processors:</strong> For secure payment processing</li>
                <li><strong>Social Media Platforms:</strong> For social sharing functionality</li>
                <li><strong>Advertising Networks:</strong> For targeted advertising (if applicable)</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-brand-gold text-h5">3.3 Session Cookies</h4>
              <p className="text-body">
                These cookies are temporary and are deleted when you close your browser. They are used to maintain your session while browsing our website.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-brand-gold text-h5">3.4 Persistent Cookies</h4>
              <p className="text-body">
                These cookies remain on your device for a set period or until you delete them. They remember your preferences and actions across multiple visits to our website.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-brand-gold text-h4">4. Managing Your Cookie Preferences</h3>
            <div className="space-y-4">
              <h4 className="text-brand-gold text-h5">4.1 Browser Settings</h4>
              <p className="text-body">
                Most web browsers allow you to control cookies through their settings. You can:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-body">
                <li>View what cookies are stored on your device</li>
                <li>Delete cookies</li>
                <li>Block cookies from specific websites</li>
                <li>Block all cookies</li>
                <li>Delete all cookies when you close your browser</li>
              </ul>
              <p className="text-body">
                <strong>Important:</strong> Blocking or deleting cookies may impact your ability to use certain features of our website, such as:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-body">
                <li>Adding items to your shopping cart</li>
                <li>Completing purchases</li>
                <li>Accessing your account</li>
                <li>Remembering your preferences</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-brand-gold text-h5">4.2 Browser-Specific Instructions</h4>
              <p className="text-body">
                To manage cookies in your browser, follow these links:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-body">
                <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80">Google Chrome</a></li>
                <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80">Mozilla Firefox</a></li>
                <li><a href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80">Safari</a></li>
                <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2d9460b0c0f4" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80">Microsoft Edge</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-brand-gold text-h5">4.3 Cookie Consent Banner</h4>
              <p className="text-body">
                When you first visit our website, you may see a cookie consent banner. You can use this banner to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-body">
                <li>Accept all cookies</li>
                <li>Reject non-essential cookies</li>
                <li>Customize your cookie preferences</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-brand-gold text-h5">4.4 Third-Party Opt-Out</h4>
              <p className="text-body">
                You can opt out of certain third-party cookies:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-body">
                <li><strong>Google Analytics:</strong> <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80">Google Analytics Opt-out</a></li>
                <li><strong>Advertising Networks:</strong> Visit <a href="http://www.youronlinechoices.com" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80">Your Online Choices</a> or <a href="http://www.aboutads.info/choices" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80">About Ads</a> to opt out of interest-based advertising</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-brand-gold text-h4">5. Cookies We Use</h3>
            <div className="space-y-3">
              <p className="text-body">
                Below is a list of the main cookies we use on our website:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border border-brand-green text-body">
                  <thead>
                    <tr className="bg-brand-light-green">
                      <th className="border border-brand-green p-3 text-left">Cookie Name</th>
                      <th className="border border-brand-green p-3 text-left">Purpose</th>
                      <th className="border border-brand-green p-3 text-left">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-brand-green p-3">session_id</td>
                      <td className="border border-brand-green p-3">Maintains your session while browsing</td>
                      <td className="border border-brand-green p-3">Session</td>
                    </tr>
                    <tr>
                      <td className="border border-brand-green p-3">cart_items</td>
                      <td className="border border-brand-green p-3">Remembers items in your shopping cart</td>
                      <td className="border border-brand-green p-3">30 days</td>
                    </tr>
                    <tr>
                      <td className="border border-brand-green p-3">user_preferences</td>
                      <td className="border border-brand-green p-3">Stores your website preferences</td>
                      <td className="border border-brand-green p-3">1 year</td>
                    </tr>
                    <tr>
                      <td className="border border-brand-green p-3">_ga (Google Analytics)</td>
                      <td className="border border-brand-green p-3">Website analytics and performance</td>
                      <td className="border border-brand-green p-3">2 years</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-brand-gold text-h4">6. Updates to This Policy</h3>
            <p className="text-body">
              We may update this Cookies Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. We will notify you of any material changes by posting the updated policy on this page and updating the &quot;Last Updated&quot; date. We encourage you to review this policy periodically.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-brand-gold text-h4">7. Contact Us</h3>
            <p className="text-body">
              If you have questions about our use of cookies or this Cookies Policy, please contact us:
            </p>
            <div className="ml-4 space-y-2 text-body">
              <p><strong>Email:</strong> <a href="mailto:hello@ohwhatagift.com" className="underline hover:opacity-80">hello@ohwhatagift.com</a></p>
              <p><strong>Subject Line:</strong> Cookies Policy Inquiry</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
