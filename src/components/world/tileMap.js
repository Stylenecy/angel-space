/**
 * tileMap.js — Growtopia-style 2D world layout.
 * Each tile is 32x32px. World is rendered as a grid.
 *
 * Tile types:
 *   0 = grass (walkable)
 *   1 = path (walkable)
 *   2 = wall (solid)
 *   3 = water (solid)
 *   4 = portal (walkable, triggers room entry)
 *   5 = decoration (walkable, visual only)
 */

// World dimensions in tiles
export const WORLD_WIDTH = 20
export const WORLD_HEIGHT = 14
export const TILE_SIZE = 32

// Tile type constants
export const TILES = {
  GRASS: 0,
  PATH: 1,
  WALL: 2,
  WATER: 3,
  PORTAL: 4,
  DECO: 5,
}

// Room/portal definitions
export const ROOMS = [
  {
    id: 'hub',
    label: 'Ruang Tengah',
    emoji: '🏠',
    tileX: 9,
    tileY: 6,
    width: 3,
    height: 3,
  },
  {
    id: 'mood',
    label: 'Bilik Suasana',
    emoji: '🎭',
    tileX: 2,
    tileY: 2,
    width: 2,
    height: 2,
    portalTile: { x: 4, y: 3 },
  },
  {
    id: 'gallery',
    label: 'Bilik Nostalgia',
    emoji: '🖼️',
    tileX: 16,
    tileY: 2,
    width: 2,
    height: 2,
    portalTile: { x: 15, y: 3 },
  },
  {
    id: 'feed',
    label: 'Feed Kita',
    emoji: '📝',
    tileX: 2,
    tileY: 10,
    width: 2,
    height: 2,
    portalTile: { x: 4, y: 10 },
  },
  {
    id: 'faith',
    label: 'Sudut Teduh',
    emoji: '✝️',
    tileX: 16,
    tileY: 10,
    width: 2,
    height: 2,
    portalTile: { x: 15, y: 10 },
  },
  {
    id: 'surprise',
    label: '???',
    emoji: '🎁',
    tileX: 9,
    tileY: 0,
    width: 2,
    height: 2,
    portalTile: { x: 10, y: 2 },
    hidden: true,
  },
]

// World map: 20 columns x 14 rows
// 0=grass, 1=path, 2=wall, 3=water, 4=portal, 5=deco
export const WORLD_MAP = [
  // Row 0
  [2,2,2,2,2,2,2,2,4,4,4,4,2,2,2,2,2,2,2,2],
  // Row 1
  [2,5,5,2,1,1,1,1,1,1,1,1,1,1,2,5,5,2,5,2],
  // Row 2
  [2,5,4,1,1,1,1,1,1,1,1,1,1,1,1,1,4,5,5,2],
  // Row 3
  [2,2,1,1,1,0,0,0,0,1,1,0,0,0,1,1,1,2,2,2],
  // Row 4
  [2,5,1,1,0,0,0,0,0,1,1,0,0,0,0,1,1,5,5,2],
  // Row 5
  [2,5,1,1,0,0,0,0,0,1,1,0,0,0,0,1,1,5,5,2],
  // Row 6
  [2,2,1,1,0,0,0,0,1,1,1,1,0,0,0,1,1,2,2,2],
  // Row 7
  [2,5,1,1,0,0,0,0,1,1,1,1,0,0,0,1,1,5,5,2],
  // Row 8
  [2,5,1,1,0,0,0,0,0,1,1,0,0,0,0,1,1,5,5,2],
  // Row 9
  [2,2,1,1,0,0,0,0,0,1,1,0,0,0,0,1,1,2,2,2],
  // Row 10
  [2,5,1,1,1,0,0,0,0,1,1,0,0,0,1,1,1,2,5,2],
  // Row 11
  [2,5,4,1,1,1,1,1,1,1,1,1,1,1,1,1,4,5,5,2],
  // Row 12
  [2,5,5,2,1,1,1,1,1,1,1,1,1,1,2,5,5,2,5,2],
  // Row 13
  [2,2,2,2,2,2,2,2,1,1,1,1,2,2,2,2,2,2,2,2],
]

// Player spawn position (tile coordinates)
export const SPAWN_POSITION = { x: 9, y: 6 }

/**
 * Check if a tile is walkable.
 */
export function isWalkable(tileType) {
  return tileType === TILES.GRASS || tileType === TILES.PATH || tileType === TILES.PORTAL
}

/**
 * Get tile type at a given tile coordinate.
 */
export function getTileAt(tileX, tileY) {
  if (tileX < 0 || tileX >= WORLD_WIDTH || tileY < 0 || tileY >= WORLD_HEIGHT) {
    return TILES.WALL
  }
  return WORLD_MAP[tileY][tileX]
}

/**
 * Check if a tile coordinate is a portal to a room.
 * Returns the room object if it is, null otherwise.
 */
export function getRoomAtTile(tileX, tileY) {
  for (const room of ROOMS) {
    if (room.portalTile && room.portalTile.x === tileX && room.portalTile.y === tileY) {
      return room
    }
    // Also check if standing on the room's area
    if (
      tileX >= room.tileX &&
      tileX < room.tileX + room.width &&
      tileY >= room.tileY &&
      tileY < room.tileY + room.height
    ) {
      return room
    }
  }
  return null
}
