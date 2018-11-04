<template>
  <div class="chat-text-wrapper" :class="{slef: data.me}">
    <div class="chat-text-time">{{_format(data.time)}}</div>
    <div class="chat-text-content">
      <div class="chat-msg-portrait">
        <img :src="data.portrait">
      </div>
      <div class="chat-msg-content">
        <div class="chat-msg-content-body">
          <div style="margin-top: 6px">
          <audio id="audio" :src="data.file.mp3Url" controls="controls" preload="auto">
          <!--<div class="chat-voice" title="播放语音">-->
            <!--<span class="voice-icon" v-show="status === 0"></span>-->
            <!--<span class="voice-icon end" v-show="status === 1"></span>-->
            <!--<span class="voice-icon star" v-show="status === 2"></span>-->
            <!--&lt;!&ndash;<span class="voice-text">{{len}}''</span>&ndash;&gt;-->
          <!--</div>-->
          </audio>
          <span @click="changeText" class="change">转</span>
          </div>
          <p v-if="textContent">{{textContent}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { chatMixin } from 'common/js/mixin'
import { voicePlay, voiceStop, setaudioToText } from 'common/js/im'
const COMPONENTS_NAME = 'chat-text'

export default {
  name: COMPONENTS_NAME,
  data () {
    return {
      play: false,
      status: 0,
      voiceText: 0,
      len: 0,
      textContent: ''
    }
  },
  mixins: [chatMixin],
  mounted () {
    // console.log(this.data)
    // const { data, voiceFormt } = this
    // this.len = voiceFormt(data.content)
  },
  methods: {
    changeText () {
      const that = this
      setaudioToText(this.data.file.url, function (err, obj) {
        console.log(err)
        that.textConten = '正在转换中....'
        if (obj.text) {
          that.textContent = obj.text
        } else {
          that.textConten = '转换失败....'
        }
      })
    },
    voiceClick () {
      const { data, voiceFormt, play } = this
      if (play) {
        this.voiceTimer && clearTimeout(this.voiceTimer)
        voiceStop(data.content)
        this.play = false
        this.len = voiceFormt(data.content)
        this.status = 0
        this.voiceTimer && clearTimeout(this.voiceTimer)
      } else {
        this.play = true
        voicePlay(data.content.content, () => {
          this.play = false
          this.len = voiceFormt(data.content)
          this.status = 0
          this.voiceTimer && clearTimeout(this.voiceTimer)
        })
        this.voiceTimeFor()
      }
    },
    voiceTimeFor () {
      this.voicePlay()
      this.len = this.len - 1
      if (this.play && this.len > 0) {
        this.voiceTimer = setTimeout(() => {
          this.voiceTimeFor()
        }, 1000)
      } else {
        this.len = this.voiceFormt(this.data.content)
        this.status = 0
      }
    },
    voicePlay () {
      const {status} = this
      if (status === 0) {
        this.status = 1
      } else if (status === 1) {
        this.status = 2
      } else {
        this.status = 0
      }
    },
    voiceFormt (b) {
      let len = b.content.length / 1024
      return Math.ceil(len)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/css/variable"
@import "~common/css/mixin"
@import "~common/css/chat"

.chat-msg-content-body
  cursor pointer

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
  float right
.chat-voice
  position relative
  padding 0 5px
  width 60px
.voice-icon
  display block
  margin 5px 20px 5px 0
  width 14px
  height 19px
  background url('./voice2.png') no-repeat center
  background-size 100% 100%
  &.star
    background url('./voice1.png') no-repeat center
    background-size 100% 100%
  &.end
    background url('./voice.png') no-repeat center
    background-size 100% 100%
.voice-text
  position absolute
  top 0
  right 0
  width 40px
  height 19px
  line-height 19px
  text-align right
  font-size 14px
  color #333
</style>
