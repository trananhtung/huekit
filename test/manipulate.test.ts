import { describe, it, expect } from "vitest";
import {
  withAlpha,
  lighten,
  darken,
  grayscale,
  mix,
  luminance,
  contrast,
  isReadable,
  toHex,
} from "../src/index.js";

describe("withAlpha", () => {
  it("sets and clamps alpha", () => {
    expect(withAlpha("#f00", 0.5).a).toBe(0.5);
    expect(withAlpha("#f00", 2).a).toBe(1);
    expect(withAlpha("#f00", -1).a).toBe(0);
  });
});

describe("lighten / darken", () => {
  it("lighten increases lightness, darken decreases it", () => {
    const base = "#808080";
    expect(luminance(lighten(base, 0.2))).toBeGreaterThan(luminance(base));
    expect(luminance(darken(base, 0.2))).toBeLessThan(luminance(base));
  });

  it("clamps at white and black", () => {
    expect(toHex(lighten("#fff", 0.5))).toBe("#ffffff");
    expect(toHex(darken("#000", 0.5))).toBe("#000000");
  });
});

describe("grayscale", () => {
  it("removes saturation", () => {
    const g = grayscale("#ff0000");
    expect(g.r).toBe(g.g);
    expect(g.g).toBe(g.b);
  });
});

describe("mix", () => {
  it("blends two colors", () => {
    expect(toHex(mix("#000000", "#ffffff", 0.5))).toBe("#808080");
    expect(toHex(mix("#ff0000", "#0000ff", 0.5))).toBe("#800080");
  });

  it("weight controls the blend", () => {
    expect(toHex(mix("#000", "#fff", 0))).toBe("#000000");
    expect(toHex(mix("#000", "#fff", 1))).toBe("#ffffff");
    expect(toHex(mix("#000", "#fff", 0.25))).toBe("#404040");
  });
});

describe("luminance / contrast / isReadable", () => {
  it("luminance of black and white", () => {
    expect(luminance("#000")).toBeCloseTo(0, 6);
    expect(luminance("#fff")).toBeCloseTo(1, 6);
  });

  it("contrast ratio is 21 for black-on-white", () => {
    expect(contrast("#000", "#fff")).toBeCloseTo(21, 1);
    expect(contrast("#fff", "#fff")).toBeCloseTo(1, 6);
    // symmetric
    expect(contrast("#000", "#fff")).toBe(contrast("#fff", "#000"));
  });

  it("isReadable uses the AA threshold by default", () => {
    expect(isReadable("#000", "#fff")).toBe(true);
    expect(isReadable("#777", "#888")).toBe(false);
    expect(isReadable("#000", "#fff", 7)).toBe(true); // AAA
  });
});
