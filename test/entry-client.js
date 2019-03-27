console.log('client +++')
import { createApp } from './app.js'

// 获取应用程序
const { app, router } = createApp()

router.onReady(() => {
    // 挂在到dom上
    app.$mount('#app')
})