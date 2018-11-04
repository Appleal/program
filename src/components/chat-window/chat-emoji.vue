<template>
  <div class="chat-emoji-wrapper">
    <slot></slot>
    <el-button class="chat-emoji-button" v-popover:emojiPopover>选择表情</el-button>
    <el-popover
      ref="emojiPopover"
      placement="top-start"
      width="550"
      trigger="click"
      v-model="emojiPopoverVisible">
      <div class="emoji-wrapper">
        <div class="emoji-item"
            v-for="emoji in emojiList"
            :key="emoji.unicode"
            v-html="emoji.nodeString"
            @click="selectEmoji(emoji)">
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script type="text/ecmascript-6">
import { Button, Popover } from 'element-ui'
import { getEmojiList } from 'common/js/im'
const COMPONENTS_NAME = 'chat-emoji'

export default {
  name: COMPONENTS_NAME,
  data () {
    return {
      emojiList: [],
      emojiPopoverVisible: false
    }
  },
  created () {
    this.$nextTick(() => {
      this.emojiList = getEmojiList()
    })
  },
  methods: {
    selectEmoji (emoji) {
      this.emojiPopoverVisible = false
      this.$emit('selectEmoji', emoji.symbol)
    }
  },
  components: {
    [Button.name]: Button,
    [Popover.name]: Popover
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/css/variable"
@import "~common/css/mixin"

.chat-emoji-button
  position absolute
  top 0
  left 0
  right 0
  bottom 0
  z-index 10
  cursor pointer
  opacity 0

.emoji-wrapper
  width 100%
  height 340px
  overflow auto
  .emoji-item
    width 44px
    height 44px
    line-height 44px
    text-align center
    transition background-color .4s
    border-radius 5px
    inline-block-top()
    &:hover
      background-color $color-mark
    &:active
      background-color #CFCFCF
</style>
