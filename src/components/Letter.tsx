import { useEffect, useState } from 'react'
import { content } from '../content'

type Props = {
  onContinue: () => void
  onReopen: () => void
}

type Reply = 'yes' | 'when' | null

export function Letter({ onContinue, onReopen }: Props) {
  const [unfolded, setUnfolded] = useState(false)
  const [reply, setReply] = useState<Reply>(null)
  const t = content.letter

  useEffect(() => {
    // даём браузеру нарисовать сложенное состояние, затем разворачиваем
    const id = window.requestAnimationFrame(() =>
      window.requestAnimationFrame(() => setUnfolded(true)),
    )
    return () => window.cancelAnimationFrame(id)
  }, [])

  return (
    <section
      className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-4 pb-16 pt-12"
      aria-label="Хат"
    >
      <div className="letter-stage w-full">
        <div className={['letter', unfolded ? 'is-unfolded' : ''].join(' ')}>
          <div className="letter-shadow" aria-hidden="true" />

          {/* верхняя треть */}
          <div className="letter-panel top paper-grain">
            <div className="px-7 pb-2 pt-9 sm:px-10 sm:pt-11">
              <p className="eyebrow">{content.envelope.seal}</p>
              <h1 className="display mt-4 text-[32px] text-cocoa sm:text-[38px]">{t.greeting}</h1>
            </div>
          </div>

          {/* середина — то, что было видно в конверте */}
          <div className="letter-panel middle paper-grain">
            <div className="px-7 py-3 sm:px-10">
              {t.lines.map((line, i) => (
                <p key={i} className="letter-text ruled" style={{ marginTop: i === 0 ? 0 : '0.75em' }}>
                  {line}
                </p>
              ))}
            </div>
          </div>

          {/* нижняя треть */}
          <div className="letter-panel bottom paper-grain">
            <div className="px-7 pb-9 pt-4 sm:px-10 sm:pb-11">
              <p className="caption text-[18px] text-muted">
                {t.signature}
                {t.signatureName ? <span className="ml-1 text-wine">{t.signatureName}</span> : null}
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  className="btn btn-primary flex-1"
                  onClick={() => setReply('yes')}
                  aria-pressed={reply === 'yes'}
                >
                  {t.yesButton}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost flex-1"
                  onClick={() => setReply('when')}
                  aria-pressed={reply === 'when'}
                >
                  {t.whenButton}
                </button>
              </div>

              <div
                className="overflow-hidden"
                aria-live="polite"
                style={{
                  transition:
                    'opacity 500ms ease 150ms, transform 500ms var(--ease-out-soft) 150ms, max-height 600ms var(--ease-paper), margin-top 600ms var(--ease-paper)',
                  opacity: reply ? 1 : 0,
                  transform: reply ? 'none' : 'translateY(8px)',
                  maxHeight: reply ? 320 : 0,
                  marginTop: reply ? 24 : 0,
                }}
              >
                {reply ? (
                  <div className="rounded-xl border border-wine/20 bg-ivory/70 px-5 py-4">
                    <p className="display text-[22px] text-wine">
                      {reply === 'yes' ? t.yesReply : t.whenReply}
                    </p>
                  </div>
                ) : null}
              </div>

              <div
                className="flex items-center justify-between gap-4 overflow-hidden"
                style={{
                  transition: 'opacity 600ms ease 350ms, max-height 600ms var(--ease-paper), margin-top 600ms var(--ease-paper)',
                  opacity: reply ? 1 : 0,
                  maxHeight: reply ? 80 : 0,
                  marginTop: reply ? 24 : 0,
                  pointerEvents: reply ? 'auto' : 'none',
                }}
              >
                <button
                  type="button"
                  className="text-[13px] font-semibold tracking-[0.02em] text-muted underline-offset-4 hover:underline"
                  onClick={onReopen}
                  tabIndex={reply ? 0 : -1}
                >
                  {content.envelope.reopenButton}
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={onContinue}
                  tabIndex={reply ? 0 : -1}
                >
                  {t.continueButton}
                  <ArrowIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
