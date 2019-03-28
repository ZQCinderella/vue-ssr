<template>
    <div id="app">
        <header class="header">
            <nav class="inner">
                <router-link to="/"> <img class="logo" src="~public/logo-48.png" alt="logo"></router-link>
                <router-link v-for="item in categories" :key="item.id" :to="item.path">{{ item.name }}</router-link>
                <!-- <a target="_self" v-for="item in categories" :key="item.id" :href="item.path">{{ item.name }}</a> -->
            </nav>
        </header>
        <router-view></router-view>
    </div>
</template>

<script>

import Category from './config/category'
export default {
    data () {
        return {
            categories: Category.map(item => ({ path: '/' + item.title, id: item.id, name: item.name}))
        }
    }
}
</script>

<style lang="stylus">
body
  font-family -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  font-size 15px
  background-color lighten(#eceef1, 30%)
  margin 0
  padding-top 55px
  color #34495e
  overflow-y scroll

a
  color #34495e
  text-decoration none

.header
  background-color #ff6600
  position fixed
  z-index 999
  height 55px
  top 0
  left 0
  right 0
  .inner
    max-width 800px
    box-sizing border-box
    margin 0px auto
    padding 15px 5px
  a
    flex 1
    color rgba(255, 255, 255, .8)
    line-height 24px
    transition color .15s ease
    display inline-block
    vertical-align middle
    font-weight 300
    letter-spacing .075em
    margin-right 1em
    &:hover
      color #fff
    &.router-link-active
      color #fff
      font-weight 400
  .github
    color #fff
    font-size .9em
    margin 0
    float right

.logo
  width 24px
  margin-right 10px
  display inline-block
  vertical-align middle

.view
  max-width 800px
  margin 0 auto
  position relative

.fade-enter-active, .fade-leave-active
  transition all .2s ease

.fade-enter, .fade-leave-active
  opacity 0

@media (max-width 860px)
  .header .inner
    padding 15px 30px

@media (max-width 600px)
  .header
    .inner
      padding 15px
    a
      margin-right 1em
    .github
      display none
</style>
