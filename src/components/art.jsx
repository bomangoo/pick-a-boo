// 작가님 일러스트 톤(파스텔 + 크레용 질감)에 맞춘 배경·소품 SVG 들
import { spriteUrl } from './common'

export function Cloud({ w = 180, opacity = 0.95, style, className }) {
  return (
    <svg className={className} width={w} height={w * 0.5} viewBox="0 0 200 100" style={{ position: 'absolute', overflow: 'visible', ...style }}>
      <path
        d="M20 80 C0 80 0 55 22 52 C18 30 45 22 60 36 C66 12 104 6 116 32 C130 18 160 24 160 46 C185 44 196 70 178 80 Z"
        fill="#fffaf2"
        opacity={opacity}
      />
      <path d="M30 78 C60 84 140 84 172 78" stroke="#f0dccb" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.7" />
    </svg>
  )
}

// 흙더미 (딸기밭 이랑)
export function Mound({ x, y, glow, wet }) {
  return (
    <svg width="150" height="80" viewBox="-75 -50 150 80" style={{ position: 'absolute', left: x - 75, top: y - 50, overflow: 'visible', zIndex: Math.round(y) - 30 }}>
      {glow && <ellipse cx="0" cy="0" rx="74" ry="36" fill="#fff1a8" opacity="0.65" className="glow-pulse" />}
      <ellipse cx="0" cy="6" rx="62" ry="22" fill="rgba(80,50,30,0.18)" />
      <path d="M-58 4 C-55 -22 -25 -32 0 -32 C25 -32 55 -22 58 4 C40 16 -40 16 -58 4Z" fill={wet ? '#8a5a3e' : '#b98763'} />
      <path d="M-40 -10 C-20 -18 20 -18 40 -10" stroke={wet ? '#6e452f' : '#9a6a4c'} strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M-30 -2 C-10 -8 15 -8 32 -2" stroke={wet ? '#6e452f' : '#9a6a4c'} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7" />
      <circle cx="-22" cy="-20" r="3" fill="#d9ab84" />
      <circle cx="18" cy="-14" r="2.5" fill="#d9ab84" />
    </svg>
  )
}

// 자라나는 딸기 모종 (stage 1~3)
export function Plant({ x, y, stage }) {
  if (!stage) return null
  const s = [0, 0.55, 0.85, 1][stage]
  return (
    <svg
      width="160"
      height="170"
      viewBox="-80 -160 160 170"
      style={{ position: 'absolute', left: x - 80, top: y - 160, overflow: 'visible', zIndex: Math.round(y) + 1 }}
      className="plant-grow"
      key={stage}
    >
      <g transform={`scale(${s})`} style={{ transformOrigin: '0 0' }}>
        <path d="M0 0 C-2 -30 2 -60 0 -80" stroke="#6f9a5c" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M0 -40 C-30 -40 -50 -60 -48 -86 C-20 -84 -4 -66 0 -40Z" fill="#8fbf6e" />
        <path d="M0 -40 C30 -40 50 -60 48 -86 C20 -84 4 -66 0 -40Z" fill="#7fb062" />
        <path d="M-6 -46 L-36 -76 M6 -46 L36 -76" stroke="#5f8f4a" strokeWidth="2.5" />
        {stage >= 2 && (
          <>
            <path d="M0 -70 C-36 -78 -58 -104 -50 -132 C-18 -124 -4 -100 0 -70Z" fill="#9ccb79" />
            <path d="M0 -70 C36 -78 58 -104 50 -132 C18 -124 4 -100 0 -70Z" fill="#86b866" />
            <path d="M0 -76 C-6 -100 6 -120 0 -140 C10 -120 12 -96 0 -76Z" fill="#a9d184" />
          </>
        )}
        {stage >= 3 &&
          [
            [-46, -128],
            [44, -122],
            [0, -146],
          ].map(([fx, fy], i) => (
            <g key={i} transform={`translate(${fx} ${fy})`}>
              {[0, 72, 144, 216, 288].map((a) => (
                <ellipse key={a} cx="0" cy="-10" rx="8" ry="10" fill="#fffaf0" stroke="#f1d9c5" strokeWidth="1.5" transform={`rotate(${a})`} />
              ))}
              <circle r="6" fill="#f6cc5c" />
            </g>
          ))}
      </g>
    </svg>
  )
}

