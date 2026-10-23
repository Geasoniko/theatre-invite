import { content } from '../content'

export type CashierPhase = 'idle' | 'giving' | 'given'

/**
 * Кассир у окошка театра. Полностью нарисован в SVG, анимации — в index.css
 * (секция «КАССИР»): дыхание, моргание, взмах рукой, билет выезжает через щель.
 */
export function Cashier({ phase }: { phase: CashierPhase }) {
  const t = content.ticket.cashier
  return (
    <div className={['cashier', `is-${phase}`].join(' ')} aria-hidden="true">
      <svg viewBox="0 0 360 320" width="100%" height="100%" role="img">
        <defs>
          <clipPath id="window-clip">
            <path d="M40 300 V120 a140 110 0 0 1 280 0 V300 Z" />
          </clipPath>
          <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.35" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* стена за окошком */}
        <path d="M40 300 V120 a140 110 0 0 1 280 0 V300 Z" fill="#e3d4bf" />
        <g clipPath="url(#window-clip)">
          <rect x="40" y="40" width="280" height="260" fill="#efe4d3" />
          {/* занавес по краям */}
          <path d="M40 40 h52 c-8 40 4 80 -10 120 c-10 30 -2 70 10 140 H40 Z" fill="#874c52" opacity="0.9" />
          <path d="M320 40 h-52 c8 40 -4 80 10 120 c10 30 2 70 -10 140 H320 Z" fill="#874c52" opacity="0.9" />
          <path d="M70 40 c6 60 -6 120 4 180" stroke="#6d3a40" strokeWidth="3" fill="none" opacity="0.5" />
          <path d="M290 40 c-6 60 6 120 -4 180" stroke="#6d3a40" strokeWidth="3" fill="none" opacity="0.5" />

          {/* кассир */}
          <g className="cashier-body">
            {/* туловище */}
            <path d="M118 300 c0-60 28-86 62-86 s62 26 62 86 Z" fill="#874c52" />
            <path d="M160 214 h40 l-20 46 Z" fill="#f7f2e9" />
            <path d="M172 232 l8 -6 l8 6 l-8 6 Z" fill="#40352f" />
            <circle cx="180" cy="232" r="2.2" fill="#e8dccb" />
            {/* левая рука на стойке */}
            <path d="M126 270 c-14 6 -26 10 -40 12" stroke="#874c52" strokeWidth="18" strokeLinecap="round" fill="none" />
            <circle cx="84" cy="283" r="10" fill="#f1d3bd" />

            {/* голова */}
            <g className="cashier-head">
              <ellipse cx="180" cy="160" rx="42" ry="46" fill="#f1d3bd" />
              {/* волосы и пучок */}
              <path d="M138 158 c-2-40 20-62 42-62 s44 22 42 62 c-6-18 -16-30 -42-30 s-36 12 -42 30 Z" fill="#40352f" />
              <circle cx="180" cy="98" r="16" fill="#40352f" />
              <circle cx="180" cy="98" r="6" fill="#874c52" />
              {/* уши */}
              <circle cx="139" cy="165" r="7" fill="#e9c3a8" />
              <circle cx="221" cy="165" r="7" fill="#e9c3a8" />
              {/* глаза */}
              <g className="cashier-eyes">
                <ellipse cx="164" cy="165" rx="4" ry="5" fill="#40352f" />
                <ellipse cx="196" cy="165" rx="4" ry="5" fill="#40352f" />
                <circle cx="165.5" cy="163" r="1.3" fill="#fff" />
                <circle cx="197.5" cy="163" r="1.3" fill="#fff" />
              </g>
              {/* очки */}
              <circle cx="164" cy="165" r="11" stroke="#40352f" strokeWidth="1.8" fill="none" opacity="0.8" />
              <circle cx="196" cy="165" r="11" stroke="#40352f" strokeWidth="1.8" fill="none" opacity="0.8" />
              <path d="M175 165 h10" stroke="#40352f" strokeWidth="1.8" opacity="0.8" />
              {/* брови */}
              <path d="M156 150 q8 -4 16 0" stroke="#40352f" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M188 150 q8 -4 16 0" stroke="#40352f" strokeWidth="2" fill="none" strokeLinecap="round" />
              {/* щёки и улыбка */}
              <circle cx="152" cy="180" r="6" fill="#d98b8f" opacity="0.4" />
              <circle cx="208" cy="180" r="6" fill="#d98b8f" opacity="0.4" />
              <path className="cashier-smile" d="M166 186 q14 12 28 0" stroke="#874c52" strokeWidth="2.4" fill="none" strokeLinecap="round" />
            </g>

            {/* правая рука с билетом */}
            <g className="cashier-arm">
              <path d="M232 262 c14 -8 24 -22 30 -40" stroke="#874c52" strokeWidth="18" strokeLinecap="round" fill="none" />
              <circle cx="264" cy="218" r="11" fill="#f1d3bd" />
            </g>
          </g>

          {/* блик стекла */}
          <rect x="40" y="40" width="280" height="260" fill="url(#glass)" />
        </g>

        {/* билет — выезжает через щель в стойке */}
        <g className="cashier-ticket">
          <rect x="236" y="206" width="58" height="30" rx="4" fill="#fffdf9" stroke="#874c52" strokeWidth="1.5" />
          <path d="M256 206 v30" stroke="#874c52" strokeWidth="1.2" strokeDasharray="2 2" />
          <text x="276" y="224" textAnchor="middle" fontFamily="Manrope, system-ui" fontSize="8" fontWeight="700" fill="#874c52" letterSpacing="0.1">
            БИЛЕТ
          </text>
        </g>

        {/* стойка */}
        <rect x="24" y="286" width="312" height="26" rx="4" fill="#5a4a40" />
        <rect x="24" y="286" width="312" height="6" rx="2" fill="#7a685a" />
        <rect x="150" y="294" width="60" height="4" rx="2" fill="#2d2420" />

        {/* рамка окошка */}
        <path d="M40 300 V120 a140 110 0 0 1 280 0 V300" fill="none" stroke="#874c52" strokeWidth="10" strokeLinejoin="round" />
        <path d="M40 300 V120 a140 110 0 0 1 280 0 V300" fill="none" stroke="#a2616a" strokeWidth="2" />

        {/* табличка */}
        <rect x="128" y="22" width="104" height="30" rx="6" fill="#874c52" />
        <rect x="131" y="25" width="98" height="24" rx="4" fill="none" stroke="#f7f2e9" strokeWidth="1" opacity="0.5" />
        <text x="180" y="42" textAnchor="middle" fontFamily="Manrope, system-ui" fontSize="13" fontWeight="700" fill="#f7f2e9" letterSpacing="2">
          {t.sign}
        </text>
      </svg>
    </div>
  )
}
