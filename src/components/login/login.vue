<template>
  <div style="height: 100%; overflow-y: auto; background: #fff">
    <div class="login-page">
      <div class="login-logo">
        <div style="margin-top: 5px">
          <c-logo type="md"></c-logo>
          <span class="cs" style="margin-top: 5px">客服热线：400-120-9125</span>
        </div>
      </div>
      <div class="login-contents">
        <div class="login-bg-wrapper">
          <div class="logins-title">壹邦互联网平台</div>
          <div class="login-text">专业智能 <span style="margin: 0 20px"></span>   方便快捷</div>
          <div class="line"><span></span></div>
        </div>
        <div class="login-wrapper">
          <div class="login-content">
            <h4>欢迎登录</h4>
            <div class="login-input-item element-login-input">
              <el-input placeholder="请输入账户"
                        v-model="userName"
                        clearable
                        size="mini"
                        @focus="inputHandleFocus('user')"
                        @blur="inputHandleFocus('')"
                        ref="userRef">
                <span slot="prefix" class="el-input__icon icon-user login-icon" :class="userClass"></span>
              </el-input>
            </div>
            <div class="login-input-item element-login-input">
              <el-input placeholder="请输入密码"
                        v-model="password"
                        clearable
                        type="password"
                        size="mini"
                        @focus="inputHandleFocus('password')"
                        @blur="inputHandleFocus('')"
                        ref="passwordRef">
                <span slot="prefix" class="el-input__icon icon-password login-icon" :class="passwordClass"></span>
              </el-input>
            </div>
            <div class="login-input-item element-login-check">
              <el-checkbox label="记住密码" v-model="remembPw"></el-checkbox>
            </div>
            <div class="login-input-item ">
              <el-button type="info" @click="loginHandle">
                <span v-if="!isLoging" class="login-button">登录</span>
                <c-loading color="#fff" class="login-button" size="25px" v-else></c-loading>
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="login-message">
      <div class="message-content">
        <div class="message-img">
          <img src="./iphone.png">
        </div>
        <div class="message-text">
          <h3>壹邦APP</h3>
          <p>作为男士健康管理工具，贯穿客户端和顾问端，通过精准大数据分析、标准化需求分类，以及贴</p>
          <p>心的服务提醒、一对一跟踪指导、健康资讯等服务实现男士健康移动化、专业化服务，为男士</p>
          <p>提供一个沟通、学习、分享、娱乐的平台。</p>

        </div>
        <div class="code">
          <img src="./code.png"/>
          <p>扫码安装壹邦APP</p>
        </div>
      </div>
    </div>
    <div class="copyright"> Copyright  2012-2018 壹健康健康产业集团 版权所有 京ICP备11041704号-31 京ICP证070359号</div>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters, mapActions } from 'vuex'
import axios from 'axios'
import { Input, Button, Checkbox, Message } from 'element-ui'
import { ERR_SUCCESS } from 'api/config'
import { login } from 'api/user'
import cLoading from 'base/c-loading/c-loading'
import cLogo from 'base/c-logo/c-logo'

const COMPONENT_NAME = 'login-page'

