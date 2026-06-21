import { type RGBA, type Color, clamp, clamp01, clampByte } from "./types.js";
import { toRgba } from "./parse.js";
import { rgbToHsl, hslToRgb } from "./convert.js";

/** Replace a color's alpha (0–1). */
export function withAlpha(color: Color, alpha: number): RGBA {
  return { ...toRgba(color), a: clamp01(alpha) };
}

/** Lighten by `amount` (0–1 → percentage points of HSL lightness). */
export function lighten(color: Color, amount: number): RGBA {
  const hsl = rgbToHsl(toRgba(color));
  return hslToRgb({ ...hsl, l: clamp(hsl.l + amount * 100, 0, 100) });
}

/** Darken by `amount` (0–1 → percentage points of HSL lightness). */
export function darken(color: Color, amount: number): RGBA {
  return lighten(color, -amount);
}

/** Saturate by `amount` (0–1). Negative desaturates. */
export function saturate(color: Color, amount: number): RGBA {
  const hsl = rgbToHsl(toRgba(color));
  return hslToRgb({ ...hsl, s: clamp(hsl.s + amount * 100, 0, 100) });
}

/** Desaturate fully (greyscale, preserving alpha and perceived lightness). */
export function grayscale(color: Color): RGBA {
  const hsl = rgbToHsl(toRgba(color));
  return hslToRgb({ ...hsl, s: 0 });
}

/**
 * Mix two colors. `weight` (0–1) is how much of `b` to use; `0.5` is an even
 * blend. Channels and alpha are interpolated linearly.
 *
 * ```ts
 * mix("#ff0000", "#0000ff");      // purple
 * mix("#000", "#fff", 0.25);      // dark grey
 * ```
 */
export function mix(a: Color, b: Color, weight = 0.5): RGBA {
  const w = clamp01(weight);
  const x = toRgba(a);
  const y = toRgba(b);
  return {
    r: clampByte(x.r + (y.r - x.r) * w),
    g: clampByte(x.g + (y.g - x.g) * w),
    b: clampByte(x.b + (y.b - x.b) * w),
    a: clamp01(x.a + (y.a - x.a) * w),
  };
}

function channelLuminance(value: number): number {
  const v = value / 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}

/** WCAG relative luminance (0 = black, 1 = white). Alpha is ignored. */
export function luminance(color: Color): number {
  const { r, g, b } = toRgba(color);
  return 0.2126 * channelLuminance(r) + 0.7152 * channelLuminance(g) + 0.0722 * channelLuminance(b);
}

/**
 * WCAG contrast ratio between two colors (1–21). `≥ 4.5` passes AA for normal
 * text, `≥ 7` passes AAA.
 *
 * ```ts
 * contrast("#000", "#fff"); // 21
 * ```
 */
export function contrast(a: Color, b: Color): number {
  const l1 = luminance(a);
  const l2 = luminance(b);
  const hi = Math.max(l1, l2);
  const lo = Math.min(l1, l2);
  return (hi + 0.05) / (lo + 0.05);
}

/** Whether `text` on `background` meets a WCAG contrast threshold (default AA 4.5). */
export function isReadable(text: Color, background: Color, threshold = 4.5): boolean {
  return contrast(text, background) >= threshold;
}
