/** Demo diagram for tutor replies (Ohm’s law — Sri Lanka OL style). */
export function OhmsLawDiagram() {
  return (
    <div className="mt-3 overflow-hidden rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50 to-white ring-1 ring-emerald-900/10">
      <div className="border-b border-emerald-900/10 bg-emerald-600/90 px-3 py-2 text-center text-xs font-bold uppercase tracking-wide text-white">
        Simple series circuit — Ohm&apos;s Law
      </div>
      <div className="p-4">
        <svg
          viewBox="0 0 360 200"
          className="mx-auto h-auto w-full max-w-md"
          aria-label="Diagram: battery, resistor, current direction, formula V equals I times R"
          role="img"
        >
          <defs>
            <marker
              id="ohms-arrowhead"
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="4"
              orient="auto"
            >
              <path d="M0,0 L8,4 L0,8 Z" fill="#047857" />
            </marker>
          </defs>

          {/* Wire loop */}
          <path
            d="M 40 100 L 120 100 L 120 60 L 260 60 L 260 140 L 120 140 L 120 100"
            fill="none"
            stroke="#065f46"
            strokeWidth="3"
          />

          {/* Battery */}
          <g transform="translate(22, 88)">
            <rect x="0" y="0" width="24" height="24" rx="3" fill="#ecfdf5" stroke="#059669" strokeWidth="2" />
          <text x="12" y="17" textAnchor="middle" fill="#064e3b" fontSize="11" fontWeight="700">
            +
          </text>
          </g>
          <text x="52" y="95" fill="#065f46" fontSize="10" fontWeight="600">
            V
          </text>

          {/* Resistor zigzag */}
          <path
            d="M 125 95 L 135 105 L 145 95 L 155 105 L 165 95 L 175 105 L 185 95"
            fill="none"
            stroke="#059669"
            strokeWidth="2.5"
          />
          <text x="152" y="130" textAnchor="middle" fill="#064e3b" fontSize="10" fontWeight="700">
            R (Ω)
          </text>

          {/* Current arrow */}
          <path
            d="M 200 72 L 235 72"
            fill="none"
            stroke="#059669"
            strokeWidth="2"
            markerEnd="url(#ohms-arrowhead)"
          />
          <text x="212" y="66" textAnchor="middle" fill="#065f46" fontSize="10" fontWeight="600">
            I (A)
          </text>

          {/* Formula box */}
          <rect
            x="215"
            y="145"
            width="125"
            height="44"
            rx="8"
            fill="#ecfdf5"
            stroke="#059669"
            strokeWidth="2"
          />
          <text x="277" y="174" textAnchor="middle" fill="#022c22" fontSize="14" fontWeight="800">
            V = I × R
          </text>
        </svg>
        <p className="mt-3 text-center text-xs font-medium text-emerald-950/70">
          Demo illustration — swap for interactive simulation later.
        </p>
      </div>
    </div>
  )
}
