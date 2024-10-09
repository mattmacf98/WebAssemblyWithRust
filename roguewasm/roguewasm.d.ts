/* tslint:disable */
/* eslint-disable */
/**
*/
export class Engine {
  free(): void;
/**
* @param {any} display
*/
  constructor(display: any);
/**
* @param {PlayerCore} pc
* @param {number} x
* @param {number} y
*/
  open_box(pc: PlayerCore, x: number, y: number): void;
/**
* @param {number} x
* @param {number} y
* @param {number} val
*/
  on_dig(x: number, y: number, val: number): void;
/**
* @param {number} x
* @param {number} y
*/
  place_box(x: number, y: number): void;
/**
* @param {number} x
* @param {number} y
*/
  mark_box_as_prize(x: number, y: number): void;
/**
*/
  draw_map(): void;
/**
* @param {number} x
* @param {number} y
* @returns {boolean}
*/
  is_cell_free(x: number, y: number): boolean;
/**
* @param {number} x
* @param {number} y
*/
  redraw_at(x: number, y: number): void;
/**
* @param {PlayerCore} pc
* @param {number} x
* @param {number} y
*/
  move_player(pc: PlayerCore, x: number, y: number): void;
}
/**
*/
export class PlayerCore {
  free(): void;
/**
* @param {number} x
* @param {number} y
* @param {string} icon
* @param {string} color
* @param {any} display
*/
  constructor(x: number, y: number, icon: string, color: string, display: any);
/**
* @returns {number}
*/
  x(): number;
/**
* @returns {number}
*/
  y(): number;
/**
*/
  draw(): void;
/**
*/
  emit_stats(): void;
/**
* @param {number} x
* @param {number} y
*/
  move_to(x: number, y: number): void;
/**
* @param {number} hit_points
* @returns {number}
*/
  take_damage(hit_points: number): number;
}
