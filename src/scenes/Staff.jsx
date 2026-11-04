import { useState } from 'react'
import { Key } from '../components/common'
import { getCustomKeys, input, useFrame, usePress } from '../input'
import { isMuted, setMuted, sfx } from '../sound'
import { getLog, getStock, resetAll, setStock } from '../prizes'
import { PRIZE_STOCK } from '../config'

const RESET_HOLD = 3000
const RANKS = Object.keys(PRIZE_STOCK).map(Number)
// 행: 1~5등 수량, 소리, 전체 초기화, 나가기
const ROWS = [...RANKS.map((r) => ({ type: 'rank', r })), { type: 'sound' }, { type: 'keys' }, { type: 'reset' }, { type: 'exit' }]

export default function Staff({ onExit, onKeys }) {
  const [row, setRow] = useState(0)
  const [stock, setLocalStock] = useState(getStock)
  const [log, setLog] = useState(getLog)
  const [muted, setMutedState] = useState(isMuted())
  const [resetP, setResetP] = useState(0)

  useFrame(() => {
    if (ROWS[row].type !== 'reset') return resetP && setResetP(0)
    const p = Math.min(1, input.heldFor('a') / RESET_HOLD)
    if (Math.abs(p - resetP) > 0.01) setResetP(p)
    if (p >= 1) {
      resetAll()
      setLocalStock(getStock())
      setLog(getLog())
      setResetP(0)
      sfx.fanfare()
      setRow(0)
    }
  })

  usePress((a) => {
    const cur = ROWS[row]
    if (a === 'up') setRow((row + ROWS.length - 1) % ROWS.length)
    if (a === 'down') setRow((row + 1) % ROWS.length)
    if ((a === 'left' || a === 'right') && cur.type === 'rank') {
      const next = { ...stock, [cur.r]: Math.max(0, stock[cur.r] + (a === 'right' ? 1 : -1)) }
      setStock(next)
      setLocalStock(next)
      sfx.move()
    }
    if (a === 'a' && cur.type === 'sound') {
      setMuted(!muted)
      setMutedState(!muted)
    }
    if (a === 'a' && cur.type === 'keys') onKeys()
    if (a === 'a' && cur.type === 'exit') onExit()
    if (a === 'b') onExit()
  })

  const counts = RANKS.reduce((acc, r) => ({ ...acc, [r]: log.filter((l) => l.rank === r).length }), {})

  return (
    <div className="scene" style={{ background: '#fdf3e3', padding: '36px 56px' }}>
      <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 4 }}>🔧 스태프 메뉴</div>
      <div style={{ fontSize: 16, color: 'var(--ink-soft)', marginBottom: 18 }}>
        <Key k="up" />
        <Key k="down" /> 이동 · <Key k="left" />
        <Key k="right" /> 수량 조절 · <Key k="a" /> 선택 · <Key k="b" /> 나가기
      </div>
      <div style={{ display: 'flex', gap: 40 }}>
        <div className="pixel-box" style={{ flex: 1, padding: 14 }}>
          {ROWS.map((it, i) => (
            <div key={i} className={`staff-row ${row === i ? 'on' : ''}`}>
              {it.type === 'rank' && (
                <>
                  <span>{it.r}등 남은 수량</span>
                  <span>
                    ◀ <b style={{ display: 'inline-block', minWidth: 46, textAlign: 'center' }}>{stock[it.r]}</b> ▶
                    <span style={{ fontSize: 15, color: 'var(--ink-soft)' }}> / {PRIZE_STOCK[it.r]}</span>
                  </span>
                </>
              )}
              {it.type === 'sound' && (
                <>
                  <span>소리</span>
                  <b>{muted ? '끔' : '켬'}</b>
                </>
              )}
              {it.type === 'reset' && (
                <>
                  <span>전체 초기화 ( <Key k="a" /> 3초 꾹 )</span>
                  <span style={{ width: 160, height: 14, border: '2px solid var(--ink)', borderRadius: 6, overflow: 'hidden', background: '#fff' }}>
                    <span style={{ display: 'block', width: `${resetP * 100}%`, height: '100%', background: 'var(--coral)' }} />
                  </span>
                </>
              )}
              {it.type === 'keys' && (
                <>
                  <span>키패드 설정</span>
                  <span style={{ fontSize: 16, color: 'var(--ink-soft)' }}>
                    {Object.keys(getCustomKeys()).length ? '등록됨' : '기본 키'} ▶
                  </span>
                </>
              )}
              {it.type === 'exit' && <span>← 처음 화면으로</span>}
            </div>
          ))}
        </div>
        <div className="pixel-box" style={{ width: 330, padding: 18, fontSize: 18, lineHeight: 1.7 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>오늘 기록 (총 {log.length}회)</div>
          {RANKS.map((r) => (
            <div key={r}>
              {r}등 당첨 {counts[r]}명
            </div>
          ))}
          <div style={{ fontWeight: 700, margin: '12px 0 4px' }}>최근 결과</div>
          {log
            .slice(-6)
            .reverse()
            .map((l, i) => (
              <div key={i} style={{ fontSize: 15 }}>
                {new Date(l.at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} · {l.rank}등 ·{' '}
                {l.game === 'balloon' ? '열기구' : '딸기밭'}
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
