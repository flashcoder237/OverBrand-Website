'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

export function ProjectGallery({
  images,
  title,
  position,
}: {
  images: string[]
  title: string
  position: string
}) {
  const [lightbox, setLightbox] = useState<number | null>(null)

  if (images.length === 1) {
    return (
      <>
        <div
          className="flex justify-center overflow-hidden cursor-pointer"
          style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}
          onClick={() => setLightbox(0)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[0]}
            alt={title}
            style={{
              height: 'clamp(300px, 50vw, 600px)',
              width: 'auto',
              maxWidth: '100%',
              display: 'block',
              objectFit: 'contain',
              objectPosition: position,
              transition: 'transform 0.7s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          />
        </div>
        {lightbox !== null && (
          <Lightbox images={images} index={lightbox} onClose={() => setLightbox(null)} position={position} />
        )}
      </>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {images.map((src, i) => (
          <div
            key={i}
            className={`relative overflow-hidden cursor-pointer group ${i === 0 ? 'md:col-span-2' : ''}`}
            style={{
              height: i === 0 ? 'clamp(300px, 45vw, 560px)' : 'clamp(200px, 28vw, 360px)',
              border: '1px solid var(--border)',
            }}
            onClick={() => setLightbox(i)}
          >
            <Image
              src={src}
              alt={`${title} — ${i + 1}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              style={{ objectPosition: i === 0 ? position : 'center' }}
              sizes={i === 0 ? '100vw' : '50vw'}
            />
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
              style={{ background: 'rgba(5,13,26,0.4)' }}
            >
              <span className="text-xs font-bold uppercase tracking-widest text-white px-4 py-2"
                style={{ background: 'rgba(40,85,160,0.8)', clipPath: 'polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)' }}
              >
                Agrandir
              </span>
            </div>
          </div>
        ))}
      </div>

      {lightbox !== null && (
        <Lightbox images={images} index={lightbox} onClose={() => setLightbox(null)} position={position} />
      )}
    </>
  )
}

function Lightbox({
  images,
  index,
  onClose,
  position,
}: {
  images: string[]
  index: number
  onClose: () => void
  position: string
}) {
  const [current, setCurrent] = useState(index)

  function prev() { setCurrent((c) => (c - 1 + images.length) % images.length) }
  function next() { setCurrent((c) => (c + 1) % images.length) }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.92)' }}
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center z-10 transition-opacity hover:opacity-60"
        style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}
        onClick={onClose}
      >
        <X size={18} />
      </button>

      {images.length > 1 && (
        <>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center z-10 transition-opacity hover:opacity-60"
            style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}
            onClick={(e) => { e.stopPropagation(); prev() }}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center z-10 transition-opacity hover:opacity-60"
            style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}
            onClick={(e) => { e.stopPropagation(); next() }}
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      <div
        className="relative max-w-5xl w-full mx-8"
        style={{ maxHeight: '85vh', aspectRatio: '16/9' }}
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={images[current]}
          alt={`Image ${current + 1}`}
          fill
          className="object-contain"
          style={{ objectPosition: current === 0 ? position : 'center' }}
          sizes="100vw"
        />
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setCurrent(i) }}
              className="w-2 h-2 transition-all"
              style={{
                background: i === current ? 'var(--primary)' : 'rgba(255,255,255,0.3)',
                transform: i === current ? 'scale(1.3)' : 'scale(1)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
