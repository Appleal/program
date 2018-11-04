<template>
  <div class="custom-feedback-dialog">
    <div class="feedback-header">
      <c-title>
        <p slot="title">服务提醒列表</p>
      </c-title>
    </div>
    <div class="task-list">
      <span>跟进时间：</span>
      <!--<el-radio-group v-model="selectData" size="mini" style="margin-right: 41px;" @change="timeChange('b')">-->
        <!--<el-radio-button label="">不限</el-radio-button>-->
        <!--<el-radio-button label="0">今天</el-radio-button>-->
        <!--<el-radio-button label="1">昨天</el-radio-button>-->
        <!--<el-radio-button label="7">近7天</el-radio-button>-->
        <!--<el-radio-button label="30">近30天</el-radio-button>-->
      <!--</el-radio-group>-->
      <el-date-picker type="date" size="mini"
                      value-format="yyyy-MM-dd"
                      format="yyyy-MM-dd"
                      v-model="orderStartDate" placeholder="开始时间"
                      style="width: 170px;">
      </el-date-picker>
      <span style="margin: 0 10px;">至</span>
      <el-date-picker type="date" size="mini"
                      value-format="yyyy-MM-dd"
                      format="yyyy-MM-dd"
                      v-model="orderEndDate" placeholder="终止时间"
                      :picker-options="orderEndDateOptions"
                      style="width: 170px;">
      </el-date-picker>
      <el-button type=""
                 size="mini"
                 @click="timeChange('t')">
        查询
      </el-button>
    </div>
    <div style="height: 310px; overflow-y: hidden">
      <c-scroll :data="tableData">
      <el-table style="width: 100%"
                      :data="tableData"
                      border
                      height="307"
                      stripe
                      size="mini"
                      header-row-class-name="element-headerRowClassName">
        <el-table-column label="推送时间" width="150" align="center" prop="createTime"></el-table-column>
        <el-table-column label="任务名称" align="center" prop="taskName"></el-table-column>
        <el-table-column label="任务描述" align="center" prop="taskDetails"></el-table-column>
        <el-table-column label="完成情况" width="100" align="center" prop="taskState">
          <template slot-scope="scope">
            {{_forTateState(tableData[scope.$index].taskState)}}
          </template>
        </el-table-column>
        <el-table-column label="完成时间" width="150" align="center" prop="completeTime"></el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button v-if="tableData[scope.$index].taskState === 0" size="mini" type="text" @click="cancalTask(tableData[scope.$index].id)">取消</el-button>
            <span v-else>取消</span>
          </template>
        </el-table-column>
      </el-table>
    </c-scroll>
    </div>
    <div class="custom-pagination" style="margin-top: 6px">
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
  </div>
</template>

<script type="text/ecmascript-6">
import { Input, Button, RadioButton, RadioGroup, Cascader, DatePicker, Pagination, Message, Table, TableColumn } from 'element-ui'
import cScroll from 'base/c-scroll/c-scroll'
import cTitle from 'base/c-title/c-title'
import { ERR_SUCCESS } from 'api/config'
import { format, isNull } from 'common/js/util'
import { getAppUserTask } from 'api/user'
import { deleteAppUserTask } from 'api/placeOrder.js'
export default {
  data () {
    return {
      tableData: [],
      address: {},
      orderStartDate: '',
      orderEndDate: '',
      selectData: '',
      startTime: '',
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
      this._getOrder()
    })
  },
  computed: {
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
    cancalTask (id) {
      deleteAppUserTask({taskId: id}).then(res => {
        if (res.code === ERR_SUCCESS) {
          Message.success('取消成功')
          this._getOrder()
        } else {
          Message.error('操作失败')
        }
      })
    },
    query () {
      this._getOrder('reset')
    },
    _getOrder (type) {
      let _orderStartDate = ''
      let _orderEndDate = ''
      const { orderStartDate, orderEndDate, pageNum, pageSize, tid } = this
      if (orderStartDate === '') {
        _orderStartDate = '2018-01-01 00:00:00'
      } else {
        _orderStartDate = orderStartDate + ' 00:00:00'
      }
      if (orderEndDate === '') {
        _orderEndDate = format(new Date(), '$1-$2-$3') + ' 23:59:59'
      } else {
        _orderEndDate = orderEndDate + ' 23:59:59'
      }
      const postObj = { startTime: _orderStartDate, endTime: _orderEndDate, pageNum, pageSize, appUserId: tid }
      this.loading = true
      getAppUserTask(postObj).then(res => {
        if (res.code === ERR_SUCCESS) {
          const tableData = res.data.dataList
          this.total = res.data.total
          this.tableData = tableData
        } else {
          Message.error(res.msg)
        }
        this.loading = false
      })
    },
    _forTateState (value) {
      value === 1 ? value = '已完成' : value = '未完成'
      return value
    },
    timeChange (type) {
      if (type === 'b') {
        this.orderStartDate = ''
        this.orderEndDate = ''
      } else {
        this.selectData = '不限'
      }
      this._getOrder('reset')
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
  .task-list
    font-size 14px
    margin 12px 0px
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
