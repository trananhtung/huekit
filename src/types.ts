/** Red/green/blue (0–255) with alpha (0–1). */
export interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

/** Hue (0–360), saturation & lightness (0–100), alpha (0–1). */
export interface HSLA {
  h: number;
  s: number;
  l: number;
  a: number;
}

/** Anything accepted as a color: a CSS string or an {@link RGBA} object. */
export type Color = string | RGBA;

export function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value;
}

export function clampByte(value: number): number {
  return clamp(Math.round(value), 0, 255);
}

export function clamp01(value: number): number {
  return clamp(value, 0, 1);
}
