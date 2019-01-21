/*
 * Explanation of passability bits:
 * w - blocks walking
 * f - blocks flying
 * s - blocks swimming
 * v - blocks vision
 */
const tile_movement_categories = Object.freeze({
  v: 1,
  w: 2,
  s: 4,
  f: 8
});
