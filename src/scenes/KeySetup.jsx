import { useEffect, useState } from 'react'
import { ACTIONS, captureNextKey, getCustomKeys, input, saveCustomKeys, useFrame, usePress } from '../input'
import { sfx } from '../sound'

const HOLD = 2000
const INFO = {
  up: { icon: '▲', name: '위' },
  down: { icon: '▼', name: '아래' },
  left: { icon: '◀', name: '왼쪽' },
  right: { icon: '▶', name: '오른쪽' },
  a: { icon: 'A', name: 'A · 확인' },
  b: { icon: 'B', name: 'B · 뒤로' },
}

// 현장 키패드의 6개 키를 하나씩 눌러서 등록하는 화면.
// 등록이 끝나면 바로 눌러보며 확인할 수 있습니다.
export default function KeySetup({ onExit }) {
  const [step, setStep] = useState(0)
  const [map, setMap] = useState({})
  const [warn, setWarn] = useState('')
  const [attempt, setAttempt] = useState(0)
  const [lit, setLit] = useState({})
  const [hold, setHold] = useState({ a: 0, b: 0 })
  const done = step >= ACTIONS.length

  useEffect(() => {
    if (done) return
    return captureNextKey((code) => {
      const action = ACTIONS[step]
      const dup = Object.entries(map).find(([, c]) => c === code)
      if (dup) {
        setWarn(`그 키는 이미 '${INFO[dup[0]].name}'에 등록했어요. 다른 키를 눌러주세요.`)
        sfx.back()
        return setAttempt((n) => n + 1)
      }
      const next = { ...map, [action]: code }
      setWarn('')
      setMap(next)
      sfx.select()
      if (step + 1 >= ACTIONS.length) {
        saveCustomKeys(next)
        sfx.confirm()
      }
      setStep(step + 1)
    })
    // 중복 키를 눌렀을 때 같은 단계에서 다시 기다리도록 attempt 를 의존성에 넣습니다.
  }, [step, map, done, attempt])

  useFrame(() => {
    if (!done) return
    const next = {}
    for (const a of ACTIONS) next[a] = input.held[a]
    if (ACTIONS.some((a) => next[a] !== lit[a])) setLit(next)
    const h = { a: Math.min(1, input.heldFor('a') / HOLD), b: Math.min(1, input.heldFor('b') / HOLD) }
    if (Math.abs(h.a - hold.a) > 0.01 || Math.abs(h.b - hold.b) > 0.01) setHold(h)
    if (h.b >= 1) onExit()
    if (h.a >= 1) {
      setMap({})
      setStep(0)
      setHold({ a: 0, b: 0 })
    }
  })

  usePress((a) => {
    if (done && a !== 'a' && a !== 'b') sfx.move()
  })

  const saved = done ? map : getCustomKeys()

  return (
    <div className="scene" style={{ background: '#fdf3e3', padding: '36px 56px' }}>
      <div style={{ fontSize: 32, fontWeight: 700 }}>⌨️ 키패드 설정</div>
      <div style={{ fontSize: 17, color: 'var(--ink-soft)', margin: '6px 0 26px' }}>
        {done ? '등록 완료! 키를 눌러서 불이 잘 들어오는지 확인해 보세요.' : '현장 키패드에서 아래 칸에 쓸 키를 하나씩 눌러주세요.'}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16 }}>
        {ACTIONS.map((a, i) => {
          const current = !done && i === step
          const on = done && lit[a]
          return (
            <div
              key={a}
              className="pixel-box"
              style={{
                padding: '18px 6px',
                textAlign: 'center',
                background: on ? '#ffe08a' : current ? 'var(--pink)' : 'var(--cream)',
                transform: on ? 'translateY(4px) scale(0.97)' : current ? 'scale(1.06)' : 'none',
                transition: 'transform .08s, background .08s',
              }}
            >
              <div
                className={current ? 'bob' : ''}
                style={{
                  width: 64,
                  height: 64,
                  margin: '0 auto 10px',
                  borderRadius: a === 'a' || a === 'b' ? '50%' : 12,
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 30,
                  fontWeight: 700,
                  color: '#fff7ee',
                  background: a === 'a' ? 'var(--coral)' : a === 'b' ? '#8aa6c9' : 'var(--ink)',
                }}
              >
                {INFO[a].icon}
              </div>
              <div style={{ fontSize: 17, fontWeight: 700 }}>{INFO[a].name}</div>
              <div style={{ fontSize: 13, marginTop: 6, color: 'var(--ink-soft)', minHeight: 18, wordBreak: 'break-all' }}>
                {map[a] || (current ? '누르세요…' : '')}
              </div>
            </div>
          )
        })}
      </div>

      {warn && <div style={{ marginTop: 22, fontSize: 19, color: '#c0504d' }}>⚠ {warn}</div>}

      {done ? (
        <div style={{ marginTop: 34, fontSize: 19, lineHeight: 2 }}>
          <HoldBar label="새 A 키를 2초 꾹 → 처음부터 다시 등록" p={hold.a} color="var(--coral)" />
          <HoldBar label="새 B 키를 2초 꾹 → 저장하고 나가기" p={hold.b} color="#8aa6c9" />
        </div>
      ) : (
        <div style={{ marginTop: 34, fontSize: 18, color: 'var(--ink-soft)', lineHeight: 1.8 }}>
          {INFO[ACTIONS[step]].name} 칸에 쓸 키를 키패드에서 눌러주세요. ({step + 1} / 6)
          <br />
          방향키·Space·Enter 같은 기본 키는 등록과 상관없이 계속 동작해요.
          {Object.keys(saved).length > 0 && step === 0 && <div>지금 저장된 설정이 있어요. 다시 등록하면 덮어써요.</div>}
        </div>
      )}
    </div>
  )
}

function HoldBar({ label, p, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <span style={{ width: 400 }}>{label}</span>
      <span style={{ width: 220, height: 14, border: '2px solid var(--ink)', borderRadius: 6, overflow: 'hidden', background: '#fff' }}>
        <span style={{ display: 'block', width: `${p * 100}%`, height: '100%', background: color }} />
      </span>
    </div>
  )
}
