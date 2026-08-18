import { PolicyPage, PolicySection } from "@/components/PolicyPage";
import { SUPPORT_EMAIL } from "@/lib/config";

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage title="Privacy Policy">
      <p>
        StyleRoute (&ldquo;we&rdquo;, &ldquo;us&rdquo;) respects your privacy. This
        policy explains what information we collect when you use this website, and
        how we use it.
      </p>

      <PolicySection title="Information we collect">
        <p>We collect information you give us directly, such as:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Your name, phone number, and delivery address, when you place an order at checkout</li>
          <li>Your name, email, and message, if you contact us through the contact form</li>
        </ul>
        <p>
          Your cart and wishlist are stored locally in your own browser and are not
          sent to our servers until you place an order.
        </p>
      </PolicySection>

      <PolicySection title="How we use your information">
        <p>We use the information you provide to:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Confirm and fulfil your order, and coordinate delivery with you over WhatsApp</li>
          <li>Respond to questions sent through the contact form</li>
        </ul>
        <p>We do not sell or rent your personal information to third parties.</p>
      </PolicySection>

      <PolicySection title="Third-party services">
        <p>
          When you place an order, your order details are shared with our team via
          WhatsApp to confirm delivery — WhatsApp&rsquo;s own privacy policy applies
          to that conversation.
        </p>
      </PolicySection>

      <PolicySection title="Your rights">
        <p>
          You can ask us to review, correct, or delete any personal information we
          hold about you by writing to us at{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="font-bold text-brand-gold hover:underline">{SUPPORT_EMAIL}</a>.
        </p>
      </PolicySection>
    </PolicyPage>
  );
}
