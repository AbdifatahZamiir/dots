// The D•TS wordmark: the "O" is a solid dot.
// `ripple` sends slow rings outward from the dot (used in the hero).
export default function Logo({
  size = "text-xl",
  tagline = false,
  align = "center",
  ripple = false,
}: {
  size?: string;
  tagline?: boolean;
  align?: "center" | "start";
  ripple?: boolean;
}) {
  return (
    <span
      className={`inline-flex flex-col leading-none ${size} ${
        align === "center" ? "items-center" : "items-start"
      }`}
    >
      <span className="flex items-center font-normal tracking-[0.4em]" aria-label="DOTS">
        D
        <span
          className="relative mr-[0.4em] inline-block size-[0.66em] rounded-full bg-current"
          aria-hidden
        >
          {ripple &&
            [0, 2, 4].map((delay) => (
              <span
                key={delay}
                className="anim pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-current opacity-0"
                style={{ animation: `ripple 6s cubic-bezier(.2,.6,.3,1) ${delay}s infinite` }}
              />
            ))}
        </span>
        T<span className="-mr-[0.4em]">S</span>
      </span>
      {tagline && (
        <span className="mt-[1em] pl-[0.35em] text-[0.15em] font-medium uppercase tracking-[0.5em]">
          Premium Clothing
        </span>
      )}
    </span>
  );
}
