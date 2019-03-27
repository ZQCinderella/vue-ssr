import { createApp } from './app'


export default context => {
    // 使用promise是因为可能会是 异步的路由钩子函数或组件，以便于服务器能够等待所有的内容在渲染前就准备就绪
    return new Promise((resolve, reject) => {
        // 从生成器app.js中获取应用程序实例，router和store
        const { app, router } = createApp()

        // 设置服务器端 当前访问的 router.
        router.push(context.url)

        // 等待 router 将可能的异步组件和钩子函数解析完
        router.onReady(() => {
            // 上面已经将访问的url  push到了router中，所以可以获取匹配的组件
            const matchedComponents = router.getMatchedComponents()
            if (!matchedComponents) {
                // 未匹配到路由
                return reject({ code: 404 })
            }
            
            // promise去resolve应用程序实例，方便渲染
            resolve(app)
        }, reject)
    })
}