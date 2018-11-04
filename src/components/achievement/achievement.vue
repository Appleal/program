<template>
  <c-table-scroll :data="tableData">
    <div class="achievement-page-left-content">
        <list-table title="订单销售业绩统计">
          <slot slot="query">
            <span>查询时间：</span>
            <el-radio-group v-model="selectData" size="mini" style="margin-right: 41px;"  @change="timeChange('b')">
              <el-radio-button label="0">今天</el-radio-button>
              <el-radio-button label="1">昨天</el-radio-button>
              <el-radio-button label="7">近7天</el-radio-button>
              <el-radio-button label="30">近30天</el-radio-button>
            </el-radio-group>
            <!--<el-date-picker type="date" size="mini"-->
              <!--format="yyyy-MM-dd" value-format="yyyy-MM-dd"-->
               <!--v-model="orderStartDate" placeholder="起始时间" style="width: 170px;">-->
            <!--</el-date-picker>-->
            <!--<span style="margin: 0 10px;">至</span>-->
            <!--<el-date-picker type="date" size="mini"-->
              <!--format="yyyy-MM-dd" value-format="yyyy-MM-dd"-->
              <!--v-model="orderEndDate" placeholder="终止时间" style="width: 170px;">-->
            <!--</el-date-picker>-->
            <!--<el-button size="mini" style="margin-left: 10px;" @click="queryData">查询</el-button>-->
          </slot>
          <div class="statistics-wrapper">
            <div class="statistics-record">
              <h5 class="statistics-title">本月销售订单业绩</h5>
              <span class="statistics-text"> ￥{{ _formatCurrency(parseInt(compares.monthAchieveAmount)) }}</span>
              <h5 class="statistics-title" style="margin-top: 28px">本周销售订单业绩(元)</h5>
              <span class="statistics-text">￥{{ _formatCurrency(parseInt(compares.weekAchieveAmount)) }}</span>
              <div class="statistics-target">
                <span class="statistics-target-num">⇧ {{compares.compare}}</span>
                <span class="statistics-target-text">同比上周</span>
              </div>
            </div>
            <div class="statistics-charts" id="statisticsCharts"></div>
            <!--<div class="statistics-charts" v-else style="line-height: 200px; text-align: center; color: #999; font-size: 12px">暂无数据</div>-->
          </div>
          <div class="achievement-table">
            <el-table style="width: 100%"
                      :data="tableData"
                      v-loading="loading"
                      border
                      stripe
                      size="mini"
                      header-row-class-name="element-headerRowClassName">
              <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
              <el-table-column prop="orderNo" label="订单编号"  align="center"></el-table-column>
              <el-table-column prop="createDate" label="订单日期" width="140" align="center"></el-table-column>
              <el-table-column prop="customerID" label="客户编号"  align="center"></el-table-column>
              <el-table-column prop="customerName" label="客户姓名" width="80" align="center"></el-table-column>
              <el-table-column prop="productStruct" label="套餐配置" width="" align="center"></el-table-column>
              <el-table-column prop="amount" label="总价" width="80" align="center">
                <template slot-scope="scope">
                  <span>￥{{ _formatCurrency(tableData[scope.$index].amount)}} </span>
                </template>
              </el-table-column>
              <el-table-column prop="usedMoney" label="已收金额" width="80" align="center">
                <template slot-scope="scope">
                  <span>￥{{ _formatCurrency(tableData[scope.$index].usedMoney)}} </span>
                </template>
              </el-table-column>
              <el-table-column prop="orderStatus" label="订单状态" width="80" align="center">
                <template slot-scope="scope">
                  <span>{{ _formatstatus(tableData[scope.$index].orderStatus)}} </span>
                </template>
              </el-table-column>
              <el-table-column prop="performanceMoney" label="业绩金额" width="80" align="center">
                <template slot-scope="scope">
                  <span>{{ _formatCurrency(tableData[scope.$index].performanceMoney)}} </span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="achievement-pagination">
            <div class="achievement-pagination-content">
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
    </div>
  </c-table-scroll>
</template>

<script type="text/ecmascript-6">
import {Row, Col, RadioGroup, RadioButton, DatePicker, Button, Table, TableColumn, Pagination} from 'element-ui'
import { formatCurrency, format } from 'common/js/util'
import { getSalesOrders, getCompare, getInfo } from 'api/placeOrder'
import cTableScroll from 'base/c-table-scroll/c-table-scroll'
import { ERR_SUCCESS } from 'api/config'
import listTable from 'base/list-table/list-table'

