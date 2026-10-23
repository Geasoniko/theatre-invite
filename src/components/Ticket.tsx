import { useState } from 'react'
import { content } from '../content'
import { useReducedMotion, useReveal } from '../hooks'

const CONFETTI = Array.from({ length: 14 }, (_, i) => ({
  left: 6 + ((i * 37) % 88),
  delay: (i * 90) % 600,
  color: i % 3 === 0 ? '#874c52' : i % 3 === 1 ? '#e8dccb' : '#c99a9f',
  size: 7 + (i % 3) * 3,
}))

export function Ticket() {
  const t = content.ticket
  const [torn, setTorn] = useState(false)
  const reduced = useReducedMotion()
  const ref = useReveal<HTMLDivElement>()

  const details = [
    { label: 'Спектакль', value: t.play },
    { label: 'Күні', value: t.date },
    { label: 'Уақыты', value: t.time },
    ...(t.row ? [{ label: 'Қатар', value: t.row }] : []),
    ...(t.seat ? [{ label: 'Орын', value: t.seat }] : []),
  ]

  return (
    <section className="relative z-10 px-5 pb-28 pt-16 sm:pt-24" aria-label="Билет">
      <div ref={ref} className="reveal mx-auto max-w-lg">
        <p className="eyebrow text-center">{t.eyebrow}</p>
        <h2 className="display mt-4 text-center text-[32px] text-cocoa sm:text-[42px]">{t.title}</h2>

        <div className="ticket-scene mt-10">
          <div className={['ticket', torn ? 'is-torn' : ''].join(' ')}>
            {/* корешок */}
            <div className="ticket-stub-wrap">
            <div className="ticket-stub paper-grain relative bg-beige/60 px-6 py-5 sm:px-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">Admit two</p>
                  <p className="display mt-1 text-[22px] text-wine">{t.city} · {t.time}</p>
                </div>
                <button
                  type="button"
                  className="btn btn-primary !min-h-[44px] !px-5"
                  onClick={() => setTorn(true)}
                  disabled={torn}
                >
                  {t.tearHint}
                </button>
              </div>
            </div>
            </div>

            <div className="ticket-perf" aria-hidden="true" />

            {/* основная часть */}
            <div className="ticket-body paper-grain relative px-6 pb-7 pt-6 sm:px-8 sm:pb-9">
              {torn && !reduced ? (
                <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                  {CONFETTI.map((c, i) => (
                    <span
                      key={i}
                      className="confetti"
                      style={{
                        left: `${c.left}%`,
                        animationDelay: `${c.delay}ms`,
                        background: c.color,
                        width: c.size,
                        height: c.size,
                      }}
                    />
                  ))}
                </div>
              ) : null}

              <p className="text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">Театр</p>
              <p className="display mt-1 text-[21px] leading-snug text-cocoa sm:text-[24px]">{t.theatre}</p>

              <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-cocoa/10 pt-5">
                {details.map((d) => (
                  <div key={d.label}>
                    <dt className="text-[11px] font-semibold tracking-[0.12em] text-muted uppercase">{d.label}</dt>
                    <dd className="display mt-0.5 text-[20px] text-cocoa">{d.value}</dd>
                  </div>
                ))}
              </dl>

              <div
                className="mt-7 overflow-hidden"
                style={{
                  maxHeight: torn ? 600 : 0,
                  opacity: torn ? 1 : 0,
                  transition: 'max-height 900ms var(--ease-paper) 400ms, opacity 700ms ease 600ms',
                }}
                aria-live="polite"
              >
                <div className="rounded-xl border border-wine/20 bg-ivory/70 px-5 py-5">
                  <p className="display text-[24px] text-wine sm:text-[26px]">{t.message}</p>
                  <p className="caption mt-3 text-muted">{t.finalLine}</p>
                </div>

                {t.image ? (
                  <figure className="polaroid relative mt-7 w-full" style={{ transform: 'rotate(-1.5deg)' }}>
                    <span className="tape" aria-hidden="true" />
                    <div className="photo !aspect-auto">
                      <img src={t.image} alt="Билет" className="!h-auto w-full !object-contain" />
                    </div>
                    <figcaption className="caption px-1 pt-3">{t.play}</figcaption>
                  </figure>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {!torn ? (
          <p className="mt-6 text-center text-[13px] text-muted">{t.tearNote}</p>
        ) : null}
      </div>
    </section>
  )
}
