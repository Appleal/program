<template>
  <div class="custom-follow-dialog">
    <div class="follow-header">
      <c-title>
        <p slot="title">跟进记录</p>
        <div slot="phone" style="float: left;position: relative;width: 61px;height: 33px;margin-top: 0px;overflow: hidden;">
          <chat-phone :userid="userId" :userName="userName" v-if="userId"></chat-phone>
        </div>
        <span slot="modify"  class="follow-add-button" @click="add">新增记录</span>
      </c-title>
    </div>
    <div class="follow-content">
      <c-scroll :data="followData" style="padding-right: 10px">
        <h3 class="follow-null" v-if="followData.length === 0 && !addType">
          <c-loading size="30px" v-if="isLoading"></c-loading>
          <span v-else>无任何跟进记录！</span>
        </h3>
        <div v-if="addType">
          <div class="follow-item" style="background-color: #d9e3f1;" >
            <span class="follow-item-date">{{addFollow.createTime}}</span>
            <span class="follow-item-username">记录人：{{addFollow.consulantName}}</span>
            <el-input
              class="custom-flow-input"
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 6}"
              placeholder="请输入记录内容..."
              :maxlength="500"
              v-model="addFollow.content">
            </el-input>
            <div class="flow-text-tip">
              <strong>{{addFollow.content.length}} </strong>/ 500
            </div>
          </div>
          <div class="flow-button-wrapper">
            <span class="flow-button-close" @click="cancel">取消</span>
            <span class="flow-button-save" @click="saveFollow">保存</span>
          </div>
        </div>
        <div class="follow-item" v-for="follow in followData" :key="follow.id">
          <span class="follow-item-date">{{follow.createTime}}</span>
          <span class="follow-item-username">记录人：{{follow.consulantName}}</span>
          <p class="follow-item-content" v-html="textFormt(follow.content)"></p>
        </div>
      </c-scroll>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
import { Message, Input } from 'element-ui'
import cLoading from 'base/c-loading/c-loading'
import cScroll from 'base/c-scroll/c-scroll'
import cTitle from 'base/c-title/c-title'
import chatPhone from 'components/chat-window/chat-phone'
import { ERR_SUCCESS } from 'api/config'
import { getAppUserFollow, addAppUserFollow } from 'api/followup'
import { isNull, format } from 'common/js/util'

export default {
  data () {
    return {
      userId: '',
      userName: '',
      addType: false,
      isLoading: true,
      followData: [],
      addFollow: {}
    }
  },
  created () {
    this.$nextTick(() => {
      const {tid, type, userName} = this.$route.query
      if (isNull(tid)) return
      if (type === 'fa') {
        this.add()
      }
      this.tid = tid
      this.userId = tid
      this.userName = userName
      this._getAppUserFollow(tid)
    })
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    textFormt (e) {
      if (e.indexOf('\n') > -1) {
        const contents = e.split('\n')
        let newContents = []
        for (let c of contents) {
          newContents.push(c)
        }
        return newContents.join('<br/>')
      }
      return e
    },
    add () {
      if (this.addType) return
      this.addType = true
      const {nickName} = this.user
      this.addFollow = {
        id: Math.floor(Math.random() * 1000),
        createTime: format(new Date(), '$1-$2-$3 $4:$5:$6'),
        consulantName: nickName,
        content: ''
      }
    },
    cancel () {
      this.addType = false
    },
    saveFollow () {
      const content = this.addFollow.content
      if (isNull(content)) {
        Message.error('请输入跟进信息！')
        return
      }
      this.addType = false
      this._addAppUserFollow(content)
    },
    _getAppUserFollow (userid) {
      getAppUserFollow({userid}).then(res => {
        if (res.code === ERR_SUCCESS) {
          this.followData = res.data
        } else {
          Message.error(res.msg)
        }
        this.isLoading = false
      })
    },
    _addAppUserFollow (content) {
      const tid = this.tid
      addAppUserFollow({content, userid: tid}).then(res => {
        if (res.code === ERR_SUCCESS) {
          Message({
            message: '新增记录成功！',
            type: 'success'
          })
          this.followData.unshift(this.addFollow)
        } else {
          Message.error(res.msg)
        }
      })
    }
  },
  components: {
    [Input.name]: Input,
    cLoading,
    cScroll,
    chatPhone,
    cTitle
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/css/variable"
@import "~common/css/mixin"

.custom-follow-dialog
  position relative
  width 100%
  height 430px
  overflow-y auto
.follow-header
  margin 0 0 10px 0
  height 35px
  line-height 35px
  position relative
  .follow-add-button
    font-size $font-size-sm
    color $color-theme
    cursor pointer
    inline-block-top()
    &:hover
      color #0e71ec
    &:active
      color #74acf1
.follow-content
  position relative
  width 100%
  height 400px
.follow-item
  position relative
  margin-bottom 10px
  padding 2px 20px
  font-size 0
  background-color $color-mark
  .follow-item-date,.follow-item-username
    width 50%
    height 30px
    line-height 30px
    font-size $font-size-sm
    color #898989
    inline-block-top()
  .follow-item-username
    text-align right
  .follow-item-content
    width 98%
    line-height 20px
    color $color-text
    font-size $font-size-sm
    word-wrap break-word
  .custom-flow-input
    margin 5px 0
.flow-button-wrapper
  margin-top -10px
  width 100%
  height 45px
  line-height 35px
  text-align right
  .flow-button-close,.flow-button-save
    margin-left 10px
    font-size $font-size-md
    inline-block-top(middle)
    cursor pointer
  .flow-button-close
    color #fc7f7f
  .flow-button-save
    color $color-theme
.follow-null
  margin 0 auto
  margin-top 24px
  width 200px
  height 100px
  line-height 100px
  color #999
  font-size 14px
  text-align center
.flow-text-tip
  height 35px
  line-height 35px
  color #333
  font-size 12px
  text-align right
  strong
    color #fc7f7f
</style>
