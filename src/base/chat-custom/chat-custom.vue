<template>
  <div class="chat-custom-wrapper">
    <c-scroll>
      <c-tabs :list="chatTabsData" v-model="chatTabsValue">
        <div v-show="chatTabsValue === 0">
          <div class="custom-info">
            <div class="custom-sculpture">
              <img :src="chatCustomer.portraitUrl">
            </div>
            <div class="custom-account">
              <span class="custom-name">
                {{chatCustomer.name}}
                <strong>({{chatCustomer.aNo}})</strong>
              </span>
              <span class="custom-icon-warrant icon-warrant" @click="authorize"></span>
              <div class="element-custom-input custom-account-select">
                <el-select v-model="chatCustomer.userType" placeholder="客户类型" size="mini" @change="save">
                  <el-option
                    v-for="userTypeList in chatCustomer.userTypeList"
                    :key="userTypeList.id"
                    :label="userTypeList.name"
                    :value="userTypeList.id">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="element-chat-radio custom-chat-radio-wrapper">
              {{chatCustomer.symptomType}}
              <c-select-box
                size="mini"
                :value="chatCustomer.symptomType"
                :list="chatCustomer.symptomTypeList"
                :type="chatCustomer.symptomTypeList.length > 0 ? chatCustomer.symptomTypeList[0].issign : 2"
                labelKey="name" valueKey="id"
                @change="selectChange">
              </c-select-box>
            </div>
            <div class="custom-account-describe">
              <div class="custom-account-list">
                <div class="custom-account-item">
                  <span class="custom-account-icon icon-sex" style="font-size: 14px"></span>
                  <span>性别：{{_genderFormat(chatCustomer.gender)}}</span>
                </div>
              </div>
              <div class="custom-account-list">
                <div class="custom-account-item">
                  <span class="custom-account-icon icon-clock"></span>
                  <span>年龄：{{chatCustomer.age}}</span>
                </div>
              </div>
              <div class="custom-account-list">
                <div class="custom-account-item">
                  <span class="custom-account-icon icon-height"></span>
                  <span>身高：{{chatCustomer.height}}cm</span>
                </div>
              </div>
              <div class="custom-account-list">
                <div class="custom-account-item">
                  <span class="custom-account-icon icon-weight"></span>
                  <span>体重：{{chatCustomer.weight}}kg</span>
                </div>
              </div>
            </div>
             <div class="custom-see-board" >
              <div class="custom-see-board-header">
                <h3 >疾病史</h3>
              </div>
              <div class="custom-see-board-item" style="margin: 0 0 0 5px;">
                <span class="custom-follow-text">{{chatCustomer.appDiseaseHistory.diseaseHistory}}</span>
              </div>
              <div class="custom-see-board-header">
                <h3 >手术史</h3>
              </div>
              <div class="custom-see-board-item" style="margin: 0 0 0 5px;">
                <span class="custom-follow-text">{{chatCustomer.appDiseaseHistory.surgeryHistory}}</span>
              </div>
              <div class="custom-see-board-header">
                <h3 >过敏史</h3>
              </div>
              <div class="custom-see-board-item" style="margin: 0 0 0 5px;">
                <span class="custom-follow-text">{{chatCustomer.appDiseaseHistory.allergyHistory}}</span>
              </div>
            </div>
            <div class="custom-see-board" >
              <div class="custom-see-board-header">
                <h3 >跟进记录</h3>
                <a @click="moreFollow" class="more">更多 >></a>
              </div>
              <div class="custom-see-board-item" v-for="f in lastFollow.slice(0,1)" :key="f.id">
                <div class="custom-follow-header">
                  <span class="custom-follow-date">{{f.createTime}}</span>
                  <span class="custom-follow-username">记录：{{f.consulantName}}</span>
                </div>
                <span class="custom-follow-text" v-html="textFormt(f.content)"></span>
              </div>
              <div class="custom-follow-button">
                <el-button size="mini" @click="addFollow">新增记录</el-button>
              </div>
            </div>
            <div class="custom-button-nav">
              <div class="custom-button-nav-item">
                <el-button size="mini" @click="linkChange">详细资料</el-button>
              </div>
              <div class="custom-button-nav-item">
                <el-button size="mini" @click="linkPrice">下定金单</el-button>
              </div>
              <div class="custom-button-nav-item">
                <el-button size="mini" type="danger" @click="openOrder">下订单</el-button>
              </div>
            </div>
          </div>
        </div>
        <div v-show="chatTabsValue === 1">
          <div class="order-wrapper" v-if="historyOrder.length > 0">
            <div class="order-item-wrapper"
              v-for="order in historyOrder"
              :key="order.id"
              @click="rowAction(order)">
              <div class="order-item">
                <div class="order-item-left order-item-text">
                    订单编号： {{order.orderNo}}
                </div>
                <div class="order-item-right order-item-price">
                  {{order.stateName}}
                </div>
              </div>
              <div class="order-item" >
                  <div class="order-item-left order-item-title">
                    {{order.orderTitle}}
                  </div>
                  <div class="order-item-right order-item-title">
                    ¥{{_formatCurrency(order.payableAmount)}}
                  </div>
              </div>
              <div class="order-item" >
                  <div class="order-item-left order-item-text">
                    已支付金额：
                  </div>
                  <div class="order-item-right order-item-text">
                    ¥{{_formatCurrency(order.paid)}}
                  </div>
              </div>
              <div class="order-item" >
                  <div class="order-item-left order-item-text">
                    剩余应支付：
                  </div>
                  <div class="order-item-right order-item-price">
                    ¥{{_formatCurrency(order.payableAmount - order.paid)}}
                  </div>
              </div>
            </div>
          </div>
          <div class="order-nodeDate" v-else>
            暂无数据
          </div>
        </div>
      </c-tabs>
    </c-scroll>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters, mapMutations } from 'vuex'
