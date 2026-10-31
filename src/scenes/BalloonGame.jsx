import { memo, useEffect, useRef, useState } from 'react'
import { Actor, asset, Burst, Confetti, Dialog, Falling, Key, Rays, spriteUrl } from '../components/common'
import { Balloon, Bee, Cloud, GiftBox, GoldenTicket, Island, Snowman, VillageBackdrop } from '../components/art'
import { input, useFrame, usePress } from '../input'
import { sfx } from '../sound'
import { drawPrize } from '../prizes'
import { IDLE_TIMEOUT } from '../config'
import { BALLOON_GIFTS, BALLOON_INTRO, ISLANDS, balloonRevealLines } from '../story'

const BOUNDS = { x0: 90, x1: 934, y0: 250, y1: 740 }
const SPEED = 230
const REACH = 165
const GROUND = 585

// 마을마다 놓이는 작가님 일러스트 소품 [이름, x, y(발), 높이, 좌우반전]
const VILLAGE_DECO = {
  maple: [
    ['persimmon', 120, 660, 70],
    ['acorn', 190, 672, 44],
    ['berries', 900, 680, 90],
    ['acorn', 830, 650, 36],
  ],
  pumpkin: [
    ['pumpkin', 110, 640, 96],
    ['pumpkin', 900, 650, 80],
    ['berries', 220, 680, 70],
  ],
  windmill: [
    ['cosmos', 110, 660, 130],
    ['flower-pot', 890, 650, 80],
    ['strawberry-plant', 960, 680, 70],
  ],
}

const Sky = memo(function Sky() {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(#bfe3d6 0%, #dff0e4 45%, #fdf0dc 100%)' }} />
      <svg width="1024" height="768" style={{ position: 'absolute', inset: 0 }}>
        <g filter="url(#crayon)">
          <circle cx="512" cy="110" r="60" fill="#fff4d0" opacity="0.9" />
          <path d="M-30 700 C140 650 260 690 380 660 C520 625 640 690 780 660 C880 640 960 670 1054 650 V798 H-30Z" fill="#b9cf9e" opacity="0.65" />
          <path d="M-30 740 C180 710 320 740 500 720 C700 700 860 740 1054 720 V798 H-30Z" fill="#9fbf8a" opacity="0.7" />
        </g>
      </svg>
      {[
        [40, 26, 220, 70],
        [300, 330, 150, 95],
        [520, 60, 190, 80],
        [680, 400, 130, 110],
        [120, 420, 160, 120],
        [880, 120, 170, 90],
      ].map(([top, delay, w, dur], i) => (
        <div key={i} className="drift" style={{ position: 'absolute', top, left: 0, animationDuration: `${dur}s`, animationDelay: `-${delay}s` }}>
          <Cloud w={w} opacity={0.85} />
        </div>
      ))}
    </>
  )
})

function Friend({ island, x, y, className, h }) {
  const f = island.friend
  if (f.sprite) return <Actor name={f.sprite} x={x} y={y} h={h ?? f.h} flip={f.sprite === 'squirrel'} className={className} />
  return (
    <div style={{ position: 'absolute', left: x, top: y, zIndex: Math.round(y) }}>
      <div className="shadow" style={{ left: -40, top: -9, width: 80, height: 16 }} />
      <div className={className} style={{ position: 'absolute', left: 0, bottom: f.bee ? 40 : 0, width: 0, display: 'flex', justifyContent: 'center', transformOrigin: '50% 100%' }}>
        <div style={{ flex: 'none' }}>{f.snowman ? <Snowman h={h ?? f.h} /> : <Bee h={h ?? f.h} />}</div>
      </div>
    </div>
  )
}

