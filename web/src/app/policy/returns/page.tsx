import { PolicyPage, PolicySection } from "@/components/PolicyPage";
import { SUPPORT_EMAIL } from "@/lib/config";

export default function ReturnsPolicyPage() {
  return (
    <PolicyPage title="Return & Exchange Policy">
      <PolicySection title="Exchange window">
        <p>
          We offer a 7-day exchange window from the date of delivery. If the fit or
          size isn&rsquo;t right, reach out within 7 days and we&rsquo;ll help you
          exchange it.
        </p>
      </PolicySection>

      <PolicySection title="Conditions">
        <p>To be eligible for an exchange, items must be:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Unused, unwashed, and in their original condition</li>
          <li>With all original tags and packaging intact</li>
        </ul>
      </PolicySection>

      <PolicySection title="How to request an exchange">
        <p>
          Contact us at{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="font-bold text-brand-gold hover:underline">{SUPPORT_EMAIL}</a>{" "}
          or via WhatsApp with your order details, and we&rsquo;ll guide you through
          the next steps.
        </p>
      </PolicySection>

      <PolicySection title="Damaged or incorrect items">
        <p>
          If you receive a damaged or incorrect item, let us know within 48 hours of
          delivery with a photo — we&rsquo;ll replace it at no extra cost.
        </p>
      </PolicySection>

      <PolicySection title="Refunds">
        <p>
          As orders are currently confirmed via Cash on Delivery, refunds for
          returned items are handled as a direct exchange or bank transfer, on a
          case-by-case basis — we&rsquo;ll confirm the best option with you directly.
        </p>
      </PolicySection>
    </PolicyPage>
  );
}
