import { PolicyPage, PolicySection } from "@/components/PolicyPage";
import { SUPPORT_EMAIL } from "@/lib/config";

export default function TermsPage() {
  return (
    <PolicyPage title="Terms & Conditions">
      <p>
        By browsing or placing an order on this website, you agree to the terms
        below. Please read them before shopping with us.
      </p>

      <PolicySection title="Orders">
        <p>
          Placing an order through this site sends your order details to us over
          WhatsApp for confirmation — it is not automatically accepted until we
          confirm availability and delivery details with you.
        </p>
      </PolicySection>

      <PolicySection title="Pricing & product information">
        <p>
          We try to keep prices, descriptions, and images as accurate as possible,
          but errors can happen. Prices and availability are subject to change
          without notice, and we&rsquo;ll always confirm final pricing with you
          before your order is dispatched.
        </p>
      </PolicySection>

      <PolicySection title="Intellectual property">
        <p>
          All text, images, and branding on this site belong to StyleRoute unless
          stated otherwise, and may not be reused without our permission.
        </p>
      </PolicySection>

      <PolicySection title="Limitation of liability">
        <p>
          We work to keep this site accurate and available, but we don&rsquo;t
          guarantee it will always be error-free or uninterrupted, and we aren&rsquo;t
          liable for indirect losses arising from its use.
        </p>
      </PolicySection>

      <PolicySection title="Governing law">
        <p>These terms are governed by the laws of India.</p>
      </PolicySection>

      <PolicySection title="Questions">
        <p>
          Reach out to us at{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="font-bold text-brand-gold hover:underline">{SUPPORT_EMAIL}</a>{" "}
          for anything not covered here.
        </p>
      </PolicySection>
    </PolicyPage>
  );
}
