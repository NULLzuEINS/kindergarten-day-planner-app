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
      msTileImage: 'img/icons/manifest-icon-512.png',
      display: 'standalone',
      orientation: 'portrait',
      icons: [
        {
          src: './img/icons/manifest-icon-512.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: './img/icons/icon.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: './img/icons/safari-pinned-tab.svg',
          sizes: '942x942',
          type: 'image/svg+xml'
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
