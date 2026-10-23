import { useState } from 'react'
import { content } from '../content'
import { useReducedMotion, useTimeouts } from '../hooks'

type Phase = 'wait' | 'enter' | 'give' | 'kiss' | 'heart'

/**
 * Финальная сцена: он входит слева, она — справа. Он протягивает букет,
 * она берёт его и целует его в щёку, затем он показывает сердце руками над
 * головой, и над ним прорисовывается сердце.
 * Персонажи — SVG, анимации — в index.css (секция «ФИНАЛ»).
 */
export function Finale() {
  const t = content.finale
  const [phase, setPhase] = useState<Phase>('wait')
  const reduced = useReducedMotion()
  const later = useTimeouts()

  function start() {
    if (phase !== 'wait') return
    if (reduced) {
      setPhase('heart')
      return
    }
    setPhase('enter')
    later(() => setPhase('give'), 1200)
    later(() => setPhase('kiss'), 2900)
    later(() => setPhase('heart'), 4700)
  }

  const line =
    phase === 'enter' ? t.enter : phase === 'give' ? t.give : phase === 'kiss' ? t.kiss : phase === 'heart' ? t.heart : ''

  return (
    <div className="mt-14 text-center">
      <p className="eyebrow">{t.eyebrow}</p>

      <div
        className="overflow-hidden"
        style={{
          maxHeight: phase === 'wait' ? 80 : 0,
          marginTop: phase === 'wait' ? 20 : 0,
          opacity: phase === 'wait' ? 1 : 0,
          transition: 'max-height 500ms var(--ease-paper), margin-top 500ms var(--ease-paper), opacity 300ms ease',
        }}
      >
        <button type="button" className="btn btn-ghost" onClick={start} tabIndex={phase === 'wait' ? 0 : -1}>
          {t.button}
        </button>
      </div>

      <div
        className="overflow-hidden"
        style={{
          maxHeight: phase === 'wait' ? 0 : 1000,
          opacity: phase === 'wait' ? 0 : 1,
          transition: 'max-height 900ms var(--ease-paper), opacity 500ms ease',
        }}
        aria-hidden={phase === 'wait'}
      >
        <div className="bubble mx-auto mt-6 max-w-xs" aria-live="polite">
          <p className="display min-h-[28px] text-[20px] text-cocoa">{line}</p>
        </div>

        <div className={['finale', `is-${phase}`].join(' ')} aria-hidden="true">
          <svg viewBox="0 -70 420 440" width="100%" height="100%" role="img">
            {/* большое сердце над ним — прорисовывается в финале */}
            <g className="finale-bigheart">
              <path
                className="finale-bigheart-fill"
                d="M130 10 c-10 -22 -46 -20 -46 8 c0 20 22 34 46 56 c24 -22 46 -36 46 -56 c0 -28 -36 -30 -46 -8 Z"
                fill="#874c52"
              />
              <path
                className="finale-bigheart-stroke"
                d="M130 10 c-10 -22 -46 -20 -46 8 c0 20 22 34 46 56 c24 -22 46 -36 46 -56 c0 -28 -36 -30 -46 -8 Z"
                fill="none"
                stroke="#874c52"
                strokeWidth="3"
                strokeLinejoin="round"
              />
            </g>

            {/* маленькие сердечки — взлетают после поцелуя и в финале */}
            <g className="finale-hearts">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <g key={i} transform={`translate(${150 + i * 24} 120) scale(${0.6 + (i % 3) * 0.25})`}>
                  <path
                    className="finale-heart"
                    style={{ animationDelay: `${i * 140}ms` }}
                    d="M0 8 L-7 1 a4.2 4.2 0 0 1 6-6 l1 1 1-1 a4.2 4.2 0 1 1 6 6 Z"
                    fill="#874c52"
                    opacity="0"
                  />
                </g>
              ))}
            </g>

            {/* тени на полу */}
            <ellipse className="finale-shadow-boy" cx="130" cy="352" rx="62" ry="8" fill="#40352f" opacity="0.1" />
            <ellipse className="finale-shadow-girl" cx="290" cy="352" rx="58" ry="8" fill="#40352f" opacity="0.1" />

            {/* ───── ОН ───── */}
            <g className="finale-boy">
              <g transform="translate(-50 0)">
                <rect x="156" y="250" width="22" height="84" rx="10" fill="#40352f" />
                <rect x="182" y="250" width="22" height="84" rx="10" fill="#40352f" />
                <path d="M150 332 h30 v10 a6 6 0 0 1 -6 6 h-28 a6 6 0 0 1 -4 -10 Z" fill="#2d2420" />
                <path d="M180 332 h30 a6 6 0 0 1 4 10 h-28 a6 6 0 0 1 -6 -6 Z" fill="#2d2420" />
                <path d="M140 262 V214 c0-26 18-40 40-40 s40 14 40 40 v48 Z" fill="#5a4a40" />
                <path d="M166 176 h28 l-14 44 Z" fill="#f7f2e9" />
                <path d="M172 190 l8 -6 l8 6 l-8 8 Z" fill="#874c52" />

                <g className="finale-boy-head">
                  <circle cx="180" cy="130" r="40" fill="#f1d3bd" />
                  <path d="M140 126 c0-30 18-48 42-48 c20 0 30 10 36 24 c-10-6 -24-8 -36-4 c-14 4 -24 8 -42 28 Z" fill="#40352f" />
                  <path d="M212 100 c8 6 10 16 10 26 c-4 -8 -8 -14 -16 -18 Z" fill="#40352f" />
                  <circle cx="142" cy="134" r="6" fill="#e9c3a8" />
                  <circle cx="218" cy="134" r="6" fill="#e9c3a8" />
                  <g className="finale-eyes">
                    <ellipse cx="166" cy="134" rx="3.8" ry="5" fill="#40352f" />
                    <ellipse cx="194" cy="134" rx="3.8" ry="5" fill="#40352f" />
                    <circle cx="167.5" cy="132" r="1.2" fill="#fff" />
                    <circle cx="195.5" cy="132" r="1.2" fill="#fff" />
                  </g>
                  <path d="M158 120 q8 -5 16 -1" stroke="#40352f" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                  <path d="M186 119 q8 -4 16 1" stroke="#40352f" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                  <circle className="finale-blush" cx="154" cy="146" r="6" fill="#d98b8f" opacity="0.4" />
                  <circle className="finale-blush" cx="206" cy="146" r="6" fill="#d98b8f" opacity="0.4" />
                  <path className="finale-smile" d="M166 152 q14 12 28 0" stroke="#874c52" strokeWidth="2.4" fill="none" strokeLinecap="round" />
                  {/* след от поцелуя на правой щеке */}
                  <g className="finale-kissmark" transform="translate(206 142)">
                    <path d="M-6 0 c0 -4 3 -5 6 -2 c3 -3 6 -2 6 2 c0 3 -3 5 -6 7 c-3 -2 -6 -4 -6 -7 Z" fill="#b8454f" />
                    <path d="M-6 0 h12" stroke="#f1d3bd" strokeWidth="1" opacity="0.6" />
                  </g>
                </g>

                {/* поза 1: левая рука опущена, правая протянута с букетом */}
                <g className="finale-pose-give">
                  <path d="M146 196 c-6 20 -10 40 -12 58" stroke="#5a4a40" strokeWidth="18" strokeLinecap="round" fill="none" />
                  <circle cx="133" cy="258" r="10" fill="#f1d3bd" />
                  <g className="finale-arm-right">
                    <path d="M214 196 c12 14 20 26 26 40" stroke="#5a4a40" strokeWidth="18" strokeLinecap="round" fill="none" />
                    <circle cx="242" cy="238" r="10" fill="#f1d3bd" />
                  </g>
                </g>

                {/* поза 2: сердце руками над головой */}
                <g className="finale-pose-heart">
                  <path d="M146 196 c-30 -24 -34 -80 2 -116 c10 -10 22 -12 28 -8" stroke="#5a4a40" strokeWidth="18" strokeLinecap="round" fill="none" />
                  <path d="M214 196 c30 -24 34 -80 -2 -116 c-10 -10 -22 -12 -28 -8" stroke="#5a4a40" strokeWidth="18" strokeLinecap="round" fill="none" />
                  <circle cx="172" cy="74" r="10" fill="#f1d3bd" />
                  <circle cx="188" cy="74" r="10" fill="#f1d3bd" />
                </g>
              </g>
            </g>

            {/* ───── ОНА ───── */}
            <g className="finale-girl">
              <g transform="translate(110 0)">
                {/* волосы сзади */}
                <path d="M138 130 c-6 40 -8 80 0 112 h84 c8 -32 6 -72 0 -112 Z" fill="#2d2420" />
                {/* ноги и туфли */}
                <rect x="164" y="270" width="14" height="64" rx="7" fill="#f1d3bd" />
                <rect x="182" y="270" width="14" height="64" rx="7" fill="#f1d3bd" />
                <path d="M158 330 h22 v8 a6 6 0 0 1 -6 6 h-20 a5 5 0 0 1 -2 -9 Z" fill="#874c52" />
                <path d="M180 330 h22 a5 5 0 0 1 2 9 h-20 a6 6 0 0 1 -6 -6 Z" fill="#874c52" />
                {/* платье */}
                <path d="M150 186 c8 -10 22 -14 30 -14 s22 4 30 14 l16 94 H134 Z" fill="#a2616a" />
                <path d="M150 186 c8 -10 22 -14 30 -14 s22 4 30 14 l4 26 H146 Z" fill="#874c52" />
                <path d="M140 262 h80" stroke="#874c52" strokeWidth="2" opacity="0.5" />

                {/* голова */}
                <g className="finale-girl-head">
                  <circle cx="180" cy="130" r="38" fill="#f1d3bd" />
                  <path d="M142 128 c0 -34 18 -52 38 -52 s38 18 38 52 c-6 -14 -16 -24 -38 -24 s-32 10 -38 24 Z" fill="#2d2420" />
                  <path d="M142 128 c-2 20 -2 40 2 60 c4 -16 4 -36 4 -52 Z" fill="#2d2420" />
                  <path d="M218 128 c2 20 2 40 -2 60 c-4 -16 -4 -36 -4 -52 Z" fill="#2d2420" />
                  <circle cx="203" cy="92" r="5" fill="#c99a9f" />
                  <g className="finale-girl-eyes">
                    <ellipse cx="167" cy="134" rx="3.8" ry="5" fill="#40352f" />
                    <ellipse cx="193" cy="134" rx="3.8" ry="5" fill="#40352f" />
                    <circle cx="168.5" cy="132" r="1.2" fill="#fff" />
                    <circle cx="194.5" cy="132" r="1.2" fill="#fff" />
                    <path d="M160 128 l-3 -3 M172 127 l3 -3 M186 127 l-3 -3 M198 128 l3 -3" stroke="#40352f" strokeWidth="1.4" strokeLinecap="round" />
                  </g>
                  <g className="finale-girl-eyes-closed">
                    <path d="M161 134 q6 4 12 0" stroke="#40352f" strokeWidth="2" fill="none" strokeLinecap="round" />
                    <path d="M187 134 q6 4 12 0" stroke="#40352f" strokeWidth="2" fill="none" strokeLinecap="round" />
                  </g>
                  <path d="M160 121 q7 -4 14 -1" stroke="#40352f" strokeWidth="2" fill="none" strokeLinecap="round" />
                  <path d="M186 120 q7 -3 14 1" stroke="#40352f" strokeWidth="2" fill="none" strokeLinecap="round" />
                  <circle cx="156" cy="146" r="6" fill="#d98b8f" opacity="0.45" />
                  <circle cx="204" cy="146" r="6" fill="#d98b8f" opacity="0.45" />
                  <path d="M171 152 q9 8 18 0" stroke="#b8454f" strokeWidth="2.6" fill="none" strokeLinecap="round" />
                </g>

                {/* руки: опущены (до букета) */}
                <g className="finale-girl-arms-down">
                  <path d="M152 196 c-6 20 -8 40 -8 56" stroke="#f1d3bd" strokeWidth="14" strokeLinecap="round" fill="none" />
                  <path d="M208 196 c6 20 8 40 8 56" stroke="#f1d3bd" strokeWidth="14" strokeLinecap="round" fill="none" />
                </g>
                {/* руки: держат букет у груди */}
                <g className="finale-girl-arms-hold">
                  <path d="M152 196 c-10 18 -6 34 10 42" stroke="#f1d3bd" strokeWidth="14" strokeLinecap="round" fill="none" />
                  <path d="M208 196 c10 18 6 34 -10 42" stroke="#f1d3bd" strokeWidth="14" strokeLinecap="round" fill="none" />
                </g>
              </g>
            </g>

            {/* букет: из его руки — в её руки */}
            <g className="finale-bouquet">
              <g transform="translate(-50 0)">
                <path d="M242 236 l-6 -40 M242 236 l2 -44 M242 236 l10 -40" stroke="#5f7a4a" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M236 214 c-10 -6 -14 -2 -16 4 c8 2 12 2 16 -4 Z" fill="#7a9460" />
                <path d="M250 212 c10 -6 14 -2 16 4 c-8 2 -12 2 -16 -4 Z" fill="#7a9460" />
                <circle cx="236" cy="192" r="9" fill="#a2616a" />
                <circle cx="252" cy="194" r="9" fill="#c99a9f" />
                <circle cx="244" cy="180" r="9" fill="#874c52" />
                <circle cx="230" cy="202" r="7" fill="#c99a9f" />
                <circle cx="258" cy="206" r="7" fill="#a2616a" />
                <circle cx="236" cy="192" r="3" fill="#f7f2e9" opacity="0.7" />
                <circle cx="252" cy="194" r="3" fill="#f7f2e9" opacity="0.7" />
                <circle cx="244" cy="180" r="3" fill="#f7f2e9" opacity="0.7" />
                <path d="M224 214 l18 32 l18 -32 c-10 8 -26 8 -36 0 Z" fill="#e8dccb" />
                <path d="M224 214 l18 32 l18 -32" stroke="#d2c2aa" strokeWidth="1.2" fill="none" />
                <path d="M236 232 h12" stroke="#874c52" strokeWidth="2.5" strokeLinecap="round" />
              </g>
            </g>
          </svg>
        </div>

        <div
          style={{
            opacity: phase === 'heart' ? 1 : 0,
            transform: phase === 'heart' ? 'none' : 'translateY(8px)',
            transition: 'opacity 700ms ease 1200ms, transform 700ms var(--ease-out-soft) 1200ms',
          }}
        >
          <p className="caption mt-2 text-[22px] text-wine">{t.signature}</p>
        </div>
      </div>
    </div>
  )
}
