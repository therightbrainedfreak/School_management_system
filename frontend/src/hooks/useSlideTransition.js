// hooks/useSlideTransition.js
export const slideVariants = {
  enterFromRight: { x: '100%', opacity: 0 },
  enterFromLeft:  { x: '-100%', opacity: 0 },
  center:         { x: 0, opacity: 1 },
  exitToLeft:     { x: '-100%', opacity: 0 },
  exitToRight:    { x: '100%', opacity: 0 },
}

export const slideTransition = {
  duration: 0.35,
  ease: [0.4, 0, 0.2, 1],  // material ease
}