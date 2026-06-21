import { type Color } from "./types.js";
import { toRgba } from "./parse.js";
import { rgbToHsl } from "./convert.js";

function hex2(n: number): string {
  return n.toString(16).padStart(2, "0");
}

function round(n: number, places = 3): number {
  const f = 10 ** places;
  return Math.round(n * f) / f;
}

export interface HexOptions {
  /** Force an 8-digit `#rrggbbaa` even when fully opaque. Default `false`. */
  alpha?: boolean;
}

/**
 * Format a color as a `#hex` string. Emits 8 digits when the color has alpha
 * (or when `alpha: true`), otherwise 6.
 *
 * ```ts
 * toHex("rgb(52, 152, 219)");      // "#3498db"
 * toHex({ r: 255, g: 0, b: 0, a: 0.5 }); // "#ff000080"
 * ```
 */
export function toHex(color: Color, options: HexOptions = {}): string {
  const { r, g, b, a } = toRgba(color);
  const base = `#${hex2(r)}${hex2(g)}${hex2(b)}`;
  if (a < 1 || options.alpha) return base + hex2(Math.round(a * 255));
  return base;
}

/** Format as `rgb(...)` or `rgba(...)` (alpha included only when `< 1`). */
export function toRgbString(color: Color): string {
  const { r, g, b, a } = toRgba(color);
  return a < 1 ? `rgba(${r}, ${g}, ${b}, ${round(a)})` : `rgb(${r}, ${g}, ${b})`;
}

/** Format as `hsl(...)` or `hsla(...)`. */
export function toHslString(color: Color): string {
  const { h, s, l, a } = rgbToHsl(toRgba(color));
  return a < 1 ? `hsla(${h}, ${s}%, ${l}%, ${round(a)})` : `hsl(${h}, ${s}%, ${l}%)`;
}
