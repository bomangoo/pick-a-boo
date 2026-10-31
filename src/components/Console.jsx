import { useLayoutEffect, useRef, useState } from 'react'
import { W, H, spriteUrl } from './common'
import { pressAction, releaseAction } from '../input'
import { BRAND } from '../config'

// 화면 크기에 맞춰 게임 화면(4:3)과 터치 버튼 자리를 계산합니다.
// 세로(아이패드를 세웠을 때)가 기본: 위에 화면, 아래에 방향패드와 A·B 버튼.
// 가로로 눕히면 화면 양옆으로 버튼이 갑니다.
function useLayout() {
  const read = () => ({ vw: window.innerWidth, vh: window.innerHeight })
  const [size, setSize] = useState(read)
  useLayoutEffect(() => {
    const fit = () => setSize(read())
    window.addEventListener('resize', fit)
    window.addEventListener('orientationchange', fit)
    return () => {
      window.removeEventListener('resize', fit)
      window.removeEventListener('orientationchange', fit)
    }
  }, [])
  const { vw, vh } = size
  const portrait = vh >= vw * 0.9
  if (portrait) {
    const pad = vw * 0.035
    const bezel = vw * 0.035
    const label = vw * 0.05
    let sw = vw - 2 * pad - 2 * bezel
    if (sw * 0.75 > vh * 0.6) sw = (vh * 0.6) / 0.75
    const sh = sw * 0.75
    const ctrlH = vh - (pad + 2 * bezel + label + sh)
    const u = Math.min(vw / 768, ctrlH / 400)
    return { portrait, vw, vh, pad, bezel, label, sw, sh, ctrlH, u }
  }
  const pad = vh * 0.03
  const bezel = vh * 0.035
  const label = vh * 0.05
  let sh = vh - 2 * pad - 2 * bezel - label
  let sw = sh / 0.75
  if (sw + 2 * bezel > vw * 0.62) {
    sw = vw * 0.62 - 2 * bezel
    sh = sw * 0.75
  }
  const side = (vw - sw - 2 * bezel) / 2
  const u = Math.min(side / 300, vh / 768)
  return { portrait, vw, vh, pad, bezel, label, sw, sh, side, u }
}

const DIRS = ['right', 'down', 'left', 'up']
// 8방향 구역 → 눌린 방향들
const SECTORS = [['right'], ['right', 'down'], ['down'], ['down', 'left'], ['left'], ['left', 'up'], ['up'], ['up', 'right']]

function DPad({ size }) {
  const [on, setOn] = useState([])
  const cur = useRef([])
  const ref = useRef(null)

  const apply = (next) => {
    for (const d of cur.current) if (!next.includes(d)) releaseAction(d)
    for (const d of next) if (!cur.current.includes(d)) pressAction(d)
    cur.current = next
    setOn(next)
  }
  const track = (e) => {
    const r = ref.current.getBoundingClientRect()
    const dx = e.clientX - (r.left + r.width / 2)
    const dy = e.clientY - (r.top + r.height / 2)
    if (Math.hypot(dx, dy) < r.width * 0.1) return apply([])
    const sector = (Math.round(Math.atan2(dy, dx) / (Math.PI / 4)) + 8) % 8
    apply(SECTORS[sector])
  }
  const end = () => apply([])

  const arm = size / 3
  return (
    <div
      ref={ref}
      className="dpad"
      style={{ width: size, height: size }}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId)
        track(e)
      }}
      onPointerMove={(e) => e.buttons && track(e)}
      onPointerUp={end}
      onPointerCancel={end}
      onLostPointerCapture={end}
    >
      <div className="dpad-ring" />
      <div className="dpad-bar" style={{ left: arm, top: 0, width: arm, height: size }} />
      <div className="dpad-bar" style={{ left: 0, top: arm, width: size, height: arm }} />
      {DIRS.map((d, i) => (
        <div
          key={d}
          className={`dpad-arrow ${on.includes(d) ? 'on' : ''}`}
          style={{
            left: size / 2 + Math.cos((i * Math.PI) / 2) * arm - arm / 2,
            top: size / 2 + Math.sin((i * Math.PI) / 2) * arm - arm / 2,
            width: arm,
            height: arm,
            fontSize: arm * 0.4,
          }}
        >
          {['▶', '▼', '◀', '▲'][i]}
        </div>
      ))}
      <div className="dpad-center" style={{ left: arm * 1.3, top: arm * 1.3, width: arm * 0.4, height: arm * 0.4 }} />
    </div>
  )
}