// 물방울
export function Droplets({ x, y }) {
  return (
    <div style={{ position: 'absolute', left: x, top: y, zIndex: 2000 }}>
      {Array.from({ length: 9 }, (_, i) => (
        <svg
          key={i}
          className="drop"
          width="12"
          height="16"
          viewBox="-6 -8 12 16"
          style={{ position: 'absolute', left: (i % 3) * 9 - 6, top: 0, animationDelay: `${i * 0.11}s` }}
        >
          <path d="M0 -8 C4 -2 6 2 6 4 A6 6 0 0 1 -6 4 C-6 2 -4 -2 0 -8Z" fill="#9fd6f0" stroke="#6fb2d6" strokeWidth="1.2" />
        </svg>
      ))}
    </div>
  )
}

// 선물 상자
export function GiftBox({ x, y, open, shake, color = '#f2a98a', ribbon = '#fff4e6' }) {
  return (
    <svg
      width="190"
      height="200"
      viewBox="-95 -170 190 200"
      className={shake ? `box-shake-${shake}` : ''}
      style={{ position: 'absolute', left: x - 95, top: y - 170, overflow: 'visible', zIndex: Math.round(y) + 5, transformOrigin: '50% 100%' }}
    >
      <ellipse cx="0" cy="22" rx="80" ry="14" fill="rgba(80,50,30,0.2)" />
      <rect x="-68" y="-70" width="136" height="90" rx="8" fill={color} />
      <rect x="-68" y="-70" width="136" height="90" rx="8" fill="url(#hatch)" />
      <rect x="-12" y="-70" width="24" height="90" fill={ribbon} />
      <g className={open ? 'lid-open' : ''}>
        <rect x="-78" y="-98" width="156" height="34" rx="8" fill={color} stroke="rgba(90,61,51,0.15)" strokeWidth="3" />
        <rect x="-12" y="-98" width="24" height="34" fill={ribbon} />
        <path d="M0 -98 C-30 -140 -66 -120 -44 -100 C-30 -92 -12 -96 0 -98Z" fill={ribbon} stroke="#e9c9b0" strokeWidth="3" />
        <path d="M0 -98 C30 -140 66 -120 44 -100 C30 -92 12 -96 0 -98Z" fill={ribbon} stroke="#e9c9b0" strokeWidth="3" />
        <circle cx="0" cy="-99" r="9" fill={ribbon} stroke="#e9c9b0" strokeWidth="3" />
      </g>
    </svg>
  )
}

// 1등: 황금 열기구 티켓
export function GoldenTicket({ w = 260, style, className }) {
  return (
    <svg className={className} width={w} height={w * 0.56} viewBox="0 0 250 140" style={{ overflow: 'visible', ...style }}>
      <defs>
        <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff0a8" />
          <stop offset="0.45" stopColor="#f3c44c" />
          <stop offset="0.7" stopColor="#ffe59a" />
          <stop offset="1" stopColor="#d99a2b" />
        </linearGradient>
      </defs>
      <path
        d="M10 0 H240 A10 10 0 0 1 250 10 V52 A18 18 0 0 0 250 88 V130 A10 10 0 0 1 240 140 H10 A10 10 0 0 1 0 130 V88 A18 18 0 0 0 0 52 V10 A10 10 0 0 1 10 0Z"
        fill="url(#gold)"
        stroke="#b97c1f"
        strokeWidth="4"
      />
      <line x1="180" y1="10" x2="180" y2="130" stroke="#b97c1f" strokeWidth="3" strokeDasharray="6 6" />
      <g transform="translate(212 70)">
        <path d="M0 -34 C22 -34 26 -8 12 8 L6 18 H-6 L-12 8 C-26 -8 -22 -34 0 -34Z" fill="#fff6d8" stroke="#b97c1f" strokeWidth="3" />
        <rect x="-7" y="22" width="14" height="10" rx="2" fill="#c98b3a" />
      </g>
      <text x="92" y="58" textAnchor="middle" fontFamily="Galmuri11" fontWeight="700" fontSize="20" fill="#8a5a12">
        GOLDEN TICKET
      </text>
      <text x="92" y="92" textAnchor="middle" fontFamily="Galmuri11" fontSize="15" fill="#8a5a12">
        ★ 어디든 갈 수 있어요 ★
      </text>
      <text x="92" y="118" textAnchor="middle" fontFamily="Galmuri11" fontSize="12" fill="#a8742a">
        No.0001 · Pick-a-Boo Air
      </text>
    </svg>
  )
}

