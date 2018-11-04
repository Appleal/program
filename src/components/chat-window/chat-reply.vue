<template>
  <div class="chat-reply-wrapper">
    <slot></slot>
    <el-button class="chat-reply-button" v-popover:replyPopover>选择模板</el-button>
    <el-popover
      ref="replyPopover"
      placement="top-start"
      width="550"
      trigger="click"
      v-model="replyPopoverVisible">
      <ul class="reply-tab">
        <li v-for="(item, index) in tabs" :key="item" :class="{active:index == selectItem}" @click="tab(index)">
          {{item}}
        </li>
      </ul>
      <div class="reply-wrapper">
        <div class="reply-item"
            v-for="reply in replyList"
            :key="reply.id"
            @click="selectreply(reply)">
          <p>{{reply.tempTitle}}</p>
          <p class="text">{{reply.tempContent}}</p>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script type="text/ecmascript-6">
import { Button, Popover, Message } from 'element-ui'
import { ERR_SUCCESS } from 'api/config'
import { getTemplate } from 'api/message'
const COMPONENTS_NAME = 'chat-reply'
export default {
  name: COMPONENTS_NAME,
  data () {
    return {
      replyList: [],
      replyLists: [],
      replyPopoverVisible: false,
      tabs: [],
      selectItem: 0
    }
  },
  created () {
    this.$nextTick(() => {
      this._getTemplate()
    })
  },
  methods: {
    selectreply (reply) {
      this.replyPopoverVisible = false
      this.$emit('selectreply', reply.tempContent)
    },
    tab (index) {
      this.selectItem = index
      this.replyList = this.replyLists[index].list
    },
    _getTemplate () {
      getTemplate().then(res => {
        if (res.code === ERR_SUCCESS) {
          const dataList = res.data
          for (var i = 0; i < dataList.length; i++) {
            this.tabs.push(dataList[i].parentName)
          }
          this.replyList = dataList[0].list
          this.replyLists = dataList
        } else {
          Message.error(res.msg)
        }
      })
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

.chat-reply-button
  position absolute
  top 0
  left 0
  right 0
  bottom 0
  z-index 10
  cursor pointer
  opacity 0
.reply-tab
  height 30px
  line-height 30px
  border-bottom 1px solid #dadada
  li
    float left
    cursor pointer
    width 70px
    height 30px
    line-height 30px
    text-align center
  .active
    border 1px solid #dadada
    border-bottom 0px
    border-top-left-radius 5px
    border-top-right-radius 5px
    background #fff
    color #409eff
.reply-wrapper
  width 100%
  min-height 140px
  max-height 340px
  overflow auto
  .reply-item
    padding  10px 5px
    height 40px
    line-height 1.8
    text-align left
    font-size 12px
    transition background-color .4s
    cursor pointer
    border-bottom 1px solid #dcdcdc
    &:hover
      background-color $color-mark
    &:active
      background-color #CFCFCF
    .text
      height 20px
      overflow hidden
      text-overflow ellipsis
      white-space nowrap
</style>
