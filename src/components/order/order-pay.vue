<template>
  <c-dialog title="下定金单" @close="goBack">
    <div class="order-pay-wrapper">
      <div class="order-pay-item">
        <label>客户编号：</label>
        <el-input v-model="userNo" placeholder="请输入客户编号"  @blur="validationUserNo" size="mini" style="width: auto;"></el-input>
        <div class="loading" v-show="isLoading">
          <c-loading size="20"></c-loading>
        </div>
        <svg v-show="isCustom" viewBox="0 0 17 20" class="order-pay-gou">
          <path d="M1 9 l 5 5 9-9" fill="none" stroke-width="2.5" stroke-linecap="round"></path>
        </svg>
      </div>
      <div class="order-pay-item" v-show="isCustom">
        <label>客户姓名：</label>
        <span style="font-size: 14px; color: #666">{{ userName }}</span>
      </div>
      <div v-show="isArein">
        <span style="font-size:12px; margin-left: 140px; color: red">该用户不存在，请确认后输入</span>
      </div>
      <div class="order-pay-item">
        <label>定金单金额：</label>
        <el-input v-model="amount" @input="changeAmount" placeholder="请输入支付单金额" size="mini" style="width: auto;">
          <template slot="append">元</template>
        </el-input>
      </div>
      <div class="order-pay-item order-pay-button">
        <el-button type="info" size="small" @click="goBack">取消</el-button>
        <el-button
          :loading="loading"
          size="small" class="element-button"
          @click="btn" :disabled="isArein">确定</el-button>
      </div>
    </div>
  </c-dialog>
</template>

<script type="text/ecmascript-6">
import {mapGetters} from 'vuex'
import {Button, Input, Message} from 'element-ui'
import cDialog from 'base/c-dialog/c-dialog'
import cLoading from 'base/c-loading/c-loading'
import { isNull } from 'common/js/util'
import { isNumber } from 'common/js/verify'
import { ERR_SUCCESS } from 'api/config'
import { payDeposit, getAppUserInfoByUserNo } from 'api/placeOrder'

export default {
  data () {
    return {
      title: '下定金单',
      loading: false,
      isLoading: false,
      isCustom: false,
      userName: '',
      isArein: false,
      userNo: '', // 编号
      amount: '', // 金额
      userid: '' // id
    }
  },
  created () {
    const {aNo} = this.$route.query
    if (aNo) {
      this.userNo = aNo
      this._getAppUserInfoByUserNo()
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    btn () {
      this._payDeposit()
    },
    changeAmount (e) {
      setTimeout(() => {
        if (this.amount <= 0) {
          this.amount = ''
        } else {
          this.amount = e.replace(/[^0-9]/g, '')
        }
      }, 20)
    },
    _payDeposit () {
      const { userid, amount } = this
      if (isNull(amount)) return Message.error('定金金额不能为空!')
      if (!isNumber(amount)) return Message.error('定金必须为大于0的整数 ！')
      this.loading = true
      payDeposit({ userid, amount }).then(res => {
        this.loading = false
        if (res.code === ERR_SUCCESS) {
          Message.success('提交成功')
          this.$router.replace('/payment')
        } else {
          Message.error(res.msg)
        }
      })
    },

    validationUserNo () {
      this._getAppUserInfoByUserNo()
    },
    _getAppUserInfoByUserNo () {
      const { userNo } = this
      if (userNo === '') return
      this.isLoading = true
      getAppUserInfoByUserNo({ userNo }).then(res => {
        this.isLoading = false
        if (res.code === ERR_SUCCESS) {
          if (res.data) {
            this.userName = res.data.name
            this.userid = res.data.id
            this.isCustom = true
            this.isArein = false
          } else {
            this.isCustom = false
            this.isArein = true
          }
        } else {
          Message.error('该客户编号存在多个客户！')
        }
      })
    }
  },
  computed: {
    ...mapGetters(['config', 'user', 'conversationList'])
  },
  components: {
    [Input.name]: Input,
    [Button.name]: Button,
    cDialog,
    cLoading,
    Message
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/css/variable"
  @import "~common/css/mixin"

  .order-pay-wrapper
    padding 10px 15px
    width 420px
    .loading
      height 20px
      inline-block-top(middle)
    .order-pay-item
      padding 10px 0
      height 28px
      line-height 28px
      label
        margin-left 25px
        font-size 14px
        width 110px
        inline-block-top()
    .order-pay-button
      text-align right
      button
        margin-right 15px
        width 105px
    .order-pay-gou
      width 50px
      height 28px
      line-height 28px
      inline-block-top()
      path
        stroke $color-theme
        stroke-dasharray 100
        animation dash 6s linear
      @keyframes dash
        from
          stroke-dashoffset 100
        to
          stroke-dashoffset 0

</style>
