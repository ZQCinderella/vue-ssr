/**
 * 服务器端通过createApp来获取内容
 */
const express = require('express')
const fs = require('fs')
const path = require('path')
const favicon = require('serve-favicon')
const compression = require('compression')
const microcache = require('route-cache')
const LRU = require('lru-cache')
const testRenderer = require('vue-server-renderer').createRenderer()
const { createBundleRenderer } = require('vue-server-renderer')
const axios = require('axios');
const websiteConfig = require('./src/config/website');

const isProd = process.env.NODE_ENV === 'production'
const useMicroCache = process.env.MICRO_CACHE !== 'false'
const serverInfo =
    `express/${require('express/package.json').version} ` +
    `vue-server-renderer/${require('vue-server-renderer/package.json').version}`

const resolve = (file) => path.resolve(__dirname, file)

const server = express()

const serve = (path, cache) => express.static(resolve(path), {
    maxAge: cache && false ? 1000 * 60 * 60 * 24 * 30 : 0
})

server.use(compression({threshold: 0}))
server.use(favicon('./public/logo-48.png'))
server.use('/dist', serve('./dist', true))
server.use('/public', serve('./public', true))
server.use('/manifest.json', serve('./manifest.json', true))
server.use('/service-worker.js', serve('./dist/service-worker.js'))
server.use(microcache.cacheSeconds(1, req => useMicroCache && req.originalUrl))

function createRenderer (bundle, options) {
    return createBundleRenderer(bundle, Object.assign(options, {
        cache: LRU({
            max: 1000,
            maxAge: 1000 * 60 * 15
        }),
         // this is only needed when vue-server-renderer is npm-linked
         basedir: resolve('./dist'),
         // recommended for performance
         runInNewContext: false
    }))
}
let renderer
let templatePath = resolve('./test/test.template.html')
let readyPromise = require('./build/setup-dev-server')(
    server,
    templatePath,
    (bundle, options) => {
        console.log('bundle callback..');
        renderer = createRenderer(bundle, options)
    }
)
server.get('/v1/get_entry_by_rank', (req, res) => {
    console.log(req.url);
    axios({
        method:'get',
        url: websiteConfig.host + req.url,
        responseType:'stream'
    }).then(response => {
        // console.log(response);
        response.data.pipe(res);
    }).catch(err => {
        console.error(err);
        res.status(500).send('500 | Internal Server Error')
    });
});
function render(req, res) {
    const s = Date.now()

    res.setHeader("Content-Type", "text/html")
    res.setHeader("Server", serverInfo)

    const handleError = err => {
        if (err.url) {
            res.redirect(err.url)
        } else if (err.code === 404) {
            res.status(404).send('404 | Page Not Found')
        } else {
            // Render Error Page or Redirect
            res.status(500).send('500 | Internal Server Error')
            console.error(`error during render : ${req.url}`)
            console.error(err.stack)
        }
    }

    const context = {
        title: '服务端渲染', // default title
        url: req.url
    }
    // 这里无需传入一个应用程序，因为在执行 bundle 时已经自动创建过。
    // 现在我们的服务器与应用程序已经解耦！
    // 在调用 renderToString 时，它将自动执行「由 bundle 创建的应用程序实例」所导出的函数（传入上下文作为参数），然后渲染它。
    renderer.renderToString(context, (err, html) => {
        if (err) {
            return handleError(err)
        }
        res.send(html)
        if (!isProd) {
            console.log(`whole request: ${Date.now() - s}ms`)
        }
    })
}
server.get('*', (req, res) => {
    // 如果使用 const createApp = require('./test/entry-server')
    // createApp(context).then(app => renderer.renderToString(app ,......))  则无法做到热更新，所以使用createBundleRenderer， 通过json文件监听到每个bundle的更新
    readyPromise.then(() => {
        console.log('ready promise')
        return render(req, res)
    })
})

const port = process.env.PORT || 8082;
server.listen(port, () => {
    console.log(`server started at localhost:${port}`)
})
