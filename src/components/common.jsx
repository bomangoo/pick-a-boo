import { useEffect, useMemo, useRef, useState } from 'react'
import { usePress } from '../input'
import { sfx } from '../sound'

export const W = 1024
export const H = 768

export const asset = (path) => `${import.meta.env.BASE_URL}assets/${path}`
export const spriteUrl = (name) => asset(`sprites/${name}.png`)

// 받침 유무에 따라 조사 고르기: josa('딸기잼', '을', '를') → '딸기잼을'
export function josa(word, withFinal, withoutFinal) {
  const code = word.charCodeAt(word.length - 1) - 0xac00
  const hasFinal = code >= 0 && code <= 11171 && code % 28 !== 0
  return word + (hasFinal ? withFinal : withoutFinal)
}

// 종이 질감 노이즈 (한 번만 생성)
let grainUrl = null
function makeGrain() {
  if (grainUrl) return grainUrl
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const g = c.getContext('2d')
  const img = g.createImageData(256, 256)
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 150 + Math.random() * 105
    img.data[i] = v
    img.data[i + 1] = v * 0.96
    img.data[i + 2] = v * 0.9
    img.data[i + 3] = 255
  }
  g.putImageData(img, 0, 0)
  grainUrl = c.toDataURL()
  return grainUrl
}
export function Grain() {
  const url = useMemo(makeGrain, [])
  return <div className="grain" style={{ backgroundImage: `url(${url})` }} />
}

// 크레용 느낌을 주는 SVG 필터 (정적인 배경 그림에만 사용)
export function SvgDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden>
      <defs>
        <filter id="crayon" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="3" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="8" result="g" />
          <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.2 1.1" result="ga" />
          <feComposite in="d" in2="ga" operator="in" result="tex" />
          <feBlend in="tex" in2="d" mode="multiply" />
        </filter>
        <pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <line x1="0" y1="0" x2="0" y2="7" stroke="rgba(90,60,40,0.10)" strokeWidth="2" />
        </pattern>
      </defs>
    </svg>
  )
}

// 원형 전환
export function Iris({ closed }) {
  return <div className={`iris ${closed ? 'closed' : ''}`} />
}

export function Key({ k }) {
  const map = { a: ['a', 'A'], b: ['b', 'B'], left: ['', '◀'], right: ['', '▶'], up: ['', '▲'], down: ['', '▼'], arrows: ['', '◀▲▼▶'] }
  const [cls, label] = map[k]
  return <span className={`key ${cls}`}>{label}</span>
}

// ───────── 고전 RPG 대화창 (타자기 효과) ─────────
// lines: [{ text, speaker?, portrait? }], 다 읽으면 onDone
// auto: 한 줄이 다 나온 뒤 자동으로 넘어가는 시간(ms). 0 이면 A 를 눌러야 넘어감.
export function Dialog({ lines, onDone, auto = 2600, speed = 38 }) {
  const [idx, setIdx] = useState(0)
  const [shown, setShown] = useState(0)
  const line = lines[Math.min(idx, lines.length - 1)]
  const full = line.text.length
  const done = shown >= full
  const doneRef = useRef(false)

  useEffect(() => {
    setShown(0)
  }, [idx])

  useEffect(() => {
    if (done) return
    const t = setTimeout(() => {
      setShown((s) => s + 1)
      if (line.text[shown] && line.text[shown] !== ' ' && shown % 2 === 0) sfx.text()
    }, speed)
    return () => clearTimeout(t)
  }, [shown, done, line, speed])

  const next = () => {
    if (idx + 1 < lines.length) setIdx(idx + 1)
    else if (!doneRef.current) {
      doneRef.current = true
      onDone?.()
    }
  }

  const nextRef = useRef(next)
  nextRef.current = next
  useEffect(() => {
    if (!done || !auto) return
    const t = setTimeout(() => nextRef.current(), line.hold ?? auto)
    return () => clearTimeout(t)
  }, [done, idx, auto, line.hold])

  usePress((a) => {
    if (a !== 'a') return
    if (!done) setShown(full)
    else next()
  })

  return (
    <div className={`dialog pixel-box ${line.portrait ? 'with-portrait' : ''}`} key={idx}>
      {line.speaker && <div className="speaker">{line.speaker}</div>}
      {line.text.slice(0, shown)}
      {line.portrait && <img className="portrait sprite" src={spriteUrl(line.portrait)} alt="" style={{ position: 'absolute' }} />}
      {done && <span className="next blink">▼</span>}
    </div>
  )
}

