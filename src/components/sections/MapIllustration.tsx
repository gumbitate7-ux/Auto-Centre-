/**
 * Stylised, dependency-free map panel. Replace with a Google Maps embed
 * (iframe) once the workshop address is confirmed.
 */
export function MapIllustration() {
  return (
    <div className="map" role="img" aria-label="Map showing the workshop location (illustrative)">
      <svg viewBox="0 0 800 640" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="800" height="640" fill="#e4e6e8" />

        {/* city blocks */}
        <g fill="#eceef0" transform="rotate(-14 400 320)">
          {Array.from({ length: 9 }).flatMap((_, row) =>
            Array.from({ length: 11 }).map((__, col) => {
              const x = -120 + col * 98 + (row % 2) * 14
              const y = -120 + row * 104
              const w = 78 - ((row * 7 + col * 3) % 4) * 6
              const h = 82 - ((row * 5 + col) % 3) * 8
              return <rect key={`${row}-${col}`} x={x} y={y} width={w} height={h} rx="5" />
            }),
          )}
        </g>

        {/* park */}
        <path d="M528 64c58-14 120 4 150 44s22 96-20 122-112 20-148-12-40-140 18-154Z" fill="#dde3dc" />
        <path d="M92 470c40-22 98-18 126 12s20 78-22 98-104 14-124-18-20-70 20-92Z" fill="#dde3dc" />

        {/* minor roads */}
        <g stroke="#f6f7f8" strokeWidth="7" fill="none" strokeLinecap="round" transform="rotate(-14 400 320)">
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={`v${i}`} x1={-40 + i * 98} y1="-140" x2={-40 + i * 98} y2="800" />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={`h${i}`} x1="-160" y1={-30 + i * 104} x2="960" y2={-30 + i * 104} />
          ))}
        </g>

        {/* arterial roads */}
        <g fill="none" strokeLinecap="round">
          <path d="M-20 420C160 380 300 360 420 300S640 160 840 140" stroke="#d3d6d9" strokeWidth="22" />
          <path d="M-20 420C160 380 300 360 420 300S640 160 840 140" stroke="#ffffff" strokeWidth="17" />
          <path d="M250 -20C268 140 300 300 340 420S420 600 440 660" stroke="#d3d6d9" strokeWidth="18" />
          <path d="M250 -20C268 140 300 300 340 420S420 600 440 660" stroke="#ffffff" strokeWidth="13" />
          {/* highway */}
          <path d="M-20 140C200 170 420 230 600 380S760 600 820 660" stroke="#dcd6ca" strokeWidth="26" />
          <path d="M-20 140C200 170 420 230 600 380S760 600 820 660" stroke="#f3efe7" strokeWidth="20" />
          <path
            d="M-20 140C200 170 420 230 600 380S760 600 820 660"
            stroke="#e1dbcf"
            strokeWidth="1.5"
            strokeDasharray="10 12"
          />
        </g>
      </svg>

      <span className="map__pin" aria-hidden="true">
        <span className="map__pulse" />
        <svg width="44" height="54" viewBox="0 0 44 54">
          <path
            d="M22 53s19-17.6 19-31A19 19 0 0 0 3 22c0 13.4 19 31 19 31Z"
            fill="#25282b"
            stroke="#ffffff"
            strokeWidth="2"
          />
          <text
            x="22"
            y="27.5"
            textAnchor="middle"
            fill="#ffffff"
            fontFamily="Archivo Variable, sans-serif"
            fontSize="13"
            fontWeight="700"
            style={{ fontStretch: '125%' }}
          >
            D
          </text>
        </svg>
      </span>
      <span className="map__badge">Illustrative map</span>
    </div>
  )
}
