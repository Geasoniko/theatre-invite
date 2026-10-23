import { useState } from 'react'
import { content } from '../content'
import { useReducedMotion, useTimeouts } from '../hooks'

type Phase = 'closed' | 'opening' | 'pulled' | 'done'

type Props = {
  onOpened: () => void
}

export function Envelope({ onOpened }: Props) {
  const [phase, setPhase] = useState<Phase>('closed')
  const reduced = useReducedMotion()
  const later = useTimeouts()
  const t = content.envelope

  function open() {
    if (phase !== 'closed') return
    if (reduced) {
      setPhase('done')
      onOpened()
      return
    }
    setPhase('opening') // клапан поднимается
    later(() => setPhase('pulled'), 750) // письмо выезжает
    later(() => {
      setPhase('done')
      onOpened()
    }, 1500)
  }

  const isOpen = phase !== 'closed'
  const isPulled = phase === 'pulled' || phase === 'done'

  return (
    <section
      className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-5 pb-16 pt-14"
      aria-label="Конверт"
    >
      <div className="envelope-scene mt-6">
        <div
          className={['envelope', isOpen ? 'is-open' : '', isPulled ? 'is-pulled' : ''].join(' ')}
          style={{ transform: isPulled ? 'rotateX(8deg) translateY(10px)' : 'rotateX(4deg)' }}
        >
          <div className="env-back" />

          {/* письмо внутри — сложенное, едва выглядывает */}
          <div className="env-letter-slot">
            <div className="letter-card">
              <div className="paper-grain relative h-full w-full rounded-[3px] bg-paper shadow-[0_6px_16px_-10px_rgba(64,53,47,0.5)]">
                <div className="ruled absolute inset-x-5 top-5 bottom-5 opacity-70" />
                <div className="absolute left-5 top-6 h-[3px] w-24 rounded-full bg-wine/25" />
                <div className="absolute left-5 top-[52px] h-[2px] w-40 rounded-full bg-cocoa/15" />
                <div className="absolute left-5 top-[76px] h-[2px] w-32 rounded-full bg-cocoa/15" />
              </div>
            </div>
          </div>

          <div className="env-front">
            <div className="env-pocket left" />
            <div className="env-pocket right" />
            <div className="env-pocket bottom" />
          </div>

          <div className="env-flap">
            <div className="face front" />
            <div className="face back" />
          </div>

          <div className="seal" aria-hidden="true">
            <HeartIcon />
          </div>
          <div className="seal-label">{t.seal}</div>
        </div>
      </div>

      <p className="display mt-14 max-w-xs text-center text-[22px] text-cocoa">{t.intro}</p>

      <button
        type="button"
        className="btn btn-primary mt-7"
        onClick={open}
        disabled={phase !== 'closed'}
        aria-disabled={phase !== 'closed'}
      >
        {t.openButton}
      </button>
    </section>
  )
}

function HeartIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 20.3 4.7 13.2a4.4 4.4 0 0 1 6.2-6.2l1.1 1 1.1-1a4.4 4.4 0 1 1 6.2 6.2L12 20.3Z"
        fill="currentColor"
        opacity="0.9"
      />
    </svg>
  )
}
