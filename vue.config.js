const PACKAGE = require('./package.json')

process.env = {
  ...process.env,
  VUE_APP_VERSION: PACKAGE.version,
  VUE_APP_TITLE: PACKAGE.title,
  VUE_APP_DISPLAYNAME: PACKAGE.displayName,
  VUE_APP_AUTHOR_NAME: PACKAGE.author.name,
  VUE_APP_AUTHOR_URL: PACKAGE.author.url,
}
module.exports = {
  pwa: {
    name: process.env.VUE_APP_DISPLAYNAME,
    themeColor: '#ff4c29',
    msTileColor: '#ff4c29',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    assetsVersion: process.env.VUE_APP_VERSION,
    manifestOptions: {
      short_name: 'Tagesplaner',
      description: process.env.VUE_APP_DESCIPTION,
      start_url: '/',
      author: process.env.VUE_APP_AUTHOR_NAME,
      developer: {
        name: 'André Lademann',
        url: "https://nullzueins.com"
      },
      homepage_url: process.env.VUE_APP_AUTHOR_URL,
      offline_enabled: true,
      msTileImage: 'img/icons/windows/mstile-150x150.png',
      display: 'standalone',
      orientation: 'landscape',
      lang: 'de',
      background_color: '#ffffff',
      categories: process.env.VUE_APP_CATEGORIES,
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
          src: './img/icons/favicon/favicon-16x16.png',
          sizes: '16x16',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: './img/icons/favicon/favicon-32x32.png',
          sizes: '32x32',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: './img/icons/apple-touch/apple-touch-icon-57x57.png',
          sizes: '57x57',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: './img/icons/apple-touch/apple-touch-icon-60x60.png',
          sizes: '60x60',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: './img/icons/apple-touch/apple-touch-icon-72x72.png',
          sizes: '72x72',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: './img/icons/apple-touch/apple-touch-icon-76x76.png',
          sizes: '76x76',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: './img/icons/apple-touch/apple-touch-icon-114x114.png',
          sizes: '114x114',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: './img/icons/apple-touch/apple-touch-icon-120x120.png',
          sizes: '120x120',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: './img/icons/apple-touch/apple-touch-icon-144x144.png',
          sizes: '144x144',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: './img/icons/apple-touch/apple-touch-icon-152x152.png',
          sizes: '152x152',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: './img/icons/apple-touch/apple-touch-icon-180x180.png',
          sizes: '180x180',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: './img/icons/android/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: './img/icons/android/android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: './img/icons/maskable/maskable_icon_x48.png',
          sizes: '48x48',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: './img/icons/maskable/maskable_icon_x72.png',
          sizes: '72x72',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: './img/icons/maskable/maskable_icon_x96.png',
          sizes: '96x96',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: './img/icons/maskable/maskable_icon_x128.pn',
          sizes: '128x128',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: './img/icons/maskable/maskable_icon_x192.pn',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: './img/icons/maskable/maskable_icon_x384.pn',
          sizes: '384x384',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: './img/icons/maskable/maskable_icon_x512.pn',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ]
    },
    iconPaths: {
      favicon16: './img/icons/favicon/favicon-16x16.png',
      favicon32: './img/icons/favicon/favicon-32x32.png',
      appleTouchIcon: './img/icons/apple-touch/apple-touch-icon-152x152.png',
      maskIcon: './img/icons/andriod/android-chrome-512x512.png',
      msTileImage: './img/icons/windows/mstile-150x150.png',
    },
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: "./src/service-worker.js",
    }
  }
}
