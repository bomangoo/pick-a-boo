import { useEffect, useRef, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { asset, Confetti, josa, Key, spriteUrl } from '../components/common'
import { GoldenTicket } from '../components/art'
import { usePress } from '../input'
import { sfx } from '../sound'
import { BRAND, RESULT_TIMEOUT } from '../config'
import { BALLOON_GIFTS, ISLANDS, STRAWBERRY_GIFTS, strawberryLetter } from '../story'

const STAMP_COLORS = { 1: '#d99a2b', 2: '#d0707f', 3: '#e8826b', 4: '#6f9a7c', 5: '#7f9ab6' }

export default function Postcard({ result, onDone }) {
  const { game, rank } = result
  const isBalloon = game === 'balloon'
  const island = isBalloon ? ISLANDS.find((i) => i.id === result.island) : null
  const gift = (isBalloon ? BALLOON_GIFTS : STRAWBERRY_GIFTS)[rank]
  const letter = isBalloon
    ? { from: island.friend.name, place: island.name, body: island.letter }
    : strawberryLetter(rank)
  const [ready, setReady] = useState(false)
  const doneRef = useRef(false)
  const finish = () => {
    if (doneRef.current) return
    doneRef.current = true
    onDone()
  }

  useEffect(() => {
    const r = setTimeout(() => setReady(true), 5000)
    const t = setTimeout(finish, RESULT_TIMEOUT)
    return () => (clearTimeout(r), clearTimeout(t))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  usePress((a) => {
    if (!ready) return
    if (a === 'a' || a === 'b') {
      sfx.back()
      finish()
    }
  })

  const today = new Date()
  const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`

  return (
    <div className="scene" style={{ background: '#f3e2d2' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isBalloon
            ? `url(${asset('scenes/balloon-sky.webp')}) center / cover`
            : `url(${asset('scenes/strawberry-pattern.webp')}) center / cover`,
          opacity: 0.45,
          filter: 'blur(1px)',
        }}
      />
      {rank <= 2 && <Confetti count={rank === 1 ? 80 : 50} />}

      <div style={{ position: 'absolute', top: 24, width: '100%', textAlign: 'center', fontSize: 26, fontWeight: 700, zIndex: 5, textShadow: '2px 2px 0 #fff7ea' }}>
        💌 {letter.place}에서 엽서가 도착했어요
      </div>

      {/* 엽서 */}
      <div className="postcard" style={{ position: 'absolute', left: 82, top: 84, width: 860, height: 540, zIndex: 10 }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'var(--paper)',
            borderRadius: 10,
            boxShadow: '0 18px 40px rgba(90,60,40,.28), inset 0 0 0 10px #fffaf2, inset 0 0 0 12px #ecd7c0',
          }}
        />
        {/* 왼쪽: 그림 */}
        <div
          style={{
            position: 'absolute',
            left: 26,
            top: 26,
            width: 400,
            height: 488,
            borderRadius: 6,
            overflow: 'hidden',
            background: rank === 1 ? 'radial-gradient(circle at 50% 45%, #fff3c0, #f6d58b 70%)' : 'radial-gradient(circle at 50% 45%, #fffaf0, #f6c9cf 90%)',
          }}
        >
          <div className="rays" style={{ left: -60, top: -50, width: 520, height: 520, opacity: 0.8 }} />
          <div className="item-float" style={{ position: 'absolute', left: 0, right: 0, top: 70, display: 'flex', justifyContent: 'center' }}>
            {gift.ticket ? (
              <GoldenTicket w={300} style={{ filter: 'drop-shadow(0 0 14px rgba(255,215,90,.9))', marginTop: 60 }} />
            ) : (
              <img
                className={gift.golden ? 'golden' : ''}
                src={spriteUrl(gift.sprite)}
                alt=""
                style={{ height: Math.min(260, gift.h * 1.45), filter: gift.golden ? undefined : 'drop-shadow(0 8px 10px rgba(90,60,40,.25))' }}
              />
            )}
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 34, textAlign: 'center' }}>
            <div style={{ fontSize: 38, fontWeight: 700, color: STAMP_COLORS[rank], textShadow: '2px 2px 0 #fff' }}>{rank}등</div>
            <div style={{ fontFamily: 'var(--hand)', fontSize: 32, fontWeight: 700, marginTop: 2 }}>{gift.name}</div>
          </div>
          {/* 소인 도장 */}
          <svg className="stamp-in" width="150" height="150" viewBox="-75 -75 150 150" style={{ position: 'absolute', right: 6, top: 6 }}>
            <g opacity="0.85" transform="rotate(-14)">
              <circle r="62" fill="none" stroke={STAMP_COLORS[rank]} strokeWidth="5" />
              <circle r="48" fill="none" stroke={STAMP_COLORS[rank]} strokeWidth="2.5" strokeDasharray="4 4" />
              <text y="12" textAnchor="middle" fontFamily="Galmuri11" fontWeight="700" fontSize="36" fill={STAMP_COLORS[rank]}>
                {rank}등
              </text>
              <text y="-26" textAnchor="middle" fontFamily="Galmuri11" fontSize="11" fill={STAMP_COLORS[rank]}>
                PICK-A-BOO
              </text>
              <text y="38" textAnchor="middle" fontFamily="Galmuri11" fontSize="11" fill={STAMP_COLORS[rank]}>
                {dateStr}
              </text>
            </g>
          </svg>
        </div>

        {/* 가운데 선 */}
        <div style={{ position: 'absolute', left: 448, top: 50, bottom: 50, width: 2, background: '#e2cbb3' }} />

        {/* 오른쪽: 편지 */}
        <div style={{ position: 'absolute', left: 472, top: 30, right: 28, bottom: 26 }}>
          {/* 우표 */}
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              width: 92,
              height: 112,
              padding: 6,
              background: '#fff',
              border: '6px dotted #fff',
              outline: '2px solid #e8d4c0',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <div style={{ width: '100%', height: '100%', background: isBalloon ? '#cfe9df' : '#fbe1e7', display: 'grid', placeItems: 'center', overflow: 'hidden' }}>
              {isBalloon ? (
                <div style={{ width: '100%', height: '100%', background: `url(${asset('scenes/balloon-sky.webp')}) -92px -4px / 200px` }} />
              ) : (
                <img src={spriteUrl('strawberry')} alt="" style={{ height: 60 }} />
              )}
            </div>
          </div>
          <div style={{ fontFamily: 'var(--hand)', fontSize: 30, fontWeight: 700, marginTop: 24 }}>To. 오늘 만난 당신</div>
          <div
            style={{
              fontFamily: 'var(--hand)',
              fontSize: 26,
              lineHeight: '42px',
              whiteSpace: 'pre-line',
              marginTop: 52,
              backgroundImage: 'repeating-linear-gradient(transparent 0 40px, #ead6c2 40px 42px)',
              minHeight: 210,
            }}
          >
            {letter.body}
          </div>
          <div style={{ fontFamily: 'var(--hand)', fontSize: 28, fontWeight: 700, textAlign: 'right', marginTop: 6 }}>
            From. {letter.from} <span style={{ color: '#ef8f9f' }}>♥</span>
          </div>

          {/* 인스타 (자연스럽게) */}
          <div style={{ position: 'absolute', left: 0, bottom: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: '#fff', padding: 5, borderRadius: 6, border: '2px solid #e2cbb3' }}>
              <QRCodeSVG value={BRAND.instagramUrl} size={70} fgColor="#5a3d33" />
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--ink-soft)' }}>
              {josa(BRAND.heroName, '과', '와')} 친구들의 이야기는
              <br />
              <b style={{ color: 'var(--ink)', fontSize: 15 }}>{BRAND.instagramHandle}</b> 에서 이어져요
            </div>
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 34, width: '100%', textAlign: 'center', fontSize: 20, zIndex: 20 }}>
        <span style={{ background: 'rgba(255,247,234,.92)', padding: '8px 20px', borderRadius: 999, border: '3px solid var(--ink)' }}>
          📷 엽서를 사진으로 남겨가세요 · 스태프에게 이 화면을 보여주세요
          {ready && (
            <>
              {' '}
              · <Key k="a" /> 처음으로
            </>
          )}
        </span>
      </div>
    </div>
  )
}
