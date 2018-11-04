<template>
  <div class="chat-text-wrapper" :class="{slef: data.me}">
    <div class="chat-text-time">{{_format(data.time)}}</div>
    <div class="chat-text-content">
      <div class="chat-msg-portrait">
        <img :src="data.portrait">
      </div>
      <div class="chat-msg-content">
        <div class="chat-msg-content-body">
          <video class="chat-msg-video" controls>
            <source :src="data.file.url" type="video/mp4">
            <source src="movie.ogg" type="video/ogg">
            您的浏览器不支持 HTML5 video 标签。
          </video>
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

  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/css/variable"
@import "~common/css/mixin"
@import "~common/css/chat"

.chat-msg-content-body
  cursor pointer
.chat-msg-video
  max-width 320px
  max-height 320px
</style>
