// One-time author tool; NOT a project dependency. Re-run only if public/favicon.svg changes:
//   npx --yes --ignore-scripts @vite-pwa/assets-generator@1.0.2 --config scripts/pwa-assets.config.mjs
// The default minimal-2023 preset pads the art and fills the padding with white; padding 0 and an
// explicit background keep the icons full-bleed (the gold cross on #0a0608, D-11).
// No .ico is produced: the SVG icon link in index.html already covers browsers.
const opaque = { background: '#0a0608' };
export default {
  preset: {
    transparent: { sizes: [192, 512], padding: 0, resizeOptions: opaque },
    maskable: { sizes: [512], padding: 0, resizeOptions: opaque },
    apple: { sizes: [180], padding: 0, resizeOptions: opaque },
  },
  images: ['public/favicon.svg'],
};