function RoundButton({ action, label, sub, size }) {
  const [down, setDown] = useState(false)
  const press = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    setDown(true)
    pressAction(action)
  }
  const release = () => {
    setDown(false)
    releaseAction(action)
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: size * 0.1 }}>
      <div
        className={`round-btn ${action} ${down ? 'down' : ''}`}
        style={{ width: size, height: size, fontSize: size * 0.42 }}
        onPointerDown={press}
        onPointerUp={release}
        onPointerCancel={release}
        onLostPointerCapture={release}
      >
        {label}
      </div>
      <div className="btn-label" style={{ fontSize: size * 0.2 }}>
        {sub}
      </div>
    </div>
  )
}

function ABButtons({ u }) {
  const s = 128 * u
  return (
    <div style={{ position: 'relative', width: s * 2.3, height: s * 1.9 }}>
      <div style={{ position: 'absolute', left: 0, bottom: 0 }}>
        <RoundButton action="b" label="B" sub="뒤로" size={s} />
      </div>
      <div style={{ position: 'absolute', right: 0, top: 0 }}>
        <RoundButton action="a" label="A" sub="확인" size={s} />
      </div>
    </div>
  )
}

function Speaker({ u }) {
  return (
    <div style={{ display: 'flex', gap: 10 * u, transform: 'rotate(-28deg)' }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} style={{ width: 9 * u, height: 70 * u, borderRadius: 9 * u, background: 'rgba(90,61,51,.28)', boxShadow: 'inset 0 2px 3px rgba(0,0,0,.2)' }} />
      ))}
    </div>
  )
}

function Brand({ u }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 * u }}>
      <img src={spriteUrl('logo')} alt="" style={{ height: 46 * u }} />
      <div style={{ lineHeight: 1.15 }}>
        <div style={{ fontWeight: 700, fontSize: 24 * u, color: '#b4475a', letterSpacing: 1 }}>Pick-a-Boo!</div>
        <div style={{ fontSize: 14 * u, color: 'var(--ink-soft)' }}>{BRAND.instagramHandle}</div>
      </div>
    </div>
  )
}

export default function Console({ children }) {
  const L = useLayout()
  const scale = L.sw / W
  const screen = (
    <div className="bezel" style={{ padding: L.bezel, paddingBottom: L.label + L.bezel * 0.4, borderRadius: L.bezel * 1.1 }}>
      <div className="screen" style={{ width: L.sw, height: L.sh }}>
        <div className="stage" style={{ width: W, height: H, transform: `scale(${scale})` }}>
          {children}
        </div>
      </div>
      <div className="bezel-label" style={{ height: L.label + L.bezel * 0.4, fontSize: L.label * 0.42, paddingLeft: L.bezel }}>
        <span className="power-led" style={{ width: L.label * 0.22, height: L.label * 0.22 }} />
        <span>
          ♥ {BRAND.brandName} · <i>{BRAND.tagline}</i>
        </span>
      </div>
    </div>
  )

  const u = L.u
  if (L.portrait) {
    const pad = Math.min(300 * u, L.ctrlH * 0.6)
    return (
      <div className="console" onContextMenu={(e) => e.preventDefault()} style={{ padding: `${L.pad}px ${L.pad}px 0` }}>
        {screen}
        <div
          style={{
            width: '100%',
            height: L.ctrlH,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            padding: `0 ${30 * u}px env(safe-area-inset-bottom)`,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <DPad size={pad} />
            <ABButtons u={pad / 300} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `0 ${10 * u}px 0 ${6 * u}px` }}>
            <Brand u={u} />
            <Speaker u={u * 0.8} />
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="console" onContextMenu={(e) => e.preventDefault()} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: L.side, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 50 * u }}>
        <DPad size={250 * u} />
        <Brand u={u * 0.9} />
      </div>
      {screen}
      <div style={{ width: L.side, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 60 * u }}>
        <ABButtons u={u * 0.85} />
        <Speaker u={u * 0.8} />
      </div>
    </div>
  )
}
