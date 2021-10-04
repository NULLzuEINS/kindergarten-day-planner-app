const VERSION = require('./package.json').version;
module.exports = {
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].version = VERSION
        return args
      })
  },
  pwa: {
    name: 'KiTa Tagesplaner',
    themeColor: '#ff4c29',
    msTileColor: '#ff4c29',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    assetsVersion: VERSION,
    manifestOptions: {
      short_name: 'Tagesplaner',
      description: '	Erstellen Sie hier einen individuellen Plan für Ihren pädagogischen Alltag.	Wählen Sie ein Layout und ziehen Sie einfach alle benötigten Tagespunkte von der linken auf die rechte Seite!',
      msTileImage: 'img/icons/manifest-icon-512.png',
      display: 'standalone',
      orientation: 'landscape',
      lang: 'de',
      background_color: '#ffffff',
      categories: ["kids", "education"],
      screenshots: [
        {
          src: "./img/screenshots/desktop.png",
          sizes: "1280x800",
          type: "image/png"
        },
        {
          src: "./img/screenshots/mobile.png",
          sizes: "750x1334",
          type: "image/png"
        }
      ],
      icons: [
        {
          src: './img/icons/icon.png',
          sizes: '16x16 32x32 48x48 72x72 128x128 192x192 256x256 512x512',
          type: 'image/png',
          purpose: 'any monochrome'
        },
      ]
    },
    iconPaths: {
      manifestIcon192: 'img/icons/icon.png',
      manifestIcon512: 'img/icons/manifest-icon-512.png',
    },
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: "./src/service-worker.js",
    }
  }
}
