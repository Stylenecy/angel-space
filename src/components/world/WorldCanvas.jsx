import { useEffect, useRef, useState, useCallback } from 'react'
import {
  WORLD_WIDTH,
  WORLD_HEIGHT,
  TILE_SIZE,
  WORLD_MAP,
  TILES,
  ROOMS,
  SPAWN_POSITION,
  isWalkable,
  getTileAt,
  getRoomAtTile,
} from './tileMap'
import PlayerAvatar from './PlayerAvatar'

/**
 * WorldCanvas — Growtopia-style 2D tile world.
 * Renders tile grid, player character, handles WASD/tap movement.
 */
export default function WorldCanvas({ onEnterRoom, onBack }) {
  const canvasRef = useRef(null)
  const [playerTileX, setPlayerTileX] = useState(SPAWN_POSITION.x)
  const [playerTileY, setPlayerTileY] = useState(SPAWN_POSITION.y)
  const [direction, setDirection] = useState('down')
  const [isWalking, setIsWalking] = useState(false)
  const [isMoving, setIsMoving] = useState(false)
  const movingRef = useRef(false)
  const animFrameRef = useRef(null)

  // Camera: center on player
  const cameraX = Math.max(0, Math.min(
    playerTileX * TILE_SIZE - window.innerWidth / 2 + TILE_SIZE / 2,
    WORLD_WIDTH * TILE_SIZE - window.innerWidth
  ))
  const cameraY = Math.max(0, Math.min(
    playerTileY * TILE_SIZE - window.innerHeight / 2 + TILE_SIZE / 2,
    WORLD_HEIGHT * TILE_SIZE - window.innerHeight
  ))

  // Render tile grid
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = false

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw tiles
    for (let y = 0; y < WORLD_HEIGHT; y++) {
      for (let x = 0; x < WORLD_WIDTH; x++) {
        const tile = WORLD_MAP[y][x]
        const px = x * TILE_SIZE
        const py = y * TILE_SIZE

        switch (tile) {
          case TILES.GRASS:
            ctx.fillStyle = (x + y) % 2 === 0 ? '#1a2744' : '#182440'
            break
          case TILES.PATH:
            ctx.fillStyle = '#2a3560'
            break
          case TILES.WALL:
            ctx.fillStyle = '#0d1228'
            break
          case TILES.WATER:
            ctx.fillStyle = '#1a3a6a'
            break
          case TILES.PORTAL:
            ctx.fillStyle = '#d4a853'
            break
          case TILES.DECO:
            ctx.fillStyle = '#1a2744'
            break
          default:
            ctx.fillStyle = '#1a2744'
        }

        ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE)

        // Wall detail
        if (tile === TILES.WALL) {
          ctx.fillStyle = 'rgba(255,255,255,0.03)'
          ctx.fillRect(px, py, TILE_SIZE, 2)
          ctx.fillStyle = 'rgba(0,0,0,0.2)'
          ctx.fillRect(px, py + TILE_SIZE - 2, TILE_SIZE, 2)
        }

        // Path detail
        if (tile === TILES.PATH) {
          ctx.fillStyle = 'rgba(255,255,255,0.02)'
          ctx.fillRect(px + 1, py + 1, TILE_SIZE - 2, 1)
        }

        // Water shimmer
        if (tile === TILES.WATER) {
          ctx.fillStyle = `rgba(100,180,255,${0.05 + Math.sin(Date.now() / 1000 + x + y) * 0.03})`
          ctx.fillRect(px + 4, py + 4, 8, 4)
        }
      }
    }

    // Draw room portals
    ROOMS.forEach(room => {
      if (room.portalTile) {
        const px = room.portalTile.x * TILE_SIZE
        const py = room.portalTile.y * TILE_SIZE

        // Portal glow
        ctx.fillStyle = 'rgba(212,168,83,0.15)'
        ctx.fillRect(px - 2, py - 2, TILE_SIZE + 4, TILE_SIZE + 4)

        // Portal border
        ctx.strokeStyle = '#d4a853'
        ctx.lineWidth = 2
        ctx.strokeRect(px + 2, py + 2, TILE_SIZE - 4, TILE_SIZE - 4)
      }
    })

    // Draw room labels on tiles
    ROOMS.forEach(room => {
      if (!room.hidden) {
        const px = room.tileX * TILE_SIZE + TILE_SIZE / 2
        const py = room.tileY * TILE_SIZE + TILE_SIZE / 2

        ctx.font = '12px sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(room.emoji, px, py)
      }
    })
  }, [playerTileX, playerTileY])

  // Movement handler
  const movePlayer = useCallback((dx, dy) => {
    if (movingRef.current) return

    const newX = playerTileX + dx
    const newY = playerTileY + dy
    const tile = getTileAt(newX, newY)

    if (!isWalkable(tile)) return

    // Set direction
    if (dx > 0) setDirection('right')
    else if (dx < 0) setDirection('left')
    else if (dy > 0) setDirection('down')
    else if (dy < 0) setDirection('up')

    movingRef.current = true
    setIsMoving(true)
    setIsWalking(true)

    // Animate movement (smooth tile transition)
    const targetX = newX
    const targetY = newY

    // Check if stepping on a portal
    const room = getRoomAtTile(newX, newY)

    setTimeout(() => {
      setPlayerTileX(targetX)
      setPlayerTileY(targetY)
      setIsWalking(false)

      if (room) {
        setTimeout(() => {
          onEnterRoom?.(room)
          setIsMoving(false)
          movingRef.current = false
        }, 200)
      } else {
        setIsMoving(false)
        movingRef.current = false
      }
    }, 180)
  }, [playerTileX, playerTileY, onEnterRoom])

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isMoving) return
      switch (e.key) {
        case 'w': case 'ArrowUp': movePlayer(0, -1); e.preventDefault(); break
        case 's': case 'ArrowDown': movePlayer(0, 1); e.preventDefault(); break
        case 'a': case 'ArrowLeft': movePlayer(-1, 0); e.preventDefault(); break
        case 'd': case 'ArrowRight': movePlayer(1, 0); e.preventDefault(); break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [movePlayer, isMoving])

  // Handle tile tap for mobile
  const handleCanvasClick = useCallback((e) => {
    if (isMoving) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const clickX = e.clientX - rect.left + cameraX
    const clickY = e.clientY - rect.top + cameraY

    const tileX = Math.floor(clickX / TILE_SIZE)
    const tileY = Math.floor(clickY / TILE_SIZE)

    const dx = tileX - playerTileX
    const dy = tileY - playerTileY

    // Only move one tile at a time
    if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1 && (dx !== 0 || dy !== 0)) {
      movePlayer(Math.sign(dx), Math.sign(dy))
    }
  }, [isMoving, playerTileX, playerTileY, cameraX, cameraY, movePlayer])

  return (
    <div className="relative w-full h-screen overflow-hidden bg-midnight select-none">
      {/* World canvas */}
      <canvas
        ref={canvasRef}
        width={WORLD_WIDTH * TILE_SIZE}
        height={WORLD_HEIGHT * TILE_SIZE}
        onClick={handleCanvasClick}
        className="absolute"
        style={{
          imageRendering: 'pixelated',
          transform: `translate(${-cameraX}px, ${-cameraY}px)`,
          width: WORLD_WIDTH * TILE_SIZE,
          height: WORLD_HEIGHT * TILE_SIZE,
        }}
      />

      {/* Player avatar */}
      <div
        className="absolute transition-all duration-150 ease-out"
        style={{
          left: playerTileX * TILE_SIZE + 4,
          top: playerTileY * TILE_SIZE + 2,
          transform: `translate(${-cameraX}px, ${-cameraY}px)`,
          zIndex: 10,
        }}
      >
        <PlayerAvatar direction={direction} isWalking={isWalking} />
      </div>

      {/* HUD */}
      <div className="fixed top-4 left-4 z-20">
        <div className="pixel-card px-3 py-2 border border-warm-gold/30">
          <p className="font-pixel text-[0.4rem] text-warm-gold/60">
            WASD / tap to move
          </p>
        </div>
      </div>

      {/* Back button */}
      <button
        onClick={onBack}
        className="fixed top-4 right-4 z-20 pixel-btn !text-[0.45rem] !py-1.5 !px-3"
      >
        ✕ keluar
      </button>

      {/* Current room label */}
      {(() => {
        const room = ROOMS.find(r =>
          playerTileX >= r.tileX && playerTileX < r.tileX + r.width &&
          playerTileY >= r.tileY && playerTileY < r.tileY + r.height
        )
        return room ? (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20">
            <div className="pixel-card px-4 py-2 border-2 border-warm-gold/40">
              <p className="font-pixel text-[0.5rem] text-warm-gold">
                {room.emoji} {room.label}
              </p>
            </div>
          </div>
        ) : null
      })()}
    </div>
  )
}
