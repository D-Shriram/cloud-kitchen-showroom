import { useMemo } from 'react'
import type { Room } from '../layouts'

function Steel({
  args,
  position,
  rotation,
}: {
  args: [number, number, number]
  position: [number, number, number]
  rotation?: [number, number, number]
}) {
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={args} />
      <meshStandardMaterial color="#d7dee4" metalness={0.72} roughness={0.28} />
    </mesh>
  )
}

function White({
  args,
  position,
}: {
  args: [number, number, number]
  position: [number, number, number]
}) {
  return (
    <mesh position={position}>
      <boxGeometry args={args} />
      <meshStandardMaterial color="#f4f1ea" roughness={0.55} metalness={0.05} />
    </mesh>
  )
}

export function RoomFixtures({ room }: { room: Room }) {
  const { type, w, d } = room
  const items = useMemo(() => {
    switch (type) {
      case 'south-indian':
      case 'mughlai':
      case 'chinese':
      case 'continental':
        return <CookLine w={w} d={d} />
      case 'desserts':
        return <DessertBay w={w} d={d} />
      case 'prep':
        return <PrepBay w={w} d={d} />
      case 'walkin':
        return <WalkIn w={w} d={d} />
      case 'dry':
        return <DryStore w={w} d={d} />
      case 'wash':
        return <WashBay w={w} d={d} />
      case 'packing':
        return <PackBay w={w} d={d} />
      case 'receiving':
        return <Receiving w={w} d={d} />
      case 'staff':
        return <StaffRoom w={w} d={d} />
      default:
        return null
    }
  }, [type, w, d])

  return <group>{items}</group>
}

function CookLine({ w, d }: { w: number; d: number }) {
  const ranges = Math.max(1, Math.floor((Math.min(w, d) - 1.5) / 3.2))
  const alongNorth = d >= w * 0.7
  return (
    <group>
      {/* exhaust hood */}
      <mesh position={[0, 8.4, alongNorth ? -d / 2 + 2.2 : 0]}>
        <boxGeometry args={alongNorth ? [w - 0.8, 0.55, 4.2] : [4.2, 0.55, d - 0.8]} />
        <meshStandardMaterial
          color="#c5ced6"
          metalness={0.8}
          roughness={0.22}
          emissive="#fff6e8"
          emissiveIntensity={0.12}
        />
      </mesh>
      <mesh position={[0, 10.6, alongNorth ? -d / 2 + 2.2 : 0]}>
        <boxGeometry args={alongNorth ? [0.35, 4.2, 0.35] : [0.35, 4.2, 0.35]} />
        <meshStandardMaterial color="#cfd6dc" metalness={0.7} roughness={0.3} />
      </mesh>
      {Array.from({ length: ranges }).map((_, i) => {
        const x = -w / 2 + 2.2 + i * 3.1
        const z = alongNorth ? -d / 2 + 2.1 : -d / 2 + 2.4 + (i % 2) * 3
        return (
          <group key={i} position={[alongNorth ? Math.min(x, w / 2 - 2) : 0, 0, z]}>
            <Steel args={[2.8, 2.9, 2.6]} position={[0, 1.45, 0]} />
            <mesh position={[0, 3.05, 0]}>
              <boxGeometry args={[2.5, 0.12, 2.3]} />
              <meshStandardMaterial color="#b7c0c8" metalness={0.85} roughness={0.2} />
            </mesh>
            {[-0.7, 0, 0.7].map((bx) =>
              [-0.55, 0.55].map((bz) => (
                <mesh key={`${bx}-${bz}`} position={[bx, 3.14, bz]}>
                  <cylinderGeometry args={[0.22, 0.22, 0.08, 16]} />
                  <meshStandardMaterial color="#9aa7b2" metalness={0.7} roughness={0.35} />
                </mesh>
              )),
            )}
          </group>
        )
      })}
      <Steel args={[Math.min(w - 1, 8), 3.0, 2.2]} position={[0, 1.5, d / 2 - 1.4]} />
      <White args={[Math.min(w - 1.4, 6), 0.08, 1.6]} position={[0, 3.06, d / 2 - 1.4]} />
    </group>
  )
}

