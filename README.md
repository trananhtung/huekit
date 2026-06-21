# huekit

> Tiny, type-safe **color** toolkit — parse `hex`/`rgb`/`hsl`, convert, format, `lighten`/`darken`/`mix`, and **WCAG contrast**. **Zero dependencies**.

[![CI](https://github.com/trananhtung/huekit/actions/workflows/ci.yml/badge.svg)](https://github.com/trananhtung/huekit/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/huekit.svg)](https://www.npmjs.com/package/huekit)
[![bundle size](https://img.shields.io/bundlephobia/minzip/huekit)](https://bundlephobia.com/package/huekit)
[![types](https://img.shields.io/npm/types/huekit.svg)](https://www.npmjs.com/package/huekit)
[![license](https://img.shields.io/npm/l/huekit.svg)](./LICENSE)

Theming, charts, and design tokens all need the same color chores: parse a hex,
nudge the lightness, blend two shades, check the contrast. `huekit` does them in
one small, typed package — parse `hex`/`rgb`/`hsl`, convert and format, and
manipulate, with **WCAG** luminance and contrast built in. **Zero dependencies**.

```ts
import { lighten, mix, contrast, toHex } from "huekit";

toHex(lighten("#3498db", 0.15));  // "#74b9e7"
toHex(mix("#ff0000", "#0000ff")); // "#800080"
contrast("#000", "#fff");         // 21
```

## Why huekit?

- **Parses what you paste.** `#rgb` / `#rgba` / `#rrggbb` / `#rrggbbaa`, plus
  `rgb()`/`rgba()` and `hsl()`/`hsla()` in comma **and** modern space/slash syntax.
- **Round-trips.** `hex ↔ rgb ↔ hsl`, with alpha preserved throughout.
- **Manipulation that reads well.** `lighten`, `darken`, `saturate`, `grayscale`,
  `mix`, `withAlpha`.
- **Accessibility built in.** WCAG `luminance`, `contrast` (1–21), and `isReadable`
  for AA/AAA checks.
- **Ergonomic.** Every function takes a CSS string **or** an `{ r, g, b, a }`
  object.
- **Typed & tiny.** Full types, ESM + CJS, zero dependencies.

## Install

```bash
npm install huekit
# or: pnpm add huekit  /  yarn add huekit  /  bun add huekit
```

## Parse & format

```ts
import { parse, toHex, toRgbString, toHslString } from "huekit";

parse("#3498db");              // { r: 52, g: 152, b: 219, a: 1 }
parse("rgba(0, 128, 255, .5)"); // { r: 0, g: 128, b: 255, a: 0.5 }
parse("hsl(210 50% 53%)");     // { r: 75, g: 135, b: 195, a: 1 }

toHex("rgb(52, 152, 219)");          // "#3498db"
toHex({ r: 255, g: 0, b: 0, a: 0.5 }); // "#ff000080"
toRgbString("#3498db");              // "rgb(52, 152, 219)"
toHslString("#ff0000");              // "hsl(0, 100%, 50%)"
```

## Convert

```ts
import { rgbToHsl, hslToRgb } from "huekit";

rgbToHsl({ r: 255, g: 0, b: 0, a: 1 }); // { h: 0, s: 100, l: 50, a: 1 }
hslToRgb({ h: 120, s: 100, l: 50, a: 1 }); // { r: 0, g: 255, b: 0, a: 1 }
```

## Manipulate

```ts
import { lighten, darken, saturate, grayscale, mix, withAlpha } from "huekit";

lighten("#3498db", 0.1);   // +10% lightness
darken("#3498db", 0.1);    // -10% lightness
saturate("#3498db", -0.2); // desaturate
grayscale("#3498db");
mix("#000", "#fff", 0.25); // 25% toward white → dark grey
withAlpha("#3498db", 0.5);
```

Amounts are `0–1` (percentage points of HSL); `mix` `weight` is how much of the
second color to use.

## Accessibility

```ts
import { luminance, contrast, isReadable } from "huekit";

luminance("#fff");              // 1
contrast("#000", "#fff");      // 21
isReadable("#777", "#fff");    // false (below AA 4.5)
isReadable("#000", "#fff", 7); // true  (AAA)
```

## Pairs well with

| Need | Use |
| --- | --- |
| Clamp / lerp / remap numbers | [`@billdaddy/mathkit`](https://www.npmjs.com/package/@billdaddy/mathkit) |

## License

[MIT](./LICENSE) © Tung Tran
