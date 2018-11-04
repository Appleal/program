<template>
  <div class="chat-text-wrapper" :class="{slef: data.me}" v-if="withdrawState">
    <div class="chat-text-time">{{_format(data.time)}}</div>
    <div class="chat-text-content">
      <div class="chat-msg-portrait">
        <img :src="data.portrait">
      </div>
      <div class="chat-msg-content">
        <span v-if="data.me" style="color: #00bafa">
          <!--<span v-if='read'>已读</span>-->
        </span>
        <div class="chat-msg-content-body">
          <span class="chat-msg-content-text" v-html="symbolToHTML(data)"></span>
        </div>
        <p><span @click="withdraw" class="change" title="撤回消息" v-if="data.me">撤回</span></p>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { chatMixin } from 'common/js/mixin'
import { emojiList } from 'common/js/emoji'
import { withdrawNim, sendTipMsg, readMessage } from 'common/js/im'
import { createdComponents, append } from 'common/js/template'
import {Message} from 'element-ui'
const COMPONENTS_NAME = 'chat-text'

export default {
  name: COMPONENTS_NAME,
  mixins: [chatMixin],
  data () {
    return {
      withdrawState: true,
      read: false
    }
  },
  methods: {
    symbolToHTML (msg) {
      this.read = readMessage(msg.allContent)
      const content = msg.text
      this.emojiToHTML(msg.text)
      if (content) {
        if (content.indexOf('\n') > -1) { // 如果有换行
          const contents = content.split('\n')
          let newContents = []
          for (let c of contents) {
            const text = this.emojiToHTML(c)
            newContents.push(text)
          }
          return newContents.join('<br/>')
        }
        return this.emojiToHTML(content)
      }
      return content
    },
    withdraw () {
      const that = this
      withdrawNim(this.data.allContent, function (error) {
        if (!error) {
          that.withdrawState = false
          sendTipMsg(that.data.allContent.to, function () {
            const yjkChat = document.getElementById('yjkChat')
            let conversation = {
              type: 'tip',
              allContent: {tip: '你撤回了一条消息'}
            }
            let components = createdComponents(conversation)
            // 存储聊天窗的组件，切换聊天需要清理注册的组件
            window.yjkChatComponents.push(components)
            append(yjkChat, components) // 添加到聊天窗口
          })
        } else {
          Message.error('发送时间超过五分钟，不能被撤回！')
        }
      })
    },
    emojiToHTML (e) {
      var str = e
      var emojiMap = emojiList
      var strNode = str.replace(/\[.*?\]/g, function (key) {
        if (emojiMap[key]) {
          return '<img src="' + emojiMap[key].file + '" />'
        } else {
          return key
        }
      })
      return strNode
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/css/variable"
@import "~common/css/mixin"
@import "~common/css/chat"

.change
  width 20px
  height 20px
  border-radius 50%
  text-align center
  line-height 20px
  margin-top 14px
  color #666
  background #fff
  cursor pointer
  margin-left 8px
.chat-msg-content-text
  height 20px
  img
    height 20px

</style>
