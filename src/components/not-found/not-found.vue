<template>
  <div class="not-found-page">
    <img src="./404.png" class="not-found">
    <div class="not-found-buttons" @click="goHome">返回首页</div>
  </div>
</template>

<script type="text/ecmascript-6">

const COMPONENT_NAME = 'not-found-page'

export default {
  name: COMPONENT_NAME,
  methods: {
    goHome () {
      this.$router.push({ path: '/home' })
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/css/variable"
@import "~common/css/mixin"

.not-found-page
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  background-color #f6f7f9
  .not-found
    position absolute
    top 0
    left 50%
    margin-top 120px
    margin-left -223px
    width 446px
    height 235px
  .not-found-buttons
    position absolute
    top 0
    left 50%
    margin-top 380px
    margin-left -120px
    width 240px
    height 44px
    line-height 44px
    text-align center
    font-size 18px
    font-weight 400
    color $color-background
    background-color #38a0dd
    transition background-color 400ms
    cursor pointer
    &:hover
      background-color #3191ca
</style>
