<template>
    <div id="app">
        welcome to vue ssr, 下面是router-view
        <router-view></router-view>
    </div>
</template>

<script>
import A from "./components/A.vue"
import B from "./components/B.vue"
export default {
    components: {
        A, B
    }
}
</script>

<style>

</style>
