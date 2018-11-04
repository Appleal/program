<template>
  <c-dialog title="电话授权" @close="goBack">
    <div class="custom-authorize-wrapper">
      <span class="custom-authorize-tip">授权规则：</span>
      <span class="custom-authorize-tip">1.每个资料最多只能同时授权给3个人</span>
      <span class="custom-authorize-tip">2.不是资料所有人不能授权客户资料 ，不允许二次授权</span>
      <div class="custom-authorize-item" v-if="customer.aid">
        <span class="custom-authorize-label">客户名称: </span>
        <div class="custom-authorize-username" >
          {{customer.aName}}
        </div>
      </div>
      <div class="custom-authorize-item" v-else>
        <span class="custom-authorize-label"><span style="color:red;">*</span>客户编号: </span>
        <div class="custom-authorize-username">
          <el-input v-model="query.id" placeholder="请输入客户编号" size="small">
          </el-input>
        </div>
        <div class="custom-authorize-button">
          <el-button type="primary" plain size="small"
            :loading="query.loading" @click="queryCustomer">
            查询
          </el-button>
        </div>
      </div>

      <div class="custom-authorize-line"></div>
      <div class="custom-authorize-item" v-for="(a, index) in authorize" :key="index">
        <span class="custom-authorize-label">被授权人{{index+1}}: </span>
        <div class="custom-authorize-content"  v-if="isSelf">
          <div class="custom-authorize-username">
            {{a.name}}
          </div>
        </div>
        <div class="custom-authorize-content" v-else>
          <template  v-if="a.id">
            <div class="custom-authorize-username">
              {{a.name}}
            </div>
            <div class="custom-authorize-button">
              <el-button type="danger" plain size="small"
                :loading="a.loading" @click="authorizeClick(a, index,'unAuthorize')">
                取消授权
              </el-button>
            </div>
          </template>
          <template v-else>
            <div class="custom-authorize-username">
              <el-input v-model="a.consName" placeholder="请输入被授权人的账号" size="small">
              </el-input>
            </div>
            <div class="custom-authorize-button">
              <el-button type="primary" plain size="small"
                :loading="a.loading" @click="authorizeClick(a, index,'authorize')">
                授权
              </el-button>
            </div>
          </template>
        </div>
      </div>
    </div>
  </c-dialog>
</template>

