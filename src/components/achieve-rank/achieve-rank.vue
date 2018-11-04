<template>
  <div class="achieveRank-page">
    <div class="achieveRank-page-left">
      <div class="achieveRank-page-left-content">
        <list-table title="业绩排名" hideQuery style="position: relative;">
          <div class="achieveRank-button">
            <el-radio-group v-model="typeText" size="mini" @change="typeTextChange">
              <el-radio-button label="周"></el-radio-button>
              <el-radio-button label="月"></el-radio-button>
            </el-radio-group>
          </div>
          <h3 class="achieveRank-title">{{department}}</h3>
          <h4 class="achieveRank-subtitle">{{_format(startTime)}} 至 {{_format(endTime)}} 统计时间：{{_format(endTime)}}</h4>
          <div class="achieveRank-table">
            <el-table style="width: 100%"
                      :data="tableData"
                      border
                      v-loading="loading"
                      stripe
                      size="mini"
                      header-row-class-name="element-headerRowClassName">
              <el-table-column
                label="排名"
                align="center"
                type="index"
                width="50">
              </el-table-column>
              <el-table-column v-for="column in columnData"
                               :label="column.label"
                               :width="column.width"
                               :align="column.align"
                               :prop="column.prop"
                               :key="column.prop">
              </el-table-column>
              <el-table-column label="下单业绩" prop="amount" width="" align="center">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="rowAction( scope.$index, tableData)"
                    class="custom-columnButton text"
                    type="text"
                    size="small">
                    <span>{{_formatCurrency(tableData[scope.$index].amount) }}</span>
                  </el-button>
                </template>
              </el-table-column>

              <el-table-column label="单均" prop="avg" width="" align="center">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="rowAction( scope.$index, tableData)"
                    class="custom-columnButton text"
                    type="text"
                    size="small">
                    <span>{{_formatCurrency(tableData[scope.$index].avg) }}</span>
                  </el-button>
                </template>
              </el-table-column>

              <el-table-column label="签收数" prop="amount" width="" align="center">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="rowAction( scope.$index, tableData)"
                    class="custom-columnButton text"
                    type="text"
                    size="small">
                    <span>{{tableData[scope.$index].receiveQuantity}}</span>
                  </el-button>
                </template>
              </el-table-column>

              <el-table-column label="签收金额" prop="receiveAmount" width="" align="center">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="rowAction( scope.$index, tableData)"
                    class="custom-columnButton text"
                    type="text"
                    size="small">
                    <span>{{_formatCurrency(tableData[scope.$index].receiveAmount) }}</span>
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="achieveRank-pagination">
            <div class="achieveRank-pagination-content">
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
        </list-table>
      </div>
    </div>
    <div class="achieveRank-page-right">
      <message-list ></message-list>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
import {RadioGroup, RadioButton, DatePicker, Button, Table, TableColumn, Pagination, Input} from 'element-ui'
import messageList from 'base/message-list/message-list'
import listTable from 'base/list-table/list-table'
import {formatCurrency, isNull, format} from 'common/js/util'
import { ERR_SUCCESS } from 'api/config'
import { getSaleSort } from 'api/user'
export default {
  data () {
    return {
      loading: false,
      department: '',
      startTime: '',
      endTime: '',
      pageSize: 10,
      pageNum: 1,
      total: 0,
      type: '1',
      typeText: '周',
      columnData: [
        {prop: 'name', label: '员工姓名', width: '89', align: 'center'},
        {prop: 'account', label: '员工账号', align: 'center'},
        {prop: 'createDate', label: '入职时间', width: '129', align: 'center'},
        {prop: 'salesCount', label: '下单数', width: '89', align: 'center'}
      ],
      tableData: []
    }
  },
  created () {
    const {userType} = this.$route.query
    this.endTime = new Date()
    if (isNull(userType)) return
    if (userType === '1') {
      this.typeText = '周'
    } else {
      this.typeText = '月'
    }
    this.type = userType
    this._getSaleSort()
  },
  methods: {
    _formatCurrency (e) {
      return formatCurrency(e)
    },
    _format (e) {
      return format(e)
    },
    changePage (key, num) {
      switch (key) {
        case 'pageSize':
          this.pageSize = num
          this._getSaleSort()
          break
        case 'pageNum':
          this.pageNum = num
          this._getSaleSort()
          break
        default:
          break
      }
    },
    typeTextChange () {
      if (this.typeText === '周') {
        this.type = '1'
      } else {
        this.type = '2'
      }
      this._getSaleSort()
    },
    _getSaleSort () {
      const {type, pageNum, pageSize} = this
      this.loading = true
      getSaleSort({type, pageNum, pageSize}).then(res => {
        if (res.code === ERR_SUCCESS) {
          this.tableData = res.data.data
          this.department = res.data.departName
          this.startTime = res.data.startTime
          this.total = res.data.count
        }
        this.loading = false
      })
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
    messageList,
    listTable
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/css/variable"
@import "~common/css/mixin"

page-init(achieveRank)

.achieveRank-query-item
  padding-bottom 10px
.achieveRank-table
  margin-top 10px
  padding 0 15px
  .authorize-no
    color #ff3333
.achieveRank-title
  margin 0 15px
  height 40px
  line-height 60px
  text-align center
  font-size 20px
  font-weight 500
  color #666
  border-top 1px solid #ccc
.achieveRank-subtitle
  margin 0 15px
  height 30px
  line-height 30px
  text-align center
  font-size $font-size-sm
  color #666
.achieveRank-pagination
  margin 21px 0
  text-align right
  .achieveRank-pagination-content
    margin-right 20px
    inline-block-top()
.achieveRank-columnButton.el-button+.el-button
  position relative
  margin-left 0
  &::before
    content ''
    margin 0 4px
    width 1px
    height 12px
    background-color #898989
    inline-block-top(middle)
.achieveRank-button
  position absolute
  top 0
  right 15px
  height 52px
  line-height 52px
  z-index 10
</style>
