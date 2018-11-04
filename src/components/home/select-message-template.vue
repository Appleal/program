<template>
  <div class="tpl-wrapper">
    <div class="element-notice-radio">
      <ul class="reply-tab">
        <li v-for="(item, index) in tabs" :key="item" :class="{active:index == selectItem}" @click="tab(index)">
          {{item}}
        </li>
      </ul>
    </div>
    <div class="tpl-content">
      <el-radio-group v-model="tpl">
          <el-radio  v-for="(t, index) in replyList" :label="t"
            :key="index" class="tpl-item">
            <p style="line-height: 20px">{{t.tempTitle}}</p>
            <p class="text">{{t.tempContent}}</p>
          </el-radio>
      </el-radio-group>
    </div>
    <div class="custom-pagination">
      <div class="custom-pagination-content">
          <el-pagination :current-page="100"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="100"
            layout="total, sizes, prev, pager, next, jumper"
            :total="400"
            v-show="false">
          </el-pagination>
      </div>
      <div class="select-custom-button">
        <el-button @click="save" size="mini" style="width: 120px;" class="element-button">确认</el-button>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {RadioGroup, Radio, RadioButton, Button, Pagination, Message} from 'element-ui'
import { ERR_SUCCESS } from 'api/config'
import {isNull} from 'common/js/util'
import { getTemplate } from 'api/message'

export default {
  data () {
    return {
      type: '',
      replyList: [],
      replyLists: [],
      tabs: [],
      selectItem: 0,
      tpl: ''
    }
  },
  created () {
    this.selectionChangeData = []
    this.$nextTick(() => {
      this._getTemplate()
    })
  },
  methods: {
    save () {
      if (isNull(this.tpl)) {
        Message.error('请选择模板！')
        return
      }
      this.$emit('change', this.tpl)
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
    [Radio.name]: Radio,
    [Button.name]: Button,
    [Pagination.name]: Pagination,
    [RadioGroup.name]: RadioGroup,
    [RadioButton.name]: RadioButton
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/css/variable"
@import "~common/css/mixin"

.tpl-wrapper
  position relative
  padding 20px
  .reply-tab
    height 30px
    line-height 30px
    border-bottom 1px solid #dadada
    li
      float left
      cursor pointer
      font-size 14px
      color #999
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
  .tpl-content
    margin-top 10px
    width 100%
    height 430px
  .custom-pagination
    margin-top 15px
  .custom-pagination-content
    inline-block-top()
  .select-custom-button
    float right
    height 32px
    line-height 32px
    inline-block-top()
  .tpl-item
    position relative
    margin 0
    margin-top -1px
    display block
    width 680px
    line-height 45px
    border-top 1px solid #dcdcdc
    border-bottom 1px solid #dcdcdc
    overflow hidden
    & >>> .el-radio__input
      position absolute
      top 25px
      left 5px
      width 14px
      height 14px
      inline-block-top()
    & >>> .el-radio__label
      display block
      padding 10px 0
      width 640px
      margin-left 30px
      white-space normal
      word-wrap break-word
      word-break normal
  .text
    height 20px
    line-height 20px
    overflow hidden
    text-overflow ellipsis
    white-space nowrap
</style>
