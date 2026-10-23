import { useEffect, useRef, useState, type ReactNode } from 'react'
import { content } from '../content'
import { useReveal, useTimeouts } from '../hooks'

type Props = {
  onUnlock: () => void
}

type Step = 0 | 1 | 2 | 3 // 3 = всё пройдено

export function Quest({ onUnlock }: Props) {
  const t = content.quest
  const [started, setStarted] = useState(false)
  const [step, setStep] = useState<Step>(0)
  const ref = useReveal<HTMLDivElement>()

  return (
    <section className="relative z-10 px-5 pb-24 pt-16 sm:pt-24" aria-label="Квест">
      <div ref={ref} className="reveal mx-auto max-w-xl">
        <p className="eyebrow text-center">{t.title}</p>

        {!started ? (
          <div className="mt-6 text-center">
            <p className="display mx-auto max-w-md text-[24px] text-cocoa sm:text-[28px]">{t.intro}</p>
            <button type="button" className="btn btn-primary mt-8" onClick={() => setStarted(true)}>
              {t.startButton}
            </button>
          </div>
        ) : (
          <>
            <ol className="mt-6 flex items-center justify-center gap-3" aria-label="Қадамдар">
              {t.stepsLabel.map((label, i) => (
                <li key={label} className="flex items-center gap-3">
                  <div
                    className={[
                      'step-seal',
                      i < step ? 'is-done' : '',
                      i === step ? 'is-active' : '',
                    ].join(' ')}
                    aria-current={i === step ? 'step' : undefined}
                  >
                    {i < step ? <CheckIcon /> : i + 1}
                  </div>
                  <span className="hidden text-[12px] font-semibold tracking-[0.04em] text-muted sm:inline">
                    {label}
                  </span>
                  {i < t.stepsLabel.length - 1 ? (
                    <span className="h-px w-5 bg-cocoa/15 sm:w-8" aria-hidden="true" />
                  ) : null}
                </li>
              ))}
            </ol>

            <div className="quest-card paper-grain mt-8 px-5 py-7 sm:px-9 sm:py-9">
              {step === 0 ? <Quiz onDone={() => setStep(1)} /> : null}
              {step === 1 ? <Scratch onDone={() => setStep(2)} /> : null}
              {step === 2 ? <Memory onDone={() => setStep(3)} /> : null}
              {step === 3 ? (
                <div className="text-center">
                  <p className="display text-[26px] text-wine">{t.memory.done}</p>
                  <p className="mt-3 text-[15px] text-muted">{t.stepsLabel.join(' · ')}</p>
                  <button type="button" className="btn btn-primary mt-7" onClick={onUnlock}>
                    {t.unlockButton}
                  </button>
                </div>
              ) : null}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

/* ───────────────────────── 1. Викторина ───────────────────────── */

function Quiz({ onDone }: { onDone: () => void }) {
  const t = content.quest.quiz
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [status, setStatus] = useState<'idle' | 'wrong' | 'right'>('idle')
  const later = useTimeouts()
  const q = t.questions[index]
  const total = t.questions.length

  function choose(i: number) {
    if (status === 'right') return
    setPicked(i)
    if (i === q.answer) {
      setStatus('right')
      later(() => {
        if (index + 1 >= total) onDone()
        else {
          setIndex(index + 1)
          setPicked(null)
          setStatus('idle')
        }
      }, 900)
    } else {
      setStatus('wrong')
      later(() => {
        setStatus('idle')
        setPicked(null)
      }, 700)
    }
  }

  return (
    <div>
      <Heading title={t.title} sub={`${index + 1} / ${total}`} />
      <p className="display mt-5 text-[23px] text-cocoa">{q.question}</p>
      <div className="mt-5 flex flex-col gap-2.5">
        {q.options.map((opt, i) => (
          <button
            key={opt}
            type="button"
            className={[
              'option',
              picked === i && status === 'wrong' ? 'is-wrong' : '',
              picked === i && status === 'right' ? 'is-right' : '',
            ].join(' ')}
            onClick={() => choose(i)}
          >
            <span className="mr-3 inline-block w-5 text-[12px] font-semibold text-wine">
              {String.fromCharCode(65 + i)}
            </span>
            {opt}
          </button>
        ))}
      </div>
      <p className="mt-4 min-h-[24px] text-[14px] text-muted" aria-live="polite">
        {status === 'wrong' ? t.wrongHint : status === 'right' ? t.correctHint : ''}
      </p>
    </div>
  )
}

/* ───────────────────────── 2. Стирающаяся карточка ───────────────────────── */

function Scratch({ onDone }: { onDone: () => void }) {
  const t = content.quest.scratch
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [cleared, setCleared] = useState(false)
  const drawing = useRef(false)
  const lastCheck = useRef(0)
  const later = useTimeouts()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const rect = canvas.getBoundingClientRect()
    canvas.width = Math.round(rect.width * dpr)
    canvas.height = Math.round(rect.height * dpr)
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return
    ctx.scale(dpr, dpr)

    // покрытие: тёплый беж с лёгким узором, как плотная бумага
    const g = ctx.createLinearGradient(0, 0, rect.width, rect.height)
    g.addColorStop(0, '#e2d4bf')
    g.addColorStop(1, '#d6c6ad')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, rect.width, rect.height)
    ctx.strokeStyle = 'rgba(64,53,47,0.08)'
    ctx.lineWidth = 1
    for (let x = -rect.height; x < rect.width; x += 12) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x + rect.height, rect.height)
      ctx.stroke()
    }
    ctx.fillStyle = 'rgba(135,76,82,0.85)'
    ctx.font = '600 12px Manrope, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(t.hint.toUpperCase(), rect.width / 2, rect.height / 2 + 4)
  }, [t.hint])

  function checkProgress(force = false) {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d', { willReadFrequently: true })
    if (!canvas || !ctx || cleared) return
    const now = performance.now()
    if (!force && now - lastCheck.current < 100) return
    lastCheck.current = now
    const { width, height } = canvas
    const data = ctx.getImageData(0, 0, width, height).data
    let transparent = 0
    let total = 0
    for (let i = 3; i < data.length; i += 4 * 9) {
      total++
      if (data[i] < 40) transparent++
    }
    if (transparent / total > 0.55) {
      setCleared(true)
      later(onDone, 1600)
    }
  }

  function scratchAt(clientX: number, clientY: number) {
    const canvas = canvasRef.current
    if (!canvas || cleared) return
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return
    const rect = canvas.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top
    ctx.globalCompositeOperation = 'destination-out'
    ctx.fillStyle = '#000' // непрозрачная «кисть» — стирает до полной прозрачности
    ctx.beginPath()
    ctx.arc(x, y, 22, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalCompositeOperation = 'source-over'
    checkProgress()
  }

  return (
    <div>
      <Heading title={t.title} sub={t.hint} />
      <div
        className="relative mt-6 overflow-hidden rounded-xl border border-cocoa/10 bg-ivory"
        style={{ touchAction: 'none' }}
      >
        <div className="grid min-h-[150px] place-items-center px-5 py-8 text-center">
          <div>
            <p className="display text-[26px] text-wine sm:text-[30px]">{t.secret}</p>
            <p className="mt-2 text-[13px] font-semibold tracking-[0.08em] text-muted uppercase">{t.secretSub}</p>
          </div>
        </div>
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full cursor-pointer"
          style={{ opacity: cleared ? 0 : 1, transition: 'opacity 700ms ease' }}
          role="img"
          aria-label={t.hint}
          onPointerDown={(e) => {
            drawing.current = true
            e.currentTarget.setPointerCapture(e.pointerId)
            scratchAt(e.clientX, e.clientY)
          }}
          onPointerMove={(e) => drawing.current && scratchAt(e.clientX, e.clientY)}
          onPointerUp={() => {
            drawing.current = false
            checkProgress(true)
          }}
          onPointerCancel={() => (drawing.current = false)}
        />
      </div>
      <p className="mt-4 min-h-[24px] text-[14px] text-muted" aria-live="polite">
        {cleared ? t.done : ''}
      </p>
      {!cleared ? (
        <button
          type="button"
          className="mt-1 text-[12px] font-semibold tracking-[0.02em] text-muted underline-offset-4 hover:underline"
          onClick={() => {
            setCleared(true)
            later(onDone, 1200)
          }}
        >
          Қырып болмай жатыр ма? — ашып көрсет
        </button>
      ) : null}
    </div>
  )
}

