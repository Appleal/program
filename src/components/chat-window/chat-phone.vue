<template>
  <div title="拨通电话" class="chat-custom-phone" @click="handleClick('phone')">
    <span class="icon-phone"></span>
  </div>
</template>

<script type="text/ecmascript-6">
import {mapGetters, mapActions} from 'vuex'
import { Message } from 'element-ui'
import { telephoneCall } from 'common/js/phone'
import { getAppMobile } from 'api/user'
import { ERR_SUCCESS } from 'api/config'

const COMPONENTS_NAME = 'chat-phone'

export default {
  name: COMPONENTS_NAME,
  props: {
    userid: ''
  },
  computed: {
    ...mapGetters(['call', 'user'])
  },
  methods: {
    handleClick () {
      const userid = this.userid
      const { callerid, extension, serverIp } = this.user
      getAppMobile({ userid }).then(res => {
        if (res.code === ERR_SUCCESS) {
          // res.data.appUserMobile = '18320008573'
          const extensionDst = res.data.appUserMobile
          telephoneCall({ serverIp, extension, extensionDst, callerid }).then(res => {
            if (res.result === '1') {
              this.setCall({
                userid: `a${userid}`,
                type: 'outgoing',
                phone: extensionDst
              })
            }
          })
        } else {
          Message.error('呼叫失败！')
        }
      })
    },
    ...mapActions([
      'setCall'
    ])
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/css/variable"
@import "~common/css/mixin"

.chat-custom-phone
  position absolute
  top 0
  right 0
  height 46px
  width 46px
  line-height 46px
  text-align center
  cursor pointer
  &:hover
    background-color $color-mark
  &:active
    background-color #dcdcdc
</style>
