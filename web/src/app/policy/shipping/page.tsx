import { PolicyPage, PolicySection } from "@/components/PolicyPage";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE, money } from "@/lib/products";

export default function ShippingPolicyPage() {
  return (
    <PolicyPage title="Shipping Policy">
      <PolicySection title="Delivery areas">
        <p>We currently ship across India.</p>
      </PolicySection>

      <PolicySection title="Processing & delivery time">
        <p>
          Orders are typically processed within 1-2 business days of confirmation.
          Delivery usually takes 3-7 business days depending on your location, once
          dispatched.
        </p>
      </PolicySection>

      <PolicySection title="Shipping charges">
        <p>
          Free shipping on orders above {money(FREE_SHIPPING_THRESHOLD)}. A flat
          shipping fee of {money(SHIPPING_FEE)} applies to orders below that.
        </p>
      </PolicySection>

      <PolicySection title="Order updates">
        <p>
          We&rsquo;ll keep you updated on your order and delivery status over
          WhatsApp, using the phone number you provide at checkout.
        </p>
      </PolicySection>

      <PolicySection title="Delays">
        <p>
          Occasionally, deliveries may be delayed due to weather, courier
          disruptions, or other events outside our control — we&rsquo;ll let you
          know as soon as we&rsquo;re aware of any delay.
        </p>
      </PolicySection>
    </PolicyPage>
  );
}
