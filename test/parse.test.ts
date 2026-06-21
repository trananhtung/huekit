import { describe, it, expect } from "vitest";
import { parse, toRgba } from "../src/index.js";

describe("parse — hex", () => {
  it("parses 6-digit hex", () => {
    expect(parse("#3498db")).toEqual({ r: 52, g: 152, b: 219, a: 1 });
    expect(parse("3498DB")).toEqual({ r: 52, g: 152, b: 219, a: 1 });
  });

  it("parses 3-digit shorthand", () => {
    expect(parse("#f00")).toEqual({ r: 255, g: 0, b: 0, a: 1 });
    expect(parse("#abc")).toEqual({ r: 170, g: 187, b: 204, a: 1 });
  });

  it("parses 8- and 4-digit hex with alpha", () => {
    expect(parse("#ff000080")).toEqual({ r: 255, g: 0, b: 0, a: 128 / 255 });
    expect(parse("#f00f")).toEqual({ r: 255, g: 0, b: 0, a: 1 });
  });

  it("throws on invalid hex", () => {
    expect(() => parse("#12345")).toThrow(SyntaxError);
    expect(() => parse("#gggggg")).toThrow(SyntaxError);
  });
});

describe("parse — rgb / hsl", () => {
  it("parses rgb and rgba (comma syntax)", () => {
    expect(parse("rgb(255, 0, 0)")).toEqual({ r: 255, g: 0, b: 0, a: 1 });
    expect(parse("rgba(0, 128, 255, 0.5)")).toEqual({ r: 0, g: 128, b: 255, a: 0.5 });
  });

  it("parses modern space/slash rgb syntax", () => {
    expect(parse("rgb(255 0 0 / 50%)")).toEqual({ r: 255, g: 0, b: 0, a: 0.5 });
  });

  it("parses percentage channels", () => {
    expect(parse("rgb(100%, 0%, 0%)")).toEqual({ r: 255, g: 0, b: 0, a: 1 });
  });

  it("parses hsl back to rgb", () => {
    expect(parse("hsl(0, 100%, 50%)")).toEqual({ r: 255, g: 0, b: 0, a: 1 });
    expect(parse("hsl(120 100% 50%)")).toEqual({ r: 0, g: 255, b: 0, a: 1 });
  });

  it("throws on unrecognized input", () => {
    expect(() => parse("not-a-color")).toThrow(SyntaxError);
  });
});

describe("toRgba", () => {
  it("passes through and clamps objects", () => {
    expect(toRgba({ r: 300, g: -5, b: 128, a: 2 })).toEqual({ r: 255, g: 0, b: 128, a: 1 });
  });

  it("parses strings", () => {
    expect(toRgba("#fff")).toEqual({ r: 255, g: 255, b: 255, a: 1 });
  });
});
