# Spec: tide-visual

## Objective

Make the breathing rhythm visually obvious and calming through a full-screen “living tide” using the morning-mist palette.

## Contract

The renderer consumes phase, normalized phase progress, and a hold/transition state from `session-engine`. On inhale, light rises from the bottom; on the upper hold, its level remains high with subtle texture motion; on exhale, it recedes; on the lower hold, the lower state remains calm. Text and countdown remain independent overlays.

The first implementation is a focused CSS composition prototype. A matching Canvas 2D prototype is evaluated if the CSS version looks like a flat curtain rather than a wave. The decision is based on organic motion, visual clarity, mobile performance, and code complexity. Paper.js is considered only if direct Canvas path work is clearly insufficient; it is not a default dependency.

## Acceptance Criteria

- Inhale and exhale direction are understandable without explanation.
- Holds look stable but not frozen.
- The transition never changes the actual phase duration.
- Text remains readable across the full palette and at mobile/desktop sizes.
- Reduced-motion preferences are respected without removing phase information.

## Testing

Build a throwaway one-cycle CSS prototype and, if needed, a Canvas prototype. Compare phase-to-visual mapping at progress `0`, midpoint, and `1`; inspect each hold; measure smoothness on representative mobile and desktop viewports; then record the renderer decision before production implementation.

## Boundaries

- The renderer never owns the timer.
- No literal anatomical lungs, 3D scene, music, or decorative motion that competes with the countdown.
- Do not add Paper.js or another animation library without a documented prototype result.

## Implementation Notes

- CSS is the accepted MVP renderer; revisit Canvas 2D only if target-device testing shows a clear quality or performance gap.
- Target mobile browsers still need best-effort Screen Wake Lock validation.
