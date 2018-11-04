<template>
  <div class="phone-wrapper" v-if="call.type">
    <div class="phone-item">
      <div class="phone-item-header">
        <span class="phone-item-icon icon-iphone"></span>
        <span class="phone-item-title">{{phoneTitle(type)}}</span>
        <span class="phone-item-icon icon-close" @click="deletePhone()"></span>
      </div>
      <div class="phone-item-content">
        <span class="phone-content-icon" :class="phoneTypeClass"></span>
        <div class="phone-text-wrapper">
          <span class="phone-text">
            <!--<div v-show="call.name !== ''">-->
            <div>
                <span>{{name}}</span>
            </div>
            <span>{{phoneText}}</span>
          </span>
        </div>
      </div>
      <div class="phone-item-footer">
        <el-button size="mini" type="danger" @click="deletePhone(call)">挂断</el-button>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { Button } from 'element-ui'
import {mapGetters, mapActions} from 'vuex'
import { telephonePush, getTelephoneStatus, deleteTelephone } from 'common/js/phone'
import { ERR_SUCCESS } from 'api/config'
import { getTciInfo, getAppUserInfoByMobile } from 'api/user'
import { getPhoneStr, getPhoneTime, getKeyArr } from 'common/js/util'
import { sendTalkTimeMessage } from 'common/js/im'
import { createdComponents, append } from 'common/js/template'

const COMPONENT_NAME = 'phone'

