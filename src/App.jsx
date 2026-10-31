import { useEffect, useRef, useState } from 'react'
import { asset, Grain, Iris, spriteUrl, Stage, SvgDefs } from './components/common'
import Title from './scenes/Title'
import StrawberryGame from './scenes/StrawberryGame'
import BalloonGame from './scenes/BalloonGame'
import Postcard from './scenes/Postcard'
import Staff from './scenes/Staff'
import { startBgm } from './sound'

const PRELOAD = [
  ...[
    'girl-watering', 'girl-cheer', 'girl-bouquet', 'girl-witch', 'girl-tea', 'girl-flowerpot', 'squirrel', 'ghost',
    'strawberry-basket', 'strawberry-plant', 'flower-pot', 'honey-jar', 'jam-jar', 'strawberry', 'ribbon', 'logo',
    'cosmos', 'scarf', 'acorn', 'maple', 'berries',
  ].map(spriteUrl),
  asset('scenes/balloon-sky.webp'),
  asset('scenes/strawberry-pattern.webp'),
  asset('scenes/snow-village.webp'),
]

export default function App() {
  const [scene, setScene] = useState({ name: 'title', n: 0 })
  const [closed, setClosed] = useState(false)
  const busy = useRef(false)

  useEffect(() => {
    PRELOAD.forEach((src) => {
      const img = new Image()
      img.src = src
    })
    const onFirst = () => startBgm()
    window.addEventListener('keydown', onFirst, { once: true })
    window.addEventListener('pointerdown', onFirst, { once: true })
  }, [])

  // 아이리스로 닫았다가 장면을 바꾸고 다시 엽니다.
  const go = (name, props = {}) => {
    if (busy.current) return
    busy.current = true
    setClosed(true)
    setTimeout(() => {
      setScene((s) => ({ name, props, n: s.n + 1 }))
      setTimeout(() => {
        setClosed(false)
        busy.current = false
      }, 120)
    }, 520)
  }

  const toTitle = () => go('title')
  let view
  switch (scene.name) {
    case 'strawberry':
      view = <StrawberryGame onFinish={(result) => go('postcard', { result })} onExit={toTitle} />
      break
    case 'balloon':
      view = <BalloonGame onFinish={(result) => go('postcard', { result })} onExit={toTitle} />
      break
    case 'postcard':
      view = <Postcard result={scene.props.result} onDone={toTitle} />
      break
    case 'staff':
      view = <Staff onExit={toTitle} />
      break
    default:
      view = <Title onStart={(id) => go(id)} onStaff={() => go('staff')} />
  }

  return (
    <Stage>
      <SvgDefs />
      <div key={scene.n} className="scene">
        {view}
      </div>
      <Grain />
      <Iris closed={closed} />
    </Stage>
  )
}
