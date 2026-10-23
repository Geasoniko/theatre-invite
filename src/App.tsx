import { useEffect, useRef, useState } from 'react'
import { Envelope } from './components/Envelope'
import { Letter } from './components/Letter'
import { Gallery } from './components/Gallery'
import { Quest } from './components/Quest'
import { Ticket } from './components/Ticket'
import { useReducedMotion } from './hooks'

/**
 * Маленькая история в пять шагов:
 * конверт → письмо → фотографии → квест за билетом → билет
 */
export default function App() {
  const [opened, setOpened] = useState(false) // конверт открыт — показываем письмо
  const [reached, setReached] = useState(1) // до какого шага дошли: 1 письмо, 2 фото, 3 квест, 4 билет
  const reduced = useReducedMotion()

  const galleryRef = useRef<HTMLDivElement>(null)
  const questRef = useRef<HTMLDivElement>(null)
  const ticketRef = useRef<HTMLDivElement>(null)

  function goTo(step: number, ref: React.RefObject<HTMLDivElement | null>) {
    setReached((r) => Math.max(r, step))
    // ждём, пока секция появится в DOM, затем мягко прокручиваем
    window.setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
    }, 60)
  }

  function reopen() {
    setOpened(false)
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
  }

  useEffect(() => {
    if (opened) window.scrollTo({ top: 0, behavior: 'auto' })
  }, [opened])

  return (
    <main className="relative">
      <div className="page-grain" aria-hidden="true" />

      {opened ? (
        <Letter onContinue={() => goTo(2, galleryRef)} onReopen={reopen} />
      ) : (
        <Envelope onOpened={() => setOpened(true)} />
      )}

      {reached >= 2 ? (
        <div ref={galleryRef}>
          <Gallery onContinue={() => goTo(3, questRef)} />
        </div>
      ) : null}

      {reached >= 3 ? (
        <div ref={questRef}>
          <Quest onUnlock={() => goTo(4, ticketRef)} />
        </div>
      ) : null}

      {reached >= 4 ? (
        <div ref={ticketRef}>
          <Ticket />
        </div>
      ) : null}

      <footer className="relative z-10 pb-10 text-center text-[12px] tracking-[0.04em] text-muted">
        ❤
      </footer>
    </main>
  )
}