// 열기구 (주인공이 바구니에서 손 흔들기)
export function Balloon({ w = 150, tilt = 0, heroSprite = 'girl-cheer', style }) {
  const h = w * 1.55
  return (
    <div style={{ position: 'absolute', width: w, height: h, transform: `translate(-50%, -100%) rotate(${tilt}deg)`, transformOrigin: '50% 100%', ...style }}>
      {/* 주인공: 바구니 뒤에 상반신만 */}
      <div style={{ position: 'absolute', left: w * 0.27, top: h * 0.55, width: w * 0.46, height: h * 0.25, overflow: 'hidden' }}>
        <img src={spriteUrl(heroSprite)} alt="" style={{ position: 'absolute', width: '100%', left: 0, top: 0 }} />
      </div>
      <svg width={w} height={h} viewBox="0 0 150 232" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <path d="M40 150 L52 186 M110 150 L98 186 M62 160 L60 186 M88 160 L90 186" stroke="#a9785a" strokeWidth="3" />
        <path d="M75 4 C130 4 150 50 146 86 C142 118 112 140 100 156 H50 C38 140 8 118 4 86 C0 50 20 4 75 4Z" fill="#fbe2c4" />
        <path d="M6 94 C20 120 40 140 50 156 H100 C110 140 130 120 144 94 C120 104 30 104 6 94Z" fill="#f2a98a" />
        <path d="M75 4 C60 30 54 100 62 156 M75 4 C90 30 96 100 88 156" stroke="#f0c9a6" strokeWidth="3" fill="none" />
        <path d="M75 4 C36 20 26 90 42 150 M75 4 C114 20 124 90 108 150" stroke="#f0c9a6" strokeWidth="3" fill="none" />
        <path d="M14 60 C50 70 100 70 136 60" stroke="#f7d3b0" strokeWidth="5" fill="none" opacity="0.8" />
        <rect x="48" y="152" width="54" height="8" rx="3" fill="#e8826b" />
        {/* 바구니 앞면 */}
        <path d="M42 180 H108 L102 222 C100 228 50 228 48 222Z" fill="#d98a62" />
        <path d="M42 180 H108 V190 H42Z" fill="#9fb48a" />
        <path d="M50 198 H100 M52 210 H98" stroke="#c0704c" strokeWidth="3" />
      </svg>
    </div>
  )
}

