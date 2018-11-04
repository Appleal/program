<template>
  <div class="chat-window-page">
    <div class="chat-window-page-left">
      <chat-custom
        v-if="chatCustomer.id"
        :chatCustomer="chatCustomer"
        :follow="follow">
      </chat-custom>
    </div>
    <div  class="chat-window-page-content">
      <div class="chat-custom-message">
        <!--v-if="isConnect && chatCustomer.id"-->
        <div class="chat-custom-message-wrapper" v-if="isConnect">
          <div class="chat-custom-message-header">
            <div class="loginState">
                <!--<span class="red" v-if="loginStates === 2"></span>-->
                <!--&lt;!&ndash;没有登录过的用户 显示xx&ndash;&gt;-->
                <!--<span class="noLogin" v-else-if = "loginStates === 3">x</span>-->
                <!--&lt;!&ndash;在线状态&ndash;&gt;-->
                <!--<span class="greed"></span>-->
            </div>
            <h3 class="chat-custom-title" id="chatCustomTitle">{{chatCustomer.name}}
              <!--如果有用户名-->
              <span v-if="consultState === 0">
                <b v-if="consultDisplayName">({{consultDisplayName}})</b>
              </span>
              <span v-else>
                <el-input v-model="consultDisplayName"  @input="changeAmount" size="mini" style="width: 160px"></el-input>
                <el-button @click="_cancelName" size="mini">取消</el-button>
                <el-button @click="_updateconsultDisplayName(1)" size="mini">保存</el-button>
              </span>
              <span @click="editDisplayName" v-if="consultState === 0" class="editBg">
                <img :src="imgUrl"/>
              </span>
              <span>
              </span>
            </h3>
            <!--<div title="开通专线" class="chat-voice active" v-if="hasSpecial && special" @click="setVoiceDedicated(true)">-->
              <!--<span class="icon-voice"></span>-->
            <!--</div>-->
            <!--<div title="关闭专线" class="chat-voice disabled" v-if="hasSpecial && !special" @click="setVoiceDedicated(false)">-->
              <!--<span class="icon-voiceDis"></span>-->
            <!--</div>-->
            <chat-phone :userid="chatCustomer.id" :userName="chatCustomer.name" v-if="chatCustomer.id"></chat-phone>
          </div>
          <div class="chat-custom-message-content" >
            <chat-content v-if="chatContentInit" :push="push"></chat-content>
          </div>
          <div class="chat-custom-message-footer">
            <div>
              <ul class="chat-custom-message-footer-util">
                <li class="chat-custom-message-footer-item" title="发送表情">
                  <chat-emoji @selectEmoji="selectEmoji">
                    <span class="chat-custom-message-icon icon-emoji"></span>
                  </chat-emoji>
                </li>
                <li class="chat-custom-message-footer-item" title="发送图片">
                  <chat-upload :tid="tid" v-if="tid !== ''" @push="pushMethod">
                    <span class="chat-custom-message-icon icon-pic"></span>
                  </chat-upload>
                </li>
                <li class="chat-custom-message-footer-item" title="消息推送">
                  <chat-reply @selectreply="selectreply">
                    消息推送
                  </chat-reply>
                </li>
                <li class="chat-custom-message-footer-item" title="推送任务" @click="taskOpen" v-if="chatCustomer.id">
                  推送任务
                </li>
                <!--<li class="chat-custom-message-footer-item" title="语音通话">
                  <chat-call-phone :userid="chatCustomer.id" :userName="chatCustomer.name" v-if="chatCustomer.id"></chat-call-phone>
                </li>-->
              </ul>
            </div>
            <div class="element-custom-textarea">
              <el-input type="textarea"
                        :rows="3"
                        :value="sendValue"
                        @input="changeText"
                        @keydown.enter.native="show"
              >
              </el-input>
            </div>
            <el-button class="chat-custom-message-send" type="primary" @click="send">发送(Enter) <span class="text">Ctrl+Enter 换行</span></el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="chat-window-page-right">
      <message-list></message-list>
    </div>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import {mapGetters, mapMutations, mapActions} from 'vuex'
