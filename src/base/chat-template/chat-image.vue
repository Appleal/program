<template>
  <div class="chat-text-wrapper" :class="{slef: data.me}" v-if= "withdrawState">
    <div class="chat-text-time">{{_format(data.time)}}</div>
    <div class="chat-text-content">
      <div class="chat-msg-portrait">
        <img :src="data.portrait">
      </div>
      <div class="chat-msg-content" style="min-height: 200px">
        <span v-if="data.me" style="color: #00bafa">
          <!--<span v-if='read'>已读</span>-->
        </span>
        <div class="chat-msg-content-body">
          <div  class="chat-msg-img-wrapper">
            <img
              @click="handlClick"
              :src="data.file.url"
              ref="img" >
            <div class="chat-msg-img-mark" v-if="isProgress" >
              <div class="chat-mark-content">
                {{progressForamt(progress)}}%
              </div>
            </div>
          </div>
        </div>
        <p><span @click="withdraw" class="change" title="撤回消息" v-if="data.me">撤回</span></p>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { chatMixin } from 'common/js/mixin'
import { withdrawNim, readMessage } from 'common/js/im'
import {Message} from 'element-ui'
const COMPONENTS_NAME = 'chat-image'

export default {
  name: COMPONENTS_NAME,
  props: {
    isProgress: {
      type: Boolean,
      default: false
    },
    progress: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      withdrawState: true,
      read: false
    }
  },
  mixins: [chatMixin],
  mounted () {
    this.read = readMessage(this.data.allContent)
    this.$nextTick(() => {
      let url = ''
      if (this.data.file.url) {
        url = this.data.file.url
      } else {
        url = this.data.file
      }
      if (url) {
        this.loadImage = setTimeout(() => {
          let img = document.createElement('img')
          let imgRef = this.$refs.img
          img.onload = function (e) {
            imgRef.src = url
          }
          img.src = url
        }, 2000)
      }
    })
  },
  beforeDestroy () {
    if (this.loadImage) {
      clearTimeout(this.loadImage)
    }
  },
  methods: {
    handlClick () {
      const url = this.data.file.url
      if (url) {
        window.open(url, '_blank')
      }
    },
    withdraw () {
      const that = this
      withdrawNim(this.data.allContent, function (error) {
        if (!error) {
          that.withdrawState = false
        } else {
          Message.error('发送时间超过五分钟，不能被撤回！')
        }
      })
    },
    progressForamt (e) {
      return Math.ceil(e)
    },
    imageBase (img) {
      const reg = /^data:image\/(gif|png|jpg|jpeg|bmp);base64,/
      if (reg.test(img)) {
        return img
      }
      return 'data:image/png;base64,' + img
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/css/variable"
@import "~common/css/mixin"
@import "~common/css/chat"

.chat-msg-img-wrapper
  position relative
  overflow hidden
  img
    max-width 240px
    min-width 60px
.change
  width 50px
  height 20px
  border-radius 50%
  display inline-block
  text-align center
  font-size 12px
  line-height 20px
  color #666
  background #fff
  cursor pointer
  margin-left 8px
.chat-msg-img-mark
  position absolute
  bottom 0px
  left 0
  width 100%
  height 100%
  background-color rgba(0,0,0,0.4)
.chat-mark-content
  position absolute
  top 50%
  left 50%
  margin-top -60px
  margin-left -60px
  width 120px
  height 120px
  line-height 120px
  text-align center
  color #fff
  font-size 20px
</style>
