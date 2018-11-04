<template>
  <div class="chat-upload-wrapper">
    <slot></slot>
    <input type="file" class="upload" id="upload" @change="upload($event)">
  </div>
</template>

<script type="text/ecmascript-6">
import {mapGetters, mapActions} from 'vuex'
import { Message } from 'element-ui'
import { getKeyArr, convertImgToBase64 } from 'common/js/util'
import { sendImage } from 'common/js/im'
import { getMessageType, MESSAGE_TYPE } from 'common/js/imConfig'
import { createdComponents, append } from 'common/js/template'
import { BASE_ENV } from 'api/config'
const COMPONENTS_NAME = 'chat-upload'

export default {
  name: COMPONENTS_NAME,
  props: {
    tid: {
      type: String
    }
  },
  computed: {
    ...mapGetters(['user', 'config', 'conversationList'])
  },
  methods: {
    upload (event) {
      let appkey = ''
      const {neteaseToken, userid} = this.user
      if (BASE_ENV === 'pro') {
        appkey = 'dcae515da206f2679f5452b0ccdb3056'
      } else {
        appkey = '596472b17aca4ef144bb4a52801d4163'
      }
      const {
        tid, getUserPortrait, conversationList, getCustomPortrait,
        setConversationListItem, addConversationListItem, getCustomName
      } = this
      if (tid === null || tid === undefined) return
      const files = event.target.files
      const file = files[0]
      event.target.value = ''
      if (!file) return
      const reg = /.(gif|png|jpg|jpeg|bmp)$/gi
      if (!reg.test(file.name)) {
        Message.error('请选择图片！')
        return
      }
      if (file.size >= 6100 * 1024) {
        Message.error('请选择图片不得超过 6M！')
        return
      }
      const r = new FileReader()
      const that = this
      r.onload = function () {
        convertImgToBase64(r.result).then(imageUrl => {
          const {objectName, type} = getMessageType(MESSAGE_TYPE[1])
          const lastTime = new Date().getTime()
          const _content = r.result
          sendImage(tid, neteaseToken, appkey, `c${userid}`, {
            base64Str: imageUrl,
            id: file
          }, (error, list) => {
            if (error) {
              Message.error('检测到，该用户尚未下载 或 尚未成功登录过壹邦APP，发送失败')
              return false
            }
            let conversationMap = getKeyArr(tid, 'id', conversationList)
            const n = Object.assign({}, conversationMap.object, {content: _content, objectName, time: lastTime, id: tid})
            if (conversationMap.index > -1) {
              setConversationListItem({index: conversationMap.object.index, state: n})
            } else {
              n.name = getCustomName()
              n.portraitUrl = getCustomPortrait()
              addConversationListItem({ state: n })
            }
            const yjkChat = document.getElementById('yjkChat')
            let conversation = {
              allContent: list,
              portrait: getUserPortrait(),
              file: _content,
              objectName,
              type,
              text: _content,
              time: lastTime,
              me: true
            }
            let components = createdComponents(conversation)
            // 存储聊天窗的组件，切换聊天需要清理注册的组件
            window.yjkChatComponents.push(components)
            append(yjkChat, components) // 添加到聊天窗口
          })
        })
        that.$emit('push')
      }
      r.readAsDataURL(file)
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
    getCustomName () {
      if (this.custom.name) {
        return this.custom.name
      }
      return this.tid
    },
    ...mapActions([
      'setConversationListItem',
      'addConversationListItem'
    ])
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/css/variable"
@import "~common/css/mixin"

.upload
  position absolute
  top 0
  left 0
  right 0
  bottom 0
  z-index 10
  cursor pointer
  opacity 0
</style>