import { Input, Message, Button } from 'element-ui'
import messageList from 'base/message-list/message-list'
import chatCustom from 'base/chat-custom/chat-custom'
import chatPhone from 'components/chat-window/chat-phone'
import chatCallPhone from 'components/chat-window/chat-call-phone'
import chatUpload from 'components/chat-window/chat-upload'
import chatEmoji from 'components/chat-window/chat-emoji'
import chatReply from 'components/chat-window/chat-reply'
import chatContent from 'components/chat-window/chat-content'
// readReceiptMessage
import {
  sendTextMessage, callPlay, removeRead
} from 'common/js/im'
import { createdComponents, append } from 'common/js/template'
import { getMessageType, MESSAGE_TYPE } from 'common/js/imConfig'
import { getKeyArr, isNull } from 'common/js/util'
import { ERR_SUCCESS, BASE_ENV } from 'api/config'
import { getAppUserInfo, updateconsultDisplayName } from 'api/placeOrder'
import { getAppUserFollow } from 'api/followup'
import { getCallDedicatedLine, setCallDedicatedLine } from 'api/user'
const CHATI_CUSTOMER_INIT = {
  nickName: '',
  portraitUrl: '',
  age: '',
  gender: '',
  symptomTypeList: []
}
export default {
  data () {
    return {
      loginStates: 0,
      imgUrl: require('./edits.png'),
      consultDisplayNames: '',
      consultDisplayName: '',
      consultState: 0,
      tid: '',
      callState: false,
      chatContentInit: false,
      emojiPopoverVisible: false,
      emojiList: [],
      chatCustomer: CHATI_CUSTOMER_INIT,
      scaleList: {},
      follow: [],
      text: '',
      hasSpecial: false,
      special: true,
      push: 0
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.chatWindowInit()
    })
  },
  computed: {
    sendValue () {
      if (window.RongIMLib && this.text) {
        return window.RongIMLib.RongIMEmoji.emojiToSymbol(this.text)
      }
      return this.text
    },
    ...mapGetters(['isConnect', 'config', 'user', 'conversationList'])
  },
  methods: {
    pushMethod () {
      setTimeout(() => {
        this.push = this.push + 1
      }, 500)
    },
    editDisplayName () {
      this.consultState = 1
      this.editDisplayNames = this.editDisplayName
    },
    changeAmount (e) {
      setTimeout(() => {
        this.consultDisplayName = e.substring(0, 30)
      }, 20)
    },
    _updateconsultDisplayName () {
      const {tid, consultDisplayName} = this
      updateconsultDisplayName({id: tid.substr(1), consultDisplayName: consultDisplayName}).then((res) => {
        if (res.code === ERR_SUCCESS) {
          Message.success('修改成功')
          this.consultState = 0
          this.consultDisplayName = res.data.consultDisplayName
          this.newName = this.chatCustomer.name + `(${res.data.consultDisplayName})`
          let conversationMap = getKeyArr(this.tid, 'id', this.conversationList)
          const n = Object.assign({}, conversationMap.object, {name: this.chatCustomer.name + `(${this.consultDisplayName})`, id: this.tid})
          if (conversationMap.index > -1) {
            this.setConversationListItem({index: conversationMap.object.index, state: n}) // 响应消息列表
          } else {}
        } else {
          Message.error('保存失败')
        }
      })
    },
    _cancelName () {
      this.consultState = 0
    },
    pushCall () {
      // if (!this.isConnect) return
      if (this.tid === null || this.tid === undefined) return
      callPlay(this.tid)
    },
    chatWindowInit () {
      const {tid} = this.$route.params
      if (tid === null || tid === undefined) {
        if (this.$route.path === '/chatwindow') {
          this.$router.push({path: 'home'})
        }
        return
      }
      this.tid = tid
      this.text = ''
      this.hasSpecial = false
      this._getAppUserInfo(tid)
      this._getAppUserFollow(tid)
      this._getCallDedicatedLine(tid)
      this._getuserMessage()
      for (let i = 0; i < this.conversationList.length; i++) {
        let cl = this.conversationList[i]
        if (cl.id === tid) {
          this.senderPortrait = cl.portraitUrl
          if (cl.num > 0) {
            removeRead(`p2p-${tid}`) // 清理未读消息
            const n = Object.assign({}, cl, {num: 0})
            this.setConversationListItem({index: i, state: n})
          }
          return
        }
      }
    },
    _getuserMessage () {
      let userMessage = localStorage.getItem('userMessage')
      let user = JSON.parse(userMessage)
      for (var key in user) {
        if (key === this.tid) { // 如果对象中有这个ID 那么值注册的账户
          // if (user[key] = 2) {
          // this.loginStates = 2 // 下线
          // } else {
          // this.loginStates = 1 // 在线
          // }
          // } else {
          // this.loginStates = 3
        }
      }
    },
    changeText (q) {
      this.text = q
    },
    show (event) {
      if (event.keyCode === 13 && !event.ctrlKey) { // 如果只用了 enter键
        event.returnValue = false
        this.send()
      } else if (event.keyCode === 13 && event.ctrlKey) {
        this.text += '\n'
      }
    },
    handleClick (type) {
      switch (type) {
        case 'phone':
          break
        default:
          break
      }
    },
    send () {
      // console.log(this.text)
      // if (!this.isConnect) return
      const reg = /^[ ]+$/
      const re = new RegExp(reg)
      const v = this.text
      if (this.tid === null || this.tid === undefined) return
      if (this.text === '') {
        Message.error('请输入发送内容！')
        return
      }
      if (re.test(this.text)) {
        Message.error('发送内容不能为空！')
        this.text = ''
        return
      }
      let appkey = ''
      const {neteaseToken, userid} = this.user
      if (BASE_ENV === 'pro') {
        appkey = 'dcae515da206f2679f5452b0ccdb3056'
      } else {
        appkey = '596472b17aca4ef144bb4a52801d4163'
      }
      // if (!this.isConnect) return
      if (this.tid === null || this.tid === undefined) return
      sendTextMessage(this.tid, neteaseToken, appkey, `c${userid}`, {
        content: v,
        extra: ''
      }, (e, index, list) => {
        if (e) {
          Message.error('检测到，该用户尚未下载 或 尚未成功登录过壹邦APP，发送失败')
          return
        }
        this.sendIm(0, v, list)
        this.push = this.push + 1
        this.text = ''
      })
    },
    sendIm (index, _content, list) {
      const {objectName, type} = getMessageType(MESSAGE_TYPE[index])
      let conversationMap = getKeyArr(this.tid, 'id', this.conversationList)
      const content = _content
      const lastTime = new Date().getTime()
      const yjkChat = document.getElementById('yjkChat')
      let conversation = {
        portrait: this.getUserPortrait(),
        allContent: list,
        objectName,
        type,
        text: _content,
        time: lastTime,
        me: true
      }
      let components = createdComponents(conversation)
      // 存储聊天窗的组件，切换聊天需要清理注册的组件
      window.yjkChatComponents.push(components)
      append(yjkChat, components)
      const n = Object.assign({}, conversationMap.object, {content, objectName, lastTime, id: this.tid})
      if (conversationMap.index > -1) {
        this.setConversationListItem({index: conversationMap.object.index, state: n}) // 响应消息列表
      } else {
        // 如果聊天列表未显示
        n.name = this.chatCustomer.nickName
        n.portraitUrl = this.chatCustomer.portraitUrl ? this.chatCustomer.portraitUrl : this.config.customPortraitUrl
        this.addConversationListItem({ state: n })
      }
    },
    selectEmoji (emoji) {
      this.text += emoji
    },
    selectreply (templateContent) {
      let appkey = ''
      const {neteaseToken, userid} = this.user
      if (BASE_ENV === 'pro') {
        appkey = 'dcae515da206f2679f5452b0ccdb3056'
      } else {
        appkey = '596472b17aca4ef144bb4a52801d4163'
      }
      // if (!this.isConnect) return
      if (this.tid === null || this.tid === undefined) return
      sendTextMessage(this.tid, neteaseToken, appkey, `c${userid}`, {
        content: templateContent,
        extra: ''
      }, (e, index, list) => {
        if (e) {
          Message.error('检测到，该用户尚未下载 或 尚未成功登录过壹邦APP，发送失败')
          return
        }
        this.sendIm(0, templateContent, list)
        this.push = this.push + 1
      })
    },
    sendValueChange (q) {
      if (window.RongIMLib) {
        return window.RongIMLib.RongIMEmoji.symbolToEmoji(q)
      }
      return q
    },
    _getAppUserInfo (tid) {
      getAppUserInfo({userid: tid.substr(1)}).then((res) => {
        if (res.code === ERR_SUCCESS) {
          this._dictKeyGetArray(res.data)
          this.chatCustomer = res.data
          this.consultDisplayName = res.data.consultDisplayName
          this.setCustom(this.chatCustomer)
          this.chatContentInit = true
          let conversationMap = getKeyArr(this.tid, 'id', this.conversationList)
          let consultDisplayNamelw = ''
          if (res.data.consultDisplayName) {
            consultDisplayNamelw = `(${res.data.consultDisplayName})`
          }
          const n = Object.assign({}, conversationMap.object, {name: res.data.name + consultDisplayNamelw, id: tid})
          if (conversationMap.index > -1) {
            this.setConversationListItem({index: conversationMap.object.index, state: n}) // 响应消息列表
          } else {}
        } else {
          Message.error(res.msg)
          this.$router.push({path: '/home'})
        }
      })
    },
    _getAppUserFollow (tid) {
      getAppUserFollow({userid: tid.substr(1)}).then((res) => {
        if (res.code === ERR_SUCCESS) {
          this.follow = res.data
        } else {
          Message.error(res.msg)
        }
      })
    },
    _getCallDedicatedLine (tid) {
      getCallDedicatedLine({userid: tid.substr(1)}).then(res => {
        if (res.code === ERR_SUCCESS) {
          this.special = res.data.callable
          this.hasSpecial = true
        } else {
          Message.error(res.msg)
        }
      })
    },
    setVoiceDedicated (e) {
      setCallDedicatedLine({
        userid: this.tid.substr(1),
        callable: !e
      }).then(res => {
        if (res.code === ERR_SUCCESS && res.data.callableResult === 1) {
          this.special = !e
        } else {
          Message.error(res.msg)
        }
      })
    },
    _dictKeyGetArray (chatCustomer) {
      if (isNull(chatCustomer) || isNull(chatCustomer.userTypeList)) return
      let newUserTypeList = []
      let _ll = chatCustomer.userTypeList
      for (let j = 0; j < _ll.length; j++) {
        let _lll = _ll[j]
        if (_lll.id === '已成交客户' && chatCustomer.userType === '已成交客户') {
          newUserTypeList.push(_lll)
        } else if (_lll.id === '新客户' && chatCustomer.userType === '新客户') {
          newUserTypeList.push(_lll)
        } else if (_lll.id !== '新客户' && _lll.id !== '已成交客户') {
          newUserTypeList.push(_lll)
        }
      }
      if (isNull(chatCustomer.portraitUrl)) {
        chatCustomer.portraitUrl = this.config.customPortraitUrl
      }
      chatCustomer.userTypeList = newUserTypeList
      if (isNull(chatCustomer.appDiseaseHistory)) {
        chatCustomer.appDiseaseHistory = {
          allergyHistory: '暂无',
          diseaseHistory: '暂无',
          surgeryHistory: '暂无'
        }
      }
    },
    getUserPortrait () {
      if (this.user.portraitUrl) {
        return this.user.portraitUrl
      }
      return this.config.userPortraitUrl
    },
    taskOpen () {
      const {path} = this.$route
      if (isNull(this.chatCustomer.id)) return
      if (isNull(this.chatCustomer.name)) return
      this.$router.push({path: `${path}/task`, query: {tid: this.chatCustomer.id, name: this.chatCustomer.name}})
    },
    ...mapMutations({ setCustom: 'SET_CUSTOM' }),
    ...mapActions([
      'setConversationListItem',
      'addConversationListItem',
      'setConversationList'
    ])
  },
  watch: {
    $route () {
      const { name } = this.$route
      if (name === 'chatwindow') {
        this.chatContentInit = false
        this.chatWindowInit()
      }
    }
  },
  components: {
    [Button.name]: Button,
    [Input.name]: Input,
    chatUpload,
    chatPhone,
    chatContent,
    chatCustom,
    chatReply,
    chatEmoji,
    chatCallPhone,
    messageList
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/css/variable"
  @import "~common/css/mixin"

  page-init(chat-window)

  .chat-window-page
    .editBg
        width 20px
        height 20px
        display inline-block
        font-size 20px
        img
          max-width 100%
          float left
          margin-top 5px
    .chat-window-page-left
      position absolute
      top 20px
      left 20px
      width 270px
      height auto
      bottom 20px
      background-color $color-background
      z-index $zIndex-brothers
    .chat-window-page-content
      position absolute
      top 20px
      left 20px
      width 75%
      bottom 20px
      box-sizing border-box
  .chat-custom-message
    position absolute
    top 0
    bottom 0
    left 280px
    right 20px
    background-color $color-background
    bg-box-shadow()
    .chat-custom-message-header
      position relative
      width 100%
      background-color $color-background
      border-bottom 1px solid #e6e6e6
      .loginState
        position absolute
        left 0px
        top 0px
        height 40px
        text-align center
        line-height 40px
        width 40px
        span
          margin-top 16px
          width 16px
          height 16px
          display inline-block
          border-radius 50%
         .red
          background-color red
         .green
          background-color green
         .noLogin
          width 16px
          height 16px
          border 2px solid #c2c2c2
          line-height 16px
      .chat-custom-title
        margin 0 auto
        width 90%
        height 46px
        line-height 46px
        font-size $font-size-lg
        text-align center
        no-wrap()
    .chat-custom-message-content
      position absolute
      top 47px
      left 0
      bottom 160px
      width 100%
      background-color $color-background
      border-bottom 1px solid #e6e6e6
      overflow-x hidden
    .chat-custom-message-footer
      position absolute
      left 0
      bottom 0
      width 100%
      height 160px
      background-color $color-background
      .chat-custom-message-footer-util
        margin 0
        padding 0
        width 100%
        height 48px
        line-height 48px
        font-size 0
        float left
      .chat-call-item
        float left
        width 100px
        font-size 12px
      .chat-custom-message-footer-item
        position relative
        padding 15px 14px
        height 18px
        line-height 18px
        font-size $font-size-sm
        color #4d4d4d
        box-sizing content-box
        cursor pointer
        overflow hidden
        inline-block-top()
        &:hover
          color $color-theme
        .chat-custom-message-icon
          font-size 18px
      .chat-custom-message-send
        position absolute
        right 21px
        bottom 10px
        width 120px
        .text
          position absolute
          left -116px
          color #c2c2c2
      .chat-window-header
        width 100%
        height 30px
        line-height 30px
        font-size $font-size-sm
        color #999
        text-align center
      .chat-window-header-loading
        font-size 20px

  .chat-custom-message-wrapper
    position relative
    width 100%
    height 100%
  .chat-voice
    position absolute
    top 0
    right 46px
    height 46px
    width 46px
    line-height 46px
    text-align center
    font-size 19px
    cursor pointer
    &.active
      color #67c23a
    &.disabled
      color #C1CDCD
    &:hover
      background-color $color-mark
    &:active
      background-color #dcdcdc
  .callBox
    cursor pointer
    width 200px
    height 100px
    text-align center
    line-height 100px
    background #ffffff
    z-index 99
    position fixed
    right 0
    bottom 0
</style>
