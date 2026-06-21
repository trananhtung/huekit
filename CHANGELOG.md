# Changelog

All notable changes to this project are documented here.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-06-22

### Added

- `parse` — CSS color string → `RGBA` (hex 3/4/6/8, `rgb()`/`rgba()`,
  `hsl()`/`hsla()`, comma and modern space/slash syntax); `toRgba` normalizes a
  string or object.
- Conversion: `rgbToHsl`, `hslToRgb` (alpha preserved).
- Formatting: `toHex` (8-digit when alpha), `toRgbString`, `toHslString`.
- Manipulation: `withAlpha`, `lighten`, `darken`, `saturate`, `grayscale`, `mix`.
- Accessibility: `luminance` (WCAG), `contrast` (1–21), `isReadable`.
- Every function accepts a CSS string or an `RGBA` object.
- ESM + CJS builds, types, and CI across Node 18 / 20 / 22.
