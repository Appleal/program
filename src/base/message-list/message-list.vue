<template>
  <work-table title="聊天消息" class="message-list-wrapper">
    <div class="message-list-inner">
      <!--<div class="message-list-header" :style="heightStyle" @click="_refresh">-->
        <!--<span class="message-list-header-text">-->
          <!--<c-loading v-show="connectype === 1" size="14" type="spinners"></c-loading>-->
        <!--</span>-->
        <!--<span class="message-list-header-text">-->
          <!--{{messageTitle}}-->
        <!--</span>-->
      <!--</div>-->
      <div class="searchAccountNameListContent">
        <p>{{searchAccountNameList.length}}</p>
        <el-input size="mini" v-model="searchAccount" clearable @input="searchAccountName" style="width: 96%; margin-left: 2%"></el-input>
        <ul v-if="searchAccountNameList.length > 0" class="searchAccountNameList">
          <li v-for="list in searchAccountNameList" :key="list.id" @click="openUrl(list.id)">
            {{list.name}} <span v-if="list.consultDisplayName">({{list.consultDisplayName}})</span>
          </li>
        </ul>
      </div>
      <c-scroll :data="conversationList" class="message-list-scroll" id="msgListScroll">
        <transition-group name="list-complete" tag="ul" class="message-list-content" v-if="conversationList.length > 0">
          <li class="message-list-content-item"
                v-for="(conversation, index) in conversationList"
                :key="conversation.id"
                @click="handleClick(conversation, index)">
            <div class="message-list-content-portrait">
              <img :src="conversation.portraitUrl">
            </div>
            <div class="message-list-content-msg">
              <div class="message-list-content-header">
                <h4 class="message-list-content-name">{{conversation.name}}</h4>
                <span class="message-list-content-lastTime">{{_msgFormat(conversation.lastTime)}}</span>
              </div>
              <div class="message-list-content-body">
                {{conversation}}
                <p class="message-list-content-p" v-html="_clMessageFormat(conversation)"></p>
                <c-sup :num="conversation.num" style="right: 0px; top: -1px;"></c-sup>
              </div>
            </div>
          </li>
        </transition-group>
        <div class='hideImg' :class="{noData: imgShow}">
          <img src="./no-data.png" style="max-width: 100%">
        </div>
      </c-scroll>
    </div>
    </work-table>
</template>

<script type="text/ecmascript-6">
import { mapGetters, mapActions } from 'vuex'
import {Input} from 'element-ui'
import workTable from 'base/work-table/work-table'
import cSup from 'base/c-sup/c-sup'
import { ERR_SUCCESS } from 'api/config'
import cScroll from 'base/c-scroll/c-scroll'
import cLoading from 'base/c-loading/c-loading'
import {msgFormat, clMessageFormat} from 'common/js/util'
import { searchAccountRelation } from 'api/placeOrder'
const COMPONENTS_NAME = 'message-list'

