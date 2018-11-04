<template>
  <c-scroll id="yjkChatWindowWrapper" class="chat-window-body" ref="chatWindowWrapper">
    <div class="chat-window-header">
      <span v-if="!hasMsg" class="chat-window-header-tip">暂无更多消息</span>
      <div v-show="isLoading" class="chat-window-header-loading">
        <!--<c-loading type="spinners"></c-loading>-->
      </div>
      <div id="yjkChat" ref="scrollHeight" class="scroll-height"></div>
    </div>
  </c-scroll>
</template>

<script type="text/ecmascript-6">
import {mapGetters} from 'vuex'
import cScroll from 'base/c-scroll/c-scroll'
import cLoading from 'base/c-loading/c-loading'
import { getHistoryMessages } from 'common/js/im'
import { BASE_ENV } from 'api/config'
import { createdComponents, append } from 'common/js/template'

const COMPONENTS_NAME = 'chat-content'

export default {
  name: COMPONENTS_NAME,
  props: {
    push: 0
  },
  data () {
    return {
      hasMsg: true,
      isLoading: true
    }
  },
  computed: {
    ...mapGetters(['user', 'custom', 'config', 'connectype'])
  },
  mounted () {
    if (!this.scrollWrapper) {
      this.init()
      this.scrollWrapper = this.$refs.chatWindowWrapper
      this.scrollWrapper.$refs.scrollbar.addEventListener('ps-y-reach-start', (e) => {
        if (!this.isLoading && this.hasMsg) {
          this.isLoading = true
          this.timestrap = this.$sentTime
          // this._getHistoryMessages()
        }
      })
    }
  },
  methods: {
    init () {
      const {tid} = this.$route.params
      this.tid = tid
      this.timestrap = 0
      this.isLoading = false
      const yjkChat = document.getElementById('yjkChat')
      if (yjkChat) {
        const childRens = yjkChat.children
        for (let i = 0; i < childRens.length; i++) {
          yjkChat.removeChild(childRens[i])
        }
        const componentsList = window.yjkChatComponents
        for (let i = 0; i < componentsList.length; i++) {
          componentsList[i].$destroy()
        }
        window.yjkChatComponents = []
      }
      this._getHistoryMessages()
    },
    _getHistoryMessages () {
      let appkey = ''
      const {neteaseToken, userid} = this.user
      if (BASE_ENV === 'pro') {
        appkey = 'dcae515da206f2679f5452b0ccdb3056'
      } else {
        appkey = '596472b17aca4ef144bb4a52801d4163'
      }
      getHistoryMessages(neteaseToken, appkey, userid, this.tid).then(request => {
        const {getUserPortrait, getCustomPortrait} = this
        let {list} = request
        const yjkChat = document.getElementById('yjkChat')
        const fragment = document.createDocumentFragment()
        if (list.length > 0) {
          this.$sentTime = list.lastMsgId
        }
        this.$index = list.length
        for (let ct of list.msgs.reverse()) {
          const { type, text, time, from, file, content } = ct
          let me = from === this.user.imId // 顾问id
          if (type === 'app:talkTimeMessage') {
            me = from
          }
          const portrait = me ? getUserPortrait() : getCustomPortrait()
          let conversation = {
            content,
            allContent: ct,
            file,
            target: from,
            portrait,
            type,
            text,
            time,
            me
          }
          let components = createdComponents(conversation)
          // 存储聊天窗的组件，切换聊天需要清理注册的组件
          window.yjkChatComponents.push(components)
          append(fragment, components)
        }
        if (this.timestrap === 0) {
          yjkChat.appendChild(fragment)
          setTimeout(() => {
            this.scrollTop('self')
          }, 400)
        } else {
          // 向上滚动 加载历史消息
          yjkChat.insertBefore(fragment, yjkChat.childNodes[0])
          setTimeout(() => {
            // this.scrollTop()
          }, 400)
        }
      })
    },
    scrollTop (type) {
      if (type === 'self' || this.timestrap === 0) {
        this.$refs.chatWindowWrapper.$refs.scrollbar.scrollTop = 2000000000
      } else {
        if (this.$index) {
          const ps = this.$refs.scrollHeight
          const index = this.$index
          let scrollTop = 0
          const children = ps.children
          for (let c = 0; c < index; c++) {
            scrollTop += children[c].clientHeight
          }
          this.$refs.chatWindowWrapper.$refs.scrollbar.scrollTop = scrollTop
        }
      }
      setTimeout(() => {
        this.isLoading = false
      }, 40)
    },
    getUserPortrait () {
      if (this.user.portraitUrl) {
        return this.user.portraitUrl
      }
      return this.config.userPortraitUrl
    },
    getCustomPortrait () {
      if (this.custom.portraitUrl) {
        return this.custom.portraitUrl
      }
      return this.config.customPortraitUrl
    }
  },
  watch: {
    $route () {
      const { name } = this.$route
      if (name === 'chatwindow') {
        this.init()
      }
    },
    push () {
      this.scrollTop('self')
    }
  },
  components: {
    cLoading,
    cScroll
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/css/variable"
@import "~common/css/mixin"
.chat-window-body
  padding 0 16px
  overflow auto
.chat-window-header
  width 100%
  height 30px
  line-height 30px
  font-size $font-size-sm
  color #999
  text-align center
.chat-window-header-loading
  margin 15px 0
  font-size 20px
.scroll-height
  position relative
  width 100%
  overflow auto
</style>
