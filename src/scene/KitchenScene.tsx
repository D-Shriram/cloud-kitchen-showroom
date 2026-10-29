import { OrbitControls, PointerLockControls, Text } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import {
  CEILING,
  SIZE,
  WALL,
  type Dir,
  type Layout,
  type Room,
  roomTint,
} from '../layouts'
import { RoomFixtures } from './fixtures'
import { epoxyTexture, wallTileTexture } from './textures'

const HALF = SIZE / 2
const DOOR = 3.4

function worldX(x: number) {
  return x - HALF
}
function worldZ(z: number) {
  return z - HALF
}

function roomCenter(room: Room): [number, number, number] {
  return [worldX(room.x + room.w / 2), 5.4, worldZ(room.z + room.d / 2)]
}

type Props = {
  layout: Layout
  walkMode: boolean
  selectedId: string | null
  onSelect: (id: string | null) => void
  focusId: string | null
}

export function KitchenScene({ layout, walkMode, selectedId, onSelect, focusId }: Props) {
  const wallMap = useMemo(() => wallTileTexture(), [])
  const floorMap = useMemo(() => epoxyTexture(), [])

  return (
    <>
      <color attach="background" args={['#e4eef6']} />
      <hemisphereLight args={['#fff7ee', '#dfe8df', 0.7]} />
      <ambientLight intensity={0.42} />
      <directionalLight position={[18, 42, -28]} intensity={1.2} color="#fff6ea" />
      <directionalLight position={[-20, 18, 24]} intensity={0.35} color="#f3fbff" />

      <Building wallMap={wallMap} floorMap={floorMap} showCeiling={!walkMode} />
      {layout.rooms.map((room) => (
        <Zone
          key={room.id}
          room={room}
          wallMap={wallMap}
          selected={selectedId === room.id}
          onSelect={onSelect}
        />
      ))}
      <NorthHood />
      <SouthDoors />
      {walkMode ? <WalkRig /> : <DollhouseRig layout={layout} focusId={focusId} />}
    </>
  )
}

function Building({
  wallMap,
  floorMap,
  showCeiling,
}: {
  wallMap: THREE.Texture
  floorMap: THREE.Texture
  showCeiling: boolean
}) {
  const wallMat = (
    <meshStandardMaterial map={wallMap} color="#f7f4ee" roughness={0.82} metalness={0.04} />
  )
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]}>
        <planeGeometry args={[SIZE + 8, SIZE + 8]} />
        <meshStandardMaterial color="#d9e1d4" roughness={0.7} metalness={0.02} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[SIZE, SIZE]} />
        <meshStandardMaterial map={floorMap} color="#e7ebe4" roughness={0.45} metalness={0.06} />
      </mesh>
      {/* exterior walls */}
      <mesh position={[0, CEILING / 2, -HALF - WALL / 2]}>
        <boxGeometry args={[SIZE + WALL * 2, CEILING, WALL]} />
        {wallMat}
      </mesh>
      <mesh position={[0, CEILING / 2, HALF + WALL / 2]}>
        <boxGeometry args={[SIZE + WALL * 2, CEILING, WALL]} />
        {wallMat}
      </mesh>
      <mesh position={[-HALF - WALL / 2, CEILING / 2, 0]}>
        <boxGeometry args={[WALL, CEILING, SIZE]} />
        {wallMat}
      </mesh>
      <mesh position={[HALF + WALL / 2, CEILING / 2, 0]}>
        <boxGeometry args={[WALL, CEILING, SIZE]} />
        {wallMat}
      </mesh>
      <Windows />
      {showCeiling ? (
        <group>
          <mesh position={[0, CEILING, 0]}>
            <boxGeometry args={[SIZE + 1, 0.25, SIZE + 1]} />
            <meshStandardMaterial color="#f6f3ec" roughness={0.9} />
          </mesh>
          {Array.from({ length: 6 }).map((_, ix) =>
            Array.from({ length: 6 }).map((_, iz) => (
              <mesh
                key={`${ix}-${iz}`}
                position={[-22.5 + ix * 9, CEILING - 0.2, -22.5 + iz * 9]}
              >
                <boxGeometry args={[6.5, 0.08, 2.2]} />
                <meshStandardMaterial
                  color="#fffaf0"
                  emissive="#fff4d6"
                  emissiveIntensity={0.85}
                />
              </mesh>
            )),
          )}
        </group>
      ) : (
        Array.from({ length: 6 }).map((_, ix) =>
          Array.from({ length: 6 }).map((_, iz) => (
            <mesh key={`${ix}-${iz}`} position={[-22.5 + ix * 9, CEILING - 0.4, -22.5 + iz * 9]}>
              <boxGeometry args={[6.5, 0.08, 2.2]} />
              <meshStandardMaterial color="#fffaf0" emissive="#fff1c8" emissiveIntensity={1.1} />
            </mesh>
          )),
        )
      )}
    </group>
  )
}

