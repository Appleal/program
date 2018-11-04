<template>
  <c-table-scroll :data="tableData">
    <list-table title="定金单列表" order='true'>
        <div class="order" slot="order">
          <router-link to="/payment/pay" class="order-btn">下定金单</router-link>
          <span @click="playOrder" class="order-btn">下订单</span>
        </div>
      <slot slot="query">
        <div class="custom-query-item">
          <div class="tabNav">
            <ul class="tabChange">
              <li> <router-link to="/order" class="allAcitve">订单列表</router-link>  </li>
              <li><router-link to="/abnormal"  class="allAcitve">异常订单</router-link></li>
              <li class="active"><router-link to="/payment"  class="allAcitve">定金单列表</router-link></li>
            </ul>
          </div>
          <span>跟进时间：</span>
          <el-radio-group v-model="selectData" size="mini" style="margin-right: 41px;" @change="timeChange('b')">
            <el-radio-button label="">不限</el-radio-button>
            <el-radio-button label="0">今天</el-radio-button>
            <el-radio-button label="1">昨天</el-radio-button>
            <el-radio-button label="7">近7天</el-radio-button>
            <el-radio-button label="30">近30天</el-radio-button>
          </el-radio-group>
          <el-date-picker type="date" size="mini"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            v-model="orderStartDate" placeholder="开始时间"
            style="width: 170px;" @change="timeChange('t')">
          </el-date-picker>
          <span style="margin: 0 10px;">至</span>
          <el-date-picker type="date" size="mini"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            v-model="orderEndDate" placeholder="终止时间"
            :picker-options="orderEndDateOptions"
            style="width: 170px;" @change="timeChange('t')">
          </el-date-picker>
        </div>
        <div class="custom-query-item">
          <span>支付状态：</span>
          <el-radio-group v-model="state" size="mini" style="margin-right: 41px;" @change="query">
            <el-radio-button label="">不限</el-radio-button>
            <el-radio-button label="0">待支付</el-radio-button>
            <el-radio-button label="1">已支付</el-radio-button>
            <el-radio-button label="2">已取消</el-radio-button>
          </el-radio-group>
        </div>
        <div>
          <span>精准查询：</span>
          <el-input placeholder="定金单编号" v-model="payNo" size="small" style="width: auto;margin-right: 10px;">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <el-input placeholder="客户编号" v-model="userNo" size="small" style="width: auto;margin-right: 10px;">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <el-input placeholder="客户姓名" v-model="userName" size="small" style="width: auto;">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <el-button size="mini" style="margin-left: 10px;" @click="query()">查询</el-button>
        </div>
      </slot>
      <div class="custom-table">
        <el-table style="width: 100%"
                  :data="tableData"
                  v-loading="loading"
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
          <el-table-column label="操作" width="" align="center">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="rowAction(scope.$index, tableData)"
                class="appointment-columnButton"
                type="text"
                size="small"
                :disabled="tableData[scope.$index].isPay != 2"
              >
                <span >取消</span>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="custom-pagination">
        <div class="custom-pagination-content">
            <el-pagination
                :current-page= pageNum
                :page-sizes="[10, 20, 50, 100]"
                :page-size= pageSize
                layout="total, sizes, prev, pager, next, jumper"
                @current-change="(n)=> this.changePage('pageNum', n)"
                @size-change="(n)=> this.changePage('pageSize', n)"
                @next-click="(n)=> this.changePage('pageNum', n)"
                @prev-click="(n)=> this.changePage('pageNum', n)"
                :total=total>
          </el-pagination>
        </div>
      </div>
    </list-table>
    <router-view @showCityName="updateStep" slot="view"></router-view>
  </c-table-scroll>

</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
import {
  RadioGroup, RadioButton, DatePicker, Button, Table, TableColumn, MessageBox,
  Pagination, Input, Message
} from 'element-ui'
import cTableScroll from 'base/c-table-scroll/c-table-scroll'
import listTable from 'base/list-table/list-table'
import { formatCurrency, format } from 'common/js/util'
import { ERR_SUCCESS } from 'api/config'
import { getDownPayment, unPayDeposit } from 'api/placeOrder.js'