export default {
  data () {
    return {
      charts: false,
      selectData: '0',
      startTime: '',
      endTime: '',
      orderStartDate: '',
      orderEndDate: '',
      pageNum: 1,
      pageSize: 10,
      total: 10,
      loading: false,
      compares: {
        weekAchieveAmount: 0,
        monthAchieveAmount: 0,
        compare: 0
      },
      tableData: []
    }
  },
  created () {
    this._getSalesOrders()
    this._getCompare()
    this._getInfo()
  },
  methods: {
    _getTime (num) {
      const time = new Date() - (num * 3600 * 24 * 1000)
      this.startTime = format(new Date(time), '$1-$2-$3') + ' 00:00:00'
      if (num === '1') {
        this.endTime = format((new Date() - 3600 * 24 * 1000), '$1-$2-$3') + ' 23:59:59'
      } else {
        this.endTime = format(new Date(), '$1-$2-$3') + ' 23:59:59'
      }
    },
    _formatstatus (status) {
      switch (status) {
        case '1':
          return '待支付'
        case '2':
          return '待发货'
        case '3':
          return '已收货'
        case '4':
          return '已取消'
        case '5':
          return '订单退回'
        default:
          return '已发货'
      }
    },
    _getInfo () {
      const {startTime, endTime, selectData} = this
      getInfo({startTime, endTime}).then(res => {
        if (res.code === ERR_SUCCESS) {
          const { columns, rows } = res.data
          let newColumns = []
          let newRows = []
          let i = 0
          if (selectData === '0') {
            i = 1
            while (i < 25) {
              newColumns.push(`${i}`)
              newRows.push(0)
              i++
            }
          } else {
            let frequency = 32
            const cs = new Date(endTime) - new Date(startTime)
            let _startTime = new Date(startTime).getTime()
            if (selectData === '1') {
              frequency = Math.ceil(cs / 86400000)
            } else {
              frequency = Math.floor(cs / 86400000)
            }
            if (frequency < 31) {
              while (i < frequency) {
                const nd = new Date(_startTime)
                newColumns.push(format(nd))
                newRows.push(0)
                _startTime += 86400000
                i++
              }
            } else {
              newColumns = columns
              newRows = rows
            }
          }
          columns.forEach((col, index) => {
            let nIndex = newColumns.indexOf(col)
            newRows[nIndex] = rows[index]
          })
          this.chartsData(newColumns, newRows)
        }
      })
    },
    changePage (key, num) {
      switch (key) {
        case 'pageSize':
          this.pageSize = num
          this._getSalesOrders()
          break
        case 'pageNum':
          this.pageNum = num
          this._getSalesOrders()
          break
        default:
          break
      }
    },
    timeChange (type) {
      this._getSalesOrders('reset')
      this._getInfo()
    },
    _getCompare () {
      getCompare().then(res => {
        if (res.code === ERR_SUCCESS) {
          const data = res.data
          this.compares.weekAchieveAmount = data.weekAchieveAmount ? data.weekAchieveAmount : 0
          this.compares.monthAchieveAmount = data.monthAchieveAmount ? data.monthAchieveAmount : 0
          this.compares.compare = data.compare ? data.compare : 0
        }
      })
    },
    _formatCurrency (e) {
      return formatCurrency(e, true)
    },
    _getSalesOrders (type) { // table 数据
      this.loading = true
      if (type === 'reset') {
        this.pageNum = 1
      }
      this._getTime(this.selectData)
      const { startTime, endTime, pageNum, pageSize } = this
      getSalesOrders({startTime, endTime, pageNum, pageSize}).then(res => {
        if (res.code === ERR_SUCCESS) {
          const tableData = res.data.list
          this.total = res.data.total
          this.tableData = tableData
          this.loading = false
        }
      })
    },
    queryData () {
      this._getSalesOrders()
    },
    chartsData (columns, rows) {
      let titleLeft = format(new Date(this.startTime))
      let titleRight = format(new Date(this.endTime))
      let titleText = titleLeft
      if (titleLeft !== titleRight) {
        titleText = `( ${titleLeft} ~ ${titleRight} )`
      }
      let option = {
        title: {
          text: '业绩变化趋势',
          subtext: titleText,
          left: 'center',
          textStyle: {
            color: '#333',
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: columns
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: '营销业绩',
          data: rows,
          type: 'line',
          areaStyle: {color: '#b2d4ff'},
          lineStyle: {color: '#b2d4ff'},
          itemStyle: {color: '#b2d4ff'}
        }]
      }
      if (window.echarts && !this.Chart) {
        this.Chart = window.echarts.init(document.getElementById('statisticsCharts'))
        // 加载表格变化
        this.Chart.setOption(option, true)
        window.addEventListener('resize', this.Chart.resize)
      } else if (window.echarts && this.Chart) {
        this.Chart.setOption(option, true)
      }
    }
  },
  mounted () {

  },
  components: {
    [Row.name]: Row,
    [Col.name]: Col,
    [RadioGroup.name]: RadioGroup,
    [RadioButton.name]: RadioButton,
    [DatePicker.name]: DatePicker,
    [Button.name]: Button,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Pagination.name]: Pagination,
    cTableScroll,
    listTable
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/css/variable"
  @import "~common/css/mixin"

  page-init(achievement)

  .statistics-wrapper
    position relative
    padding 24px 15px 0 15px
    .statistics-record
      float left
      width 181px
      height 222px
      border-right 1px solid #ccc
      .statistics-title
        margin-top 9px
        padding 15px 0
        height 14px
        line-height 14px
        font-size $font-size-sm
        color #999
      .statistics-text
        font-size 24px
        font-weight 500
        color $color-text
      .statistics-target
        margin-top 10px
        width 100%
        color #ff3333
      .statistics-target-text,.statistics-target-num
        display inline-block
        width 40%
        font-size $font-size-sm
      .statistics-target-text
        color #999
    .statistics-charts
      margin-left 182px
      height 222px
  .achievement-message-list
    position absolute
    top 0px
    right 0px
    width 25%
    height 100%
    padding-left 5px
    padding-right 5px
    box-sizing border-box
  .achievement-table
    margin-top 24px
    padding 0 15px
  .achievement-pagination
    margin 21px 0
    text-align right
    .achievement-pagination-content
      margin-right 20px
      inline-block-top()
</style>