import { Input, Button, Select, Option, Message } from 'element-ui'
import cSelectBox from 'base/c-selectBox/c-selectBox'
import cTabs from 'base/c-tabs/c-tabs'
import cScroll from 'base/c-scroll/c-scroll'
import {genderFormat, isNull, formatCurrency} from 'common/js/util'
import { ERR_SUCCESS } from 'api/config'
import { brmOrderGoUrl } from 'api/brm'
import { updataAppUserInfo, getHistoryOrder } from 'api/placeOrder'

export default {
  props: {
    chatCustomer: {
      type: Object
    },
    follow: {
      type: Array
    }
  },
  data () {
    return {
      tid: this.chatCustomer.id,
      aNo: this.chatCustomer.aNo,
      chatTabsValue: 0,
      chatTabsData: ['客户资料', '历史订单'],
      historyOrder: []
    }
  },
  created () {
    this._getHistoryOrder()
  },
  computed: {
    lastFollow () {
      return this.follow.slice(0, 4)
    },
    ...mapGetters(['user', 'config'])
  },
  methods: {
    rowAction (data) {
      const rowId = data.id
      const {path} = this.$route
      this.$router.push({path: `${path}/oInfo`, query: {tid: rowId}})
    },
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
    _formatCurrency (e) {
      return formatCurrency(e)
    },
    authorize (e) {
      const {path} = this.$route
      if (isNull(this.chatCustomer.id)) return
      this.chatCustomer.aid = this.chatCustomer.id
      this.chatCustomer.aName = this.chatCustomer.aName
      this.setCustom(this.chatCustomer)
      this.$router.push({path: `${path}/authorize`, query: {tid: this.chatCustomer.id}})
    },
    _getHistoryOrder () {
      if (isNull(this.chatCustomer.id)) return
      getHistoryOrder({aid: this.chatCustomer.id}).then(res => {
        if (res.code === ERR_SUCCESS) {
          this.historyOrder = res.data
        }
      })
    },
    linkChange (e) {
      const {path, params} = this.$route
      this.$router.push({path: `${path}/item`, query: {tid: params.tid.substr(1)}})
    },
    linkPrice () {
      const {path} = this.$route
      this.$router.push({path: `${path}/pay`, query: {aNo: this.aNo}})
    },
    addFollow () {
      const {path, params} = this.$route
      this.$router.push({path: `${path}/item`, query: {tid: params.tid.substr(1), type: 'fa111', userName: this.chatCustomer.name}})
    },
    moreFollow () {
      const {path, params} = this.$route
      this.$router.push({path: `${path}/item`, query: {tid: params.tid.substr(1), type: 'f', userName: this.chatCustomer.name}})
    },
    selectChange (e) {
      // if (!this.isInit) return
      this.chatCustomer.symptomType = e
      this._updataAppUserInfo()
    },
    _genderFormat (e) {
      return genderFormat(e)
    },
    save () {
      // if (!this.isInit) return
      this._updataAppUserInfo()
    },
    _updataAppUserInfo () {
      const {id, userType, symptomType} = this.chatCustomer
      const userInfo = {id, userType, symptomType}
      updataAppUserInfo({userInfo}).then(res => {
        if (res.code === ERR_SUCCESS) {
          Message({
            message: '修改成功！',
            type: 'success'
          })
        } else {
          Message.error(res.msg)
        }
      })
    },
    openOrder () {
      const brmToken = this.user.brmToken
      brmOrderGoUrl({
        token: brmToken,
        customer: this.chatCustomer.aNo
      })
    },
    ...mapMutations({ setCustom: 'SET_CUSTOM' })
  },
  watch: {
    chatCustomer () {
      this.isInit = false
      this._getHistoryOrder()
      setTimeout(() => {
        this.isInit = true
      }, 1000)
      if (isNull(this.chatCustomer.portraitUrl)) {
        this.chatCustomer.portraitUrl = this.config.customPortraitUrl
      }
    }
  },
  components: {
    [Input.name]: Input,
    [Button.name]: Button,
    [Select.name]: Select,
    [Option.name]: Option,
    cTabs,
    cSelectBox,
    cScroll
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/css/variable"
@import "~common/css/mixin"

.chat-custom-wrapper
  position relative
  width 100%
  height 100%
  background-color $color-background
  bg-box-shadow()
  .custom-info
    padding 18px 9px
    font-size 0
    box-sizing content-box
    background-color $color-background
    .custom-sculpture
      width 45px
      height 45px
      border-radius 5px
      overflow hidden
      inline-block-top()
      img
        width 45px
        height 45px
    .custom-account
      position relative
      margin-left 12px
      width 170px
      font-size $font-size-sm
      inline-block-top()
    .custom-chat-radio-wrapper
      padding 5px 0
  .custom-name
      display block
      padding-right 20px
      width 124px
      line-height 18px
      box-sizing content-box
      color $color-text
    strong
      color #969696
  .custom-icon-warrant
    position absolute
    display block
    top -5px
    right 0
    padding 5px
    width 18px
    height 18px
    font-size 18px
    cursor pointer
  .custom-account-select
    margin-top 5px
  .custom-account-describe
    width 100%
  .custom-account-list
    margin-top 1px
    width 50%
    height 30px
    line-height 30px
    font-size $font-size-sm
    inline-block-top()
    .custom-account-item
      margin-left 1px
      height 30px
      line-height 30px
      background-color #e6ecf2
  .custom-account-icon
    margin 0 5px 0 10px
    color #405e80
  .custom-see-board
    position relative
    margin-top 10px
    padding 0 9px
    background-color #f2f2f2
    font-size $font-size-sm
    overflow hidden
    .custom-see-board-header
      margin 0
      padding 0
      width 100%
      height 30px
      font-size 0
      h3
        height 30px
        line-height 30px
        color $color-text
        font-size $font-size-sm
        font-weight 900
        inline-block-top()
      .more
        float right
        height 30px
        color $color-theme
        font-size $font-size-sm
        line-height 30px
        inline-block-top()
        cursor pointer
    .custom-see-board-item
      position relative
      margin-top 5px
      margin-bottom 20px
      width 100%
      line-height 24px
      color #999
      overflow hidden
      .custom-see-board-label
        float left
        color #969696
        inline-block-top()
    .custom-see-select
      width 140px
      inline-block-top()
  .custom-follow-header
    width 100%
    height 12px
    line-height 12px
    font-size 0
    .custom-follow-date,.custom-follow-username
      font-size $font-size-sm
      color #969696
      inline-block-top()
    .custom-follow-username
      float right
  .custom-follow-text
    display block
    margin 5px 0
    line-height 18px
    font-size 12px
    color #666
    max-height 70px
    overflow hidden
  .order-nodeDate
    line-height 180px
    text-align center
    font-size 14px
    color #999
  .custom-follow-button
    margin-bottom 10px
    text-align right
  .custom-button-nav
    padding 15px 0 6px 0
    font-size 0
    .custom-button-nav-item
      width 33.33%
      inline-block-top()
      button
        width 92%
    .custom-button-nav-item+.custom-button-nav-item
      text-align right

.order-wrapper
  height 100%
  background-color $color-mark
  .order-item-wrapper
    margin-bottom 10px
    cursor pointer
    background-color $color-background
    &:hover
      background-color #F5F5F5
  .order-item
    line-height 35px
    font-size 0
  .order-item-left
    padding-left 10px
    font-size $font-size-sm
    inline-block-top()
  .order-item-right
    float right
    padding-right 10px
    font-size $font-size-sm
    text-align right
    inline-block-top()
  .order-item-text
    color #969696
  .order-item-title
    font-weight 500
    color $color-text
  .order-item-price
    color #ff3333
</style>
