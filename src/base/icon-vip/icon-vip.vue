<template>
  <div class="icon-vip-wrapper" :style="wrapperStyle">
    <span class="icon-vip" :style="style">
      <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span><span class="path8"></span><span class="path9"></span><span class="path10"></span><span class="path11"></span><span class="path12"></span><span class="path13"></span><span class="path14"></span><span class="path15"></span><span class="path16"></span><span class="path17"></span><span class="path18"></span><span class="path19"></span><span class="path20"></span><span class="path21"></span><span class="path22"></span><span class="path23"></span>
    </span>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    width: {
      type: Number,
      default: 16
    },
    height: {
      type: Number,
      default: 16
    },
    size: {
      type: Number,
      default: 16
    }
  },
  computed: {
    wrapperStyle () {
      return `width: ${this.width}px;height: ${this.height}px;`
    },
    style () {
      return `font-size: ${this.size * 1.6}px`
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/css/variable"
@import "~common/css/mixin"

.icon-vip-wrapper
  position relative
  inline-block-top()
  .icon-vip
    position absolute
    top 50%
    left 50%
    transform translate(-50%,-50%)
</style>
