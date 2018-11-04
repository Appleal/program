<template>
  <c-dialog :title="title" @close="goBack" class="element-dialog">
    <div class="layer-wrapper" :style="layerWrapperStyle">
      <div v-show="index === 0" class="msg-wrapper">
        <div class="msg-content-left">
          <div class="msg-app-wrapper">
            <div class="msg-app-header">
              <div class="msg-app-header-left">
                <span class="el-icon-arrow-left"></span>
              </div>
              <div class="msg-app-header-content">
                {{bmData.customList.length > 0 ? bmData.customList[0].name : ''}}
              </div>
              <div class="msg-app-header-right">
                <span class="icon-phone"></span>
              </div>
            </div>
            <div class="msg-app-content">
              <div>
                <div class="msg-app-user">
                  <img :src="user.portraitUrl" alt="" v-if="user.portraitUrl">
                </div>
                <div class="msg-app-input-content">
                  <div class="msg-app-input-content-body">
                    <span v-if="bmData.msgTitle">{{bmData.msgTitle}}<br/></span>
                    {{bmData.content}}
                  </div>
                </div>
              </div>
            </div>
            <div class="msg-app-footer">
              <div class="msg-app-footer-input"></div>
              <div class="msg-app-footer-icon">
                <span class="icon-emoji"></span>
              </div>
              <div class="msg-app-footer-icon">
                <span class="icon-add"></span>
              </div>
            </div>
          </div>
        </div>
        <div class="msg-content-right">
          <div class="msg-input-item" style="margin-bottom: 0">
            <span class="msg-input-label">
              <strong class="msg-input-strong">*</strong>选择客户：
            </span>
            <div class="msg-input-content" :class="{hasCustom: bmData.custom.length > 30}">
              <el-select v-model="bmData.custom" multiple placeholder="请选择" style="width: 100%;">
                <el-option
                  v-for="c in bmData.customList"
                  :key="c.id"
                  :label="c.name"
                  :value="c.id">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="msg-input-item" style="margin-bottom: 0">
            <div class="msg-input-content" style="margin-left: 100px">
              <div class="msg-input-tpl-item">
                <span class="msg-input-tpl-label">
                  已选择
                  <strong class="msg-input-strong">{{bmData.custom ? bmData.custom.length : 0}}</strong>
                  人
                  </span>
                <span class="msg-input-tpl-button" @click="select('custom')">选择客户</span>
              </div>
            </div>
          </div>
          <div class="msg-input-item">
            <span class="msg-input-label">
              <strong class="msg-input-strong">*</strong>消息标题：
            </span>
            <div class="msg-input-content">
              <el-input v-model="bmData.msgTitle" placeholder="请输入标题"></el-input>
            </div>
          </div>
          <div class="msg-input-item">
            <span class="msg-input-label">
              <strong class="msg-input-strong">*</strong>消息内容：
            </span>
            <div class="msg-input-content">
              <el-input v-model="bmData.content"
                        type="textarea"
                        @input="changeContent"
                        :maxlength="200"
                        :rows="6"
                        placeholder="请输入内容或者选择模板"></el-input>
              <div class="msg-input-tpl-item">
                <span class="msg-input-tpl-label">
                  已输入
                  <strong class="msg-input-strong">{{bmData.content ? bmData.content.length : 0}}</strong>/200
                  字
                  </span>
                <span class="msg-input-tpl-button" @click="select('tpl')">选择模板</span>
              </div>
            </div>
          </div>
          <!--<div class="msg-input-item">-->
            <!--<span class="msg-input-label">-->
              <!--<strong class="msg-input-strong">*</strong>发送时间：-->
            <!--</span>-->
            <!--<div class="msg-input-content">-->
              <!--<div class="msg-input-sender">-->
                <!--<el-radio v-model="bmData.timeType" :label="false">立即发送</el-radio>-->
              <!--</div>-->
              <!--<div class="msg-input-sender">-->
                <!--<el-radio v-model="bmData.timeType" :label="true">定时发送</el-radio>-->
                <!--<el-date-picker-->
                  <!--style="margin-left: 10px;width: 220px;"-->
                  <!--v-model="bmData.sendTime"-->
                  <!--type="datetime"-->
                  <!--class="startdate"-->
                  <!--placeholder="选择日期"-->
                  <!--format="yyyy-MM-dd hh:mm:ss"-->
                  <!--value-format="yyyy-MM-dd hh:mm:ss"-->
                  <!--:picker-options="pickerOptions"-->
                <!--&gt;-->
                <!--</el-date-picker>-->
              <!--</div>-->
            <!--</div>-->
          <!--</div>-->
          <div class="msg-input-item">
            <el-button @click="_sendMsg" style="margin: 20px 10px 0 0;float: right;" class="element-button">发送消息</el-button>
          </div>

        </div>
      </div>
      <div v-show="index === 1" class="custom-wrapper">
        <select-custom @change="selectCustomChange"></select-custom>
      </div>
      <div v-show="index === 2" class="tpl-wrapper">
        <select-message-tpl @change="selectTplChange"></select-message-tpl>
      </div>
    </div>
  </c-dialog>