export function Snowman({ h = 140 }) {
  return (
    <svg width={h * 0.8} height={h} viewBox="-40 -100 80 100" style={{ overflow: 'visible', display: 'block' }}>
      <circle cx="0" cy="-28" r="28" fill="#fffdf8" stroke="#dfe6ee" strokeWidth="3" />
      <circle cx="0" cy="-70" r="20" fill="#fffdf8" stroke="#dfe6ee" strokeWidth="3" />
      <path d="M-20 -54 C-8 -48 8 -48 20 -54 L22 -46 C8 -40 -8 -40 -22 -46Z" fill="#e8826b" />
      <path d="M12 -48 L18 -30 L8 -32Z" fill="#e8826b" />
      <circle cx="-7" cy="-74" r="2.6" fill="#3b2a24" />
      <circle cx="7" cy="-74" r="2.6" fill="#3b2a24" />
      <path d="M-2 -68 L10 -66 L-2 -63Z" fill="#f4a24b" />
      <ellipse cx="-12" cy="-66" rx="4" ry="2.5" fill="#f6b8bf" />
      <ellipse cx="12" cy="-66" rx="4" ry="2.5" fill="#f6b8bf" />
      <path d="M-14 -88 C-14 -104 14 -104 14 -88Z" fill="#8aa6c9" />
      <circle cx="0" cy="-102" r="5" fill="#fff" />
      <path d="M-26 -36 L-44 -50 M26 -36 L44 -52" stroke="#a9785a" strokeWidth="3" strokeLinecap="round" />
      <circle cx="0" cy="-30" r="2.5" fill="#a9785a" />
      <circle cx="0" cy="-18" r="2.5" fill="#a9785a" />
    </svg>
  )
}

export function Bee({ h = 90 }) {
  return (
    <svg width={h * 1.1} height={h} viewBox="-50 -50 100 90" style={{ overflow: 'visible', display: 'block' }}>
      <ellipse cx="-14" cy="-26" rx="16" ry="20" fill="#e9f5f7" opacity="0.9" className="wing" />
      <ellipse cx="12" cy="-28" rx="16" ry="20" fill="#e9f5f7" opacity="0.9" className="wing" />
      <ellipse cx="0" cy="0" rx="34" ry="28" fill="#f6d06b" />
      <path d="M-14 -26 C-18 -6 -18 12 -12 26 M8 -27 C4 -6 4 14 10 27" stroke="#6b4a3a" strokeWidth="8" fill="none" opacity="0.85" />
      <circle cx="22" cy="-6" r="3" fill="#3b2a24" />
      <ellipse cx="26" cy="4" rx="5" ry="3" fill="#f6b8bf" />
      <path d="M18 -26 C22 -40 30 -42 32 -38 M26 -22 C34 -34 42 -32 40 -28" stroke="#6b4a3a" strokeWidth="2.5" fill="none" />
      <path d="M-34 0 L-44 4 L-34 8Z" fill="#6b4a3a" />
    </svg>
  )
}

function House({ x, y, w = 60, wall = '#fbe9d0', roof = '#e8826b', door = '#c98b5e', snow }) {
  const h = w * 0.8
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-w / 2} y={-h} width={w} height={h} fill={wall} />
      <rect x={-w / 2} y={-h} width={w} height={h} fill="url(#hatch)" />
      <path d={`M${-w / 2 - 8} ${-h + 2} L0 ${-h - w * 0.55} L${w / 2 + 8} ${-h + 2}Z`} fill={snow ? '#fffdf8' : roof} />
      {snow && <path d={`M${-w / 2 - 8} ${-h + 2} L${w / 2 + 8} ${-h + 2} L${w / 2} ${-h + 10} L${-w / 2} ${-h + 10}Z`} fill={roof} opacity="0.5" />}
      <path d={`M-8 0 V${-h * 0.45} A8 8 0 0 1 8 ${-h * 0.45} V0Z`} fill={door} />
      <rect x={w * 0.18} y={-h * 0.75} width={w * 0.18} height={w * 0.18} fill="#ffe7a8" stroke={door} strokeWidth="2" />
    </g>
  )
}

function Tree({ x, y, s = 1, c = '#8fb48a', trunk = '#a9785a' }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-3 0 V-24 M3 0 V-24" stroke={trunk} strokeWidth="5" />
      <path d="M0 -80 C24 -70 26 -30 18 -20 C10 -12 -10 -12 -18 -20 C-26 -30 -24 -70 0 -80Z" fill={c} />
      <path d="M0 -70 V-20 M0 -40 L10 -52 M0 -32 L-10 -44" stroke={trunk} strokeWidth="2.5" opacity="0.7" />
    </g>
  )
}

