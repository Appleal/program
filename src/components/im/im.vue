<template>
  <div>
    <audio id="iMAudio" class="im-tip">
      <source src="./tip.mp3" type="audio/mpeg">
    </audio>
  </div>
</template>

<script type="text/ecmascript-6">
import {mapGetters, mapMutations, mapActions} from 'vuex'
import { Message } from 'element-ui'
// readReceiptMessage messageAUidoListener
import {
  init, messageListener, connect, removeRead,
  getConversationList, statusListener
} from 'common/js/im'
import { BASE_ENV } from 'api/config'
import { getKeyArr } from 'common/js/util'
import { msgListInterface } from 'common/js/interface'
import { getAccountRelation } from 'api/user'
import { createdComponents, append } from 'common/js/template'

const COMPONENT_NAME = 'im'

export default {
  name: COMPONENT_NAME,
  data () {
    return {
      loading: false,
      connect: true,
      states: {}
    }
  },
  computed: {
    ...mapGetters(['isLogin', 'config', 'user', 'custom', 'conversationList', 'conversationUserList'])
  },
  created () {
    this.init()
  },
  methods: {
    handlClick () {
      this.loading = true
    },
    init () {
      let appkey = ''
      const {neteaseToken, userid} = this.user
      const that = this
      if (BASE_ENV === 'pro') {
        appkey = 'dcae515da206f2679f5452b0ccdb3056'
      } else {
        appkey = '596472b17aca4ef144bb4a52801d4163'
      }
      const tokenAndUser = {neteaseToken, userid, appkey}
      localStorage.setItem('tokenAndUser', JSON.stringify(tokenAndUser))
      init(appkey)
      statusListener(appkey, neteaseToken, userid, {
        otherCient () {
          Message.warning('该账号已在其他设备登录，请重新登录！')
          this.userOut()
          // 融云A用户登录，获取A的会话列表之后，退出登录之后，B用户登录，获取B的会话列表，
          // A的会话列表和B的会话列表一样, 所以改为reload，不是跳login路由，尴尬
          window.location.reload()
        },
        refresh () {
          if (!that.isLogin) return
          that.imConnectBreak()
          that.refreshTimer && clearTimeout(that.refreshTimer)
          that.refreshTimer = setTimeout(() => {
            that.refresh()
          }, 3000)
        },
        unavailable () {
          Message.error('网络不可用，请刷新页面！')
          if (!that.isLogin) return
          that.imConnectBreak()
          that.refreshTimer && clearTimeout(that.refreshTimer)
          that.refreshTimer = setTimeout(() => {
            that.refresh()
          }, 3000)
        }
      })
      messageListener(appkey, neteaseToken, userid, { // 消息监听
        onMsg: function (msg) {
          that.messageListener(msg)
        },
        onsysmsg: function (msg) {
          let idServer = msg.deletedIdServer
          for (var i = 0; i < window.yjkChatComponents.length; i++) {
            if (window.yjkChatComponents[i].data.allContent) {
              if (window.yjkChatComponents[i].data.allContent['idServer'] === idServer) {
                window.yjkChatComponents[i].withdrawState = false
                that._withdraw()
              }
            }
          }
        },
        onupdatesession: function (msg) {
          console.log('消息被读了')
          console.log(msg)
          // 已读消息
        },
        onPushevents: function (msg) { // 订阅状态变更
          that.states[msg.msgEvents[0].account] = msg.msgEvents[0].value
          const userMessage = that.states
          localStorage.setItem('userMessage', JSON.stringify(userMessage))
        },
        onerror: function (msg) {
          console.log(msg)
        }
      })
      this.imConnecting()
      connect(appkey, neteaseToken, userid).then((request) => {
        console.log('***************')
        this.imConnectSuccess()
        const p1 = new Promise((resolve, reject) => {
          resolve(getConversationList(appkey, neteaseToken, userid)) // 获取会话列表
        }).then(result => result)
        const p2 = new Promise((resolve, reject) => {
          resolve(getAccountRelation({userid})) // 获取顾问客户
        }).then(result => result)
        Promise.all([p1, p2]).then(result => {
          const conversationList = result[0]
          console.log(conversationList)
          const users = result[1].data
          console.log(users)
          let conversations = []
          users.forEach(u => (u.imId = `a${u.id}`))
          for (let i = 0; i < conversationList.length; i++) {
            let cl = conversationList[i]
            cl.content = cl.lastMsg
            let msgItem = msgListInterface(cl.lastMsg)
            let msgUser = getKeyArr(cl.lastMsg.target, 'imId', users) // 通过id去查询匹配数据
            if (msgUser.index > -1) {
              if (msgUser.object.consultDisplayName) {
                msgItem.name = msgUser.object.name + '(' + msgUser.object.consultDisplayName + ')'
              } else {
                msgItem.name = msgUser.object.name
              }
              msgItem.num = conversationList[i].unread
              msgItem.portraitUrl = msgUser.object.portraitUrl || this.config.customPortraitUrl
              conversations.push(msgItem)
            }
          }
          this.setConversationUserList(users)
          this.setConversationList(conversations)
        })
      }).catch((error) => {
        console.log(error)
      })
    },
    titleFlash () {
      document.getElementById('iMAudio').play()
      let m1 = '来消息啦...'
      document.title = m1
      setTimeout(function () {
        document.title = '壹邦'
      }, 4000)
    },
    _withdraw () {
      const yjkChat = document.getElementById('yjkChat')
      let conversation = {
        type: 'tip',
        allContent: {tip: '对方撤回了一条消息'}
      }
      let components = createdComponents(conversation)
      // 存储聊天窗的组件，切换聊天需要清理注册的组件
      window.yjkChatComponents.push(components)
      append(yjkChat, components) // 添加到聊天窗口
    },
    messageListener (e) {
      console.log('你收到了一条新消息')
      console.log(e)
      const {from, time, sessionId, fromNick, file, type, text, content} = e
      const isCustomType = this.$route.params.tid === from && this.$route.name === 'chatwindow' // 判断如果是聊天窗口
      if (from !== this.user.imId) { // 如果是别人发送的消息 就提示
        this.titleFlash()
      }
      let conversationMap = getKeyArr(from, 'id', this.conversationList) // 顾问关系列表
      if (conversationMap.index > -1) { // 如果已经在列表中显示了
        // 存在的消息列表对象中
        let num = conversationMap.object.num + 1
        if (this.$route.params.tid === from && this.$route.name === 'chatwindow') { // 如果是聊天窗口
          num = conversationMap.object.num
          removeRead(sessionId) // 清理未读消息
        }
        const n = Object.assign({}, conversationMap.object, {num, id: from, allContent: e, content: text, objectName: type, lastTime: time, type, fromNick})
        console.log(conversationMap)
        this.setConversationListItem({index: conversationMap.object.index, state: n}) // 插入会话列表
        // setConversationListItem 讲聊天内存插入到右侧聊天列表
      } else {
        // 要插入对象中 会话列表无数据
        // 要插入对象中
        let msgUser = getKeyArr(from, 'imId', this.conversationUserList) // 顾问关系列表
        console.log(msgUser)
        console.log(this.conversationUserList)
        let newConversation = msgListInterface({
          content,
          target: from,
          time,
          file,
          text,
          fromNick,
          type,
          unreadMessageCount: 1
        })
        if (msgUser.index > -1) {
          newConversation.name = msgUser.object.nickName
          newConversation.portraitUrl = msgUser.object.portraitUrl ? msgUser.object.portraitUrl : this.config.customPortraitUrl
          this.addConversationListItem({state: newConversation})
        } else {
          debugger
          const {userid} = this.user
          getAccountRelation({userid}).then(res => {
            let msgUser = getKeyArr(from, 'imId', res.data) // 如果客户关系有这个用户
            let newConversation = msgListInterface({
              content,
              target: from,
              time,
              file,
              text,
              fromNick,
              type,
              unreadMessageCount: 1
            })
            console.log(newConversation)
            console.log('***************')
            console.log(msgUser.object.nickName)
            newConversation.name = msgUser.object.nickName
            newConversation.portraitUrl = msgUser.object.portraitUrl ? msgUser.object.portraitUrl : this.config.customPortraitUrl
            this.addConversationListItem({state: newConversation})
          })
        }
      }
      if (isCustomType) { // 如果是聊天窗口，那么就插入在聊天窗口里面去
        const yjkChat = document.getElementById('yjkChat')
        const yjkChatWindowWrapper = document.getElementById('yjkChatWindowWrapper')
        const me = e.target === this.user.imId
        const portrait = me ? this.getUserPortrait() : this.getCustomPortrait()
        let conversation = {
          allContent: e,
          senderUserId: e.target,
          portrait,
          type,
          file,
          content,
          fromNick,
          text,
          time,
          me
        }
        let components = createdComponents(conversation)
        window.yjkChatComponents.push(components)
        append(yjkChat, components)
        setTimeout(() => {
          if (yjkChatWindowWrapper) {
            yjkChatWindowWrapper.scrollTop = 200000000
          }
        }, 500)
      }
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
    ...mapMutations({setConversationUserList: 'SET_CONVERSATION_USER_LIST'}),
    ...mapActions([
      'imConnecting',
      'imConnectBreak',
      'imConnectSuccess',
      'refresh',
      'setConversation',
      'addConversationListItem',
      'setConversationList',
      'setConversationListItem'
    ])
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/css/variable"
@import "~common/css/mixin"

.im-tip
  position absolute
  opacity 0
  z-index -1
</style>