// ───────── 반짝이 터짐 ─────────
const SPARK_COLORS = ['#ffd76a', '#ff9fb0', '#fff3c4', '#9fd8c4', '#ffb27a']
export function Burst({ x, y, count = 18, spread = 160, size = 22, seed = 0 }) {
  const parts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const ang = (i / count) * Math.PI * 2 + Math.random() * 0.5
        const r = spread * (0.5 + Math.random() * 0.6)
        return {
          dx: Math.cos(ang) * r,
          dy: Math.sin(ang) * r,
          c: SPARK_COLORS[i % SPARK_COLORS.length],
          s: size * (0.5 + Math.random() * 0.8),
          d: Math.random() * 0.25,
          star: i % 3 !== 0,
        }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [seed, count, spread, size],
  )
  return (
    <>
      {parts.map((p, i) => (
        <svg
          key={`${seed}-${i}`}
          className="particle sparkle"
          width={p.s}
          height={p.s}
          viewBox="-10 -10 20 20"
          style={{ left: x - p.s / 2, top: y - p.s / 2, '--dx': `${p.dx}px`, '--dy': `${p.dy}px`, animationDelay: `${p.d}s`, zIndex: 1900 }}
        >
          {p.star ? (
            <path d="M0-10 L2.5-2.5 L10 0 L2.5 2.5 L0 10 L-2.5 2.5 L-10 0 L-2.5-2.5Z" fill={p.c} />
          ) : (
            <path d="M0 8 C-12-2 -5-11 0-4 C5-11 12-2 0 8Z" fill={p.c} />
          )}
        </svg>
      ))}
    </>
  )
}

// ───────── 꽃가루 (1·2등 축하) ─────────
export function Confetti({ count = 60 }) {
  const parts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: Math.random() * W,
        dur: 3.5 + Math.random() * 3,
        delay: -Math.random() * 6,
        sway: `${(Math.random() - 0.5) * 240}px`,
        c: ['#f6c9cf', '#f6d58b', '#9fd8c4', '#e8826b', '#fff', '#b9a6e0'][i % 6],
        w: 8 + Math.random() * 10,
        heart: i % 5 === 0,
      })),
    [count],
  )
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 4500 }}>
      {parts.map((p, i) =>
        p.heart ? (
          <svg
            key={i}
            className="particle confetti"
            width={p.w * 1.6}
            height={p.w * 1.6}
            viewBox="-10 -10 20 20"
            style={{ left: p.left, animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s`, '--sway': p.sway }}
          >
            <path d="M0 8 C-12-2 -5-11 0-4 C5-11 12-2 0 8Z" fill="#ef8f9f" />
          </svg>
        ) : (
          <div
            key={i}
            className="particle confetti"
            style={{
              left: p.left,
              width: p.w,
              height: p.w * 0.6,
              background: p.c,
              borderRadius: 2,
              animationDuration: `${p.dur}s`,
              animationDelay: `${p.delay}s`,
              '--sway': p.sway,
            }}
          />
        ),
      )}
    </div>
  )
}

export function Rays({ x, y, size = 520, style }) {
  return <div className="rays" style={{ left: x - size / 2, top: y - size / 2, width: size, height: size, ...style }} />
}

// 바닥 그림자 + 스프라이트 (발 위치 x,y 기준 배치)
// className 의 애니메이션은 안쪽 래퍼에 걸려서 좌우 반전과 충돌하지 않습니다.
export function Actor({ name, x, y, h, flip, className = '', style, innerStyle, shadow = true, z, imgClass = '' }) {
  return (
    <div style={{ position: 'absolute', left: x, top: y, zIndex: z ?? Math.round(y), ...style }}>
      {shadow && <div className="shadow" style={{ left: -h * 0.27, top: -9, width: h * 0.54, height: 16 }} />}
      <div
        className={className}
        style={{ position: 'absolute', left: 0, bottom: 0, width: 0, display: 'flex', justifyContent: 'center', transformOrigin: '50% 100%', ...innerStyle }}
      >
        <img
          className={`sprite ${imgClass}`}
          src={spriteUrl(name)}
          alt=""
          style={{ position: 'relative', height: h, flex: 'none', transform: flip ? 'scaleX(-1)' : 'none' }}
        />
      </div>
    </div>
  )
}

// 천천히 떨어지는 낙엽 / 눈 / 꽃잎
export function Falling({ kind, count = 16 }) {
  const parts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: Math.random() * W,
        dur: 7 + Math.random() * 6,
        delay: -Math.random() * 12,
        sway: `${(Math.random() - 0.3) * 200}px`,
        s: 14 + Math.random() * 18,
        i,
      })),
    [count],
  )
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1000 }}>
      {parts.map((p) => {
        const style = { left: p.left, animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s`, '--sway': p.sway }
        if (kind === 'maple')
          return <img key={p.i} className="particle confetti" src={spriteUrl(p.i % 3 ? 'maple' : 'acorn')} alt="" style={{ ...style, height: p.s * 1.4 }} />
        if (kind === 'snow')
          return <div key={p.i} className="particle confetti" style={{ ...style, width: p.s * 0.6, height: p.s * 0.6, borderRadius: '50%', background: '#fff', opacity: 0.9 }} />
        const c = kind === 'pumpkin' ? ['#fff3c4', '#f6d58b', '#e7d6f5'][p.i % 3] : ['#f6c9cf', '#fffaf0', '#f6d58b'][p.i % 3]
        return (
          <svg key={p.i} className="particle confetti" width={p.s} height={p.s} viewBox="-10 -10 20 20" style={style}>
            {kind === 'pumpkin' ? (
              <path d="M0-10 L2.5-2.5 L10 0 L2.5 2.5 L0 10 L-2.5 2.5 L-10 0 L-2.5-2.5Z" fill={c} />
            ) : (
              <ellipse rx="6" ry="9" fill={c} />
            )}
          </svg>
        )
      })}
    </div>
  )
}
