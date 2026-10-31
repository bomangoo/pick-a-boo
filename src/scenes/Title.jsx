import { useMemo, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { asset, josa, Key, spriteUrl } from '../components/common'
import { Cloud } from '../components/art'
import { input, useFrame, usePress } from '../input'
import { sfx } from '../sound'
import { getStock, totalLeft } from '../prizes'
import { BRAND, PRIZE_STOCK, STAFF_HOLD } from '../config'

const GAMES = [
  { id: 'strawberry', title: '딸기밭에 물 주기', desc: '물을 주면 어떤 선물이 자라날까?' },
  { id: 'balloon', title: '열기구 세계여행', desc: '보고 싶은 친구를 만나러 떠나요' },
]

function FloatingDeco() {
  const items = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => ({
        name: ['strawberry', 'maple', 'acorn', 'strawberry', 'cosmos', 'berries'][i % 6],
        left: 30 + ((i * 113) % 960),
        top: 150 + ((i * 71) % 480),
        h: 34 + (i % 3) * 10,
        delay: -i * 0.7,
      })),
    [],
  )
  return items.map((it, i) => (
    <img
      key={i}
      className="sprite float-slow"
      src={spriteUrl(it.name)}
      alt=""
      style={{ left: it.left, top: it.top, height: it.h, opacity: 0.55, animationDelay: `${it.delay}s` }}
    />
  ))
}

