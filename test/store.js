import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { fetchIdsByType } from '../src/api'
console.log(fetchIdsByType)

Vue.use(Vuex)

import Category from './config/category'
import website from './config/website'
let dataList = {},
    rankIndex = {},
    menuMap = {}

Category.forEach(item => {
    dataList[item.title] = {}
    rankIndex[item.title] = {},
    menuMap[item.title] = item
})

const actions = {
    fetchListData: ({ commit, dispatch, state}, { type }) => {
        commit('setCurrentType', { type })
        return new Promise((resolve, reject) => {
            axios.get('http://localhost:8082' + website.path + '&category=' + menuMap[type].id).then(res => {
                const val = res.data && res.data.d;
                console.log('res:', res.data)
                if (val) val.__lastUpdated = Date.now()
                resolve(val);
            }, reject).catch(reject)
        }).then(data => {
            commit('updateList', { type, data })
        })
        // return fetchIdsByType(type, '').then(data => {
        //     commit('updateList', { type, data })
        // })
    }
}
const mutations = {
    updateList: (state, { type, data }) => {
        state.lists[type] = data
    },
    setCurrentType: (state, { type }) => {
        state.activeType = type
    }
}
export function createStore() {
    return new Vuex.Store({
        state: {
            activeType: null,
            lists: dataList,
            rankIndex
        },
        actions,
        mutations
    })
}