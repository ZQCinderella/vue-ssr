<template>
    <div>
        listView-{{ type }}
    </div>
</template>

<script>
export default {
    props: ['type'],
    mounted() {
        console.log(this.$store.state)
    }
}
</script>

<style>

</style>
