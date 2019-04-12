import Vue from 'vue'
import Router from 'vue-router'
import Category from './config/category'
Vue.use(Router)


// import 动态导入之后返回promise, 但是不能像 import aaa from '..//' 这样导入默认模块，如果想访问默认模块可以then(m => m.default)
const createListView = (type) => {
    return () => {

        // 如果模块使用了 export default导出，则用第一种形式
        return import('./createListView').then(m => {
            console.log('m: ', m)
            return m.default(type)
        })

        // return import('./createListView').then(({ createListView }) => {
        //     console.log('m: ', createListView)
        //     return createListView(type)
        // })
    }
}
const routes = Category.map(item => {
    return {
        path: '/' + item.title,
        component: createListView(item.title)
    }
})
// 访问根目录时重定向
routes.push({
    path: '/', redirect: routes[0].path
})
export function createRouter() {
    return new Router({
        mode: 'history',
        fallback: false,
        scrollBehavior: () => ({y: 0}),
        routes: routes
    })
}