<template>
  <div class="chat-text-wrapper">
    <div class="chat-text-time">{{data.allContent.tip}}</div>
  </div>
</template>

<script type="text/ecmascript-6">
import { chatMixin } from 'common/js/mixin'
const COMPONENTS_NAME = 'chat-text'

export default {
  name: COMPONENTS_NAME,
  mixins: [chatMixin],
  data () {
    return {
      withdrawState: true
    }
  },
  methods: {
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/css/variable"
@import "~common/css/mixin"
@import "~common/css/chat"

.change
  width 20px
  height 20px
  border-radius 50%
  text-align center
  line-height 20px
  margin-top 14px
  color #666
  background #fff
  cursor pointer
  margin-left 8px

</style>