export default {
  name: COMPONENTS_NAME,
  data () {
    return {
      imgShow: false,
      phoneTimeId: '',
      searchAccountNameList: [],
      searchAccount: '',
      searchTime: null,
      searchTimeout: null,
      add: []
    }
  },
  created () {
    this.upDataUser()
  },
  computed: {
    messageTitle () {
      const connectype = this.connectype
      if (connectype === 0) {
        return '已经断开连接'
      } else if (connectype === 1) {
        return '正在连接中'
      }
      return ''
    },
    heightStyle () {
      if (this.isLogin && this.connectype !== 2) {
        return 'height: 45px;'
      }
      return ''
    },
    ...mapGetters(['connectype', 'isLogin', 'isConnect', 'conversationList'])
  },
  updated () {
    this.$nextTick(() => {
      const Scroll = this.$route.query.msgListScroll
      const msgListScroll = document.getElementById('msgListScroll')
      if (Scroll) {
        msgListScroll.scrollTop = Scroll
      } else {
        msgListScroll.scrollTop = 0
      }
      this.upDataUser()
    })
  },
  methods: {
    _msgFormat (e) {
      return msgFormat(e)
    },
    searchAccountName (es) {
      const {searchTime} = this
      if (searchTime) {
        clearTimeout(searchTime)
        this.searchTime = null
      }
      if (es) {
        this.searchTime = setTimeout(e => {
          this._searchAccountRelation(es)
        }, 600)
      } else {
        this.searchAccountNameList = []
      }
    },
    openUrl (e) {
      this.searchAccount = ''
      this.searchAccountNameList = []
      if (e) {
        const msgListScroll = document.getElementById('msgListScroll').scrollTop
        this.$router.push({name: 'chatwindow', params: {tid: `a${e}`}, query: {msgListScroll}})
      }
    },
    _searchAccountRelation (e) {
      searchAccountRelation({keyName: e}).then(res => {
        if (res.code === ERR_SUCCESS) {
          const list = res.data
          if (list.length === 0) {
            this.searchAccountNameList = [{name: '暂无数据'}]
          } else {
            this.searchAccountNameList = res.data
          }
        }
      })
    },
    _clMessageFormat (e) {
      return clMessageFormat(e)
    },
    handleClick (e, index) {
      this.searchAccount = ''
      this.searchAccountNameList = []
      const msgListScroll = document.getElementById('msgListScroll').scrollTop
      this.$router.push({name: 'chatwindow', params: {tid: e.id}, query: {msgListScroll}})
    },
    _refresh () {
      const connectype = this.connectype
      if (connectype === 0) {
        this.refresh()
      }
    },
    upDataUser () {
      // 如果聊天列表为空
      if (!this.isLogin) {
        this.imgShow = false // 隐藏
      } else {
        this.phoneTimeId && clearTimeout(this.phoneTimeId)
        this.phoneTimeId = setTimeout(e => {
          if (this.conversationList.length > 0) {
            this.imgShow = false // 隐藏
          } else {
            this.imgShow = true // 显示
          }
        }, 1000)
      }
    },
    ...mapActions(['refresh'])
  },
  components: {
    workTable,
    [Input.name]: Input,
    cSup,
    cScroll,
    cLoading
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/css/variable"
@import "~common/css/mixin"

.message-list-wrapper
  position relative
  width 100%
  height 100%
  overflow hidden
  .hideImg{
    display none
  }
  .searchAccountNameListContent
    height 40px
    position relative
    .searchAccountNameList
      width 96%
      margin-left 2%
      background: rgba(255,255,255, 0.9)
      position absolute
      overflow hidden
      z-index 99
      min-height 200px
      li
        padding-left 10px
        overflow: hidden;
        cursor pointer
        height 34px
        line-height 34px
        font-size 12px
        display block
        border-bottom 1px solid #c2c2c2
        &:hover
          background-color #f2f2f2
  .noData{
    display block
  }
  .message-list-header-text
    inline-block-top()
  .message-list-inner
    position absolute
    top 42px
    left 0
    bottom 0
    width 100%
  .message-list-scroll
    position relative
    width 100%
    height calc(100% - 40px)
    overflow hidden
  .message-list-content
    margin 0
    padding 0
    background-color $color-home-workData-background
    .message-list-content-item
      position relative
      padding 10px 15px
      height 44px
      line-height 44px
      transition background-color .3s, opacity 1s, transform 1s
      color $color-background
      cursor pointer
      &:hover
        background-color $color-mark
      .message-list-content-portrait
        position absolute
        margin 4px 4px 0 0
        width 36px
        height 36px
        border-radius 50%
        img
          width 36px
          height 36px
          border-radius 50%
          border none
      .message-list-content-msg
        margin-left 45px
        height 44px
      .message-list-content-header
        width 100%
        height 29px
        line-height 29px
        font-size 0
        .message-list-content-name
          margin 0
          padding 0
          width 60%
          font-size $font-size-md
          color $color-text
          no-wrap()
          inline-block-top()
        .message-list-content-lastTime
          width 40%
          font-size $font-size-sm
          color #999
          text-align right
          inline-block-top()
      .message-list-content-body
        position relative
        height 15px
        line-height 15px
        .message-list-content-p
          margin 0
          padding 0
          width 80%
          font-size $font-size-sm
          color #999
          no-wrap()
          inline-block-top()
          & >>> .rong-emoji-content
            transform: scale(0.7);
            transform-origin: 50% 30%;
.list-complete-enter, .list-complete-leave-to,
  opacity 0
  transform translateY(30px)
.list-complete-leave-active
  position absolute
.message-list-header
  width 100%
  height 0
  line-height 45px
  font-size 14px
  background-color #f4d9b2
  color #966b34
  text-align center
  transition height 400ms
  cursor pointer
  overflow hidden
  &:hover
    background-color #e0caaa
  &:active
    background-color #e6cfad
</style>
