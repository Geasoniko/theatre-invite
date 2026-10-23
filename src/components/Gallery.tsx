import { useEffect, useState } from 'react'
import { content, type Photo } from '../content'
import { useReveal } from '../hooks'

type Props = {
  onContinue: () => void
}

const TILTS = [-3.2, 2.4, -1.6, 3, -2.4, 1.8, -2.8, 2.2]

export function Gallery({ onContinue }: Props) {
  const t = content.gallery
  const photos = t.photos
  const [open, setOpen] = useState<Photo | null>(null)
  const ref = useReveal<HTMLDivElement>()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const items: (Photo | null)[] = photos.length ? photos : [null, null, null, null]

  return (
    <section className="relative z-10 px-5 pb-24 pt-20 sm:pt-28" aria-label="Фотолар">
      <div ref={ref} className="reveal mx-auto max-w-5xl">
        <p className="eyebrow text-center">{t.subtitle}</p>
        <h2 className="display mx-auto mt-4 max-w-md text-center text-[30px] text-cocoa sm:text-[40px]">
          {t.title}
        </h2>

        <div className="mt-14 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 sm:gap-x-8 lg:grid-cols-4">
          {items.map((photo, i) => (
            <PolaroidCard
              key={i}
              photo={photo}
              tilt={TILTS[i % TILTS.length]}
              offset={i % 2 === 1 ? 18 : 0}
              onOpen={() => photo && setOpen(photo)}
            />
          ))}
        </div>

        {photos.length === 0 ? (
          <p className="mx-auto mt-10 max-w-sm text-center text-[13px] leading-relaxed text-muted">
            Положи фотографии в папку <code className="rounded bg-beige/60 px-1.5 py-0.5">public/photos</code> и
            перечисли их в <code className="rounded bg-beige/60 px-1.5 py-0.5">src/content.ts → gallery.photos</code>.
          </p>
        ) : null}

        <div className="mt-16 flex justify-center">
          <button type="button" className="btn btn-ghost" onClick={onContinue}>
            {t.continueButton}
          </button>
        </div>
      </div>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={open.caption ?? 'Фото'}
          className="fixed inset-0 z-50 grid place-items-center bg-cocoa/70 p-5"
          onClick={() => setOpen(null)}
          style={{ overscrollBehavior: 'contain' }}
        >
          <figure
            className="polaroid relative max-h-[88dvh] w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
            style={{ transform: 'rotate(0deg)' }}
          >
            <div className="photo !aspect-auto max-h-[70dvh]">
              <img src={open.src} alt={open.caption ?? ''} className="!h-auto max-h-[70dvh] w-full !object-contain" />
            </div>
            {(open.caption || open.date) && (
              <figcaption className="flex items-baseline justify-between gap-3 px-1 pt-3">
                <span className="caption">{open.caption}</span>
                <span className="text-[12px] tracking-[0.04em] text-muted">{open.date}</span>
              </figcaption>
            )}
            <button
              type="button"
              className="btn btn-ghost mt-3 w-full !min-h-[44px]"
              onClick={() => setOpen(null)}
            >
              Жабу
            </button>
          </figure>
        </div>
      ) : null}
    </section>
  )
}

function PolaroidCard({
  photo,
  tilt,
  offset,
  onOpen,
}: {
  photo: Photo | null
  tilt: number
  offset: number
  onOpen: () => void
}) {
  const t = content.gallery
  const base = (
    <>
      <span className="tape" aria-hidden="true" />
      {photo ? (
        <div className="photo">
          <img src={photo.src} alt={photo.caption ?? ''} loading="lazy" width={600} height={600} />
        </div>
      ) : (
        <div className="ph-photo">
          <div className="flex flex-col items-center gap-2 px-3 text-center">
            <CameraIcon />
            <span className="text-[12px] leading-snug">{t.placeholderHint}</span>
          </div>
        </div>
      )}
      <div className="flex min-h-[26px] items-baseline justify-between gap-2 px-0.5 pt-3">
        <span className="caption">{photo?.caption ?? ''}</span>
        <span className="text-[11px] tracking-[0.04em] text-muted">{photo?.date ?? ''}</span>
      </div>
    </>
  )

  const style = { transform: `rotate(${tilt}deg) translateY(${offset}px)` }

  if (!photo) {
    return (
      <div className="polaroid relative" style={style}>
        {base}
      </div>
    )
  }
  return (
    <button
      type="button"
      className="polaroid relative block w-full text-left"
      style={style}
      onClick={onOpen}
      aria-label={photo.caption ? `Ашу: ${photo.caption}` : 'Фотоны ашу'}
    >
      {base}
    </button>
  )
}

function CameraIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 8.5h3l1.3-2h7.4l1.3 2h3v10H4v-10Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="12" cy="13" r="3.2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}
