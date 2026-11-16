const items = [
  {
    title: "Free shipping",
    text: "On orders over $100",
    path: "M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z",
  },
  {
    title: "Free returns",
    text: "Within 30 days",
    path: "M4 9h11a5 5 0 0 1 0 10H8M4 9l4-4M4 9l4 4",
  },
  {
    title: "Secure checkout",
    text: "Payments by Stripe",
    path: "M6 10V8a6 6 0 0 1 12 0v2M5 10h14v10H5zM12 14v2",
  },
  {
    title: "Premium quality",
    text: "Made to last",
    path: "M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z",
  },
];

export default function TrustBar() {
  return (
    <section className="border-y border-line">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-8 px-4 py-10 sm:px-6 md:grid-cols-4">
        {items.map((i) => (
          <div key={i.title} className="flex flex-col items-center gap-3 text-center">
            <svg viewBox="0 0 24 24" className="size-6 fill-none stroke-current" strokeWidth="1.3" aria-hidden>
              <path d={i.path} strokeLinejoin="round" strokeLinecap="round" />
            </svg>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em]">{i.title}</p>
              <p className="mt-1 text-xs text-muted">{i.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
