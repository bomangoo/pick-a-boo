import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { Actor, Burst, Confetti, Dialog, Key, Rays, spriteUrl } from '../components/common'
import { Droplets, Mound, Plant } from '../components/art'
import { input, useFrame, usePress } from '../input'
import { sfx } from '../sound'
import { drawPrize } from '../prizes'
import { IDLE_TIMEOUT } from '../config'
import { STRAWBERRY_GIFTS, STRAWBERRY_INTRO, strawberryGrowLines } from '../story'

const MOUNDS = [
  { x: 430, y: 405 },
  { x: 590, y: 405 },
  { x: 750, y: 405 },
  { x: 430, y: 530 },
  { x: 590, y: 530 },
  { x: 750, y: 530 },
]
const BOUNDS = { x0: 60, x1: 975, y0: 290, y1: 735 }
const SPEED = 240
const HERO_H = 128
const REACH = 105

// 움직이지 않는 배경은 한 번만 그립니다.
const FarmBackground = memo(function FarmBackground() {
  return (
    <svg width="1024" height="768" viewBox="0 0 1024 768" style={{ position: 'absolute', inset: 0 }}>
      <g filter="url(#crayon)">
        <rect x="-30" y="-30" width="1084" height="828" fill="#b9d49a" />
        <rect x="-30" y="-30" width="1084" height="828" fill="url(#hatch)" />
        {/* 풀 무늬 */}
        {Array.from({ length: 70 }, (_, i) => {
          const x = (i * 137) % 1024
          const y = 180 + ((i * 89) % 580)
          return <path key={i} d={`M${x} ${y} l4 -10 l3 10 l4 -8 l2 8`} stroke="#8fb478" strokeWidth="2.5" fill="none" />
        })}
        {/* 위쪽 숲 */}
        <path d="M-30 -30 H1054 V150 C960 170 900 140 840 160 C760 180 700 140 620 158 C540 176 470 140 380 160 C300 178 220 146 140 166 C80 180 30 160 0 170Z" fill="#7fa37a" />
        {Array.from({ length: 12 }, (_, i) => (
          <circle key={i} cx={i * 92 + 20} cy={110 + (i % 3) * 14} r={58 + (i % 2) * 12} fill={i % 2 ? '#6f9670' : '#86ab7c'} />
        ))}
        {/* 흙길 */}
        <path d="M-20 700 C120 690 200 650 260 600 C300 560 300 520 330 500 L360 520 C340 560 320 620 260 680 C210 730 120 760 -20 768Z" fill="#efd8a8" />
        <path d="M640 300 C650 260 660 230 700 210 L760 214 C730 236 712 270 710 300Z" fill="#efd8a8" />
        {/* 텃밭 */}
        <rect x="335" y="325" width="510" height="275" rx="34" fill="#c99a6e" />
        <rect x="335" y="325" width="510" height="275" rx="34" fill="url(#hatch)" />
        {[355, 410, 465, 520, 570].map((y) => (
          <path key={y} d={`M362 ${y} C500 ${y - 6} 680 ${y + 6} 818 ${y}`} stroke="#b4855c" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.6" />
        ))}
        {/* 울타리 */}
        <path d="M330 318 H850" stroke="#c99a74" strokeWidth="8" strokeLinecap="round" />
        {Array.from({ length: 11 }, (_, i) => (
          <rect key={i} x={330 + i * 52 - 6} y="294" width="12" height="40" rx="4" fill="#d9ab84" />
        ))}
        {/* 오두막 */}
        <g transform="translate(870 300)">
          <rect x="-90" y="-110" width="180" height="110" fill="#fbe9d0" />
          <rect x="-90" y="-110" width="180" height="110" fill="url(#hatch)" />
          <path d="M-110 -106 L0 -190 L110 -106Z" fill="#e8826b" />
          <path d="M-110 -106 L0 -190 L110 -106" stroke="#c96a55" strokeWidth="6" fill="none" />
          <rect x="40" y="-176" width="22" height="42" fill="#b9a69a" />
          <path d="M-16 0 V-56 A16 16 0 0 1 16 -56 V0Z" fill="#c98b5e" />
          <rect x="-72" y="-82" width="38" height="34" fill="#ffe7a8" stroke="#c98b5e" strokeWidth="4" />
          <rect x="36" y="-82" width="38" height="34" fill="#ffe7a8" stroke="#c98b5e" strokeWidth="4" />
          <path d="M-74 -46 H-32 M34 -46 H76" stroke="#8fb48a" strokeWidth="8" strokeLinecap="round" />
        </g>
        {/* 왼쪽 나무 */}
        <g transform="translate(80 300)">
          <rect x="-10" y="-60" width="20" height="70" fill="#a9785a" />
          <circle cx="0" cy="-110" r="70" fill="#86ab7c" />
          <circle cx="-34" cy="-80" r="40" fill="#7fa37a" />
          <circle cx="36" cy="-86" r="44" fill="#93b888" />
          {[[-30, -120], [20, -140], [30, -90], [-10, -80]].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="7" fill="#e8826b" />
          ))}
        </g>
        {/* 꽃 */}
        {Array.from({ length: 34 }, (_, i) => {
          const x = (i * 211) % 1000 + 12
          const y = 200 + ((i * 131) % 560)
          if (x > 320 && x < 860 && y > 290 && y < 620) return null
          return <circle key={i} cx={x} cy={y} r={5 + (i % 3)} fill={['#fffaf0', '#f6c9cf', '#f6d58b'][i % 3]} />
        })}
        {/* 작은 진열대 */}
        <g transform="translate(150 520)">
          <rect x="-80" y="-40" width="160" height="16" rx="4" fill="#c98b5e" />
          <rect x="-72" y="-24" width="10" height="44" fill="#a9785a" />
          <rect x="62" y="-24" width="10" height="44" fill="#a9785a" />
          <rect x="-84" y="-48" width="168" height="10" rx="4" fill="#f2a98a" />
        </g>
        {/* 표지판 */}
        <g transform="translate(300 720)">
          <rect x="-6" y="-50" width="12" height="54" fill="#a9785a" />
          <rect x="-70" y="-92" width="140" height="48" rx="8" fill="#fbe9d0" stroke="#a9785a" strokeWidth="5" />
        </g>
      </g>
    </svg>
  )
})

