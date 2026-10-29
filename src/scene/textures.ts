import * as THREE from 'three'

function canvasTexture(draw: (ctx: CanvasRenderingContext2D, size: number) => void, size = 256) {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('canvas')
  draw(ctx, size)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  return texture
}

export function wallTileTexture() {
  const texture = canvasTexture((ctx, size) => {
    ctx.fillStyle = '#fbfaf6'
    ctx.fillRect(0, 0, size, size)
    ctx.strokeStyle = '#e6e2d8'
    ctx.lineWidth = 2
    const step = size / 4
    for (let i = 0; i <= size; i += step) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, size)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(size, i)
      ctx.stroke()
    }
  })
  texture.repeat.set(2, 2)
  return texture
}

export function epoxyTexture() {
  const texture = canvasTexture((ctx, size) => {
    ctx.fillStyle = '#eef1ec'
    ctx.fillRect(0, 0, size, size)
    for (let i = 0; i < 900; i++) {
      const x = Math.random() * size
      const y = Math.random() * size
      const a = 0.04 + Math.random() * 0.05
      ctx.fillStyle = Math.random() > 0.5 ? `rgba(255,255,255,${a})` : `rgba(180,190,175,${a})`
      ctx.fillRect(x, y, 1.4, 1.4)
    }
  }, 512)
  texture.repeat.set(20, 20)
  return texture
}

export function stainlessTexture() {
  const texture = canvasTexture((ctx, size) => {
    const gradient = ctx.createLinearGradient(0, 0, size, 0)
    gradient.addColorStop(0, '#dfe5ea')
    gradient.addColorStop(0.35, '#f4f7f9')
    gradient.addColorStop(0.55, '#cfd8df')
    gradient.addColorStop(1, '#e8eef2')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, size, size)
    ctx.fillStyle = 'rgba(255,255,255,0.18)'
    for (let y = 0; y < size; y += 3) {
      ctx.fillRect(0, y, size, 1)
    }
  })
  texture.repeat.set(1, 1)
  return texture
}