<script type="text/ecmascript-6">
import {mapGetters, mapMutations} from 'vuex'
import {Input, Button, Message} from 'element-ui'
import {isNull} from 'common/js/util'
import cDialog from 'base/c-dialog/c-dialog'
import { ERR_SUCCESS } from 'api/config'
import { appUserAuthorize, appUserUnAuthorize, getAppUserAuthorizeList } from 'api/user'
import { getAppUserInfo, getAppUserInfoByUserNo } from 'api/placeOrder'
export default {
  data () {
    return {
      isSelf: false,
      customer: {},
      authorize: [],
      query: {
        id: '',
        loading: false
      }
    }
  },
  created () {
    this.$nextTick(() => {
      this.init()
    })
  },
  computed: {
    ...mapGetters(['user', 'custom'])
  },
  methods: {
    init () {
      const {aid} = this.custom
      const {tid} = this.$route.query
      if (this.user.userid == aid) { /* eslint-disable-line eqeqeq */
        this.isSelf = true
      }
      if (isNull(tid) || isNull(aid)) return
      this._getAppUserInfo(aid)
    },
    goBack () {
      this.$router.go(-1)
    },
    authorizeClick (a, index, type) {
      if (this.authorize[index].loading) return
      const userid = this.custom.aid
      const consName = a.consName
      if (type === 'authorize') {
        if (isNull(consName)) {
          Message.error('请输入被授权人的账号！')
          return
        }
        this._appUserAuthorize(userid, consName, index)
      } else {
        const id = a.id
        this._appUserUnAuthorize(userid, id, index)
      }
      this.authorize[index].loading = true
    },
    _appUserAuthorize (userid, consName, index) {
      appUserAuthorize({userid, consName}).then((res) => {
        if (res.code === ERR_SUCCESS && res.data && res.data.authorizeResult === 1) {
          this._getAppUserAuthorizeList(userid)
          Message({
            message: '授权成功！',
            type: 'success'
          })
        } else {
          Message.error(res.msg)
        }
        this.authorize[index].loading = false
      })
    },
    _appUserUnAuthorize (userid, id, index) {
      appUserUnAuthorize({id}).then((res) => {
        if (res.code === ERR_SUCCESS) {
          this._getAppUserAuthorizeList(userid)
          Message({
            message: '取消授权成功！',
            type: 'success'
          })
          this.authorize[index].loading = false
        } else {
          Message.error(res.msg)
        }
      })
    },
    _getAppUserAuthorizeList (userid) {
      getAppUserAuthorizeList({userid}).then(res => {
        if (res.code === ERR_SUCCESS) {
          const dominator = res.data
          let _dominator
          if (dominator.length === 0) {
            _dominator = [{loading: false}, {loading: false}, {loading: false}]
          } else if (dominator.length === 1) {
            _dominator = dominator.concat([{loading: false}, {loading: false}])
          } else if (dominator.length === 2) {
            _dominator = dominator.concat([{loading: false}])
          } else {
            dominator.forEach(e => { e.loading = false })
            _dominator = dominator.slice(0, 3)
          }
          this.authorize = _dominator
        } else {
          Message.error(res.msg)
        }
      })
    },
    _getAppUserInfoByUserNo () {
      const userNo = this.query.id
      if (userNo === '') return
      this.query.loading = true
      getAppUserInfoByUserNo({ userNo }).then(res => {
        this.query.loading = false
        if (res.code === ERR_SUCCESS) {
          if (res.data) {
            const userid = res.data.id
            this._getAppUserInfo(userid)
          } else {
            Message.error('不存在客户！')
          }
        } else {
          Message.error('该客户编号存在多个客户！')
        }
      })
    },
    _getAppUserInfo (userid) {
      getAppUserInfo({userid}).then(res => {
        if (res.code === ERR_SUCCESS) {
          let customer = res.data
          customer.aid = customer.id
          customer.aName = customer.name
          this.customer = { aName: customer.name, aid: customer.id }
          this.setCustom(customer)
          this._getAppUserAuthorizeList(userid)
        } else {
          Message.error(res.msg)
        }
        this.query.loading = false
      })
    },
    queryCustomer () {
      const userid = this.query.id
      if (isNull(userid)) {
        Message.error('请输入客户编号！')
        return
      }
      this.query.loading = true
      // this._getAppUserInfo(userid)
      this._getAppUserInfoByUserNo()
    },
    ...mapMutations({ setCustom: 'SET_CUSTOM' })
  },
  components: {
    [Button.name]: Button,
    [Input.name]: Input,
    cDialog
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/css/variable"
@import "~common/css/mixin"

.custom-authorize-wrapper
  width 488px
  height 280px
  box-sizing border-box
  .custom-authorize-tip
    display block
    padding 0 20px
    height 25px
    line-height 25px
    font-size $font-size-sm
    font-weight 500
    color #FF3030
  .custom-authorize-item
    padding 0 20px
    height 45px
    font-size 0
    overflow hidden
    .custom-authorize-label
      width 60px
      padding-right 15px
      height 45px
      line-height 45px
      font-size $font-size-sm
      color $color-text
      text-align right
      inline-block-top()
    .custom-authorize-content
      font-size 0
      inline-block-top()
    .custom-authorize-username
      width 170px
      height 45px
      line-height 45px
      font-size $font-size-sm
      color $color-text
      inline-block-top()
    .custom-authorize-button
      padding 0 15px
      height 45px
      line-height 45px
      inline-block-top()
      button
        vertical-align middle
  .custom-authorize-line
    width 100%
    border-bottom 1px solid #dcdcdc
</style>
