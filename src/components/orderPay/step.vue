<template>
  <div class="custom-page">
    <div class="custom-page-left">
      <div class="custom-page-left-content">
        <list-table title="支付列表" hideQuery>
          <ul class="step">
            <li v-for="(item, index) in items" :key="item.message"  @click="change(index)">
              <div :class="{active:item.ischoose }">
                <span>{{ index+1 }}</span> <a> {{ item.message }}</a>
              </div>
            </li>
          </ul>
          <router-view @showCityName="updateStep"></router-view>
        </list-table>
      </div>
    </div>
    <div class="custom-page-right">
      <message-list ></message-list>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
import messageList from 'base/message-list/message-list'
import listTable from 'base/list-table/list-table'

export default {
  data () {
    return {
      index: 1,
      items: [
        {message: '第一步', ischoose: false},
        {message: '第二步', ischoose: false},
        {message: '第三步', ischoose: false},
        {message: '第四步', ischoose: false}
      ]
    }
  },
  methods: {
    updateStep (data) {
      this.index = data.index
      for (var i = 0; i < this.items.length; i++) {
        this.items[i].ischoose = false
        if (i < this.index) {
          this.items[i].ischoose = true
        }
      }
    }
  },
  created () {
    for (var i = 0; i < this.items.length; i++) {
      if (i < this.index) {
        this.items[i].ischoose = true
      }
    }
  },
  components: {
    messageList,
    listTable
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/css/variable"
  @import "~common/css/mixin"

  page-init(custom)

  .custom-query-item
    padding-bottom 10px
  .custom-table
    margin-top 10px
    padding 0 15px
    .authorize-no
      color #ff3333
  .custom-pagination
    margin 21px 0
    text-align right
    .custom-pagination-content
      margin-right 20px
      inline-block-top()
  .custom-columnButton.el-button+.el-button
    position relative
    margin-left 0
    &::before
      content ''
      margin 0 4px
      width 1px
      height 12px
      background-color #898989
      inline-block-top(middle)
  .list-table-wrapper
    .list-table-header-query
      display none
  .step
      width 97%
      margin 0 auto
      height 60px
      border-bottom 1px solid #c2c2c2
      border-top 1px solid #c2c2c2
      padding-top  20px
      li
        width 24.8%
        height 40px
        line-height 40px
        float left
        &:first-child
          div
            &::before
              display none
        div
          width 97%
          height 40px
          text-align center
          background-color #cccccc
          position relative
          font-size 0
          &::before
            content ''
            display inline-block
            position absolute
            width 0
            height 0
            left 0
            border-top 20px solid transparent
            border-left 20px solid #ffffff
            border-bottom 20px solid transparent
          &::after
            content ''
            display inline-block
            position absolute
            width 0
            height 0
            border-top 20px solid transparent
            border-left 20px solid #cccccc
            border-bottom 20px solid transparent
            z-index 9
            right -20px
          a
            height 40px
            font-size 14px
            line-height 40px
            display inline-block
            position relative
          span
            font-size 28px
            height 40px
            line-height 40px
            color #808080
            display inline-block
            font-weight bold
            vertical-align top
            padding-right 4px
        .active
          background-color #ffa42e
          a
            color #995700
          &::after
            border-left: 20px solid #ffa42e
          span
            color #FFFFFF
</style>
