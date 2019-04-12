// 类似静态资源的注入，head也遵循相同的理念，我们可以在组件的生命周期中，将数据动态的追加到上下文中，然后在模版中用占位符替换为这些数据
// 2.3.2+版本，服务端可以使用this.$ssrContext来访问组件中服务器的上下文(SSR context)

function getTitle(vm) {
    const {title} = vm.$options
    if (title) {
        return typeof title === 'function'
            ? title.call(vm)
            : title
    }
}

const serverTitleMixin = {
    created() {
        const title = getTitle(this)
        if (title) {
            this.$ssrContext.title = title
            this.$ssrContext.meta = '<meta charset="utf-8">'
        }
    }
}
const clientTitleMixin = {
    mounted() {
        const title = getTitle(this)
        if (title) {
            document.title = title
        }
    }
}

export default process.env.VUE_ENV === 'server'
    ? serverTitleMixin
    : clientTitleMixin