function Windmill({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M-18 0 L-12 -70 H12 L18 0Z" fill="#fbe9d0" />
      <path d="M-18 0 L-12 -70 H12 L18 0Z" fill="url(#hatch)" />
      <path d="M-16 -70 L0 -88 L16 -70Z" fill="#e8826b" />
      <path d="M-5 0 V-16 A5 5 0 0 1 5 -16 V0Z" fill="#c98b5e" />
      <g className="windmill-spin" style={{ transformOrigin: '0px -72px', transformBox: 'view-box' }}>
        {[0, 90, 180, 270].map((a) => (
          <g key={a} transform={`rotate(${a} 0 -72)`}>
            <rect x="-5" y="-130" width="10" height="56" fill="#fff8ec" stroke="#c9a37f" strokeWidth="2" />
            <path d="M-5 -126 H5 M-5 -112 H5 M-5 -98 H5 M-5 -84 H5" stroke="#c9a37f" strokeWidth="1.5" />
          </g>
        ))}
      </g>
      <circle cx="0" cy="-72" r="5" fill="#a9785a" />
    </g>
  )
}

// 떠 있는 섬 (지도용)
export function Island({ island, glow, scale = 1 }) {
  const { id } = island
  const top = { maple: '#a8c48a', pumpkin: '#b9b48e', snow: '#fffaf3', windmill: '#b5d39a' }[id]
  return (
    <svg width={260 * scale} height={230 * scale} viewBox="-130 -150 260 230" style={{ overflow: 'visible', display: 'block' }}>
      {glow && <ellipse cx="0" cy="-10" rx="140" ry="70" fill="#fff4b8" opacity="0.7" className="glow-pulse" />}
      {/* 섬 아랫부분 */}
      <path d="M-110 -8 C-90 40 -40 76 0 80 C40 76 90 40 110 -8Z" fill="#c99a74" />
      <path d="M-110 -8 C-90 40 -40 76 0 80 C40 76 90 40 110 -8Z" fill="url(#hatch)" />
      <path d="M-70 20 C-40 30 -10 26 10 34 M-40 50 C-10 56 20 50 40 40" stroke="#a9785a" strokeWidth="3" fill="none" opacity="0.6" />
      <path d="M-30 74 C-28 92 -20 100 -18 110 M24 72 C24 88 30 96 28 104" stroke="#8fb48a" strokeWidth="3" fill="none" />
      {/* 윗면 */}
      <ellipse cx="0" cy="-10" rx="118" ry="34" fill={top} />
      <ellipse cx="0" cy="-14" rx="104" ry="26" fill={top} opacity="0.6" stroke="rgba(255,255,255,0.4)" strokeWidth="3" />
      {id === 'maple' && (
        <>
          <Tree x={-70} y={-10} s={0.9} c="#e9a066" />
          <Tree x={70} y={-16} s={1.05} c="#d9824f" />
          <Tree x={88} y={4} s={0.7} c="#f0c068" />
          <House x={-6} y={-6} w={58} wall="#fbe9d0" roof="#d9824f" />
        </>
      )}
      {id === 'pumpkin' && (
        <>
          <House x={-46} y={-8} w={56} wall="#efe3f1" roof="#8d7fb8" door="#7b6aa6" />
          <House x={40} y={-14} w={48} wall="#fbe9d0" roof="#e6965e" />
          <Tree x={88} y={2} s={0.7} c="#b9a96e" />
        </>
      )}
      {id === 'snow' && (
        <>
          <House x={-44} y={-8} w={54} wall="#f2b5a5" roof="#d98b7c" snow />
          <House x={30} y={-16} w={46} wall="#9fb7cf" roof="#7f9ab6" snow />
          <Tree x={84} y={0} s={0.75} c="#e8eef2" trunk="#c8a58c" />
          <Tree x={-92} y={4} s={0.6} c="#e8eef2" trunk="#c8a58c" />
        </>
      )}
      {id === 'windmill' && (
        <>
          <Windmill x={-30} y={-10} />
          <House x={52} y={-8} w={44} wall="#fbe9d0" roof="#e79aa6" />
          {[-90, -70, 10, 20, 86].map((fx, i) => (
            <circle key={i} cx={fx} cy={-2 + (i % 2) * 8} r="5" fill={['#f6c9cf', '#fff', '#f6d58b'][i % 3]} />
          ))}
        </>
      )}
    </svg>
  )
}

