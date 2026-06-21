import { describe, it, expect } from "vitest";
import { rgbToHsl, hslToRgb, toHex, toRgbString, toHslString } from "../src/index.js";

describe("rgbToHsl / hslToRgb", () => {
  it("converts known colors", () => {
    expect(rgbToHsl({ r: 255, g: 0, b: 0, a: 1 })).toEqual({ h: 0, s: 100, l: 50, a: 1 });
    expect(rgbToHsl({ r: 0, g: 0, b: 0, a: 1 })).toEqual({ h: 0, s: 0, l: 0, a: 1 });
    expect(rgbToHsl({ r: 255, g: 255, b: 255, a: 1 })).toEqual({ h: 0, s: 0, l: 100, a: 1 });
  });

  it("round-trips through HSL within rounding tolerance", () => {
    for (const c of [
      { r: 52, g: 152, b: 219, a: 1 },
      { r: 231, g: 76, b: 60, a: 0.5 },
      { r: 46, g: 204, b: 113, a: 1 },
    ]) {
      const back = hslToRgb(rgbToHsl(c));
      expect(Math.abs(back.r - c.r)).toBeLessThanOrEqual(2);
      expect(Math.abs(back.g - c.g)).toBeLessThanOrEqual(2);
      expect(Math.abs(back.b - c.b)).toBeLessThanOrEqual(2);
      expect(back.a).toBe(c.a);
    }
  });
});

describe("formatting", () => {
  it("toHex", () => {
    expect(toHex("rgb(52, 152, 219)")).toBe("#3498db");
    expect(toHex({ r: 255, g: 0, b: 0, a: 0.5 })).toBe("#ff000080");
    expect(toHex("#f00", { alpha: true })).toBe("#ff0000ff");
  });

  it("toRgbString", () => {
    expect(toRgbString("#3498db")).toBe("rgb(52, 152, 219)");
    expect(toRgbString({ r: 255, g: 0, b: 0, a: 0.5 })).toBe("rgba(255, 0, 0, 0.5)");
  });

  it("toHslString", () => {
    expect(toHslString("#ff0000")).toBe("hsl(0, 100%, 50%)");
    expect(toHslString({ r: 255, g: 0, b: 0, a: 0.5 })).toBe("hsla(0, 100%, 50%, 0.5)");
  });
});
