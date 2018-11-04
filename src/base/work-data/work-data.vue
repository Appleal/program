<template>
  <div class="work-data-wrapper">
    <div class="work-data-header">
      <slot name="header"></slot>
    </div>
    <div class="work-data-content">
      <slot></slot>
    </div>
    <div class="work-data-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">

export default {
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/css/variable"
@import "~common/css/mixin"

.work-data-wrapper
  position relative
  width 100%
  height 100%
  background-color $color-mark
  .work-data-header
    padding 16px 20px
    height 12px
    line-height 12px
    font-size $font-size-sm
  .work-data-content
    box-sizing content-box
  .work-data-footer
    box-sizing content-box
    font-size $font-size-lg
</style>