/* ───────────────────────── 3. Найди пару ───────────────────────── */

type Card = { id: number; key: string; node: ReactNode }

function buildDeck(): Card[] {
  // 4 пары: сначала наши фото (до 4), недостающие пары добираем значками
  const icons: { key: string; node: ReactNode }[] = [
    { key: 'masks', node: <MasksIcon /> },
    { key: 'heart', node: <HeartIcon /> },
    { key: 'ticket', node: <TicketIcon /> },
    { key: 'star', node: <StarIcon /> },
  ]
  const faces: { key: string; node: ReactNode }[] = content.gallery.photos
    .slice(0, 4)
    .map((p) => ({ key: p.src, node: <img src={p.src} alt="" /> }))
  faces.push(...icons.slice(0, 4 - faces.length))
  const cards = faces.flatMap((f, i) => [
    { id: i * 2, key: f.key, node: f.node },
    { id: i * 2 + 1, key: f.key, node: f.node },
  ])
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[cards[i], cards[j]] = [cards[j], cards[i]]
  }
  return cards
}

function Memory({ onDone }: { onDone: () => void }) {
  const t = content.quest.memory
  const [deck] = useState(buildDeck)
  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<Set<string>>(new Set())
  const [moves, setMoves] = useState(0)
  const lock = useRef(false)
  const later = useTimeouts()
  const pairs = deck.length / 2

  function flip(card: Card) {
    if (lock.current || flipped.includes(card.id) || matched.has(card.key)) return
    const next = [...flipped, card.id]
    setFlipped(next)
    if (next.length === 2) {
      setMoves((m) => m + 1)
      const [a, b] = next.map((id) => deck.find((c) => c.id === id)!)
      if (a.key === b.key) {
        const m = new Set(matched)
        m.add(a.key)
        later(() => {
          setMatched(m)
          setFlipped([])
          if (m.size === pairs) later(onDone, 900)
        }, 350)
      } else {
        lock.current = true
        later(() => {
          setFlipped([])
          lock.current = false
        }, 850)
      }
    }
  }

  return (
    <div>
      <Heading title={t.title} sub={`${matched.size} / ${pairs} · ${moves} жүріс`} />
      <p className="mt-2 text-[14px] text-muted">{t.hint}</p>
      <div className="mem-scene mt-6 grid grid-cols-4 gap-2.5 sm:gap-3">
        {deck.map((card) => {
          const isUp = flipped.includes(card.id) || matched.has(card.key)
          return (
            <button
              key={card.id}
              type="button"
              className={[
                'mem-card',
                isUp ? 'is-flipped' : '',
                matched.has(card.key) ? 'is-matched' : '',
              ].join(' ')}
              onClick={() => flip(card)}
              aria-label={isUp ? 'Ашық карта' : 'Жабық карта'}
              aria-pressed={isUp}
            >
              <span className="face front">
                <SmallHeart />
              </span>
              <span className="face back text-wine">{card.node}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ───────────────────────── мелочи ───────────────────────── */

function Heading({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
      <h3 className="display text-[21px] text-wine">{title}</h3>
      {sub ? <span className="shrink-0 text-[12px] font-semibold tracking-[0.04em] text-muted">{sub}</span> : null}
    </div>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12.5 10 17 19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function SmallHeart() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 20.3 4.7 13.2a4.4 4.4 0 0 1 6.2-6.2l1.1 1 1.1-1a4.4 4.4 0 1 1 6.2 6.2L12 20.3Z" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
    </svg>
  )
}
function HeartIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 20.3 4.7 13.2a4.4 4.4 0 0 1 6.2-6.2l1.1 1 1.1-1a4.4 4.4 0 1 1 6.2 6.2L12 20.3Z" fill="currentColor" />
    </svg>
  )
}
function MasksIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 5c2.2-.8 4.6-.8 6.8 0v6.2c0 2.8-1.5 4.8-3.4 4.8S4 14 4 11.2V5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M13.2 8c2.2-.8 4.6-.8 6.8 0v6.2c0 2.8-1.5 4.8-3.4 4.8s-3.4-2-3.4-4.8V8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M6 8.5h1.2M8.6 8.5h1.2M15.2 11.5h1.2M17.8 11.5H19M6 12c.9.8 2 .8 2.8 0M15.4 16c.9-.8 2-.8 2.8 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}
function TicketIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3.5 8.5v-2h17v2a1.8 1.8 0 0 0 0 3.5v2a1.8 1.8 0 0 0 0 3.5v2h-17v-2a1.8 1.8 0 0 0 0-3.5v-2a1.8 1.8 0 0 0 0-3.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 7v11" stroke="currentColor" strokeWidth="1.3" strokeDasharray="2 2" />
    </svg>
  )
}
function StarIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1.1 5.9L12 16.9l-5.3 2.8 1.1-5.9-4.3-4.1 5.9-.8L12 3.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}
