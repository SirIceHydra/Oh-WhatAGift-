import HeaderSecondary from '@/components/layout/header-secondary';

export default function ShippingPolicyPage() {
  return (
    <div className="w-full min-h-screen bg-brand-cream">
      <HeaderSecondary />
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-brand-gold mb-8 text-center text-[38.4px]">
          SHIPPING POLICY
        </h2>
        <div className="max-w-4xl mx-auto space-y-8 text-brand-green">
          <div className="space-y-4">
            <p className="text-body">
              <strong>Last Updated:</strong> January 2025
            </p>
            <p className="text-body">
              At Oh! What a Gift!, we are committed to delivering your carefully crafted, personalized items safely and efficiently. This Shipping Policy outlines our shipping methods, delivery times, costs, and what to expect when you place an order with us.
            </p>
          </div>

          <section className="space-y-4">
            <h3 className="text-brand-gold text-h4">1. Processing Time</h3>
            <div className="space-y-3">
              <p className="text-body">
                <strong>Standard Items:</strong> Orders for non-personalized items are typically processed and dispatched within 1-3 business days (Monday through Friday, excluding public holidays).
              </p>
              <p className="text-body">
                <strong>Personalized Items:</strong> Orders requiring custom embroidery or personalization require additional processing time. Please allow 5-10 business days for production before shipping. Complex customizations may take longer, and we will notify you if there are any delays.
              </p>
              <p className="text-body">
                <strong>Bulk/Corporate Orders:</strong> Large orders or corporate purchases may require extended processing times. We will provide a specific timeline when you place your order.
              </p>
              <p className="text-body">
                Processing time begins once payment is confirmed and any required personalization details are received and approved.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-brand-gold text-h4">2. Shipping Methods and Delivery Times</h3>
            <div className="space-y-4">
              <h4 className="text-brand-gold text-h5">2.1 Domestic Shipping (South Africa)</h4>
              <ul className="list-disc list-inside space-y-2 ml-4 text-body">
                <li><strong>Standard Shipping:</strong> 3-7 business days from dispatch</li>
                <li><strong>Express Shipping:</strong> 1-3 business days from dispatch (available at checkout for an additional fee)</li>
                <li><strong>Free Shipping:</strong> Available on orders over R1,500 (standard shipping only)</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-brand-gold text-h5">2.2 International Shipping</h4>
              <p className="text-body">
                We currently offer international shipping to select countries. Delivery times vary by destination:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-body">
                <li><strong>Regional (SADC countries):</strong> 7-14 business days</li>
                <li><strong>International (other countries):</strong> 10-21 business days</li>
              </ul>
              <p className="text-body">
                International orders may be subject to customs duties, taxes, and fees, which are the responsibility of the recipient. We recommend checking with your local customs office for more information.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-brand-gold text-h4">3. Shipping Costs</h3>
            <div className="space-y-3">
              <p className="text-body">
                Shipping costs are calculated at checkout based on:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-body">
                <li>Order weight and dimensions</li>
                <li>Delivery destination</li>
                <li>Selected shipping method</li>
              </ul>
              <p className="text-body">
                <strong>Free Shipping:</strong> Orders over R1,500 qualify for free standard domestic shipping. This offer applies automatically at checkout and cannot be combined with other promotional offers unless stated otherwise.
              </p>
              <p className="text-body">
                Shipping costs are non-refundable unless the item arrives damaged or incorrect due to our error.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-brand-gold text-h4">4. Order Tracking</h3>
            <div className="space-y-3">
              <p className="text-body">
                Once your order has been dispatched, you will receive a shipping confirmation email containing:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-body">
                <li>Tracking number</li>
                <li>Carrier information</li>
                <li>Estimated delivery date</li>
                <li>Link to track your package online</li>
              </ul>
              <p className="text-body">
                You can track your order status by:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-body">
                <li>Clicking the tracking link in your confirmation email</li>
                <li>Logging into your account (if you created one)</li>
                <li>Contacting us at <a href="mailto:hello@ohwhatagift.com" className="underline hover:opacity-80">hello@ohwhatagift.com</a> with your order number</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-brand-gold text-h4">5. Delivery Address</h3>
            <div className="space-y-3">
              <p className="text-body">
                Please ensure your delivery address is accurate and complete. We are not responsible for delays or failed deliveries due to incorrect or incomplete addresses provided at checkout.
              </p>
              <p className="text-body">
                <strong>Address Changes:</strong> If you need to change your delivery address, please contact us immediately at <a href="mailto:hello@ohwhatagift.com" className="underline hover:opacity-80">hello@ohwhatagift.com</a>. We can only modify the address if your order has not yet been dispatched. Address changes after dispatch may incur additional fees.
              </p>
              <p className="text-body">
                <strong>P.O. Boxes:</strong> We can deliver to P.O. Boxes for standard shipping. Express shipping may require a physical address.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-brand-gold text-h4">6. Delivery Issues</h3>
            <div className="space-y-4">
              <h4 className="text-brand-gold text-h5">6.1 Failed Delivery Attempts</h4>
              <p className="text-body">
                If delivery is attempted but unsuccessful (e.g., no one available to receive the package), the carrier will typically:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-body">
                <li>Leave a notification card with instructions</li>
                <li>Attempt redelivery (number of attempts varies by carrier)</li>
                <li>Hold the package at a local depot for collection</li>
              </ul>
              <p className="text-body">
                Packages not collected within the carrier&apos;s holding period may be returned to us, and additional shipping fees may apply for redelivery.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-brand-gold text-h5">6.2 Lost or Stolen Packages</h4>
              <p className="text-body">
                If your package is lost or stolen after delivery confirmation, please contact us immediately. We will investigate with the carrier and work to resolve the issue. We are not responsible for packages that are confirmed as delivered but are subsequently lost or stolen from the delivery location.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-brand-gold text-h5">6.3 Damaged Packages</h4>
              <p className="text-body">
                If your order arrives damaged, please:
              </p>
              <ol className="list-decimal list-inside space-y-2 ml-4 text-body">
                <li>Take photos of the damaged package and items</li>
                <li>Contact us within 48 hours of delivery at <a href="mailto:hello@ohwhatagift.com" className="underline hover:opacity-80">hello@ohwhatagift.com</a></li>
                <li>Include your order number and photos in your email</li>
              </ol>
              <p className="text-body">
                We will arrange for a replacement or refund as appropriate.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-brand-gold text-h4">7. Special Circumstances</h3>
            <div className="space-y-3">
              <p className="text-body">
                <strong>Holiday Periods:</strong> During peak shopping seasons (e.g., Christmas, Valentine&apos;s Day), processing and delivery times may be extended. We recommend placing orders well in advance.
              </p>
              <p className="text-body">
                <strong>Weather Delays:</strong> Extreme weather conditions may cause delivery delays. We will notify you if we become aware of significant delays.
              </p>
              <p className="text-body">
                <strong>Customs Delays:</strong> International orders may experience delays at customs. These delays are beyond our control, and we cannot guarantee delivery times for international shipments.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-brand-gold text-h4">8. Contact Us</h3>
            <p className="text-body">
              If you have questions about shipping, need to update your delivery address, or are experiencing delivery issues, please contact us:
            </p>
            <div className="ml-4 space-y-2 text-body">
              <p><strong>Email:</strong> <a href="mailto:hello@ohwhatagift.com" className="underline hover:opacity-80">hello@ohwhatagift.com</a></p>
              <p><strong>Subject Line:</strong> Shipping Inquiry - [Your Order Number]</p>
            </div>
            <p className="text-body">
              We aim to respond to all shipping inquiries within 24-48 hours during business days.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
