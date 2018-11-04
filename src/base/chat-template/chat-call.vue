<template>
  <div class="chat-text-wrapper"
    :class="{slef: data.senderUserId === data.content.message.content.senderUserId}" @click="callPlay">
    <div class="chat-text-time">{{_format(data.sentTime)}}</div>
    <div class="chat-text-content">
      <div class="chat-msg-portrait">
        <img :src="data.portrait">
      </div>
      <div class="chat-msg-content">
        <div class="chat-msg-content-body chat-talk">
          <span class="chat-voice icon-voice"></span>
          <span>{{data.content.message.content.talkTime}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { chatMixin } from 'common/js/mixin'

const COMPONENTS_NAME = 'chat-text'

export default {
  name: COMPONENTS_NAME,
  mixins: [chatMixin],
  mounted () {
  },
  methods: {
    callPlay () {
      console.log(this.data.content.message)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/css/variable"
@import "~common/css/mixin"
@import "~common/css/chat"

.chat-text-wrapper
  cursor pointer
  .chat-msg-content
    &::before
      border-left-color #45bbe6 !important
      border-right-color #45bbe6 !important
    .chat-msg-content-body.chat-talk
      font-size $font-size-sm
      color $color-background
      background-color #45bbe6
  .chat-voice
    height 21px
    line-height 21px
    font-size 16px
    inline-block-top()
</style>