function DessertBay({ w, d }: { w: number; d: number }) {
  return (
    <group>
      <Steel args={[Math.min(w - 1, 10), 3.1, 2.4]} position={[0, 1.55, -d / 2 + 1.5]} />
      <mesh position={[0, 5.2, -d / 2 + 1.5]}>
        <boxGeometry args={[Math.min(w - 1.2, 9.4), 3.2, 2.1]} />
        <meshPhysicalMaterial
          color="#f7fbff"
          transparent
          opacity={0.35}
          roughness={0.05}
          transmission={0.6}
          thickness={0.4}
        />
      </mesh>
      <Steel args={[2.6, 4.6, 2.6]} position={[-w / 2 + 2, 2.3, d / 2 - 2.2]} />
      <Steel args={[Math.min(w - 2, 7), 3, 2.2]} position={[w / 4, 1.5, d / 2 - 1.5]} />
    </group>
  )
}

function PrepBay({ w, d }: { w: number; d: number }) {
  const tables = Math.max(1, Math.floor(w / 8))
  return (
    <group>
      {Array.from({ length: tables }).map((_, i) => {
        const x = -w / 2 + 4 + i * 7.5
        return (
          <group key={i} position={[Math.min(x, w / 2 - 3.5), 0, 0]}>
            <Steel args={[6.2, 0.12, Math.min(d - 2, 6.5)]} position={[0, 3.0, 0]} />
            <Steel args={[0.18, 3, 0.18]} position={[-2.9, 1.5, -2.4]} />
            <Steel args={[0.18, 3, 0.18]} position={[2.9, 1.5, -2.4]} />
            <Steel args={[0.18, 3, 0.18]} position={[-2.9, 1.5, 2.4]} />
            <Steel args={[0.18, 3, 0.18]} position={[2.9, 1.5, 2.4]} />
            <mesh position={[-1.6, 3.08, 1.4]}>
              <boxGeometry args={[1.6, 0.12, 1.2]} />
              <meshStandardMaterial color="#8ec3b0" roughness={0.45} />
            </mesh>
          </group>
        )
      })}
      <Steel args={[2.4, 3.1, 2.2]} position={[w / 2 - 1.6, 1.55, -d / 2 + 1.4]} />
    </group>
  )
}

function WalkIn({ w, d }: { w: number; d: number }) {
  const innerW = Math.max(2, w - 1.1)
  const innerD = Math.max(2, d - 1.1)
  return (
    <group>
      <mesh position={[0, 5.2, 0]}>
        <boxGeometry args={[innerW, 10.2, innerD]} />
        <meshStandardMaterial color="#e7f3f6" roughness={0.7} />
      </mesh>
      <mesh position={[0, 10.35, 0]}>
        <boxGeometry args={[innerW + 0.2, 0.2, innerD + 0.2]} />
        <meshStandardMaterial color="#cfe3ea" metalness={0.4} roughness={0.4} />
      </mesh>
      {Array.from({ length: 3 }).map((_, i) => (
        <Steel
          key={i}
          args={[innerW * 0.7, 6.5, 0.12]}
          position={[0, 4.2, -innerD / 2 + 1.2 + i * Math.min(2.2, innerD / 3)]}
        />
      ))}
      <mesh position={[0, 11.2, 0]}>
        <boxGeometry args={[1.6, 0.15, 1.6]} />
        <meshStandardMaterial color="#f4fbff" emissive="#d7f0ff" emissiveIntensity={0.8} />
      </mesh>
    </group>
  )
}

function DryStore({ w, d }: { w: number; d: number }) {
  const rows = Math.max(1, Math.floor(d / 3.2))
  return (
    <group>
      {Array.from({ length: rows }).map((_, i) => (
        <group key={i} position={[0, 0, -d / 2 + 1.6 + i * 3.1]}>
          <Steel args={[Math.min(w - 1.2, 8), 7.2, 0.12]} position={[0, 3.7, 0]} />
          {[-2.2, 0, 2.2].map((x) =>
            [1.4, 3.2, 5.0, 6.8].map((y) => (
              <White key={`${x}-${y}`} args={[1.6, 0.7, 1.1]} position={[x, y, 0.55]} />
            )),
          )}
        </group>
      ))}
    </group>
  )
}