export default {
  name: COMPONENT_NAME,
  data () {
    return {
      userName: '',
      password: '',
      remembPw: false,
      isLoging: false,
      inputFocus: ''
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.isLogin) {
        this.userOut()
      }
      let body = document.body
      let that = this
      body.style.overflow = 'hidden'
      this.$refs.passwordRef && this.$refs.passwordRef.$el.addEventListener('keydown', function (e) {
        if (e.keyCode === 13) {
          that.loginHandle()
        }
      })
      try {
        let localStorageText = window.localStorage
        let gwda = localStorage.getItem('gwda')
        let gwdp = localStorage.getItem('gwdp')
        if (localStorageText && gwda) {
          this.userName = window.atob(gwda)
          this.password = window.atob(gwdp)
          this.remembPw = true
        }
      } catch (error) {
      }
    })
  },
  beforeDestroy () {
    this.$nextTick(() => {
      let body = document.body
      body.style.overflow = ''
    })
  },
  computed: {
    userClass () {
      return {
        active: this.inputFocus === 'user'
      }
    },
    passwordClass () {
      return {
        active: this.inputFocus === 'password'
      }
    },
    ...mapGetters(['config', 'isLogin'])
  },
  methods: {
    verification () {
      if (this.userName === '') {
        Message.error('账号不能为空，请输入账号！')
        this.$refs.userRef.focus()
        return true
      }
      if (this.password === '') {
        Message.error('密码不能为空，请输入密码！')
        this.$refs.passwordRef.focus()
        return true
      }
      return false
    },
    loginHandle () {
      if (this.verification()) return
      if (this.isLoging) return
      delete axios.defaults.headers.common['Authorization']
      this.isLoging = true
      this.userName = this.userName.replace(/^\s+/g, '').replace(/\s+$/g, '')
      login({
        userName: this.userName,
        password: this.password
      }).then((res) => {
        if (res.code === ERR_SUCCESS) {
          res.data.username = this.userName
          res.data.imId = `c${res.data.userid}`
          if (!res.data.portraitUrl) {
            res.data.portraitUrl = this.config.userPortraitUrl
          }
          if (this.remembPw) {
            localStorage.setItem('gwda', window.btoa(this.userName))
            localStorage.setItem('gwdp', window.btoa(this.password))
          }
          this.setUser(res.data)
          this.appStart()
          this.$router.replace('home')
        } else {
          Message.error(res.msg)
        }
        this.isLoging = false
      }).catch(() => {
        this.isLoging = false
      })
    },
    inputHandleFocus (e) {
      this.inputFocus = e
    },
    ...mapActions(['setUser', 'appStart', 'userOut'])
  },
  components: {
    [Button.name]: Button,
    [Checkbox.name]: Checkbox,
    [Input.name]: Input,
    cLoading,
    cLogo
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/css/variable"
@import "~common/css/mixin"

.login-message
  width 100%
  background #fff
  height 240px
.message-content
  width 1200px
  height 240px
  margin 0 auto
  margin-top 30px
  position relative
  .message-img
    height 285px
    width 129px
    position absolute
    top -60px
    z-index 99999
    img
      height 285px
      width 129px
  .message-text
    width 600px
    float left
    margin-left 150px
    font-size 12px
    color #1D2532
    h3
      font-size 16px
      line-height 40px
    p
      line-height 20px
  .code
    width 130px
    height 150px
    float right
    margin-right 90px
    img
      width 130px
      height 130px
    p
      font-size 12px
      text-align center
      color #666
.login-page
  height 500px
  width 100%
  background url('./bg-top.png')
  background-size 100%
  z-index $zIndex-brothers
  position relative
  .login-contents
    width 1200px
    height 400px
    margin 0 auto
  .login-logo
    width 100%
    height 60px
    line-height 60px
    overflow hidden
    border-bottom 1px solid  rgba(255,255,255,0.3)
    .cs
      float right
      margin-right 22px
      font-size 12px
      color #ffffff
      height 40px
      width 200px
      display inline-block
      line-height 40px
      background url('./phone.png')
      background-size: 16px 16px
      background-position -20px -10px
      background-repeat no-repeat
  .login-bg-wrapper
    float left
    margin-top 100px
    width 500px
    height 288px
    z-index $zIndex-brothers
    .logins-title
      font-size 64px
      font-weight bold
      color #ffffff
    .login-text
      margin-top 30px
      margin-bottom 30px
      font-size 28px
      color #ffffff
    .line
      width 40px
      span
        width 40px
        height 6px
        display inline-block
        margin-left 10px
        background #fff
    .login-bg
      position relative
      margin 0 auto
      width 308px
      height 308px
      background url('./bg.png') no-repeat center
      background-size contain
      z-index 10
    .login-bk-c
      position absolute
      top 50%
      left 50%
      margin-top -200px
      margin-left -200px
      width 400px
      height 400px
      background url('./login_bk_c.png')
      filter blur(5px)
      opacity .85
      border-radius 50%
      z-index 0
    .login-bk
      position absolute
      left 0
      top 163px
      width 100%
      height 106px
      background url('./login_bk_pic.png') repeat-x
      background-size contain
      z-index -1
  .login-wrapper
    width 319px
    height 330px
    float right
    margin-top 50px
    overflow hidden
    box-sizing content-box
    z-index $zIndex-brothers
  .login-title
    padding 20px 0
    height 24px
    line-height 24px
    color $color-background
    font-size 24px
    text-align center
    font-stretch normal
    font-weight normal
    letter-spacing 2px
  .login-content
    padding 30px
    height 100%
    box-sizing content-box
    background-color $color-background
    h4
      margin-bottom 30px
      width 100%
      height 17px
      line-height 17px
      font-size $font-size-lg
      color #4d4d4d
      text-align center
  .login-input-item
    margin-bottom 10px
    width 100%
    height 40px
    .login-icon
      margin-right 5px
      height 45px
      line-height 45px
      font-size 16px
      inline-block-top()
      color $color-text
      transition color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1)
      &.active
        color #1b60a9
    button
      width 100%
      background-color #2873d0
      &:active
        background-color #1b60a9
  .login-button
    display block
    height 25px
    line-height 25px
    font-size $font-size-lg
.copyright
  text-align center
  font-size 14px
  margin-bottom 20px
</style>
