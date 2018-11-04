<template slot-scope="props">
  <div class="list-table-wrapper">
    <div class="list-table-header">
      <h3 class="list-table-header-title">
        {{title}}
        <slot name="order"></slot>
      </h3>
      <div class="list-table-header-query" v-show="!hideQuery">
        <slot name="query"></slot>
      </div>
    </div>
    <div class="list-table-content">
      <slot></slot>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {Button} from 'element-ui'
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    hideQuery: {
      type: Boolean,
      default: false
    },
    order: {
      type: String,
      default: ''
    }
  },
  components: {
    [Button.name]: Button
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/css/variable"
@import "~common/css/mixin"

.list-table-wrapper
  width 100%
  padding-bottom 20px
  font-size 14px
  background-color $color-background
  bg-box-shadow()
  .list-table-header
    padding 0 15px
    .list-table-header-title
      margin 0
      padding: 6px 0 6px 0;
      height: 40px;
      line-height: 40px;
      color $color-text
      font-size $font-size-md
      &::before
        content ''
        display inline-block
        margin-right 12px
        width 2px
        height 14px
        inline-block-top()
        margin-top 14px
        background-color $color-theme
  .list-table-header-query
    padding 16px 0
    line-height 30px
    color $color-text
    font-size $font-size-sm
    border 1px solid #ccc
    border-left none
    border-right none
</style>
