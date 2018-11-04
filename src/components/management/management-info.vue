<template>
  <c-dialog :title="title" @close="goBack" class="element-dialog">
    <div class="layer-wrapper">
      <div class="custom-info-dialog">
        <c-scroll :data="reportList">
          <div class="custom-info-wrapper">
            <div class="custom-info">
              <img v-if="chatCustomer.portraitUrl" :src="chatCustomer.portraitUrl" class="custom-info-portrait">
              <el-input v-model="chatCustomer.nickName" size="mini"
                        v-show="edit" style="display: block;width: 80%;margin: 0 auto;"></el-input>
              <h3 v-if="chatCustomer.nickName" v-show="!edit"
                  class="custom-info-username">{{chatCustomer.nickName}}</h3>
            </div>
            <div class="custom-form">
            <table class="gridtable">
              <tr>
                <td>
                  <label class="custom-form-label">症状: </label>
                  <div class="custom-form-input">
                    <span class="custom-info-text" v-show="!edit">{{chatCustomer.symptomTypeText}}</span>
                  </div>
                </td>
                <td>
                  <label class="custom-form-label">类型: </label>
                  <div class="custom-form-input">
                    <span class="custom-info-text">{{chatCustomer.userTypeText}}</span>
                  </div>
                </td>
                <td>
                  <label class="custom-form-label">昵称: </label>
                  <div class="custom-form-input">
                    <span class="custom-info-text">{{chatCustomer.nickName}}</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <label class="custom-form-label">性别: </label>
                  <div class="custom-form-input">
                    <span class="custom-info-text">{{_genderFormat(chatCustomer.gender)}}</span>
                  </div>
                </td>
                <td>
                  <label class="custom-form-label">身高: </label>
                  <div class="custom-form-input">
                    <span class="custom-info-text">{{chatCustomer.height}}cm</span>
                  </div>
                </td>
                <td>
                  <label class="custom-form-label">体重: </label>
                  <div class="custom-form-input">
                    <span class="custom-info-text">{{chatCustomer.weight}}kg</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <label class="custom-form-label">生日: </label>
                  <div class="custom-form-input">
                    <span class="custom-info-text">{{_format(chatCustomer.birthDate)}}</span>
                  </div>
                </td>
                <td>
                  <label class="custom-form-label">职业: </label>
                  <div class="custom-form-input">
                    <span class="custom-info-text">{{chatCustomer.career}}</span>
                  </div>
                </td>
                <td>
                  <label class="custom-form-label">城市: </label>
                  <div class="custom-form-input">
                    <span class="custom-info-text">{{chatCustomer.area}}</span>
                  </div>
                </td>
              </tr>
            </table>
            </div>
          </div>
          <div class="custom-info-title-wrapper">
            <c-title>
              <p slot="title">交易流水</p>
            </c-title>
          </div>
          <div class="statistical-wrapper">
            <div class="statistical-item">
              <div class="statistical-item-content">
                <h3 class="statistical-item-title"><span>{{ totalMoney }}</span></h3>
                <span class="statistical-item-text">总支付金额</span>
              </div>
            </div>
            <div class="statistical-item">
              <div class="statistical-item-content">
                <h3 class="statistical-item-title"><span>{{ residueMoney }}</span></h3>
                <span class="statistical-item-text">余额</span>
              </div>
            </div>
          </div>
          <div class="custom-info-title-wrapper">
            <el-table style="width: 100%"
                      :data="tableData"
                      border
                      stripe
                      size="mini"
                      header-row-class-name="element-headerRowClassName">
              <el-table-column v-for="column in columnData"
                               :label="column.label"
                               :width="column.width"
                               :align="column.align"
                               :prop="column.prop"
                               :key="column.prop">
              </el-table-column>

              <el-table-column label="金额" width="" align="center">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="rowAction( scope.$index, tableData)"
                    class="custom-columnButton"
                    type="text"
                    size="small">
                    <span class='green' :class="{active:tableData[scope.$index].amount>0}">
                      <strong v-if="tableData[scope.$index].amount>0">+</strong>
                      {{tableData[scope.$index].amount}}
                    </span>
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="custom-pagination">
              <div class="custom-pagination-content">
                <el-pagination
                :page-sizes="[10, 20, 50, 100]"
                :page-size="pageSize"
                :current-page="pageNum"
                layout="total, sizes, prev, pager, next, jumper"
                @current-change="(n)=> this.changePage('pageNum', n)"
                @size-change="(n)=> this.changePage('pageSize', n)"
                @next-click="(n)=> this.changePage('pageNum', n)"
                @prev-click="(n)=> this.changePage('pageNum', n)"
                :total="total">
              </el-pagination>
              </div>
            </div>
          </div>
        </c-scroll>
      </div>
    </div>
  </c-dialog>
