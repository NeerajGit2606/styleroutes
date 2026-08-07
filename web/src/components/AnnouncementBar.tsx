const MESSAGES = [
  "New Season Drop — Fresh Styles Every Week",
  "Free Shipping On Orders Above ₹999",
  "Customer Support: Mon–Sat, 10:30 AM – 6:30 PM",
];

export function AnnouncementBar() {
  return (
    <div className="bg-black text-white text-xs tracking-wide">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-8 overflow-x-auto px-4 py-2">
        {MESSAGES.map((message) => (
          <span key={message} className="whitespace-nowrap">
            {message}
          </span>
        ))}
      </div>
    </div>
  );
}