export default {
  name: COMPONENT_NAME,
  data () {
    return {
      type: '',
      name: '',
      time: '',
      phoneText: ''
    }
  },
  computed: {
    phoneTypeClass () {
      const type = this.type
      if (type === 'incoming') {
        return 'icon-callerId'
      } else if (type === 'outgoing') {
        return 'icon-ninicall'
      } else {
        return 'icon-voice'
      }
    },
    ...mapGetters(['call', 'user', 'callPhone', 'config', 'conversationList'])
  },
  created () {
    const { getPhoneCallBack } = this
    getTciInfo().then(res => {
      // res.data.Extension = '13932'
      // res.data.phone = '22204044'
      // res.data.Serverip = '172.16.90.214'
      const extension = res.data.Extension
      const callerid = res.data.phone
      const serverIp = res.data.Serverip
      telephonePush(extension, serverIp, getPhoneCallBack)
      this.setUser(Object.assign({}, this.user, {
        extension, callerid, serverIp
      }))
    })
  },
  methods: {
    getPhoneCallBack (str) {
      let phoneObj = getPhoneStr(str)
      const { Callerid } = phoneObj // 被叫号码
      getAppUserInfoByMobile({ mobile: Callerid }).then(res => {
        if (res.code === ERR_SUCCESS) {
          // const { name, id } = res.data
          const { id } = res.data
          this.setCall({
            userid: `a${id}`,
            phone: Callerid,
            type: 'incoming'
          })
          // this.name = `${name}(${id})`
          this.name = this.call.userName
          this.$router.push({name: 'chatwindow', params: {tid: `a${id}`}})
        } else {
          this.setCall({
            userid: '',
            phone: Callerid,
            type: 'incoming'
          })
          // this.name = '(未知客户)'
          this.name = this.call.userName
        }
      })
    },
    phoneTimer () {
      this.phoneTimeId = setTimeout(() => {
        this._getTelephoneStatus()
      }, 1000)
    },
    _getTelephoneStatus () {
      const {serverIp, extension} = this.user
      getTelephoneStatus({ extension, serverIp }).then(res => {
        const d = res.data
        // -1不存在 0空闲 1通话中 2忙 4未注册 8振铃中 16保持中
        if (d === '0') {
          this.closeCall()
          return
        } else if (d === '1') {
          if (!this.time) {
            this.time = new Date()
          }
          this.type = 'calling'
          this.phoneText = `正在通话中 ${getPhoneTime(this.time)}`
          this.name = this.call.userName
        }
        this.phoneTimer()
      })
    },
    deletePhone () {
      const {serverIp, extension} = this.user
      deleteTelephone({serverIp, extension})
      this.closeCall()
    },
    closeCall () {
      if (this.call.type) {
        let senderUserId
        let Me = true
        if (this.time && this.call.userid) {
          const talkTime = `通话时长 ${getPhoneTime(this.time)}`
          if (this.call.type === 'incoming') {
            senderUserId = this.call.userid
            Me = false
          } else {
            senderUserId = this.user.imId
            Me = true
          }
          // this.setIm(senderUserId, talkTime, Me)
          console.log(`${senderUserId}${talkTime}${Me}`)
          this.phoneTimeId && clearTimeout(this.phoneTimeId)
        }
        this.setCall({})
        this.time = null
      }
    },
    phoneTitle (n) {
      switch (n) {
        case 'incoming': // 来电
          return '来电提醒'
        case 'outgoing': // 去电
          return '去电显示'
        case 'calling': // 通话中
          return '正在通话'
      }
    },
    setIm (senderUserId, talkTime, Me) {
      const userid = this.call.userid
      const { getUserPortrait, conversationList, setConversationListItem, getCustomPortrait } = this
      const content = {
        senderUserId, talkTime
      }
      sendTalkTimeMessage(userid, {
        content
      }, () => {
        const objectName = 'app:talkTimeMessage'
        const lastTime = new Date().getTime()
        // 存储聊天窗的组件，切换聊天需要清理注册的组件
        if (this.$route.params.tid === userid && this.$route.name === 'chatwindow') {
          const yjkChat = document.getElementById('yjkChat')
          let conversation = {
            senderUserId,
            portrait: Me ? getUserPortrait() : getCustomPortrait(),
            objectName,
            content: {
              message: {
                content,
                objectName
              },
              messageName: 'UnknownMessage'
            },
            sentTime: lastTime
          }
          let components = createdComponents(conversation)
          append(yjkChat, components)
          window.yjkChatComponents.push(components)
        }
        let conversationMap = getKeyArr(userid, 'id', conversationList)
        const n = Object.assign({}, conversationMap.object, {content, objectName, lastTime, id: userid})
        if (conversationMap.index > -1) {
          setConversationListItem({index: conversationMap.object.index, state: n})
        }
      })
    },
    getUserPortrait () {
      if (this.user.portraitUrl) {
        return this.user.portraitUrl
      }
      return this.config.userPortraitUrl
    },
    getCustomPortrait () {
      if (this.custom.portraitUrl) {
        return this.custom.portraitUrl
      }
      return this.config.customPortraitUrl
    },
    ...mapActions([
      'setCall',
      'setUser',
      'setConversationListItem'
    ])
  },
  watch: {
    call () {
      if (this.call.type) {
        if (this.call.type === 'incoming') {
          this.type = 'incoming'
          this.phoneText = '正在拨打您的电话...'
        } else {
          this.type = 'outgoing'
          this.name = this.call.userName
          this.phoneText = '等待对方接听...'
        }
        this.phoneTimer()
      }
    }
  },
  components: {
    [Button.name]: Button
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/css/variable"
@import "~common/css/mixin"

.phone-wrapper
  position fixed
  bottom 20px
  right 20px
  z-index $zIndex-toast
  .phone-item
    position absolute
    bottom 0
    right 0
    width 300px
    height 180px
    background-color #2972cc
    box-shadow 0 0 15px 0 rgba(0, 0, 0, 0.5)
  .phone-item-header
    position relative
    height 35px
    line-height 35px
    font-size $font-size-md
    color $color-background
    .phone-item-icon
      width 35px
      height 35px
      line-height 35px
      inline-block-top()
      cursor pointer
      text-align center
      &.icon-close
        position absolute
        right 0px
        &:hover
          background-color rgba(0,0,0,0.2)
        &:active
          background-color rgba(0,0,0,0.4)
  .phone-item-content
    margin 0 auto
    width 200px
    height 105px
    .phone-content-icon
      margin-right 10px
      width 80px
      height 105px
      line-height 105px
      text-align center
      font-size 55px
      color #fff
    .phone-text-wrapper
      position relative
      width 110px
      height 105px
      overflow hidden
      inline-block-top()
      .phone-text
        position absolute
        top 50%
        left 0
        width 110px
        line-height 24px
        font-size $font-size-sm
        transform translateY(-50%)
        color $color-background
  .phone-item-footer
    width 100%
    height 40px
    line-height 40px
    text-align center
    background-color #a9c7eb
    & >>> button
      width 88px
</style>