</template>

<script type="text/ecmascript-6">
import cDialog from 'base/c-dialog/c-dialog'
import {Button, Input, Select, Option, DatePicker, Table, TableColumn, Pagination} from 'element-ui'
import cScroll from 'base/c-scroll/c-scroll'
import cTitle from 'base/c-title/c-title'
import { ERR_SUCCESS } from 'api/config'
import { getAppUserInfo } from 'api/placeOrder'
import { getAppUserBill } from 'api/bill'
import {format, genderFormat, isNull, billFormat} from 'common/js/util'

export default {
  data () {
    return {
      title: '交易流水',
      edit: false,
      totalMoney: 0.00,
      residueMoney: 0.00,
      chatCustomer: {},
      reportList: [],
      columnData: [
        {prop: 'flowNo', label: '支付流水号', width: '150', align: 'center'},
        {prop: 'salesOrderno', label: '订单编号', width: '150', align: 'center'},
        {prop: 'thirdpartyTradeno', label: '第三方交易单号', width: '150', align: 'center'},
        {prop: 'payWay', label: '收款方式', width: '150', align: 'center'},
        {prop: 'remark', label: '类型', width: '100', align: 'center'},
        {prop: 'createTime', label: '时间', width: '150', align: 'center'}
      ],
      tableData: [],
      pageSize: 10,
      pageNum: 1,
      total: 0
    }
  },
  created () {
    this.$nextTick(() => {
      const {tid} = this.$route.query
      if (isNull(tid)) return
      getAppUserInfo({userid: tid}).then((res) => { // 获取账单详情用户信息
        if (res.code === ERR_SUCCESS) {
          this.chatCustomer = res.data
        } else {
          // Message.error(res.msg)
        }
      })
      getAppUserBill(tid).then((res) => { // 获取账单table展示
        if (res.code === ERR_SUCCESS) {
          const tableList = res.data.pageDate.dataList
          this.tableData = tableList
          this.total = res.data.pageDate.total
          this.totalMoney = res.data.totalRecharge
          this.residueMoney = res.data.balance
          this.calcPrice(tableList)
        } else {
          // Message.error(res.msg)
        }
      })
    })
  },
  methods: {
    changePage (key, num) {
      switch (key) {
        case 'pageSize':
          this.pageSize = num
          this._getAppUser()
          break
        case 'pageNum':
          this.pageNum = num
          this._getAppUser()
          break
        default:
          break
      }
    },
    goBack () {
      this.$router.go(-1)
    },
    cSelectChange (e) {
      if (e.length === 0) return ''
      this.chatCustomer.symptomType = e.join(',')
    },
    _billFormat (e) {
      return billFormat(e)
    },
    _genderFormat (e) {
      return genderFormat(e)
    },
    _format (e) {
      return format(e)
    },
    calcPrice (number) {
      number.forEach(e => {
        switch (e.payWay) {
          case 1:
            e.payWay = '微信支付'
            break
          case 2:
            e.payWay = '支付宝'
            break
          case 3:
            e.payWay = '银联'
            break
          default:
            e.payWay = '钱包支出'
        }
      })
    }
  },
  components: {
    [Button.name]: Button,
    [Input.name]: Input,
    [Select.name]: Select,
    [Option.name]: Option,
    [DatePicker.name]: DatePicker,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Pagination.name]: Pagination,
    cTitle,
    cDialog,
    cScroll
  }
}

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/css/variable"
  @import "~common/css/mixin"

  .layer-wrapper
    padding 20px
    width 1000px
    height 560px
    box-sizing border-box
    .green
      position relative
      color #ee4040
      &:before
        content '￥'
        position absolute
        left -12px
        top:3px
    .active
      color #4cbd4f
  .custom-pagination
    margin 21px 0
    text-align right
    .custom-pagination-content
      margin-right 20px
      inline-block-top()
    .custom-columnButton.el-button+.el-button
      position relative
      margin-left 0
      &::before
        content ''
        margin 0 4px
        width 1px
        height 12px
        background-color #898989
        inline-block-top(middle)
  .custom-info-dialog
    position relative
    width 100%
    height 430px
    overflow-y auto
  .custom-info-wrapper
    position relative
    width 100%
    font-size 0
    inline-block-top()
    background-color #e6ecf2
    .custom-info
      position relative
      float left
      width 180px
      height 122px
      .custom-info-portrait
        display block
        margin 0 auto
        margin-top 10px
        width 75px
        height 75px
        border-radius 50%
        overflow hidden
      .custom-info-username,.custom-info-userId
        display block
        margin 0 auto
        font-size $font-size-md
        color $color-text
        text-align center
      .custom-info-username
        height 28px
        line-height 28px
    .custom-form
      margin-left 180px
      .custom-form-label
        width 55px
        font-size $font-size-sm
        text-align right
        inline-block-top()
      .custom-info-text
        width 160px
        color $color-text
        font-size $font-size-sm
        inline-block-top()
      .custom-form-input
        width 150px
        inline-block-top()
      .icon-exclamation
        position absolute
        top 50%
        right 5px
        transform translateY(-50%)
        font-size $font-size-md
        color #F94848
        inline-block-top()
  .custom-form-buttom
    position absolute
    left 0
    bottom 0
    width 100%
    height 35px
    font-size 0
    background-color #f0f5fc
    .custom-form-buttom-item
      width 50%
      height 35px
      line-height 35px
      text-align center
      inline-block-top()
      button
        padding 0
        width 100%
        height 100%
        background-color transparent
        border none
        border-radius 0
        inline-block-top()
      button:hover
        background-color #CFCFCF
      button:active
        background-color #DEDEDE
      &.relation
        .buttom-delete
          color #CCC
        button:hover
          cursor not-allowed
          background-color transparent
    .buttom-edit
      color #4897f9
    .buttom-delete
      color #f85959
    .icon-buttom
      font-size $font-size-lg
  .custom-info-title-wrapper
    margin-top 20px
    width 100%
    height 45px
    .custom-info-title
      height 40px
      line-height 40px
      font-size $font-size-md
      inline-block-top()
  .statistical-wrapper
    width 100%
    font-size 0
    .statistical-item
      width 50%
      inline-block-top()
      color #4897f9
      .statistical-item-content
        width 100%
        font-size 18px
      .statistical-item-title
        padding 10px 0 20px 0
        width 100%
        height 30px
        line-height 30px
        font-size 24px
        font-weight bold
        text-align center
        span
          position relative
          &::before
            position absolute
            top -2px
            left -20px
            content '￥'
            font-weight bold
            font-size 12px
      &:last-child
        color #4cbd4f
      .statistical-item-text
        display block
        width 100%
        height 35px
        line-height 35px
        font-size 14px
        text-align center
  .physical-wrapper
    margin-top 10px
    width 100%
    border 1px solid #c2c2c2
    box-sizing border-box
    font-size 0
    .physical-header
      width 100%
      font-size 0
      .physical-header-item
        padding 0 20px
        width 33.3%
        height 42px
        line-height 42px
        font-size $font-size-md
        font-weight 400
        color $color-text
        box-sizing border-box
        inline-block-top()
      .physical-header-item+.physical-header-item
        font-weight 500
        text-align center
      .physical-header-item+.physical-header-item+.physical-header-item
        font-weight 400
        text-align right
    .physical-item
      margin-top -1px
      margin-left -1px
      width 20%
      border-top 1px solid #c2c2c2
      border-left 1px solid #c2c2c2
      inline-block-top()
      .physical-item-label,.physical-item-text
        display block
        padding 0 10px
        height 42px
        line-height 42px
        font-size $font-size-sm
        color $color-text
        no-wrap()
      .physical-item-label
        text-align center
    .physical-picture-wrapper
      padding 5px 10px
      font-size 0
      .physical-picture
        margin-right 15px
        inline-block-top()
        img
          max-width 200px
.gridtable
  width 100%
  font-size $font-size-sm
  color $color-text
  border 1px solid #fff
  td
    padding 15px 0
    line-height 1.6
    border 1px solid #fff
    background-color #cedaf2
    background-color #e1ecfa
</style>
