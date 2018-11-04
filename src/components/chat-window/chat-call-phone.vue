<template>
  <div title="语音通话" class="chat-custom-phone" @click="handleClick()">
    语音通话
    <!--<span class="icon-phone"></span>-->
    <!--<p>语音电话</p>-->
  </div>
</template>

<script type="text/ecmascript-6">
import {mapGetters, mapActions} from 'vuex'
const COMPONENTS_NAME = 'chat-phone'

export default {
  name: COMPONENTS_NAME,
  props: {
    userid: '',
    userName: ''
  },
  computed: {
    ...mapGetters(['user', 'telephone', 'call'])
  },
  methods: {
    handleClick () {
      const userid = this.userid
      const userName = this.userName
      this.setTelephone({
        userid: `a${userid}`,
        type: 'outgoing',
        userName: userName
      })
    },
    ...mapActions([
      'setTelephone'
    ])
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/css/variable"
@import "~common/css/mixin"

.chat-custom-phone
  /*position absolute*/
  top 0
  right 0
  text-align center
  cursor pointer
  &:hover
    background-color $color-mark
  &:active
    background-color #dcdcdc
</style>