export default function StrawberryGame({ onFinish, onExit }) {
  const [phase, setPhase] = useState('intro') // intro → explore → walkTo → grow → reveal
  const [pos, setPos] = useState({ x: 210, y: 690 })
  const [facing, setFacing] = useState(1)
  const [moving, setMoving] = useState(false)
  const [target, setTarget] = useState(null)
  const [chosen, setChosen] = useState(null)
  const [stage, setStage] = useState(0)
  const [shaking, setShaking] = useState(false)
  const [watering, setWatering] = useState(false)
  const [rank, setRank] = useState(null)
  const [dialog, setDialog] = useState({ id: 'intro', lines: STRAWBERRY_INTRO, auto: 2600 })
  const stepT = useRef(0)
  const posRef = useRef(pos)
  posRef.current = pos

  const lines = useMemo(() => (rank ? strawberryGrowLines(rank) : null), [rank])

  useFrame((dt) => {
    if (phase === 'explore') {
      if (input.idleFor() > IDLE_TIMEOUT) return onExit()
      const { x: ax, y: ay } = input.axis()
      const isMoving = ax !== 0 || ay !== 0
      if (isMoving !== moving) setMoving(isMoving)
      if (isMoving) {
        if (ax) setFacing(ax > 0 ? 1 : -1)
        const p = posRef.current
        const nx = Math.max(BOUNDS.x0, Math.min(BOUNDS.x1, p.x + ax * SPEED * dt))
        const ny = Math.max(BOUNDS.y0, Math.min(BOUNDS.y1, p.y + ay * SPEED * dt))
        setPos({ x: nx, y: ny })
        stepT.current += dt
        if (stepT.current > 0.26) {
          stepT.current = 0
          sfx.step()
        }
      }
      // 가장 가까운 흙더미 찾기
      const p = posRef.current
      let best = null
      let bestD = REACH
      MOUNDS.forEach((m, i) => {
        const d = Math.hypot(m.x - p.x, (m.y - p.y) * 1.3)
        if (d < bestD) {
          bestD = d
          best = i
        }
      })
      if (best !== target) {
        setTarget(best)
        if (best !== null) sfx.select()
      }
    }
    if (phase === 'walkTo') {
      const m = MOUNDS[chosen]
      const goal = { x: m.x - 78, y: m.y + 22 }
      const p = posRef.current
      const dx = goal.x - p.x
      const dy = goal.y - p.y
      const d = Math.hypot(dx, dy)
      if (d < 4) {
        setPos(goal)
        setFacing(1)
        setMoving(false)
        startGrowing()
      } else {
        const s = Math.min(d, SPEED * 1.2 * dt)
        setPos({ x: p.x + (dx / d) * s, y: p.y + (dy / d) * s })
        setFacing(dx >= 0 ? 1 : -1)
        if (!moving) setMoving(true)
      }
    }
  })

  const timers = useRef([])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])
  const at = (ms, fn) => timers.current.push(setTimeout(fn, ms))

  const started = useRef(false)
  function startGrowing() {
    if (started.current) return
    started.current = true
    setPhase('grow')
    const r = rank
    const L = strawberryGrowLines(r)
    setWatering(true)
    sfx.water()
    setDialog({ id: 'water', lines: [L.water], auto: 0 })
    at(1900, () => {
      setWatering(false)
      setStage(1)
      sfx.grow(0)
      setDialog({ id: 'sprout', lines: [L.sprout], auto: 0 })
    })
    at(3200, () => {
      setStage(2)
      sfx.grow(1)
    })
    at(4500, () => {
      setStage(3)
      sfx.grow(2)
      setDialog({ id: 'flower', lines: [L.flower], auto: 0 })
    })
    at(6000, () => {
      setShaking(true)
      sfx.shake()
    })
    at(6400, () => sfx.shake())
    at(6800, () => sfx.shake())
    at(7400, () => {
      setShaking(false)
      setStage(0)
      setPhase('reveal')
      sfx.pop()
      if (r <= 2) sfx.fanfare()
      else sfx.reveal()
      setDialog({ id: 'reveal', lines: L.reveal, auto: 3000, done: () => onFinish({ game: 'strawberry', rank: r }) })
    })
  }

  usePress((a) => {
    if (phase === 'explore') {
      if (a === 'a' && target !== null) {
        const r = drawPrize('strawberry')
        if (r === null) return onExit()
        sfx.confirm()
        setRank(r)
        setChosen(target)
        setTarget(null)
        setPhase('walkTo')
      }
      if (a === 'b') {
        sfx.back()
        onExit()
      }
    }
  })

  const gift = rank ? STRAWBERRY_GIFTS[rank] : null
  const m = chosen !== null ? MOUNDS[chosen] : null
  const heroName = phase === 'reveal' ? 'girl-cheer' : 'girl-watering'
  const heroCls = phase === 'reveal' ? 'cheer' : watering ? 'watering' : moving ? 'walk' : 'idle-breathe'

  return (
    <div className="scene">
      <FarmBackground />
      {/* 소품 (작가님 일러스트) */}
      <img className="sprite" src={spriteUrl('honey-jar')} alt="" style={{ left: 88, top: 428, height: 52, zIndex: 480 }} />
      <img className="sprite" src={spriteUrl('jam-jar')} alt="" style={{ left: 138, top: 432, height: 46, zIndex: 480 }} />
      <img className="sprite" src={spriteUrl('strawberry-basket')} alt="" style={{ left: 172, top: 424, height: 56, zIndex: 480 }} />
      <img className="sprite" src={spriteUrl('logo')} alt="" style={{ left: 268, top: 626, height: 44, zIndex: 760 }} />
      <span style={{ position: 'absolute', left: 312, top: 640, zIndex: 760, fontWeight: 700, fontSize: 15, color: '#a9785a' }}>FARM</span>
      <Actor name="strawberry-plant" x={250} y={330} h={78} />
      <Actor name="strawberry-plant" x={960} y={420} h={70} />
      <Actor name="flower-pot" x={800} y={318} h={60} />
      <Actor name="flower-pot" x={950} y={318} h={52} />
      <Actor name="squirrel" x={930} y={650} h={70} flip className={phase === 'reveal' ? 'hop' : 'idle-breathe'} />

      {MOUNDS.map((mo, i) => (
        <Mound key={i} x={mo.x} y={mo.y} glow={target === i && phase === 'explore'} wet={chosen === i && phase !== 'walkTo'} />
      ))}
      {m && (
        <div className={shaking ? 'plant-shake' : ''} style={{ position: 'absolute', inset: 0, transformOrigin: `${m.x}px ${m.y}px`, zIndex: Math.round(m.y) + 1 }}>
          <Plant x={m.x} y={m.y - 14} stage={stage} />
        </div>
      )}
      {watering && m && <Droplets x={pos.x + 40} y={pos.y - 64} />}

      <Actor
        name={heroName}
        x={pos.x}
        y={pos.y}
        h={phase === 'reveal' ? HERO_H * 1.15 : HERO_H}
        flip={facing < 0}
        className={heroCls}
        z={phase === 'reveal' ? 1750 : undefined}
      />

      {target !== null && phase === 'explore' && (
        <>
          <div className="target-arrow" style={{ left: MOUNDS[target].x, top: MOUNDS[target].y - 100 }}>
            ▼
          </div>
          <div className="bubble" style={{ left: pos.x, top: pos.y - HERO_H - 14, zIndex: 1600 }}>
            <Key k="a" /> 물 주기
          </div>
        </>
      )}

      {phase === 'reveal' && gift && m && (
        <>
          <Rays x={m.x + 10} y={m.y - 140} size={rank === 1 ? 640 : 460} style={{ zIndex: 1700 }} />
          <Burst x={m.x + 10} y={m.y - 130} count={rank <= 2 ? 30 : 18} spread={rank <= 2 ? 240 : 170} />
          <div className="item-rise" style={{ position: 'absolute', left: m.x + 10, top: m.y - 60, zIndex: 1800 }}>
            <div style={{ transform: 'translate(-50%, -100%)' }}>
              <div className="item-float">
                <img
                  className={gift.golden ? 'golden' : ''}
                  src={spriteUrl(gift.sprite)}
                  alt=""
                  style={{ display: 'block', height: gift.h, filter: gift.golden ? undefined : 'drop-shadow(0 6px 8px rgba(90,60,40,.25))' }}
                />
              </div>
            </div>
          </div>
          <div className="rank-ribbon" style={{ left: 512, top: 40 }}>
            <span>
              {rank}등 · {gift.name}
            </span>
          </div>
          {rank <= 2 && <Confetti />}
        </>
      )}

      {phase === 'explore' && (
        <div className="hint">
          <Key k="arrows" /> 걸어가기 &nbsp;·&nbsp; 마음에 드는 흙 앞에서 <Key k="a" /> 물 주기
        </div>
      )}

      {dialog && (
        <Dialog
          key={dialog.id}
          lines={dialog.lines}
          auto={dialog.auto}
          onDone={() => {
            if (dialog.id === 'intro') {
              setDialog(null)
              setPhase('explore')
            } else if (dialog.done) dialog.done()
          }}
        />
      )}
    </div>
  )
}
