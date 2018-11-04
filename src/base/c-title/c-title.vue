<template>
  <div class="title-wapper">
    <b class="title">
      <slot name="title">
      </slot>
    </b>
    <b class="phone">
       <slot name="phone"></slot>
    </b>
    <span class="modify">
        <slot name="modify"></slot>
    </span>
    <span class="cancel">
        <slot name="cancel"></slot>
    </span>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/css/variable"
@import "~common/css/mixin"
.title-wapper
  position relative
  height 30px
  line-height 30px
  border-bottom 1px solid #c2c2c2
  margin-bottom 10px
  .title
    display inline-block
    width 110px
    height 30px
    border 1px solid #c2c2c2
    border-bottom none
    text-align center
    font-weight normal
    font-size 12px
    background-color #FFFFFF
    float left
  & > span
    float right
    padding 0 10px
    font-size 12px
    cursor pointer
  .phone
    width 76px
    display inline-block
    float left
    margin-top -7px
    overflow hidden
  .cancel
    color #f50742
  .modify
    color #003dfa
</style>
