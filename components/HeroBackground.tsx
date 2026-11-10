// Decorative, animated layers behind the hero. Pure CSS/SVG — no JavaScript.
const lines = ["8%", "24%", "41%", "59%", "76%", "92%"];

const grain =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export default function HeroBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Soft breathing glow behind the logo */}
      <div
        className="anim absolute left-1/2 top-1/2 size-[60rem] rounded-full bg-[radial-gradient(circle,rgba(242,238,231,0.09),transparent_62%)]"
        style={{ animation: "breathe 9s ease-in-out infinite", transform: "translate(-50%,-50%)" }}
      />

      {/* Vertical hairlines with travelling light */}
      {lines.map((left, i) => (
        <div
          key={left}
          className="absolute top-0 h-full w-px overflow-hidden bg-cream/[0.06]"
          style={{ left }}
        >
          <span
            className="anim absolute left-0 top-0 h-1/3 w-px bg-gradient-to-b from-transparent via-cream/45 to-transparent"
            style={{ animation: `beam ${8 + (i % 3) * 2}s linear ${i * 1.4}s infinite` }}
          />
        </div>
      ))}

      {/* Horizontal hairline with a sweeping light */}
      <div className="absolute left-0 top-[72%] h-px w-full overflow-hidden bg-cream/[0.06]">
        <span
          className="anim absolute left-0 top-0 h-px w-1/4 bg-gradient-to-r from-transparent via-cream/40 to-transparent"
          style={{ animation: "sweep 11s linear 2s infinite" }}
        />
      </div>

      {/* Rotating rings: a ring of dots + a fine ring with an orbiting dot */}
      <div className="absolute left-1/2 top-1/2 size-[min(94vw,46rem)] -translate-x-1/2 -translate-y-1/2">
        <svg
          viewBox="0 0 100 100"
          className="anim absolute inset-0 size-full"
          style={{ animation: "spin 140s linear infinite" }}
        >
          <circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke="#f2eee7"
            strokeOpacity=".22"
            strokeWidth=".55"
            strokeLinecap="round"
            strokeDasharray="0 2.4"
          />
        </svg>
        <svg
          viewBox="0 0 100 100"
          className="anim absolute inset-0 size-full"
          style={{ animation: "spin 60s linear infinite reverse" }}
        >
          <circle
            cx="50"
            cy="50"
            r="49.5"
            fill="none"
            stroke="#f2eee7"
            strokeOpacity=".1"
            strokeWidth=".15"
          />
          <circle cx="50" cy=".5" r=".9" fill="#f2eee7" fillOpacity=".8" />
        </svg>
      </div>

      {/* Film grain + vignette for depth */}
      <div className="absolute inset-0 opacity-[0.07] mix-blend-overlay" style={{ backgroundImage: grain }} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.55))]" />
    </div>
  );
}
