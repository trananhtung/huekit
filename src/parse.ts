import { type RGBA, type Color, clampByte, clamp01 } from "./types.js";
import { hslToRgb } from "./convert.js";

function parseChannel(token: string, max: number): number {
  return token.endsWith("%")
    ? clampByte((parseFloat(token) / 100) * max)
    : clampByte(parseFloat(token));
}

function parseAlpha(token: string | undefined): number {
  if (token === undefined) return 1;
  return clamp01(token.endsWith("%") ? parseFloat(token) / 100 : parseFloat(token));
}

function parseHex(hex: string): RGBA | null {
  const h = hex.replace(/^#/, "");
  if (!/^[0-9a-f]+$/i.test(h)) return null;
  let r: number;
  let g: number;
  let b: number;
  let a = 1;
  if (h.length === 3 || h.length === 4) {
    r = parseInt(h[0]! + h[0]!, 16);
    g = parseInt(h[1]! + h[1]!, 16);
    b = parseInt(h[2]! + h[2]!, 16);
    if (h.length === 4) a = parseInt(h[3]! + h[3]!, 16) / 255;
  } else if (h.length === 6 || h.length === 8) {
    r = parseInt(h.slice(0, 2), 16);
    g = parseInt(h.slice(2, 4), 16);
    b = parseInt(h.slice(4, 6), 16);
    if (h.length === 8) a = parseInt(h.slice(6, 8), 16) / 255;
  } else {
    return null;
  }
  return { r, g, b, a };
}

/**
 * Parse a CSS color string into {@link RGBA}. Understands `#hex` (3/4/6/8
 * digits), `rgb()`/`rgba()`, and `hsl()`/`hsla()` in both comma and modern
 * space/slash syntax. Throws on anything it can't read.
 *
 * ```ts
 * parse("#3498db");                 // { r: 52, g: 152, b: 219, a: 1 }
 * parse("rgba(255, 0, 0, 0.5)");    // { r: 255, g: 0, b: 0, a: 0.5 }
 * parse("hsl(210 50% 53%)");        // { ... }
 * ```
 */
export function parse(input: string): RGBA {
  const s = input.trim().toLowerCase();

  if (s.startsWith("#") || /^[0-9a-f]{3,8}$/.test(s)) {
    const hex = parseHex(s);
    if (hex) return hex;
    throw new SyntaxError(`parse: invalid hex color "${input}"`);
  }

  const tokens = s.match(/-?\d*\.?\d+%?/g);
  if (s.startsWith("rgb") && tokens && tokens.length >= 3) {
    return {
      r: parseChannel(tokens[0]!, 255),
      g: parseChannel(tokens[1]!, 255),
      b: parseChannel(tokens[2]!, 255),
      a: parseAlpha(tokens[3]),
    };
  }
  if (s.startsWith("hsl") && tokens && tokens.length >= 3) {
    return hslToRgb({
      h: parseFloat(tokens[0]!),
      s: parseFloat(tokens[1]!),
      l: parseFloat(tokens[2]!),
      a: parseAlpha(tokens[3]),
    });
  }

  throw new SyntaxError(`parse: unrecognized color "${input}"`);
}

/** Normalize any {@link Color} (string or object) into a fresh {@link RGBA}. */
export function toRgba(input: Color): RGBA {
  if (typeof input === "string") return parse(input);
  return {
    r: clampByte(input.r),
    g: clampByte(input.g),
    b: clampByte(input.b),
    a: clamp01(input.a),
  };
}
