/**
 * "Hedgerow Horizon" — the site-wide atmospheric backdrop. A hand-built SVG
 * illustration (gradient wash + layered hills + scattered botanical sprigs),
 * fixed behind all page content, with a gentle drift animation and a canvas-
 * tinted overlay (see globals.css) for text contrast. Purely decorative.
 */
export function SiteBackground() {
  return (
    <div className="site-bg" aria-hidden="true">
      <div className="site-bg__art">
        <svg
          viewBox="0 0 1440 1024"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
        >
          <defs>
            <linearGradient id="bg-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FBEBD2" />
              <stop offset="100%" stopColor="#E4EFE7" />
            </linearGradient>
            <filter id="bg-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="60" />
            </filter>

            <symbol id="bg-leaf" viewBox="0 0 40 40">
              <path
                d="M2 34 C10 20 18 8 34 4 C30 16 24 26 12 34 C9 35 5 35 2 34 Z"
                fill="none"
              />
              <path d="M4 32 C14 22 22 14 32 6" />
            </symbol>
            <symbol id="bg-fern" viewBox="0 0 40 40">
              <path d="M20 38 L20 4" fill="none" />
              <path d="M20 8 L8 2 M20 8 L32 2 M20 16 L9 11 M20 16 L31 11 M20 24 L10 20 M20 24 L30 20" />
            </symbol>
            <symbol id="bg-berry" viewBox="0 0 40 40">
              <path d="M4 36 C12 24 20 14 34 6" fill="none" />
              <circle cx="12" cy="27" r="2.4" />
              <circle cx="19" cy="19" r="2.4" />
              <circle cx="27" cy="11" r="2.4" />
            </symbol>
          </defs>

          {/* base sky-meadow wash */}
          <rect x="0" y="0" width="1440" height="1024" fill="url(#bg-sky)" />

          {/* soft warm glow, abstract */}
          <circle
            cx="1100"
            cy="160"
            r="250"
            fill="#E39A3B"
            opacity="0.18"
            filter="url(#bg-glow)"
          />

          {/* back hill */}
          <path
            d="M0 680 C 220 630, 420 720, 680 660 C 940 600, 1180 700, 1440 650 L1440 1024 L0 1024 Z"
            fill="#E4EFE7"
            opacity="0.55"
          />
          {/* mid hill */}
          <path
            d="M0 800 C 260 740, 520 830, 780 770 C 1040 710, 1220 810, 1440 760 L1440 1024 L0 1024 Z"
            fill="#2F5D45"
            opacity="0.28"
          />
          {/* foreground band */}
          <path
            d="M0 900 C 300 870, 620 930, 960 890 C 1180 865, 1320 900, 1440 880 L1440 1024 L0 1024 Z"
            fill="#2F5D45"
            opacity="0.2"
          />

          {/* scattered botanical sprigs — upper two-thirds, sparse texture */}
          <g stroke="#2F5D45" strokeWidth="1.6" opacity="0.12" strokeLinecap="round">
            <use href="#bg-leaf" x="80" y="60" width="46" height="46" />
            <use href="#bg-fern" x="220" y="140" width="34" height="34" transform="rotate(8 237 157)" />
            <use href="#bg-berry" x="360" y="40" width="40" height="40" />
            <use href="#bg-leaf" x="520" y="180" width="30" height="30" transform="rotate(-12 535 195)" />
            <use href="#bg-fern" x="640" y="70" width="42" height="42" />
            <use href="#bg-berry" x="780" y="150" width="34" height="34" transform="rotate(6 797 167)" />
            <use href="#bg-leaf" x="900" y="60" width="38" height="38" transform="rotate(14 919 79)" />
            <use href="#bg-fern" x="1020" y="180" width="30" height="30" />
            <use href="#bg-berry" x="1150" y="90" width="36" height="36" transform="rotate(-8 1168 108)" />
            <use href="#bg-leaf" x="1280" y="200" width="42" height="42" />
            <use href="#bg-fern" x="160" y="260" width="28" height="28" />
            <use href="#bg-leaf" x="1000" y="280" width="32" height="32" transform="rotate(20 1016 296)" />
          </g>
        </svg>
      </div>
    </div>
  );
}