</template>

<script type="text/ecmascript-6">
import {mapGetters, mapActions} from 'vuex'
import cDialog from 'base/c-dialog/c-dialog'
import { BASE_ENV } from 'api/config'
import { Button, Select, Option, Input, Radio, DatePicker, Message } from 'element-ui'
import selectCustom from 'components/home/select-custom'
import selectMessageTpl from 'components/home/select-message-template'
import { isNull, getKeyArr } from 'common/js/util'
import { sendTextMessage } from 'common/js/im'
import { getMessageType, MESSAGE_TYPE } from 'common/js/imConfig'

export default {
  data () {
    return {
      index: 0,
      title: '消息推送',
      hasCustom: '',
      pickerOptions: {
        disabledDate (time) {
          const nowDate = new Date()
          if (time.getFullYear() > nowDate.getFullYear()) return false
          if (time.getFullYear() === nowDate.getFullYear()) {
            if (time.getMonth() > nowDate.getMonth()) return false
            if (time.getMonth() === nowDate.getMonth()) {
              if (time.getDate() >= nowDate.getDate()) return false
              return true
            }
            return true
          }
          return true
        }
      },
      bmData: {
        timeType: false,
        msgTitle: '',
        custom: [],
        customList: [],
        sendTime: new Date(),
        content: ''
      }
    }
  },
  computed: {
    layerWrapperStyle () {
      if (this.index === 0) return ''
      if (this.index === 1) return 'width: 840px;'
      if (this.index === 2) return ''
    },
    ...mapGetters(['isConnect', 'config', 'user', 'conversationList'])

  },
  methods: {
    _sendMsg () {
      let { msgTitle, customList, content } = this.bmData
      if (customList.length === 0) {
        Message.error('请选择客户！')
        return
      }
      if (isNull(msgTitle)) {
        Message.error('请输入标题！')
        return
      }
      if (isNull(content)) {
        Message.error('请输入内容或者选择模板！')
        return
      }
      content = msgTitle + '\n' + content
      let appkey = ''
      const {neteaseToken, userid} = this.user
      if (BASE_ENV === 'pro') {
        appkey = 'dcae515da206f2679f5452b0ccdb3056'
      } else {
        appkey = '596472b17aca4ef144bb4a52801d4163'
      }
      const sendTime = new Date().getTime()
      for (let custom of customList) {
        sendTextMessage(`a${custom.id}`, neteaseToken, appkey, `c${userid}`, {
          content: content,
          extra: ''
        }, (msgRes) => {
        })
        this.sendMsg(`a${custom.id}`, content, sendTime, custom.name)
      }
      Message({
        showClose: true,
        message: '发送成功！',
        type: 'success'
      })
      this.$router.go(-1)
      this.bmData.msgTitle = ''
      this.bmData.custom = []
      this.bmData.customList = []
      this.bmData.content = ''
    },
    sendMsg (userId, _content, sendTime, nickName) {
      const {objectName} = getMessageType(MESSAGE_TYPE[0])
      let conversationMap = getKeyArr(userId, 'id', this.conversationList)

      const lastTime = new Date().getTime()
      let content = _content
      const n = Object.assign({}, conversationMap.object, {content, objectName, lastTime, id: userId})
      if (conversationMap.index > -1) {
        this.setConversationListItem({index: conversationMap.object.index, state: n})
      } else {
        n.name = nickName
        n.portraitUrl = this.config.customPortraitUrl
        this.addConversationListItem({ state: n })
      }
    },
    changeContent (e) {
      setTimeout(() => {
        if (this.bmData.content.length > 200) {
          const textData = this.bmData.content.substring(0, 200)
          this.bmData.content = textData
        }
      }, 20)
    },
    goBack () {
      this.$router.go(-1)
    },
    changeIndex (index) {
      switch (index) {
        case 0:
          this.index = 0
          this.title = '消息推送'
          break
        case 1:
          this.index = 1
          this.title = '选择用户'
          break
        case 2:
          this.index = 2
          this.title = '选择模板'
          break
        default:
          break
      }
    },
    select (type) {
      switch (type) {
        case 'custom':
          this.changeIndex(1)
          break
        case 'tpl':
          this.changeIndex(2)
          break
        default:
          this.changeIndex(0)
          break
      }
    },
    selectCustomChange (item) {
      console.log(item.length)
      if (item.length === 0) {
        this.bmData.custom = []
        this.bmData.customList = []
        this.changeIndex(0)
        return
      }
      let newCustomList = []
      let newCustom = []
      item.forEach(i => {
        newCustomList.push({
          id: i.aid,
          name: i.aName
        })
        newCustom.push(i.aid)
      })
      this.bmData.customList = newCustomList
      this.bmData.custom = newCustom
      this.changeIndex(0)
    },
    selectTplChange (item) {
      this.bmData.content = item.tempContent
      this.bmData.msgTitle = item.tempTitle
      this.changeIndex(0)
    },
    ...mapActions([
      'setConversationListItem',
      'addConversationListItem',
      'setConversationList'
    ])
  },
  components: {
    [Button.name]: Button,
    [Select.name]: Select,
    [Option.name]: Option,
    [Input.name]: Input,
    [Radio.name]: Radio,
    [DatePicker.name]: DatePicker,
    selectCustom,
    selectMessageTpl,
    cDialog
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/css/variable"
@import "~common/css/mixin"

.layer-wrapper
  width 760px
  height 560px
  box-sizing border-box
  .msg-wrapper
    width 100%
    font-size 0
  .msg-content-left
    padding 12px 24px
    width 260px
    height 250px
    inline-block-top()
  .msg-content-right
    margin-top 12px
    width 440px
    height 250px
    inline-block-top()
    .msg-input-item
      margin-bottom 20px
      width 100%
      font-size 0
    .msg-input-label
      padding 0 10px
      width 80px
      height 35px
      line-height 35px
      font-size $font-size-sm
      color $color-text
      text-align right
      inline-block-top()
    .msg-input-strong
        color #f94848
    .msg-input-content
      width 330px
      inline-block-top()
    .hasCustom
      max-height 125px
      overflow-y auto
      border-bottom  1px solid #c2c2c2
    .msg-input-sender
      height 25px
    .msg-input-tpl-item
      width 100%
    .msg-input-tpl-label
      height 35px
      line-height 35px
      font-size $font-size-sm
      color $color-text
      inline-block-top()
    .msg-input-tpl-button
      float right
      height 35px
      line-height 35px
      font-size $font-size-sm
      color $color-theme
      cursor pointer
      inline-block-top()
      &:hover
        color #0e71ec
      &:active
        color #74acf1
.msg-app-wrapper
  position relative
  padding 0 10px
  width 240px
  height 506px
  background url("./iphone.png") no-repeat
  background-size 100% 100%
  overflow hidden
  .msg-app-header
    margin-top 50px
    width 100%
    height 35px
    line-height 35px
    font-size 0
    .msg-app-header-left,.msg-app-header-content,.msg-app-header-right
      height 35px
      line-height 35px
      font-size $font-size-sm
      color $color-text
      inline-block-top()
    .msg-app-header-left
      padding-left 10px
      width 60px
    .msg-app-header-content
      width 100px
      font-weight 500
      text-align center
    .msg-app-header-right
      padding-right 10px
      width 60px
      text-align right
  .msg-app-content
    position absolute
    top 85px
    left 10px
    right 10px
    padding 10px
    height 340px
    background-color #f5f5f5
    overflow hidden
    .msg-app-user
      width 25px
      height 25px
      background-color #dcdcdc
      border-radius 50%
      overflow hidden
      inline-block-top()
      img
        width 25px
        height 25px
    .msg-app-input-content
      position relative
      padding 0 0 0 8px
      max-width 85%
      font-size $font-size-md
      inline-block-top()
      &::before
        content ''
        display block
        position absolute
        top 10px
        left 0
        width 0
        height 0
        border-top 4px solid transparent
        border-right 8px solid #e6e6e6
        border-bottom 4px solid transparent
      .msg-app-input-content-body
        padding 11px
        border-radius 3px
        font-size $font-size-sm
        background-color #e6e6e6
        word-wrap break-word
  .msg-app-footer
    position absolute
    top 425px
    left 10px
    right 10px
    padding 0 5px
    height 35px
    font-size 0
    background-color #ededf0
    .msg-app-footer-input
      margin 5px 5px 5px 0
      width 175px
      height 25px
      border-radius 5px
      background-color #fff
      inline-block-top()
    .msg-app-footer-icon
      margin 6.5px 0
      width 25px
      height 22px
      line-height 22px
      font-size 22px
      color #898989
      text-align center
      inline-block-top()
</style>
