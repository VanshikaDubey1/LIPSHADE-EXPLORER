export default function LipstickIcon() {
  return (
    <div className="pulse-spin w-24 h-24 flex items-center justify-center">
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="lipstick-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(349 75% 68%)" />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g style={{ filter: 'url(#glow)' }}>
          <path d="M47.5 10L32.5 25L40 32.5L55 17.5L47.5 10Z" fill="url(#lipstick-gradient)" />
          <rect x="30" y="30" width="20" height="40" rx="5" fill="hsl(var(--accent))" />
          <rect x="25" y="25" width="30" height="10" rx="3" fill="hsl(var(--accent) / 0.6)" />
        </g>
      </svg>
    </div>
  );
}
