<template>
  <div id="app">
    <template v-if="isLoginPage">
      <router-view></router-view>
    </template>
    <template v-else>
      <c-progress></c-progress>
      <c-header></c-header>
      <section class="c-content">
          <router-view></router-view>
      </section>
      <im v-if="isLogin"></im>
      <!--<im></im>-->
      <phone v-if="isLogin"></phone>
      <call-phone v-if="isLogin"></call-phone>
    </template>
  </div>
</template>

<script type="text/ecmascript-6">
import {mapGetters, mapActions} from 'vuex'
import cHeader from 'base/c-header/c-header'
import cProgress from 'base/c-progress/c-progress'
import Im from 'components/im/im'
import Phone from 'components/phone/phone'
import callPhone from 'components/phone/call-phone'
import {getToken} from 'common/js/storage'

window.yjkChatComponents = [] // 存储聊天窗的组件，切换聊天需要清理注册的组件

export default {
  name: 'App',
  computed: {
    ...mapGetters(['isLogin', 'user'])
  },
  data () {
    return {
      isLoginPage: true
    }
  },
  created () {
    this.$nextTick(() => {
      if (this.$route.path === '/login' || window.location.pathname === '/login') {
        this.isLoginPage = true
        return
      }
      const token = getToken()
      if (this.user.userid && token) {
        this.appStart()
      }
    })
  },
  methods: {
    ...mapActions(['appStart', 'refresh'])
  },
  watch: {
    $route () {
      if (this.$route.path === '/login') {
        this.isLoginPage = true
      } else {
        this.isLoginPage = false
      }
    }
  },
  components: {
    cHeader,
    cProgress,
    Im,
    Phone,
    callPhone
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/css/variable"
@import "~common/css/mixin"

#app
  position relative
  width 100%
  height 100%
  & >>> .ps__rail-y
    z-index 100
.c-content
  position absolute
  top 50px
  bottom 0
  left 0
  right 0
  overflow hidden

</style>
