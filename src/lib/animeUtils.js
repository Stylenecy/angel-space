/**
 * animeUtils.js — Shared animation presets for Angel's Space.
 * All animations use anime.js v4 API.
 * 
 * Usage:
 *   import { staggerReveal, pageTransition } from '../lib/animeUtils'
 *   staggerReveal('.my-grid-items')
 */

import { animate, stagger, createTimeline, random } from 'animejs'

/**
 * Stagger reveal for grid/list elements.
 * @param {string} selector — CSS selector for elements to reveal
 * @param {object} options — optional overrides
 */
export function staggerReveal(selector, options = {}) {
  const {
    translateY = [20, 0],
    opacity = [0, 1],
    delay = 60,
    duration = 500,
    easing = 'easeOutExpo',
  } = options

  animate(selector, {
    translateY,
    opacity,
    delay: stagger(delay),
    duration,
    easing,
  })
}

/**
 * Page/room transition animation.
 * Fades out old content, fades in new content.
 * @param {Element} outEl — element to fade out
 * @param {Element} inEl — element to fade in
 * @param {Function} onComplete — callback after transition
 */
export function pageTransition(outEl, inEl, onComplete) {
  const tl = createTimeline({
    easing: 'easeInOutSine',
    complete: () => onComplete?.(),
  })

  tl
    .add({
      targets: outEl,
      opacity: 0,
      translateY: -15,
      duration: 300,
    })
    .add({
      targets: inEl,
      opacity: [0, 1],
      translateY: [15, 0],
      duration: 400,
    }, '-=150')
}

/**
 * Surprise reveal animation — pop-in effect.
 * @param {string} selector — CSS selector
 */
export function surpriseReveal(selector) {
  animate(selector, {
    scale: [0.3, 1],
    opacity: [0, 1],
    duration: 600,
    easing: 'easeOutElastic(1, .5)',
  })
}

/**
 * Message pop-in for chat/feed bubbles.
 * @param {string} selector — CSS selector for message elements
 */
export function messagePopIn(selector) {
  animate(selector, {
    translateY: [15, 0],
    opacity: [0, 1],
    scale: [0.95, 1],
    duration: 400,
    easing: 'easeOutExpo',
  })
}

/**
 * Heart burst animation — like/favorite effect.
 * @param {Element} el — target element
 */
export function heartBurst(el) {
  if (!el) return

  // Create particles
  const particles = []
  for (let i = 0; i < 8; i++) {
    const particle = document.createElement('div')
    particle.textContent = ['💛', '✨', '🤍', '⭐'][Math.floor(Math.random() * 4)]
    particle.style.cssText = `
      position: absolute;
      font-size: 12px;
      pointer-events: none;
      left: 50%;
      top: 50%;
      opacity: 0;
    `
    el.parentElement?.appendChild(particle)
    particles.push(particle)
  }

  createTimeline({
    easing: 'easeOutQuad',
    complete: () => particles.forEach(p => p.remove()),
  })
    .add({
      targets: el,
      scale: [1, 1.4, 1],
      duration: 300,
    })
    .add({
      targets: particles,
      translateX: () => random(-50, 50),
      translateY: () => random(-50, 50),
      opacity: [1, 0],
      scale: [0, 1.2],
      delay: stagger(30),
      duration: 500,
    }, '-=200')
}

/**
 * Card flip animation.
 * @param {Element} el — element to flip
 */
export function cardFlip(el) {
  if (!el) return
  animate(el, {
    rotateY: [0, 360],
    duration: 600,
    easing: 'easeInOutSine',
  })
}

/**
 * Typewriter dialog entrance — RPG dialog appear.
 * @param {string} selector — container selector
 */
export function dialogAppear(selector) {
  const tl = createTimeline({ easing: 'easeOutExpo' })

  tl
    .add({
      targets: selector,
      opacity: [0, 1],
      translateY: [10, 0],
      duration: 400,
    })
    .add({
      targets: `${selector} .dialog-text`,
      opacity: [0, 1],
      duration: 300,
    }, '-=200')
}

/**
 * Pulse glow effect — for important elements.
 * @param {string} selector — CSS selector
 * @param {string} color — glow color (default warm gold)
 */
export function pulseGlow(selector, color = 'rgba(212,168,83,0.4)') {
  animate(selector, {
    boxShadow: [
      `0 0 0 0 ${color}`,
      `0 0 20px 5px ${color}`,
      `0 0 0 0 ${color}`,
    ],
    duration: 2000,
    loop: true,
    easing: 'easeInOutSine',
  })
}

/**
 * Shake animation — for errors or attention.
 * @param {string} selector — CSS selector
 */
export function shake(selector) {
  animate(selector, {
    translateX: [0, -8, 8, -6, 6, -3, 3, 0],
    duration: 500,
    easing: 'easeInOutSine',
  })
}
