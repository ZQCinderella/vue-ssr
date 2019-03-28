import { createApp } from './app.js'
import 'es6-promise/auto'
import Vue from 'vue'

// a global mixin that calls `asyncData` when a route component's params change
Vue.mixin({
    beforeRouteUpdate (to, from, next) {
    const { asyncData } = this.$options
    if (asyncData) {
        asyncData({
            store: this.$store,
            route: to
        }).then(next).catch(next)
    } else {
        next()
    }
    }
})

// 获取应用程序
const { app, router, store } = createApp()
console.log('router', router)

if (window.__INITIAL_STATE__) {
    store.replaceState(window.__INITIAL_STATE__)
}

// 在路由导航前解析数据。使用此策略，应用程序会等待视图所需数据全部解析之后，再传入数据并处理当前视图
router.onReady(() => {

    console.log('router ready ------')
   // 添加路由钩子函数，用于处理 asyncData.
   // 在初始路由 resolve 后执行，
   // 以便我们不会二次预取(double-fetch)已有的数据。
   // 使用 `router.beforeResolve()`，以便确保所有异步组件都 resolve。
   router.beforeResolve((to, from, next) => {
       const matched = router.getMatchedComponents(to)
       const prevMatched = router.getMatchedComponents(from)
       
       // 找出非当前预渲染的组件. 即 如果当前route是 /a   , 如果再次访问/a 则不进行操作
       let diffed = false
       const activited = matched.filter((c, i) => {
           return diffed || (diffed = (prevMatched[i] !== c))
       })
       if (!activited.length) {
           return next()
       }

       // 如果存在匹配到的异步组件， 则和服务端一样去检查是否有asyncData方法，若有则执行
       Promise.all(activited.map(Compponent => {
           if (Compponent.asyncData) {
               return Compponent.asyncData({
                    store,
                    route: to
               })
           }
       })).then(() => {
           // 停止加载指示器(loading indicator)
           next()
       }).catch(next)
       
   })

    // 挂在到dom上
    app.$mount('#app')
})

// service worker
function isLocalhost() {
    return /^http(s)?:\/\/localhost/.test(location.href);
}
if (('https:' === location.protocol || isLocalhost()) && navigator.serviceWorker) {
    navigator.serviceWorker.register('/service-worker.js')
}