export default {
  data () {
    return {
      loading: false,
      show: true,
      orderStartDate: '',
      orderEndDate: '',
      selectData: '',
      startDate: '',
      endDate: '',
      state: '',
      payNo: '',
      userNo: '',
      userName: '',
      pageNum: 1,
      pageSize: 10,
      total: 0,
      columnData: [
        {prop: 'orderNo', label: '定金单编号', align: 'center'},
        {prop: 'userNo', label: '客户编号', align: 'center'},
        {prop: 'userName', label: '客户姓名', align: 'center'},
        {prop: 'payTime', label: '下单时间', width: '180', align: 'center'},
        {prop: 'amount', label: '金额', width: '120', align: 'center'},
        {prop: 'statusName', label: '支付状态', width: '140', align: 'center'}
      ],
      tableData: [],
      orderEndDateOptions: {
        disabledDate (time) {
          return false
        }
      }
    }
  },
  created () {
    this._getOrder()
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    changePage (key, num) {
      switch (key) {
        case 'pageSize':
          this.pageSize = num
          this._getOrder()
          break
        case 'pageNum':
          this.pageNum = num
          this._getOrder()
          break
        default:
          break
      }
    },
    rowAction (rowIndex, row) {
      MessageBox.confirm('是否取消这个定金单？', '取消定金单', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const {id, userid} = row[rowIndex]
        unPayDeposit({id, userid}).then(res => {
          if (res.code === ERR_SUCCESS) {
            this._getOrder()
            Message({
              type: 'success',
              message: '取消定金单成功!'
            })
          }
        })
      }).catch(() => {})
    },
    updateStep (data) {
      this._getOrder()
    },
    query () {
      this._getOrder('reset')
    },
    _getOrder (type) {
      let targetObj
      if (type === 'reset') {
        this.pageNum = 1
        targetObj = this
      } else {
        targetObj = this.targetObj ? this.targetObj : this
      }
      if (this.selectData === '') {
        this.startDate = ''
        this.endDate = ''
      } else if (this.selectData === '不限') {
        this.startDate = this.orderStartDate
        this.endDate = this.orderEndDate
      } else {
        this._getTime(this.selectData)
      }
      let { startDate, endDate, state, payNo, userNo, userName } = targetObj
      const { pageNum, pageSize } = this
      const postObj = { startDate, endDate, state, payNo, userNo, userName, pageNum, pageSize }
      this.loading = true
      getDownPayment(postObj).then(res => {
        if (res.code === ERR_SUCCESS) {
          this.targetObj = postObj
          const tableData = res.data.dataList
          this.tableData = tableData
          this.total = res.data.total
          this._formatCurrency(tableData)
        } else {
          Message.error(res.msg)
        }
        this.loading = false
      })
    },
    _getTime (num) {
      const time = new Date() - (num * 3600 * 24 * 1000)
      this.startDate = format(new Date(time), '$1-$2-$3') + ' 00:00:00'
      if (num === '1') {
        this.endDate = format((new Date() - 3600 * 24 * 1000), '$1-$2-$3') + ' 23:59:59'
      } else {
        this.endDate = format(new Date(), '$1-$2-$3') + ' 23:59:59'
      }
    },
    timeChange (type) {
      if (type === 'b') {
        this.orderStartDate = ''
        this.orderEndDate = ''
      } else {
        this.selectData = '不限'
      }
      this._getOrder('reset')
    },
    _formatCurrency (tableData) {
      tableData.forEach(e => {
        e['amount'] = `￥${formatCurrency(e['amount'])}`
      })
    },
    handleSizeChange (val) { // 设置多少条
      this.pageSize = val
      this._getOrder()
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this._getOrder()
    },
    playOrder () {
      this.$router.push({ path: '/order/pay', query: {state: '1'} })
    }
  },
  watch: {
    startDate () {
      const d = new Date(this.startDate).getTime()
      this.orderEndDateOptions.disabledDate = (time) => {
        return time.getTime() < d
      }
    },
    payNo (value) {
      this.payNo = value.replace(' ', '')
    },
    userName (value) {
      this.userName = value.replace(' ', '')
    },
    userNo (value) {
      this.userNo = value.replace(' ', '')
    }
  },
  components: {
    [RadioGroup.name]: RadioGroup,
    [RadioButton.name]: RadioButton,
    [DatePicker.name]: DatePicker,
    [Button.name]: Button,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Pagination.name]: Pagination,
    [Input.name]: Input,
    cTableScroll,
    listTable
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/css/variable"
  @import "~common/css/mixin"

  .custom-query-item
    padding-bottom 10px
  .allAcitve
    width 100%
    height 100%
    display inline-block
  .custom-table
    margin-top 10px
    padding 0 15px
    .authorize-no
      color #ff3333
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
  .tabNav
    height 31px
    border-bottom 1px solid #cccccc
    margin-bottom 20px
  .tabChange
    width 309px
    float left
    border-top 1px solid #cccccc;
    border-right 1px solid #cccccc
  .tabChange li
    width 102px
    float left
    text-align center
    background-color #f2f2f2
    border-left: 1px solid #cccccc
    a
      width 100%
      height:100%
      inline-block-top()
  .tabChange .active
    background-color #FFFFFF
    padding-bottom:1px
  .order
    float right
    a
      color #fff
  .order-btn
    margin-left 10px
    padding 7px 15px
    height 15px
    line-height 15px
    border-radius 3px
    font-size 12px
    background-color #4897f9
    color #fff
    cursor pointer
    inline-block-top(middle)
    &:hover
      background-color #2873d0
</style>
