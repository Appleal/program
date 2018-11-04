<template>
  <h1 class="c-title" @click="goHome">
    <img src="./logo.png" alt="壹邦互联网平台" class="c-logo" :class="{md:type ==='md'}">
  </h1>
</template>

<script type="text/ecmascript-6">
const COMPONENTS_NAME = 'c-logo'

export default {
  name: COMPONENTS_NAME,
  props: {
    type: {
      type: String,
      defalut: 'sm'
    }
  },
  methods: {
    goHome () {
      this.$router.push({ path: '/custom' })
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/css/variable"
@import "~common/css/mixin"

.c-title
  margin 0
  padding 0
  width 136px
  height 40px
  line-height 40px
  color $color-background
  text-align center
  cursor pointer
  inline-block-top()
  margin-top 5px
  .c-logo
    width 77px
    height 30px
    inline-block-top(middle)
    &.md
      max-width 100%
      max-height 100%
</style>
