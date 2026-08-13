const MESSAGES = [
  "New Season Drop — Fresh Styles Every Week",
  "Free Shipping On Orders Above ₹999",
  "Customer Support: Mon–Sat, 10:30 AM – 6:30 PM",
];

export function AnnouncementBar() {
  const track = [...MESSAGES, ...MESSAGES];

  return (
    <div className="overflow-hidden bg-brand-navy text-white text-xs tracking-wide">
      <div className="flex w-max animate-[marquee_22s_linear_infinite] py-2">
        {track.map((message, index) => (
          <span key={index} className="flex items-center whitespace-nowrap">
            {message}
            <span className="mx-8 text-brand-gold">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