export default function BalloonGame({ onFinish, onExit }) {
  const [phase, setPhase] = useState('intro') // intro → fly → landing → visit → box → reveal
  const [pos, setPos] = useState({ x: 512, y: 520 })
  const [tilt, setTilt] = useState(0)
  const [near, setNear] = useState(null)
  const [dest, setDest] = useState(null)
  const [rank, setRank] = useState(null)
  const [dialog, setDialog] = useState({ id: 'intro', lines: BALLOON_INTRO, auto: 2600 })
  const [visit, setVisit] = useState({ heroIn: false, heart: false, box: false, shake: 0, open: false })
  const vel = useRef({ x: 0, y: 0 })
  const tRef = useRef(0)
  const posRef = useRef(pos)
  posRef.current = pos

  const timers = useRef([])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])
  const at = (ms, fn) => timers.current.push(setTimeout(fn, ms))

  useFrame((dt) => {
    tRef.current += dt
    if (phase !== 'fly' && phase !== 'intro') return
    if (phase === 'fly' && input.idleFor() > IDLE_TIMEOUT) return onExit()
    const ax = phase === 'fly' ? input.axis() : { x: 0, y: 0 }
    const v = vel.current
    const k = Math.min(1, dt * 2.6)
    v.x += (ax.x * SPEED - v.x) * k
    v.y += (ax.y * SPEED - v.y) * k
    const p = posRef.current
    const nx = Math.max(BOUNDS.x0, Math.min(BOUNDS.x1, p.x + v.x * dt))
    const ny = Math.max(BOUNDS.y0, Math.min(BOUNDS.y1, p.y + v.y * dt))
    if (Math.abs(nx - p.x) + Math.abs(ny - p.y) > 0.01) setPos({ x: nx, y: ny })
    setTilt((v.x / SPEED) * 7)

    let best = null
    let bestD = REACH
    ISLANDS.forEach((isl, i) => {
      const d = Math.hypot(isl.x - nx, isl.y - 20 - (ny - 100))
      if (d < bestD) {
        bestD = d
        best = i
      }
    })
    if (phase === 'fly' && best !== near) {
      setNear(best)
      if (best !== null) sfx.select()
    }
  })

  function land(i) {
    const r = drawPrize('balloon')
    if (r === null) return onExit()
    sfx.confirm()
    sfx.whoosh()
    setRank(r)
    setDest(i)
    setNear(null)
    setPhase('landing')
    at(1900, () => startVisit(i, r))
  }

  function startVisit(i, r) {
    const isl = ISLANDS[i]
    setPhase('visit')
    at(300, () => setVisit((v) => ({ ...v, heroIn: true })))
    at(1700, () => {
      setVisit((v) => ({ ...v, heart: true }))
      sfx.heart()
    })
    at(2300, () =>
      setDialog({
        id: 'greet',
        lines: isl.greet.map((text) => ({ text, speaker: isl.friend.name, portrait: isl.friend.sprite })),
        auto: 2800,
        done: () => openBox(r, isl),
      }),
    )
  }

  function openBox(r, isl) {
    setDialog(null)
    setPhase('box')
    setVisit((v) => ({ ...v, box: true }))
    sfx.pop()
    at(800, () => {
      setVisit((v) => ({ ...v, shake: 1 }))
      sfx.shake()
    })
    at(1600, () => {
      setVisit((v) => ({ ...v, shake: 2 }))
      sfx.shake()
    })
    at(2200, () => {
      setVisit((v) => ({ ...v, shake: 3 }))
      sfx.shake()
    })
    at(2800, () => {
      setVisit((v) => ({ ...v, shake: 0, open: true }))
      setPhase('reveal')
      sfx.pop()
      if (r <= 2) sfx.fanfare()
      else sfx.reveal()
      setDialog({ id: 'reveal', lines: balloonRevealLines(r, isl), auto: 3000, done: () => onFinish({ game: 'balloon', rank: r, island: isl.id }) })
    })
  }

  usePress((a) => {
    if (phase !== 'fly') return
    if (a === 'a' && near !== null) land(near)
    if (a === 'b') {
      sfx.back()
      onExit()
    }
  })

  const bobY = Math.sin(tRef.current * 2.2) * 6
  const isl = dest !== null ? ISLANDS[dest] : null
  const onMap = phase === 'intro' || phase === 'fly' || phase === 'landing'

  if (onMap) {
    const landing = phase === 'landing'
    const bx = landing ? isl.x : pos.x
    const by = landing ? isl.y - 6 : pos.y + bobY
    return (
      <div className="scene">
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transformOrigin: isl ? `${isl.x}px ${isl.y}px` : '50% 50%',
            transform: landing ? 'scale(2.6)' : 'none',
            opacity: landing ? 0.0 : 1,
            transition: landing ? 'transform 1.8s ease-in, opacity 0.6s ease-in 1.3s' : 'none',
          }}
        >
          <Sky />
          {ISLANDS.map((it, i) => (
            <div key={it.id} style={{ position: 'absolute', left: it.x - 130, top: it.y - 150, zIndex: 10 }}>
              <div className="float-slow" style={{ animationDelay: `${-i * 1.3}s` }}>
                <Island island={it} glow={near === i} />
                <div style={{ position: 'absolute', left: 196, top: 162 - (it.friend.bee ? 20 : 0) }}>
                  <Friend island={it} x={0} y={0} h={it.friend.h * 0.42} className={near === i ? 'hop' : 'idle-breathe'} />
                </div>
                <div
                  className="pixel-box"
                  style={{ position: 'absolute', left: 130, top: 218, transform: 'translateX(-50%)', padding: '4px 12px', fontSize: 16, whiteSpace: 'nowrap', borderWidth: 3 }}
                >
                  {it.name}
                </div>
              </div>
            </div>
          ))}
          <div style={{ position: 'absolute', left: bx, top: by, zIndex: 50, transition: landing ? 'left 1.6s ease-in-out, top 1.6s ease-in-out' : 'none' }}>
            <Balloon w={130} tilt={landing ? 0 : tilt} />
          </div>
          {near !== null && phase === 'fly' && (
            <div className="bubble" style={{ left: pos.x, top: pos.y + bobY - 214, zIndex: 60 }}>
              <Key k="a" /> {ISLANDS[near].name}에 내리기
            </div>
          )}
        </div>
        {phase === 'fly' && (
          <div className="hint">
            <Key k="arrows" /> 열기구 움직이기 &nbsp;·&nbsp; 만나고 싶은 친구의 섬에서 <Key k="a" />
          </div>
        )}
        {dialog && <Dialog key={dialog.id} lines={dialog.lines} auto={dialog.auto} onDone={() => (setDialog(null), setPhase('fly'))} />}
      </div>
    )
  }

  // ───────── 마을 방문 ─────────
  const gift = BALLOON_GIFTS[rank]
  const revealed = phase === 'reveal'
  return (
    <div className="scene fade-in">
      {isl.id === 'snow' ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${asset('scenes/snow-village.webp')})`,
            backgroundSize: '1463px 1034px',
            backgroundPosition: '-439px 0',
          }}
        />
      ) : (
        <VillageBackdrop id={isl.id} />
      )}
      {isl.id !== 'snow' &&
        [
          [70, 0, 200, 80],
          [150, 40, 150, 60],
        ].map(([top, delay, w, dur], i) => (
          <div key={i} className="drift" style={{ position: 'absolute', top, left: 0, animationDuration: `${dur}s`, animationDelay: `-${delay}s` }}>
            <Cloud w={w} opacity={0.8} />
          </div>
        ))}
      {(VILLAGE_DECO[isl.id] || []).map(([name, x, y, h, flip], i) => (
        <Actor key={i} name={name} x={x} y={y} h={h} flip={flip} />
      ))}
      <Falling kind={isl.id} count={isl.id === 'snow' ? 40 : 16} />
      <div className="pixel-box" style={{ position: 'absolute', left: 32, top: 28, padding: '8px 18px', fontSize: 20, zIndex: 800 }}>
        {isl.name} <span style={{ color: 'var(--ink-soft)', fontSize: 15 }}>· {isl.en}</span>
      </div>

      <Actor
        name={revealed ? 'girl-cheer' : isl.heroSprite}
        x={visit.heroIn ? 330 : -120}
        y={GROUND}
        h={revealed ? 230 : 210}
        className={revealed ? 'cheer' : visit.heroIn && phase === 'visit' && !visit.heart ? 'walk' : 'idle-breathe'}
        style={{ transition: 'left 1.4s ease-out' }}
      />
      <Friend island={isl} x={700} y={GROUND} className={revealed || phase === 'visit' ? 'hop' : 'idle-breathe'} h={isl.friend.h * 1.35} />

      {visit.heart &&
        [0, 1, 2].map((i) => (
          <svg
            key={i}
            className="particle heart-float"
            width="44"
            height="44"
            viewBox="-10 -10 20 20"
            style={{ left: 490 + (i - 1) * 46, top: GROUND - 230, animationDelay: `${i * 0.25}s`, zIndex: 900 }}
          >
            <path d="M0 8 C-12-2 -5-11 0-4 C5-11 12-2 0 8Z" fill="#ef8f9f" />
          </svg>
        ))}

      {visit.box && (
        <div className="box-drop" style={{ position: 'absolute', inset: 0, zIndex: GROUND + 10 }}>
          <GiftBox x={515} y={GROUND + 10} shake={visit.shake} open={visit.open} color={rank === 1 ? '#f3c44c' : '#f2a98a'} />
        </div>
      )}

      {revealed && (
        <>
          <Rays x={515} y={GROUND - 220} size={rank === 1 ? 660 : 480} style={{ zIndex: 1700 }} />
          <Burst x={515} y={GROUND - 200} count={rank <= 2 ? 30 : 18} spread={rank <= 2 ? 250 : 180} />
          <div className="item-rise" style={{ position: 'absolute', left: 515, top: GROUND - 110, zIndex: 1800 }}>
            <div style={{ transform: 'translate(-50%, -100%)' }}>
              <div className="item-float">
              {gift.ticket ? (
                <GoldenTicket w={280} style={{ filter: 'drop-shadow(0 0 16px rgba(255,215,90,.9))' }} />
              ) : (
                <img src={spriteUrl(gift.sprite)} alt="" style={{ display: 'block', height: gift.h, filter: 'drop-shadow(0 6px 8px rgba(90,60,40,.25))' }} />
              )}
              </div>
            </div>
          </div>
          <div className="rank-ribbon" style={{ left: 512, top: 92 }}>
            <span>
              {rank}등 · {gift.name}
            </span>
          </div>
          {rank <= 2 && <Confetti />}
        </>
      )}

      {dialog && <Dialog key={dialog.id} lines={dialog.lines} auto={dialog.auto} onDone={() => dialog.done?.()} />}
    </div>
  )
}