function Windows() {
  const panes: Array<[number, number, number, number, number]> = []
  for (let i = 0; i < 5; i++) {
    panes.push([-HALF - 0.12, 6.2, -20 + i * 10, 0.12, Math.PI / 2])
    panes.push([HALF + 0.12, 6.2, -20 + i * 10, 0.12, Math.PI / 2])
  }
  return (
    <group>
      {panes.map((p, i) => (
        <mesh key={i} position={[p[0], p[1], p[2]]} rotation={[0, p[4], 0]}>
          <boxGeometry args={[6.2, 4.6, 0.16]} />
          <meshPhysicalMaterial
            color="#e8f5ff"
            transparent
            opacity={0.45}
            roughness={0.08}
            metalness={0.05}
            transmission={0.55}
            thickness={0.3}
          />
        </mesh>
      ))}
    </group>
  )
}

function NorthHood() {
  return (
    <group position={[0, 11.2, -HALF + 1.6]}>
      <mesh>
        <boxGeometry args={[SIZE - 4, 0.7, 3.6]} />
        <meshStandardMaterial color="#c9d3db" metalness={0.78} roughness={0.22} />
      </mesh>
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[SIZE - 6, 0.12, 2.6]} />
        <meshStandardMaterial color="#fff6e4" emissive="#ffe7b8" emissiveIntensity={0.7} />
      </mesh>
    </group>
  )
}

function SouthDoors() {
  return (
    <group>
      <mesh position={[-18, 3.6, HALF + 0.2]}>
        <boxGeometry args={[5.5, 7.2, 0.2]} />
        <meshStandardMaterial color="#cfe8d4" metalness={0.15} roughness={0.4} />
      </mesh>
      <mesh position={[18, 3.6, HALF + 0.2]}>
        <boxGeometry args={[5.5, 7.2, 0.2]} />
        <meshStandardMaterial color="#f3ddb0" metalness={0.15} roughness={0.4} />
      </mesh>
    </group>
  )
}

function Zone({
  room,
  wallMap,
  selected,
  onSelect,
}: {
  room: Room
  wallMap: THREE.Texture
  selected: boolean
  onSelect: (id: string | null) => void
}) {
  const cx = worldX(room.x + room.w / 2)
  const cz = worldZ(room.z + room.d / 2)
  const h = room.solid ? 10.5 : 4.2
  const tint = roomTint[room.type]

  return (
    <group position={[cx, 0, cz]}>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.12, 0]}
        onClick={(e) => {
          e.stopPropagation()
          onSelect(room.id)
        }}
      >
        <planeGeometry args={[room.w - 0.15, room.d - 0.15]} />
        <meshStandardMaterial
          color={selected ? '#ffe99a' : tint}
          roughness={0.62}
          metalness={0}
        />
      </mesh>
      <Partition
        room={room}
        wallMap={wallMap}
        height={h}
        selected={selected}
      />
      <RoomFixtures room={room} />
      <Text
        position={[0, room.solid ? 7.4 : 5.4, 0]}
        fontSize={0.85}
        color="#3d372f"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.06}
        outlineColor="#fffaf0"
        onClick={(e) => {
          e.stopPropagation()
          onSelect(room.id)
        }}
      >
        {room.name}
      </Text>
    </group>
  )
}

