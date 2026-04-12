import { useEffect, useRef, useState } from 'react'
import { animate } from 'animejs'

/**
 * PlayerAvatar — Pixel character with 4-directional walk animation.
 * Rendered as a 24x24px pixel sprite.
 */
export default function PlayerAvatar({ direction = 'down', isWalking = false }) {
  const canvasRef = useRef(null)
  const animFrameRef = useRef(null)
  const frameRef = useRef(0)

  useEffect(() => {
    if (!isWalking) {
      frameRef.current = 0
      return
    }

    let frame = 0
    const animate = () => {
      frame = (frame + 1) % 4
      frameRef.current = frame
      animFrameRef.current = requestAnimationFrame(() => {
        setTimeout(animate, 150)
      })
    }
    animFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [isWalking])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, 24, 24)

    const frame = frameRef.current
    const bobY = isWalking ? (frame % 2 === 0 ? 0 : -1) : 0

    // Draw pixel character
    drawCharacter(ctx, direction, frame, isWalking, bobY)
  }, [direction, frameRef.current, isWalking])

  return (
    <canvas
      ref={canvasRef}
      width={24}
      height={24}
      className="absolute pointer-events-none"
      style={{
        imageRendering: 'pixelated',
        width: 24,
        height: 24,
        zIndex: 10,
      }}
    />
  )
}

function drawCharacter(ctx, direction, frame, isWalking, bobY) {
  const colors = {
    skin: '#f5c6a0',
    hair: '#4a3728',
    shirt: '#d4a853',
    pants: '#111b3d',
    shoes: '#333',
    eye: '#222',
  }

  const p = (x, y, w, h, color) => {
    ctx.fillStyle = color
    ctx.fillRect(x, y, w, h)
  }

  const offset = 4 // center the 16x20 sprite in 24x24
  const y = bobY

  // Hair top
  p(offset + 4, y + offset + 0, 8, 2, colors.hair)

  // Head
  p(offset + 3, y + offset + 2, 10, 6, colors.skin)

  // Hair sides
  p(offset + 2, y + offset + 2, 1, 4, colors.hair)
  p(offset + 13, y + offset + 2, 1, 4, colors.hair)

  // Eyes
  if (direction === 'down' || direction === 'left' || direction === 'right') {
    const eyeX = direction === 'left' ? 4 : direction === 'right' ? 7 : 5
    p(offset + eyeX, y + offset + 4, 2, 2, colors.eye)
    if (direction !== 'left' && direction !== 'right') {
      p(offset + eyeX + 3, y + offset + 4, 2, 2, colors.eye)
    }
  }

  // Body/shirt
  p(offset + 4, y + offset + 8, 8, 4, colors.shirt)

  // Arms
  const armBob = isWalking ? (frame % 2 === 0 ? -1 : 1) : 0
  p(offset + 2, y + offset + 8 + armBob, 2, 3, colors.shirt)
  p(offset + 12, y + offset + 8 - armBob, 2, 3, colors.shirt)

  // Pants
  p(offset + 5, y + offset + 12, 3, 3, colors.pants)
  p(offset + 9, y + offset + 12, 3, 3, colors.pants)

  // Legs (walking animation)
  if (isWalking) {
    const legBob = frame % 2 === 0 ? 1 : -1
    p(offset + 5, y + offset + 15 + legBob, 3, 2, colors.pants)
    p(offset + 9, y + offset + 15 - legBob, 3, 2, colors.pants)
  } else {
    p(offset + 5, y + offset + 15, 3, 2, colors.pants)
    p(offset + 9, y + offset + 15, 3, 2, colors.pants)
  }

  // Shoes
  p(offset + 5, y + offset + 17, 3, 1, colors.shoes)
  p(offset + 9, y + offset + 17, 3, 1, colors.shoes)

  // Cape (when facing down — shows on back)
  if (direction === 'down') {
    ctx.fillStyle = 'rgba(212,168,83,0.3)'
    ctx.fillRect(offset + 5, y + offset + 8, 6, 8)
  }
}