export default function Title({ onStart, onStaff }) {
  const [sel, setSel] = useState(0)
  const [staffHold, setStaffHold] = useState(0)
  const stock = useMemo(getStock, [])
  const left = totalLeft(stock)

  useFrame(() => {
    const h = input.heldFor('b')
    const p = Math.min(1, h / STAFF_HOLD)
    if (Math.abs(p - staffHold) > 0.01) setStaffHold(p)
    if (p >= 1) {
      sfx.confirm()
      onStaff()
    }
  })

  usePress((a) => {
    if (a === 'left' || a === 'up') {
      if (sel !== 0) sfx.move()
      setSel(0)
    }
    if (a === 'right' || a === 'down') {
      if (sel !== 1) sfx.move()
      setSel(1)
    }
    if (a === 'a' && left > 0) {
      sfx.confirm()
      onStart(GAMES[sel].id)
    }
  })

  return (
    <div className="scene" style={{ background: 'linear-gradient(#cfe9df 0%, #fdf3e3 55%, #fbe6ec 100%)' }}>
      {[
        [60, 0, 190, 90],
        [130, 30, 140, 70],
        [30, 55, 220, 110],
      ].map(([top, delay, w, dur], i) => (
        <div key={i} className="drift" style={{ position: 'absolute', top, left: 0, animationDuration: `${dur}s`, animationDelay: `-${delay}s` }}>
          <Cloud w={w} />
        </div>
      ))}
      <FloatingDeco />

      {/* 브랜드 */}
      <div style={{ position: 'absolute', left: 26, top: 20, display: 'flex', alignItems: 'center', gap: 8, zIndex: 5 }}>
        <img src={spriteUrl('logo')} alt="" style={{ height: 52 }} />
        <div style={{ lineHeight: 1.1 }}>
          <div style={{ fontWeight: 700, fontSize: 18, letterSpacing: 2, color: '#d0707f' }}>{BRAND.brandName}</div>
          <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{BRAND.tagline}</div>
        </div>
      </div>

      {/* 타이틀 */}
      <div className="bob" style={{ position: 'absolute', left: 512, top: 26, width: 520, marginLeft: -260, height: 112, zIndex: 5 }}>
        <img src={spriteUrl('ribbon')} alt="" style={{ width: '100%', height: '100%' }} />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            paddingBottom: 12,
            fontWeight: 700,
            fontSize: 46,
            letterSpacing: 2,
            color: '#b4475a',
            textShadow: '3px 3px 0 #fff3f3',
          }}
        >
          Pick-a-Boo!
        </div>
      </div>
      <div style={{ position: 'absolute', top: 140, width: '100%', textAlign: 'center', fontFamily: 'var(--hand)', fontSize: 30, fontWeight: 700, color: 'var(--ink)', zIndex: 5 }}>
        {josa(BRAND.heroName, '이', '가')} 준비한 따뜻한 선물 뽑기
      </div>

      {/* 게임 카드 */}
      {GAMES.map((g, i) => {
        const on = sel === i
        return (
          <div
            key={g.id}
            className="pixel-box"
            style={{
              position: 'absolute',
              left: i === 0 ? 92 : 542,
              top: 200,
              width: 390,
              height: 400,
              padding: 12,
              borderRadius: 4,
              zIndex: on ? 20 : 10,
              transform: on ? 'scale(1.05) rotate(-1deg)' : 'scale(0.95)',
              filter: on ? 'none' : 'saturate(0.6) brightness(0.97)',
              opacity: on ? 1 : 0.85,
              transition: 'transform .25s cubic-bezier(.2,1.6,.4,1), filter .25s, opacity .25s',
              background: on ? '#fffaf0' : 'var(--cream)',
            }}
          >
            <div style={{ position: 'relative', height: 290, overflow: 'hidden', borderRadius: 4, border: '3px solid var(--ink)' }}>
              {g.id === 'strawberry' ? (
                <>
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: `#fbe5ee url(${asset('scenes/strawberry-pattern.webp')}) -60px -40px / 760px`,
                      opacity: 0.28,
                    }}
                  />
                  <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 90, background: '#c99a6e', borderTop: '6px solid #b9d49a' }} />
                  <img className="sprite" src={spriteUrl('strawberry-plant')} alt="" style={{ left: 196, top: 128, height: 110 }} />
                  <img className="sprite" src={spriteUrl('strawberry-basket')} alt="" style={{ left: 290, top: 176, height: 70 }} />
                  <div className={on ? 'walk' : ''} style={{ position: 'absolute', left: 56, top: 50, transformOrigin: '50% 100%' }}>
                    <img src={spriteUrl('girl-watering')} alt="" style={{ height: 200, display: 'block' }} />
                  </div>
                </>
              ) : (
                <>
                  <div
                    className={on ? 'float-slow' : ''}
                    style={{
                      position: 'absolute',
                      inset: -14,
                      background: `url(${asset('scenes/balloon-sky.webp')}) -216px -24px / 620px`,
                    }}
                  />
                </>
              )}
            </div>
            <div style={{ textAlign: 'center', marginTop: 12 }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: on ? 'var(--coral)' : 'var(--ink)' }}>
                {on && <span className="blink">▶ </span>}
                {g.title}
              </div>
              <div style={{ fontFamily: 'var(--hand)', fontSize: 23, marginTop: 4, color: 'var(--ink-soft)' }}>{g.desc}</div>
            </div>
          </div>
        )
      })}

      {/* 시작 안내 */}
      <div style={{ position: 'absolute', top: 628, width: '100%', textAlign: 'center', fontSize: 24, zIndex: 5 }}>
        {left > 0 ? (
          <span className="blink">
            <Key k="left" />
            <Key k="right" /> 고르고 <Key k="a" /> 눌러서 출발!
          </span>
        ) : (
          <span>오늘의 선물이 모두 주인을 찾아 떠났어요. 다음에 또 만나요! ♥</span>
        )}
      </div>

      {/* 남은 선물 */}
      <div style={{ position: 'absolute', left: 26, bottom: 22, fontSize: 15, zIndex: 5 }}>
        <div style={{ marginBottom: 6, color: 'var(--ink-soft)' }}>오늘 남은 선물</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {Object.keys(PRIZE_STOCK).map((r) => (
            <div
              key={r}
              style={{
                padding: '4px 10px',
                borderRadius: 999,
                border: '2px solid var(--ink)',
                background: stock[r] > 0 ? (r === '1' ? '#f6d58b' : '#fffaf0') : '#e6dcd2',
                color: stock[r] > 0 ? 'var(--ink)' : '#a8968a',
                textDecoration: stock[r] > 0 ? 'none' : 'line-through',
              }}
            >
              {r}등 <b>{stock[r]}</b>
            </div>
          ))}
        </div>
      </div>

      {/* 인스타 QR (은은하게) */}
      <div style={{ position: 'absolute', right: 24, bottom: 18, display: 'flex', alignItems: 'center', gap: 10, zIndex: 5 }}>
        <div style={{ textAlign: 'right', fontSize: 14, lineHeight: 1.4, color: 'var(--ink-soft)' }}>
          {BRAND.heroName}의 다른 이야기
          <br />
          <b style={{ color: 'var(--ink)' }}>{BRAND.instagramHandle}</b>
        </div>
        <div style={{ background: '#fff', padding: 5, borderRadius: 8, border: '2px solid var(--ink)' }}>
          <QRCodeSVG value={BRAND.instagramUrl} size={62} fgColor="#5a3d33" bgColor="#ffffff" />
        </div>
      </div>

      {staffHold > 0.12 && (
        <div style={{ position: 'absolute', left: '50%', bottom: 90, transform: 'translateX(-50%)', width: 220, zIndex: 50 }}>
          <div style={{ fontSize: 13, textAlign: 'center', marginBottom: 4 }}>스태프 메뉴…</div>
          <div style={{ height: 10, border: '2px solid var(--ink)', borderRadius: 6, overflow: 'hidden', background: '#fff' }}>
            <div style={{ width: `${staffHold * 100}%`, height: '100%', background: 'var(--coral)' }} />
          </div>
        </div>
      )}
    </div>
  )
}
