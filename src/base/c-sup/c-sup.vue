<template>
  <span v-show="num > 0" class="c-sup">{{nums}}</span>
</template>

<script type="text/ecmascript-6">
const COMPONENTS_NAME = 'c-sup'

export default {
  name: COMPONENTS_NAME,
  props: {
    num: {
      type: Number,
      defalut: 0
    }
  },
  computed: {
    nums () {
      if (this.num > 99) return '99+'
      return this.num
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/css/variable"
@import "~common/css/mixin"

.c-sup
  display block
  position absolute
  height 18px
  line-height 18px
  padding 0 6px
  text-align center
  white-space nowrap
  font-size $font-size-sm
  font-family "Helvetica Neue"
  border-radius 10px
  color $color-background
  background-color #f56c6c
</style>
