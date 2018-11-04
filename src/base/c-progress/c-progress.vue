<template>
  <div class="c-progress" ref="progress"></div>
</template>

<script type="text/ecmascript-6">
import {hasClass, addClass, removeClass} from 'common/js/dom'

const COMPONENT_NAME = 'c-progress'

export default {
  name: COMPONENT_NAME,
  watch: {
    $route (to, from) {
      let progress = this.$refs.progress
      const P_CLASS = 'active'
      if (progress) {
        if (hasClass(progress, P_CLASS)) {
          this.progresser && clearTimeout(this.progresser)
          removeClass(progress, P_CLASS)
          this.progresser = setTimeout(() => {
            addClass(progress, P_CLASS)
          }, 20)
        } else {
          addClass(progress, P_CLASS)
        }
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/css/variable"
@import "~common/css/mixin"

.c-progress
  position fixed
  top 0
  left 0
  width 0
  height 2px
  background-color #fff
  background linear-gradient(left, #8deeee, #40E0D0)
  z-index $zIndex-toast
  &.active
    animation pulse 1s  cubic-bezier(.05,.17,.98,.07)
@keyframes pulse
  0%
    width 0
  100%
    width 100%
</style>
