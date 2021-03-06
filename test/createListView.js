import ItemView from './view/ItemList.vue'
import titleMixin from './head-mixin'

export default function createListView (type) {
    return {
        name: `${type}-view`,
        mixins: [titleMixin],
        props: [type],
        title:'titleMixin',
        serverCacheKey: props => {
            console.log('props----', props)
        },
        // 此函数会在组件初始化之前执行，去修改store, 因此没有this，需要手动传入store和router
        asyncData ({ store }) {
            // 发送action请求数据
            console.log('========= server async');
            return store.dispatch('fetchListData', { type })
        },
        render(h) {
            return h(ItemView, { props: { type }})
        }
    }
}