function Partition({
  room,
  wallMap,
  height,
  selected,
}: {
  room: Room
  wallMap: THREE.Texture
  height: number
  selected: boolean
}) {
  const color = selected ? '#fff6d4' : '#f4f1ea'
  const sides: Array<{ dir: Dir; pos: [number, number, number]; args: [number, number, number] }> = [
    { dir: 'n', pos: [0, height / 2, -room.d / 2], args: [room.w, height, WALL] },
    { dir: 's', pos: [0, height / 2, room.d / 2], args: [room.w, height, WALL] },
    { dir: 'w', pos: [-room.w / 2, height / 2, 0], args: [WALL, height, room.d] },
    { dir: 'e', pos: [room.w / 2, height / 2, 0], args: [WALL, height, room.d] },
  ]
  return (
    <group>
      {sides.map((side) => {
        const open = room.doors.includes(side.dir)
        if (!open) {
          return (
            <mesh key={side.dir} position={side.pos}>
              <boxGeometry args={side.args} />
              <meshStandardMaterial map={wallMap} color={color} roughness={0.8} />
            </mesh>
          )
        }
        const horizontal = side.dir === 'n' || side.dir === 's'
        if (horizontal) {
          const remain = Math.max(0.4, (room.w - DOOR) / 2)
          return (
            <group key={side.dir}>
              <mesh position={[-room.w / 2 + remain / 2, height / 2, side.pos[2]]}>
                <boxGeometry args={[remain, height, WALL]} />
                <meshStandardMaterial map={wallMap} color={color} roughness={0.8} />
              </mesh>
              <mesh position={[room.w / 2 - remain / 2, height / 2, side.pos[2]]}>
                <boxGeometry args={[remain, height, WALL]} />
                <meshStandardMaterial map={wallMap} color={color} roughness={0.8} />
              </mesh>
              <mesh position={[0, height - 0.45, side.pos[2]]}>
                <boxGeometry args={[DOOR, 0.9, WALL]} />
                <meshStandardMaterial map={wallMap} color={color} roughness={0.8} />
              </mesh>
            </group>
          )
        }
        const remain = Math.max(0.4, (room.d - DOOR) / 2)
        return (
          <group key={side.dir}>
            <mesh position={[side.pos[0], height / 2, -room.d / 2 + remain / 2]}>
              <boxGeometry args={[WALL, height, remain]} />
              <meshStandardMaterial map={wallMap} color={color} roughness={0.8} />
            </mesh>
            <mesh position={[side.pos[0], height / 2, room.d / 2 - remain / 2]}>
              <boxGeometry args={[WALL, height, remain]} />
              <meshStandardMaterial map={wallMap} color={color} roughness={0.8} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

function DollhouseRig({ layout, focusId }: { layout: Layout; focusId: string | null }) {
  const controls = useRef<any>(null)
  const { camera } = useThree()
  const target = useRef(new THREE.Vector3(0, 0.4, 0))
  const goal = useRef(new THREE.Vector3(0, 52, 42))

  useEffect(() => {
    const room = layout.rooms.find((item) => item.id === focusId)
    if (room) {
      const [x, , z] = roomCenter(room)
      target.current.set(x, 0.5, z)
      goal.current.set(x + 10, 18, z + 14)
    } else {
      target.current.set(0, 0.4, 0)
      goal.current.set(0, 52, 42)
    }
  }, [focusId, layout])

  useFrame(() => {
    camera.position.lerp(goal.current, 0.06)
    if (controls.current?.target) {
      controls.current.target.lerp(target.current, 0.08)
      controls.current.update()
    }
  })

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      minPolarAngle={0.18}
      maxPolarAngle={1.05}
      minDistance={16}
      maxDistance={95}
      enablePan
    />
  )
}

function WalkRig() {
  const { camera } = useThree()
  const keys = useRef<Record<string, boolean>>({})
  const velocity = useRef(new THREE.Vector3())

  useEffect(() => {
    camera.position.set(-18, 5.6, 26)
    camera.rotation.set(0, 0, 0)
    const down = (e: KeyboardEvent) => {
      keys.current[e.code] = true
    }
    const up = (e: KeyboardEvent) => {
      keys.current[e.code] = false
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [camera])

  useFrame((_, dt) => {
    const speed = keys.current.ShiftLeft ? 18 : 10
    const forward = (keys.current.KeyW ? 1 : 0) - (keys.current.KeyS ? 1 : 0)
    const strafe = (keys.current.KeyD ? 1 : 0) - (keys.current.KeyA ? 1 : 0)
    const dir = new THREE.Vector3()
    camera.getWorldDirection(dir)
    dir.y = 0
    dir.normalize()
    const right = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize()
    velocity.current.set(0, 0, 0)
    velocity.current.addScaledVector(dir, forward * speed * dt)
    velocity.current.addScaledVector(right, strafe * speed * dt)
    camera.position.add(velocity.current)
    camera.position.y = 5.6
    camera.position.x = THREE.MathUtils.clamp(camera.position.x, -HALF + 1.2, HALF - 1.2)
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, -HALF + 1.2, HALF - 1.2)
  })

  return <PointerLockControls selector="#walk-canvas" />
}
