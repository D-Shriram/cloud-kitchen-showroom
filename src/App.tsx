import { Canvas } from '@react-three/fiber'
import { useMemo, useState } from 'react'
import { layouts, SIZE, type Layout } from './layouts'
import { KitchenScene } from './scene/KitchenScene'
import './App.css'

export default function App() {
  const [layoutId, setLayoutId] = useState(layouts[0].id)
  const [walkMode, setWalkMode] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const layout = layouts.find((item) => item.id === layoutId) ?? layouts[0]
  const selected = layout.rooms.find((room) => room.id === selectedId) ?? null

  return (
    <div className="app">
      <header className="top">
        <div>
          <p className="kicker">Cloud kitchen · Proposed GA · 60 × 60 ft</p>
          <h1>Interior showroom</h1>
        </div>
        <div className="modes">
          <button
            type="button"
            className={!walkMode ? 'on' : ''}
            onClick={() => setWalkMode(false)}
          >
            Dollhouse
          </button>
          <button
            type="button"
            className={walkMode ? 'on' : ''}
            onClick={() => setWalkMode(true)}
          >
            Walk through
          </button>
        </div>
      </header>

      <nav className="tabs" aria-label="Floor plan options">
        {layouts.map((item) => (
          <button
            key={item.id}
            type="button"
            className={item.id === layout.id ? 'on' : ''}
            onClick={() => {
              setLayoutId(item.id)
              setSelectedId(null)
            }}
          >
            <span className="code">{item.code}</span>
            {item.name}
          </button>
        ))}
      </nav>

      <div className="stage">
        <div className="canvas-wrap" id={walkMode ? 'walk-canvas' : undefined}>
          <Canvas
            camera={{ position: [0, 52, 42], fov: 40, near: 0.1, far: 220 }}
            onPointerMissed={() => setSelectedId(null)}
          >
            <KitchenScene
              key={`${layout.id}-${walkMode}`}
              layout={layout}
              walkMode={walkMode}
              selectedId={selectedId}
              onSelect={setSelectedId}
              focusId={selectedId}
            />
          </Canvas>
          {walkMode && (
            <p className="hint">Click the kitchen, then use W A S D to walk · Shift to move faster · Esc to release mouse</p>
          )}
        </div>

        <aside className="panel">
          <p className="layout-name">
            {layout.code} · {layout.name}
          </p>
          <p className="summary">{layout.summary}</p>
          <Minimap layout={layout} selectedId={selectedId} onSelect={setSelectedId} />
          <div className="facts">
            <span>60 × 60 ft</span>
            <span>Ceiling 13 ft</span>
            <span>IN staff south-west</span>
            <span>OUT dispatch south-east</span>
            <span>Exhaust on north wall</span>
          </div>
          {selected ? (
            <div className="card">
              <h2>{selected.name}</h2>
              <p>
                {selected.w.toFixed(1)} × {selected.d.toFixed(1)} ft ·{' '}
                {(selected.w * selected.d).toFixed(0)} sq ft
              </p>
              <p className="muted">{blurb(selected.type)}</p>
            </div>
          ) : (
            <div className="card">
              <h2>Client walkthrough</h2>
              <p className="muted">
                Click a labelled zone to fly in. All six options share the same bright hygiene
                finish: white wall tile, epoxy floor, stainless equipment, north exhaust.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

function Minimap({
  layout,
  selectedId,
  onSelect,
}: {
  layout: Layout
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  const scale = 180 / SIZE
  const rooms = useMemo(() => layout.rooms, [layout])
  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="mini" role="img" aria-label="Floor plan">
      <rect x="0" y="0" width={SIZE} height={SIZE} fill="#f7f4ee" stroke="#d7d0c4" />
      {rooms.map((room) => (
        <g key={room.id} onClick={() => onSelect(room.id)} style={{ cursor: 'pointer' }}>
          <rect
            x={room.x}
            y={room.z}
            width={room.w}
            height={room.d}
            fill={selectedId === room.id ? '#fff3b0' : roomFill(room.type)}
            stroke="#c8c0b4"
            strokeWidth={0.25}
          />
          <text x={room.x + room.w / 2} y={room.z + room.d / 2} textAnchor="middle" fontSize={2.1} fill="#5a5348">
            {shortName(room.name)}
          </text>
        </g>
      ))}
      <text x={12} y={58.6} fontSize={2} fill="#3d7a52">
        IN
      </text>
      <text x={48} y={58.6} fontSize={2} fill="#9a7040">
        OUT
      </text>
      <title>{`Scale ${scale.toFixed(1)}`}</title>
    </svg>
  )
}

function shortName(name: string) {
  return name.replace('Veg / non-veg prep', 'Prep').replace('Walk-in cold + freezer', 'Cold').replace('Packing + dispatch', 'Pack').replace('Receiving + staff entry', 'In').replace('Receiving + entry', 'In').replace('Staff, lockers, WC, office', 'Staff').replace('Staff, WC', 'Staff')
}

function roomFill(type: string) {
  const map: Record<string, string> = {
    'south-indian': '#f3e4c8',
    mughlai: '#f4d4c8',
    chinese: '#efe3b8',
    continental: '#d5e6f4',
    desserts: '#f3d5e4',
    prep: '#d8ead4',
    walkin: '#d4eaf0',
    dry: '#eadcc8',
    wash: '#d9e3f2',
    packing: '#f3e7b8',
    receiving: '#e8e0d0',
    staff: '#e4e4ea',
  }
  return map[type] ?? '#eee'
}

function blurb(type: string) {
  const map: Record<string, string> = {
    'south-indian': 'Dosa / tawa line, idli steamers and wet-grinders under the north hood.',
    mughlai: 'Range, tandoor landing and plated-service pass in stainless.',
    chinese: 'Wok range, high-heat hood and plated landing.',
    continental: 'Flat-top, oven and clean-protein line, separated from spicy cluster where the plan allows.',
    desserts: 'Cold garnishes, fridge undercounter and a glass sweet display.',
    prep: 'Shared veg / non-veg tables, colour-coded boards, hand sink.',
    walkin: 'Insulated cold room plus freezer, diamond-plate threshold, LED cold lighting.',
    dry: 'Shelving for grains, spices, packaging — kept off the wet floor.',
    wash: 'Three-compartment sink, machine wash and clean rack return.',
    packing: 'Bag / box benches and a south dispatch pass to riders.',
    receiving: 'Staff-in and goods-in. Crates land here before cold store.',
    staff: 'Lockers, WC and a small office — hygiene lock between street and kitchen.',
  }
  return map[type] ?? 'Clinical finish, easy to keep FSSAI-clean.'
}
