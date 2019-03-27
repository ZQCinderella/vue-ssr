import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export function createRouter() {
    return new Router({
        mode: 'history',
        routes: [
            { path: '/a', component: () => import('./components/A.vue')},
            { path: '/b', component: () => import('./components/B.vue')},
            { path: '/', redirect: '/a'}
        ]
    })
}