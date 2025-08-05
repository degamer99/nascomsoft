// app/head.tsx
export default function Head() {
  return (
    <>
      {/* PWA meta */}
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#0d9488" />

      {/* icons for iOS/Safari */}
      <link rel="apple-touch-icon" href="/icon512_maskable.png" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />

      {/* optional: splash screens, msapplication-TileImage, etc. */}
    </>
  )
}
