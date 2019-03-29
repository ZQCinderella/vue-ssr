const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.base.config')
const SWPrecachePlugin = require('sw-precache-webpack-plugin')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const Category = require('../src/config/category');

const config = merge(base, {
  entry: {
    // app: './src/entry-client.js',
    app: './test/entry-client.js'
  },
  resolve: {
    alias: {
      'create-api': './create-api-client.js'
    }
  },
  plugins: [
    // strip dev-only code in Vue source
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"client"'
    }),
    // 将依赖模块提取到 vendor chunk 以获得更好的缓存
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module) {
        
        // 在使用 CSS 提取 + 使用 CommonsChunkPlugin 插件提取 vendor 时，
        // 如果提取的 CSS 位于提取的 vendor chunk 之中，extract-text-webpack-plugin 会遇到问题。
        // 为了解决这个问题，请避免在 vendor chunk 中包含 CSS 文件
        return (
          // 如果它在 node_modules 中， 即为公共模块 进行提取
          /node_modules/.test(module.context) &&
          // 如果 request 是一个 CSS 文件，则无需外置化提取
          !/\.css$/.test(module.request)
        )
      }
    }),
    // extract webpack runtime & manifest to avoid vendor chunk hash changing
    // on every build.
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest'
    }),
    new VueSSRClientPlugin()
  ]
})

if (process.env.NODE_ENV === 'production') {
  const categories = Category.map(category => category.title).join('|');
  const categoryUrlPattern = new RegExp('^/(' + categories + ')');
  config.plugins.push(
    // auto generate service worker
    new SWPrecachePlugin({
      cacheId: 'vue-hn',
      filename: 'service-worker.js',
      minify: false,
      dontCacheBustUrlsMatching: /./,
      staticFileGlobsIgnorePatterns: [/\.map$/, /\.json$/],
      runtimeCaching: [
        {
          urlPattern: '/',
          handler: 'networkFirst'
        },
        {
          urlPattern: categoryUrlPattern,
          handler: 'networkFirst'
        }
      ]
    })
  )
}

module.exports = config
