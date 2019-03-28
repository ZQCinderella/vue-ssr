import Vue from 'vue'
import App from './App.vue'
import { createRouter } from './router'
import { createStore } from './store'
import { sync } from 'vuex-router-sync'
/**
 * 避免状态单例， 在客户端中，我们习惯在上下文中取值，但是在node服务器中，当代码进入进程时，会进行一次取值，并且保留在内存中，这样意味着它将在每个请求中共享，容易导致交叉请求状态污染
 * 同样的规则也适用于 router、store 和 event bus 实例。你不应该直接从模块导出并将其导入到应用程序中，而是需要在 createApp 中创建一个新的实例，并从根 Vue 实例注入。
 */

 // 导出一个工厂函数，用来创建新的 app, router, store实例
 export function createApp () {
     const router = createRouter()
     const store = createStore()

     // 同步路由状态(route state)到store
     sync(store, router)
     const app = new Vue({
         // 注入router,
         router,
         store,
         // 跟实例渲染应用程序
         render: h => h(App)
     })
     return { app, router, store }
 }