function WashBay({ w, d }: { w: number; d: number }) {
  return (
    <group>
      <Steel args={[Math.min(w - 1, 9), 3.1, 2.6]} position={[0, 1.55, -d / 2 + 1.6]} />
      {[-2.4, 0, 2.4].map((x) => (
        <mesh key={x} position={[x, 3.2, -d / 2 + 1.6]}>
          <boxGeometry args={[2.1, 0.35, 2.1]} />
          <meshStandardMaterial color="#c5d0d8" metalness={0.65} roughness={0.25} />
        </mesh>
      ))}
      <Steel args={[3.4, 4.8, 2.8]} position={[-w / 2 + 2.4, 2.4, d / 2 - 2.2]} />
      <mesh position={[-w / 2 + 2.4, 5.1, d / 2 - 2.2]}>
        <boxGeometry args={[2.8, 1.4, 2.2]} />
        <meshStandardMaterial color="#dfeaf0" metalness={0.3} roughness={0.35} />
      </mesh>
      <Steel args={[Math.min(w - 2, 6), 5.5, 1.8]} position={[w / 4, 2.75, 0]} />
    </group>
  )
}

function PackBay({ w, d }: { w: number; d: number }) {
  const n = Math.max(1, Math.floor(w / 7))
  return (
    <group>
      {Array.from({ length: n }).map((_, i) => {
        const x = -w / 2 + 3.5 + i * 6.8
        return (
          <group key={i} position={[Math.min(x, w / 2 - 3), 0, 0]}>
            <Steel args={[5.4, 3.0, Math.min(d - 3, 8)]} position={[0, 1.5, 0]} />
            <mesh position={[0, 3.08, 0]}>
              <boxGeometry args={[5.2, 0.1, Math.min(d - 3.2, 7.6)]} />
              <meshStandardMaterial color="#f3efe4" roughness={0.5} />
            </mesh>
          </group>
        )
      })}
      <Steel args={[Math.min(w - 2, 12), 3.4, 0.7]} position={[0, 4.4, d / 2 - 0.2]} />
    </group>
  )
}

function Receiving({ w, d }: { w: number; d: number }) {
  return (
    <group>
      <Steel args={[Math.min(w - 1.5, 8), 0.25, Math.min(d - 1.5, 6)]} position={[0, 0.2, 0]} />
      {[-1.6, 1.6].map((x, i) => (
        <mesh key={i} position={[x, 1.1, -0.4]}>
          <boxGeometry args={[2.2, 1.6, 1.6]} />
          <meshStandardMaterial color="#e4d4b4" roughness={0.7} />
        </mesh>
      ))}
      <Steel args={[2.2, 3.2, 2.2]} position={[w / 2 - 1.6, 1.6, d / 2 - 1.8]} />
    </group>
  )
}

function StaffRoom({ w, d }: { w: number; d: number }) {
  const lockers = Math.max(2, Math.min(8, Math.floor(w / 1.4)))
  return (
    <group>
      {Array.from({ length: lockers }).map((_, i) => (
        <mesh key={i} position={[-w / 2 + 1 + i * 1.25, 3.1, -d / 2 + 0.7]}>
          <boxGeometry args={[1.1, 6.2, 1.1]} />
          <meshStandardMaterial color={i % 2 ? '#f3f0e8' : '#e7eef2'} roughness={0.5} />
        </mesh>
      ))}
      <White args={[3.2, 0.12, 1.8]} position={[w / 2 - 2.2, 2.9, d / 4]} />
      <mesh position={[w / 2 - 2.2, 1.45, d / 4]}>
        <boxGeometry args={[0.12, 2.9, 1.8]} />
        <meshStandardMaterial color="#f0ebe3" />
      </mesh>
      <mesh position={[w / 2 - 3.4, 2.2, d / 2 - 1.2]}>
        <cylinderGeometry args={[0.7, 0.7, 0.35, 20]} />
        <meshStandardMaterial color="#d5e4ea" metalness={0.4} roughness={0.3} />
      </mesh>
    </group>
  )
}
