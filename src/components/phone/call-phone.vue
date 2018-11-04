<template>
  <div>
  <div class="phone-wrapper" v-if="telephone.type">
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
            <div v-show="call.name !== ''">
                <span>{{name}}</span>
            </div>
            <span>{{phoneText}}</span>
          </span>
        </div>
      </div>
      <div class="phone-item-footer">
        <el-button size="mini" type="primary" @click="connectPhone()" v-if="type === 'incoming'">接听</el-button>
        <el-button size="mini" type="danger" @click="deletePhone(callsSenderUserId)">挂断</el-button>
      </div>
    </div>
  </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { Button } from 'element-ui'
import {mapGetters, mapActions} from 'vuex'
import { getAppUserInfo } from 'api/placeOrder'
import { getPhoneTime, getKeyArr } from 'common/js/util'
import { sendCallTimeMessage, callListener, callPlay } from 'common/js/im'
import { createdComponents, append } from 'common/js/template'
const COMPONENT_NAME = 'phone'

export default {
  name: COMPONENT_NAME,
  data () {
    return {
      type: '',
      name: '',
      time: '',
      phoneText: '',
      callsSenderUserId: '',
      callName: ''
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
    ...mapGetters(['call', 'user', 'telephone', 'callPhone', 'custom', 'config', 'conversationList'])
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      const that = this
      callListener({
        InviteMessage: function (e) { // 电话呼入
          that.callsSenderUserId = e.senderUserId
          getAppUserInfo({
            userid: e.senderUserId.substring(1, e.senderUserId.length)
          }).then((res) => {
            that.setTelephone({
              userid: e.senderUserId,
              userName: res.data.name,
              type: 'incoming'
            })
            that.name = res.data.name
          })
        },
        HungupMessage: function (e) { // 挂断通话
          const RongIMLib = window.RongIMLib
          let config = {
            // 发起音视频超时时间, 默认 15000 毫秒
            timeout: 15000,
            RongIMLib: RongIMLib
          }
          let RongCallLib = window.RongCallLib.init(config)
          let params = {
            conversationType: RongIMLib.ConversationType.PRIVATE,
            targetId: e.senderUserId
          }
          RongCallLib.hungup(params)
          that.closeCall()
        },
        AcceptMessage: function (e) { // 电话呼出接通
          that._getTelephoneStatus()
        },
        SummaryMessage: function (e) { // 电话呼出结束
          that.closeCall()
        }
      })
    },
    phoneTimer () {
      this.phoneTimeId = setTimeout(() => {
        this._getTelephoneStatus()
      }, 1000)
    },
    _getTelephoneStatus (num) {
      if (!this.time) {
        this.time = new Date()
      }
      this.type = 'calling'
      this.phoneText = `正在通话中 ${getPhoneTime(this.time)}`
      this.name = this.telephone.userName
      this.phoneTimer()
    },
    deletePhone (id) {
      const RongIMLib = window.RongIMLib
      let config = {
        // 发起音视频超时时间, 默认 15000 毫秒
        timeout: 15000,
        RongIMLib: RongIMLib
      }
      let RongCallLib = window.RongCallLib.init(config)
      let params = {
        conversationType: RongIMLib.ConversationType.PRIVATE,
        targetId: this.telephone.userid
      }
      RongCallLib.hungup(params)
      this.closeCall()
    },
    connectPhone () {
      const RongIMLib = window.RongIMLib
      let config = {
        // 发起音视频超时时间, 默认 15000 毫秒
        timeout: 15000,
        RongIMLib: RongIMLib
      }
      let RongCallLib = window.RongCallLib.init(config)
      const CallType = RongIMLib.VoIPMediaType
      var params = {
        conversationType: RongIMLib.ConversationType.PRIVATE,
        targetId: this.callsSenderUserId,
        mediaType: CallType.MEDIA_AUDIO
      }
      RongCallLib.accept(params)
      this._getTelephoneStatus(1)
    },
    closeCall () {
      if (this.telephone.type) {
        let senderUserId
        let Me = true
        if (this.time && this.telephone.userid) {
          const talkTime = `通话时长 ${getPhoneTime(this.time)}`
          if (this.telephone.type === 'incoming') {
            senderUserId = this.telephone.userid
            Me = false
          } else {
            senderUserId = this.user.imId
            Me = true
          }
          this.setIm(senderUserId, talkTime, Me)
          this.phoneTimeId && clearTimeout(this.phoneTimeId)
        }
        this.setTelephone({})
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
      const userid = this.telephone.userid
      const { getUserPortrait, conversationList, setConversationListItem, getCustomPortrait } = this
      const content = {
        senderUserId, talkTime
      }
      sendCallTimeMessage(userid, {
        content
      }, () => {
        const objectName = 'app:callTimeMessage'
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
      'setTelephone',
      'setUser',
      'setConversationListItem'
    ])
  },
  watch: {
    telephone () {
      if (this.telephone.type) {
        if (this.telephone.type === 'incoming') {
          this.type = 'incoming'
          this.phoneText = '正在拨打您的电话...'
        } else {
          this.type = 'outgoing'
          this.name = this.telephone.userName
          this.phoneText = '等待对方接听...'
          callPlay(this.telephone.userid) // 发送语音聊天
        }
        // this.phoneTimer()
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
