import { useState } from 'react'
import { content } from '../content'
import { useReducedMotion, useReveal, useTimeouts } from '../hooks'
import { Cashier, type CashierPhase } from './Cashier'
import { Finale } from './Finale'

const CONFETTI = Array.from({ length: 14 }, (_, i) => ({
  left: 6 + ((i * 37) % 88),
  delay: (i * 90) % 600,
  color: i % 3 === 0 ? '#874c52' : i % 3 === 1 ? '#e8dccb' : '#c99a9f',
  size: 7 + (i % 3) * 3,
}))

export function Ticket() {
  const t = content.ticket
  const [torn, setTorn] = useState(false)
  const [phase, setPhase] = useState<CashierPhase>('idle')
  const reduced = useReducedMotion()
  const ref = useReveal<HTMLDivElement>()
  const later = useTimeouts()
  const c = t.cashier

  function askTicket() {
    if (phase !== 'idle') return
    if (reduced) {
      setPhase('given')
      return
    }
    setPhase('giving')
    later(() => setPhase('given'), 1700)
  }

  const bubbleText = phase === 'idle' ? c.greeting : phase === 'giving' ? c.giving : c.done

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

        {/* кассир у окошка */}
        <div className="mt-10">
          <div className="bubble mx-auto max-w-xs text-center" aria-live="polite">
            <p className="display text-[19px] text-cocoa">{bubbleText}</p>
          </div>
          <div className="mt-6">
            <Cashier phase={phase} />
          </div>
          <div
            className="flex justify-center overflow-hidden"
            style={{
              maxHeight: phase === 'idle' ? 80 : 0,
              marginTop: phase === 'idle' ? 24 : 0,
              opacity: phase === 'idle' ? 1 : 0,
              transition: 'max-height 500ms var(--ease-paper), margin-top 500ms var(--ease-paper), opacity 300ms ease',
            }}
          >
            <button type="button" className="btn btn-primary" onClick={askTicket} tabIndex={phase === 'idle' ? 0 : -1}>
              {c.askButton}
            </button>
          </div>
        </div>

        <div
          className="ticket-scene overflow-hidden"
          style={{
            maxHeight: phase === 'given' ? 2000 : 0,
            marginTop: phase === 'given' ? 40 : 0,
            opacity: phase === 'given' ? 1 : 0,
            transform: phase === 'given' ? 'none' : 'translateY(-24px)',
            transition:
              'max-height 900ms var(--ease-paper), margin-top 700ms var(--ease-paper), opacity 700ms ease 200ms, transform 800ms var(--ease-paper)',
          }}
          aria-hidden={phase !== 'given'}
        >
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
                  maxHeight: torn ? 2400 : 0,
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

                {t.file || t.image ? (
                  <div className="mt-7 flex flex-col items-center gap-2">
                    <a
                      className="btn btn-primary"
                      href={t.file || t.image}
                      download={t.file ? 'bilet.pdf' : 'bilet.jpg'}
                    >
                      <DownloadIcon />
                      {t.downloadButton}
                    </a>
                    <span className="text-[12px] tracking-[0.04em] text-muted">{t.downloadNote}</span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {!torn && phase === 'given' ? (
          <p className="mt-6 text-center text-[13px] text-muted">{t.tearNote}</p>
        ) : null}

        {torn ? <Finale /> : null}
      </div>
    </section>
  )
}

function DownloadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 4v11m0 0-4-4m4 4 4-4M5 19h14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
