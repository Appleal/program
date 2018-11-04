<template>
  <div class="custom-feedback-dialog">
    <div class="feedback-header">
      <c-title>
        <p slot="title">历史订单</p>
      </c-title>
    </div>
    <!--<div class="task-list">-->
      <!--<span>跟进时间：</span>-->
      <!--<el-radio-group v-model="selectData" size="mini" style="margin-right: 41px;" @change="timeChange('b')">-->
        <!--<el-radio-button label="">不限</el-radio-button>-->
        <!--<el-radio-button label="0">今天</el-radio-button>-->
        <!--<el-radio-button label="1">昨天</el-radio-button>-->
        <!--<el-radio-button label="7">近7天</el-radio-button>-->
        <!--<el-radio-button label="30">近30天</el-radio-button>-->
      <!--</el-radio-group>-->
    <!--</div>-->
    <div style="height: 430px">
      <c-scroll :data="tableData">
      <el-table style="width: 100%"
                      :data="tableData"
                      border
                      height="386"
                      v-loading="loading"
                      stripe
                      size="mini"
                      header-row-class-name="element-headerRowClassName">
        <el-table-column label="订单编号" width="150" align="center" prop="orderNo"></el-table-column>
        <el-table-column label="下单时间" width="150" align="center" prop="createDate"></el-table-column>
        <el-table-column label="客户姓名" width="80" align="center" prop="userName"></el-table-column>
        <el-table-column label="套餐配置" align="" prop="goodsConfigure"></el-table-column>
        <el-table-column label="总价" width="80" align="center" prop="payableAmount">
          <template slot-scope="scope">
            ¥{{_formatCurrency(tableData[scope.$index].payableAmount)}}
          </template>
        </el-table-column>
        <el-table-column label="已支付" width="80" align="center" prop="paid">
          <template slot-scope="scope">
            ¥{{_formatCurrency(tableData[scope.$index].paid)}}
          </template>
        </el-table-column>
        <el-table-column label="订单状态" width="80" align="center" prop="stateName"></el-table-column>
        <el-table-column label="来源" width="70" align="center" prop="salesLineName"></el-table-column>
      </el-table>
    </c-scroll>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { Input, Button, RadioButton, RadioGroup, Cascader, DatePicker, Pagination, Table, TableColumn } from 'element-ui'
import cScroll from 'base/c-scroll/c-scroll'
import cTitle from 'base/c-title/c-title'
import { ERR_SUCCESS } from 'api/config'
import { isNull, formatCurrency } from 'common/js/util'
import { getHistoryOrder } from 'api/placeOrder.js'
export default {
  data () {
    return {
      tableData: [],
      address: {},
      orderStartDate: '',
      orderEndDate: '',
      selectData: '',
      startTime: '',
      loading: true,
      endTime: '',
      state: '',
      tid: '',
      pageNum: 1,
      pageSize: 10,
      total: 10,
      orderEndDateOptions: {
        disabledDate (time) {
          return false
        }
      }
    }
  },
  created () {
    this.$nextTick(() => {
      const {tid} = this.$route.query
      if (isNull(tid)) return
      this.tid = tid
      this._getHistoryOrder(tid)
    })
  },
  computed: {
  },
  methods: {
    _getHistoryOrder (aid) {
      getHistoryOrder({aid}).then(res => {
        if (res.code === ERR_SUCCESS) {
          this.tableData = res.data
          console.log(res.data)
          this.loading = false
        }
      })
    },
    _formatCurrency (e) {
      return formatCurrency(e)
    }
  },
  watch: {
    orderStartDate () {
      const d = new Date(this.orderStartDate).getTime()
      this.orderEndDateOptions.disabledDate = (time) => {
        return time.getTime() < d
      }
    }
  },
  components: {
    [Table.name]: Table,
    [DatePicker.name]: DatePicker,
    [RadioButton.name]: RadioButton,
    [RadioGroup.name]: RadioGroup,
    [Pagination.name]: Pagination,
    [TableColumn.name]: TableColumn,
    [Input.name]: Input,
    [Cascader.name]: Cascader,
    [Button.name]: Button,
    cScroll,
    cTitle
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/css/variable"
@import "~common/css/mixin"

.custom-feedback-dialog
  position relative
  width 100%
  height 430px
  overflow hidden
  .task-list
    font-size 14px
    margin 20px 0px
  .address-item
    padding 4px 0
    width 100%
    font-size 0
    .address-item-label
      padding-right 10px
      width 140px
      height 35px
      line-height 35px
      color $color-text
      font-size $font-size-sm
      text-align right
      inline-block-top()
      strong
        color #ff8d8d
    .address-item-input
      width 460px
      inline-block-top()
  .address-button
    padding 10px 0
    width 600px
    text-align right
  .custom-address-button-wrapper
    width 100%
    font-size 0
    .custom-address-button
      margin-right 5px
      padding 0 5px
      height 30px
      line-height 30px
      color $color-theme
      font-size $font-size-sm
      cursor pointer
      inline-block-top()
      &:hover
        color #1776ea
      &:active
        color #558acc

</style>
