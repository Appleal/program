<template>
  <div class="setting-page">
    <div class="setting-page-left">
      <div class="setting-page-left-content">
        <list-table title="账户设置">
          <slot slot="query">
            <div class="setting-user-wrapper">
              <img class="setting-user-sculpture" :src="user.portraitUrl">
              <div class="setting-user-info">
                 <span class="setting-user-infoitem">登录账号: {{user.username}}</span>
                 <span class="setting-user-infoitem">账号ID: {{user.userid}}</span>
                 <router-link class="setting-sculpture-link" :to="{ path:'/setting/sculpture'}">修改头像</router-link>
              </div>
            </div>
          </slot>
          <div class="setting-user-item">
            <div class="setting-user-input-item">
              <span class="setting-user-input-laebl setting-user-input">用户昵称：</span>
              <div class="setting-user-input">
                <el-input v-model="name" placeholder="请输入昵称" size="mini"></el-input>
              </div>
              <span class="setting-user-input-laebl" style="color: #999">对客户展示的昵称，请依据自己身份设置</span>
            </div>
          </div>
          <div class="setting-user-item" style="margin-top: 180px;height: 160px;">
            <div class="setting-user-buttom">
              <div class="setting-user-buttom-item">
                <el-button @click="goBack">返回</el-button>
              </div>
              <div class="setting-user-buttom-item">
                <el-button @click="save" class="setting-user-buttom-save">保存</el-button>
              </div>
            </div>
          </div>
        </list-table>
      </div>
    </div>
    <div class="setting-page-right">
      <message-list ></message-list>
    </div>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import {mapGetters, mapActions} from 'vuex'
import {Button, Input, Message} from 'element-ui'
import messageList from 'base/message-list/message-list'
import listTable from 'base/list-table/list-table'
import {updateConsultant} from 'api/user'
import { updateMyInfo } from 'common/js/im'
import { ERR_SUCCESS } from 'api/config'

export default {
  data () {
    return {
      name: ''
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  created () {
    this.name = this.user.nickName
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    save () {
      const nickName = this.name
      if (!nickName) {
        Message.error('用户昵称不能空')
        return
      }
      const url = this.user.portraitUrl
      updateConsultant({nickName}).then(res => {
        if (res.code === ERR_SUCCESS) {
          this.setUser(Object.assign({}, this.user, {nickName}))
          updateMyInfo(nickName, url, function (error, user) {
            console.log('更新我的名片' + (!error ? '成功' : '失败'))
            console.log(error)
            console.log(user)
            if (!error) {

            }
            Message({
              message: '更新用户资料成功！',
              type: 'success'
            })
          })
        } else {
          Message.error(res.msg)
        }
      }).catch(res => {
        Message.error(res.msg)
      })
    },
    ...mapActions(['setUser'])
  },
  components: {
    [Button.name]: Button,
    [Input.name]: Input,
    messageList,
    listTable
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/css/variable"
@import "~common/css/mixin"

page-init(setting)

.setting-user-wrapper
  width 100%
  font-size 0
  .setting-user-sculpture
    width 80px
    height 80px
    inline-block-top()
  .setting-user-info
    padding 0 17px
    height 80px
    inline-block-top()
    .setting-user-infoitem
      display block
      height 22px
      line-height 22px
      font-size $font-size-sm
      color $color-text
  .setting-sculpture-link
      display block
      margin-top 5px
      color $color-theme
      font-size $font-size-sm
.setting-user-item
  margin 0 17px
  padding 6px 0
  .setting-user-input
    width 240px
    inline-block-top()
  .setting-user-input-laebl
    width 75px
    font-size $font-size-sm
  .setting-user-input-item
    padding 10px 0
    height 30px
    line-height 30px
.setting-user-buttom
  margin-top 80px
  margin-bottom 20px
  margin-left auto
  width 350px
  .setting-user-buttom-item
    margin-left 30px
    width 120px
    inline-block-top()
    button
      width 100%
  .setting-user-buttom-save
    color $color-background
    background-color $color-theme
</style>
