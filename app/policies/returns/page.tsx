import Header from '@/components/layout/header';
import HeaderSecondary from '@/components/layout/header-secondary';

export default function ReturnsPolicyPage() {
  return (
    <div className="w-full min-h-screen bg-brand-cream">
      {/* Show HeaderSecondary on mobile, Header on desktop */}
      <div className="md:hidden">
        <HeaderSecondary />
      </div>
      <div className="hidden md:block">
        <Header />
      </div>
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-brand-gold mb-8 text-center text-[38.4px]">
          RETURNS & EXCHANGES POLICY
        </h2>
        <div className="max-w-4xl mx-auto space-y-8 text-brand-green">
          <div className="space-y-4">
            <p className="text-body">
              <strong>Last Updated:</strong> January 2025
            </p>
            <p className="text-body">
              At Oh! What a Gift!, we want you to be completely satisfied with your purchase. This Returns & Exchanges Policy explains your rights and our process for returns, exchanges, and refunds.
            </p>
          </div>

          <section className="space-y-4">
            <h3 className="text-brand-gold text-h4">1. Returns Eligibility</h3>
            <div className="space-y-4">
              <h4 className="text-brand-gold text-h5">1.1 Non-Personalized Items</h4>
              <p className="text-body">
                Non-personalized items may be returned within 14 days of delivery, provided they are:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-body">
                <li>Unused and in original condition</li>
                <li>In original packaging with all tags and labels attached</li>
                <li>Not damaged, soiled, or altered in any way</li>
                <li>Accompanied by proof of purchase (order confirmation or receipt)</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-brand-gold text-h5">1.2 Personalized/Customized Items</h4>
              <p className="text-body">
                Due to the personalized nature of custom embroidery and personalized items, these products are generally <strong>not eligible for return or exchange</strong> unless:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-body">
                <li>The item is defective or damaged upon arrival</li>
                <li>The personalization was completed incorrectly (e.g., wrong name, misspelling, wrong design)</li>
                <li>The item received does not match what was ordered</li>
                <li>There was an error on our part in fulfilling the order</li>
              </ul>
              <p className="text-body">
                If you believe your personalized item qualifies for return under these circumstances, please contact us immediately.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-brand-gold text-h5">1.3 Non-Returnable Items</h4>
              <p className="text-body">
                The following items cannot be returned:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-body">
                <li>Personalized items (unless defective or incorrectly personalized as described above)</li>
                <li>Items that have been used, washed, or damaged after delivery</li>
                <li>Items without proof of purchase</li>
                <li>Items returned after the 14-day return period</li>
                <li>Sale or clearance items (unless defective)</li>
                <li>Gift cards or digital products</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-brand-gold text-h4">2. How to Initiate a Return</h3>
            <div className="space-y-3">
              <p className="text-body">
                To initiate a return or exchange, please follow these steps:
              </p>
              <ol className="list-decimal list-inside space-y-3 ml-4 text-body">
                <li>
                  <strong>Contact Us:</strong> Email us at <a href="mailto:hello@ohwhatagift.com" className="underline hover:opacity-80">hello@ohwhatagift.com</a> within 14 days of delivery with:
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>Your order number</li>
                    <li>Item(s) you wish to return</li>
                    <li>Reason for return</li>
                    <li>Photos (if applicable, especially for damaged or defective items)</li>
                  </ul>
                </li>
                <li>
                  <strong>Receive Authorization:</strong> We will review your request and send you a Return Authorization (RA) number and return instructions within 2-3 business days.
                </li>
                <li>
                  <strong>Package Your Return:</strong> Securely package the item(s) in original packaging (if available) or appropriate protective packaging. Include the RA number clearly visible on the package.
                </li>
                <li>
                  <strong>Ship Your Return:</strong> Send the package to the address provided in your return instructions. We recommend using a trackable shipping method. You are responsible for return shipping costs unless the return is due to our error.
                </li>
                <li>
                  <strong>Processing:</strong> Once we receive and inspect your return, we will process your refund or exchange within 5-10 business days.
                </li>
              </ol>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-brand-gold text-h4">3. Refunds</h3>
            <div className="space-y-4">
              <h4 className="text-brand-gold text-h5">3.1 Refund Processing</h4>
              <p className="text-body">
                Refunds will be processed to the original payment method used for the purchase. Processing times vary by payment provider:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-body">
                <li><strong>Credit/Debit Cards:</strong> 5-10 business days after we process the refund</li>
                <li><strong>PayPal:</strong> 3-5 business days</li>
                <li><strong>Bank Transfer:</strong> 5-7 business days</li>
              </ul>
              <p className="text-body">
                You will receive an email confirmation once the refund has been processed.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-brand-gold text-h5">3.2 Refund Amount</h4>
              <p className="text-body">
                The refund amount will include:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-body">
                <li>The full item price (excluding original shipping costs, unless the return is due to our error)</li>
                <li>Original shipping costs (only if the return is due to our error, defective item, or incorrect item received)</li>
              </ul>
              <p className="text-body">
                <strong>Deductions:</strong> We may deduct amounts if:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-body">
                <li>The item is returned in a condition that reduces its value (e.g., damaged, used, missing tags)</li>
                <li>Return shipping costs (unless the return is due to our error)</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-brand-gold text-h4">4. Exchanges</h3>
            <div className="space-y-3">
              <p className="text-body">
                We offer exchanges for non-personalized items of equal or greater value, subject to availability. To request an exchange:
              </p>
              <ol className="list-decimal list-inside space-y-2 ml-4 text-body">
                <li>Follow the return process outlined above</li>
                <li>Specify in your return request that you would like an exchange and indicate the desired item(s)</li>
                <li>If the exchange item is of greater value, you will be charged the difference</li>
                <li>If the exchange item is of lesser value, you will receive a refund for the difference</li>
              </ol>
              <p className="text-body">
                <strong>Note:</strong> Exchanges for personalized items are only available if the personalization was completed incorrectly or the item is defective.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-brand-gold text-h4">5. Defective or Incorrect Items</h3>
            <div className="space-y-3">
              <p className="text-body">
                If you receive a defective item or an item that does not match your order, please contact us immediately. We will:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-body">
                <li>Arrange for a replacement or full refund at no cost to you</li>
                <li>Cover return shipping costs</li>
                <li>Process your request as a priority</li>
              </ul>
              <p className="text-body">
                Please provide photos of the defect or incorrect item to help us process your request quickly.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-brand-gold text-h4">6. Return Shipping</h3>
            <div className="space-y-3">
              <p className="text-body">
                <strong>Customer Responsibility:</strong> Unless the return is due to our error, defective item, or incorrect item, you are responsible for return shipping costs.
              </p>
              <p className="text-body">
                <strong>Our Responsibility:</strong> We cover return shipping costs if:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-body">
                <li>The item is defective or damaged</li>
                <li>You received the wrong item</li>
                <li>The personalization was completed incorrectly</li>
                <li>There was an error on our part</li>
              </ul>
              <p className="text-body">
                We recommend using a trackable shipping method for returns. We are not responsible for items lost in return transit.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-brand-gold text-h4">7. Late or Missing Refunds</h3>
            <div className="space-y-3">
              <p className="text-body">
                If you haven&apos;t received your refund within the expected timeframe:
              </p>
              <ol className="list-decimal list-inside space-y-2 ml-4 text-body">
                <li>Check your bank account or payment method statement</li>
                <li>Contact your bank or payment provider (processing times vary)</li>
                <li>Contact us at <a href="mailto:hello@ohwhatagift.com" className="underline hover:opacity-80">hello@ohwhatagift.com</a> with your order number and we will investigate</li>
              </ol>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-brand-gold text-h4">8. Contact Us</h3>
            <p className="text-body">
              For questions about returns, exchanges, or refunds, please contact us:
            </p>
            <div className="ml-4 space-y-2 text-body">
              <p><strong>Email:</strong> <a href="mailto:hello@ohwhatagift.com" className="underline hover:opacity-80">hello@ohwhatagift.com</a></p>
              <p><strong>Subject Line:</strong> Return Request - [Your Order Number]</p>
            </div>
            <p className="text-body">
              We aim to respond to all return inquiries within 24-48 hours during business days.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
