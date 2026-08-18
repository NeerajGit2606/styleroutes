import { Clock, Mail, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <p className="text-xs font-bold tracking-[.2em] text-brand-gold">GET IN TOUCH</p>
      <h1 className="mt-2 text-3xl font-black uppercase tracking-[-.04em]">Contact us</h1>
      <p className="mt-3 max-w-md text-neutral-600">Questions about an order, sizing, or anything else — we&rsquo;re happy to help.</p>

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <Mail size={20} className="mt-1 shrink-0 text-brand-gold" />
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">Email</p>
              <a href="mailto:contact@styleroute.co.in" className="mt-1 block font-bold hover:text-brand-gold">contact@styleroute.co.in</a>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Clock size={20} className="mt-1 shrink-0 text-brand-gold" />
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">Support hours</p>
              <p className="mt-1 font-bold">Mon–Sat, 10:30 AM – 6:30 PM</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <MapPin size={20} className="mt-1 shrink-0 text-brand-gold" />
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">Based in</p>
              <p className="mt-1 font-bold">India</p>
            </div>
          </div>
        </div>

        <form className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-neutral-500">Name</label>
            <input type="text" className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-neutral-500">Email</label>
            <input type="email" className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-neutral-500">Message</label>
            <textarea rows={4} className="w-full border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black" />
          </div>
          <button type="submit" className="w-full bg-black py-4 text-sm font-black uppercase tracking-wider text-white hover:bg-neutral-800">
            Send message
          </button>
          <p className="text-xs text-neutral-500">For now, please reach us directly by email — this form will be connected soon.</p>
        </form>
      </div>
    </div>
  );
}
