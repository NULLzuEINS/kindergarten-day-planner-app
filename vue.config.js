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
      orientation: 'portrait',
      lang: 'de-DE',
      categories: ["kids", "education"],
      shortcuts: [
        {
          name: "How's weather today?",
          short_name: "Today",
          description: "View weather information for today",
          url: "/today?source=pwa",
          icons: [{src: "/img/icons/icon.png", "sizes": "192x192"}]
        },
        {
          name: "How's weather tomorrow?",
          short_name: "Tomorrow",
          description: "View weather information for tomorrow",
          url: "/tomorrow?source=pwa",
          icons: [{src: "/img/icons/icon.png", "sizes": "192x192"}]
        }
      ],
      icons: [
        {
          src: './img/icons/icon.png',
          sizes: '16x16 32x32 48x48 72x72 128x128 192x192 256x256 512x512',
          type: 'image/png',
          purpose: 'any maskable monochrome'
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
