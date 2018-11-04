<template>
  <c-table-scroll :data="tableData">
    <list-table title="客户账单">
      <slot slot="query">
        <div class="custom-query-item">
            <ul class="about-amount">
              <li class="total">
                <p>
                  <span v-if="show">{{ price.totalMoney }}</span>
                  <span v-else>0.00</span>
                </p>
                <p>总支付金额</p>
              </li>
              <li class="forehead">
                <p>
                  <span v-if="show">{{ price.avgMoney }}</span>
                  <span v-else>0.00</span></p>
                <p>平均支付金额</p>
              </li>
              <li class="balance">
                <p>
                  <span v-if="show">{{price.residueMoney }}</span>
                  <span v-else>0.00</span>
                </p>
                <p>总余额</p>
              </li>
            </ul>
        </div>
        <div>
          <span>精准查询：</span>
          <el-select v-model="type" placeholder="请选择" size="mini"
            class="medium"  style="width: 100px; margin-right: 10px;" @change="changeprice">
            <el-option
              v-for="item in feedbackoop"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input placeholder="最低金额" v-model="startMoney" size="mini" style="width: 140px; margin-right: 10px;">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          至
          <el-input placeholder="最高金额" v-model="endMoney" size="mini" style="width: 140px;margin-right: 10px;margin-left: 10px;" >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <el-button size="mini" style="margin-left: 10px;" @click="query()">查询</el-button>
          <div style="margin: 10px 0px 0px 62px;">
            <el-input placeholder="客户编号" v-model="brmid" size="mini" style="width: 220px;margin-right: 10px;">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
            <el-input placeholder="客户姓名" v-model="name" size="mini" style="width: 220px;">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </div>
        </div>
      </slot>
      <div class="custom-table">
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
          <el-table-column label="操作" width="" align="center">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="rowAction( scope.$index, tableData)"
                class="custom-columnButton"
                type="text"
                size="small">
                <span>账单明细</span>
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
              :total="total">
          </el-pagination>
        </div>
      </div>
    </list-table>
  </c-table-scroll>

</template>

<script type="text/ecmascript-6">
import {RadioGroup, Select, Option, RadioButton, DatePicker, Button, Table, TableColumn, Pagination, Input} from 'element-ui'
import cTableScroll from 'base/c-table-scroll/c-table-scroll'
import listTable from 'base/list-table/list-table'
import { ERR_SUCCESS } from 'api/config'
import { getStatistical, getBillList } from 'api/bill'
export default {
  data () {
    return {
      show: false,
      price: {},
      totalMoney: '',
      avgMoney: '',
      residueMoney: '',
      type: '',
      startMoney: '',
      endMoney: '',
      brmid: '',
      name: '',
      pageNum: 1,
      pageSize: 10,
      total: 0,
      feedbackoop: [{
        label: '总金额',
        value: 1
      }, {
        label: '余额',
        value: 2
      }],
      columnData: [
        {prop: 'brmid', label: '客户编号', align: 'center'},
        {prop: 'name', label: '客户姓名', align: 'center'},
        {prop: 'totalRecharge', label: '总金额', align: 'center'},
        {prop: 'balance', label: '余额', align: 'center'}
      ],
      tableData: []
    }
  },
  created () {
    this._getStatistical() // 查询金额相关
    this.query() // 列表加载
  },
  methods: {
    changePage (key, num) {
      switch (key) {
        case 'pageSize':
          this.pageSize = num
          this._getBillList()
          break
        case 'pageNum':
          this.pageNum = num
          this._getBillList()
          break
        default:
          break
      }
    },
    changeprice () {
    },
    query () {
      this._getBillList('reset') // 列表加载
    },
    rowAction (rowIndex, row) {
      const rowId = row[rowIndex].id
      this.$router.push({path: '/management/info', query: {tid: rowId}})
    },
    _getStatistical () {
      getStatistical().then(res => {
        if (res.code === ERR_SUCCESS) {
          this.price = res.data.moneyStatistics
          this.show = true
        } else {
          // Message.error(res.msg)
        }
      })
    },
    _getBillList (t) {
      let targetObj
      if (t === 'reset') {
        this.pageNum = 1
        targetObj = this
      } else {
        targetObj = this.targetObj ? this.targetObj : this
      }
      let { type, startMoney, endMoney, brmid, name } = targetObj
      const { pageNum, pageSize } = this
      const postObj = { type, startMoney, endMoney, brmid, name, pageNum, pageSize }
      this.loading = true
      getBillList(postObj).then(res => {
        if (res.code === ERR_SUCCESS) {
          this.targetObj = postObj
          this.tableData = res.data.dataList
          this.total = res.data.total
        } else {
          // Message.error(res.msg)
        }
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
    [Select.name]: Select,
    [Option.name]: Option,
    cTableScroll,
    listTable
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/css/variable"
  @import "~common/css/mixin"

  page-init(custom)

  .custom-query-item
    padding-bottom 10px
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
    width 206px
    float left
    border-top 1px solid #cccccc;
    border-right 1px solid #cccccc
  .tabChange li
    width 102px
    float left
    text-align center
    background-color #f2f2f2
    border-left: 1px solid #cccccc
  .tabChange .active
    background-color #FFFFFF
    padding-bottom:1px
  .about-amount
    height 120px
    border-bottom 1px solid #c2c2c2
    li
      float left
      width 33.3%
      text-align center
      font-size 24px
    p
      font-size 14px
      &:first-child
        height 60px
        line-height 60px
        font-weight bold
        font-size 24px
      span
        display inline-block
        position relative
        &::before
          content:"￥"
          font-size 14px
          left -14px
          font-weight bold
          position absolute
  .total
    color #4897f9
  .forehead
    color #f89800
  .balance
    color #4cbd4f
</style>