// 마을 방문 장면의 배경 (눈꽃 마을은 작가님 일러스트를 그대로 사용)
export function VillageBackdrop({ id }) {
  const sky = {
    maple: ['#fde7c8', '#f8d0a8'],
    pumpkin: ['#cbbbe0', '#f7cdb8'],
    windmill: ['#cfe9df', '#fdf0dc'],
  }[id]
  const ground = { maple: '#d9b27a', pumpkin: '#b8a982', windmill: '#a9c98a' }[id]
  return (
    <svg width="1024" height="768" viewBox="0 0 1024 768" style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <linearGradient id={`sky-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sky[0]} />
          <stop offset="1" stopColor={sky[1]} />
        </linearGradient>
      </defs>
      <rect x="-30" y="-30" width="1084" height="828" fill={`url(#sky-${id})`} />
      <g filter="url(#crayon)">
        <path d="M-30 360 C160 290 300 330 420 300 C560 260 700 320 820 290 C900 270 980 300 1054 290 V798 H-30Z" fill={id === 'pumpkin' ? '#9c8fb3' : '#b9cf9e'} opacity="0.7" />
        <path d="M-30 470 C200 430 420 460 600 440 C780 420 900 450 1054 440 V798 H-30Z" fill={ground} />
        <path d="M-30 470 C200 430 420 460 600 440 C780 420 900 450 1054 440 V798 H-30Z" fill="url(#hatch)" />
        <path d="M380 768 C430 640 470 560 520 452 C540 470 600 560 680 768Z" fill="#f3dfb6" opacity="0.8" />
        {id === 'maple' && (
          <>
            <Tree x={110} y={470} s={2.4} c="#e9a066" />
            <Tree x={250} y={455} s={1.8} c="#f0c068" />
            <Tree x={880} y={460} s={2.6} c="#d9824f" />
            <Tree x={760} y={440} s={1.5} c="#e9a066" />
            <House x={640} y={440} w={110} wall="#fbe9d0" roof="#d9824f" />
          </>
        )}
        {id === 'pumpkin' && (
          <>
            <circle cx="820" cy="140" r="54" fill="#fff4d6" />
            <House x={190} y={460} w={140} wall="#efe3f1" roof="#8d7fb8" door="#7b6aa6" />
            <House x={800} y={450} w={120} wall="#fbe9d0" roof="#e6965e" />
            <Tree x={940} y={460} s={1.8} c="#b9a96e" />
            {[[90, 140], [300, 90], [600, 70], [700, 180], [960, 60]].map(([sx, sy], i) => (
              <path key={i} d={`M${sx} ${sy - 8} L${sx + 3} ${sy - 2} L${sx + 9} ${sy} L${sx + 3} ${sy + 2} L${sx} ${sy + 8} L${sx - 3} ${sy + 2} L${sx - 9} ${sy} L${sx - 3} ${sy - 2}Z`} fill="#fff8d8" />
            ))}
          </>
        )}
        {id === 'windmill' && (
          <>
            <g transform="translate(200 470) scale(2.6)">
              <Windmill x={0} y={0} />
            </g>
            <House x={820} y={450} w={110} wall="#fbe9d0" roof="#e79aa6" />
            {Array.from({ length: 40 }, (_, i) => (
              <circle key={i} cx={(i * 97) % 1024} cy={500 + ((i * 53) % 250)} r={6 + (i % 3) * 2} fill={['#f6c9cf', '#fffaf0', '#f6d58b', '#e79aa6'][i % 4]} />
            ))}
          </>
        )}
      </g>
    </svg>
  )
}
