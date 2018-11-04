<template>
  <div>
    <ul class="change">
      <li v-if="allData.length > 0" :class="{active: selectItem === index}" v-for="(item, index) in allData" @click="addData(index)" :key="item.orderNo">
        订单{{item.orderNo}}
      </li>
    </ul>
    <p class="order"><span>基本信息</span></p>
    <div>
      <ul class="basicMessage">
        <li>订单编号：{{ message.orderNo }}</li>
        <li>订单名称：{{ message.orderTitle }}</li>
        <li>下单时间：{{ message.createDate }}</li>
        <li>客户姓名：{{ message.receiver }}</li>
        <li>下单人：{{ message.orderCreatePeople }}</li>
        <li>订单状态：{{ message.stateName }}</li>
        <li>订单金额：￥{{ message.payableAmount }}</li>
        <li>已支付：￥{{ message.paid }}</li>
        <li>发货方式：{{ message.sendStyleName }}</li>
      </ul>
    </div>
    <p class="order"><span>产品信息</span></p>
    <div>
      <el-table style="width: 100%"
                :data="tableData"
                border
                stripe
                size="mini"
                header-row-class-name="element-headerRowClassName">
        <el-table-column prop="name" label="产品名称" align="center">
          <template slot-scope="scope">
            {{tableData[scope.$index].name}}
          </template>
        </el-table-column>
        <el-table-column prop="price" label="单价" align="center">
          <template slot-scope="scope">
            ￥{{tableData[scope.$index].price}}
          </template>
        </el-table-column>
        <el-table-column v-for="column in columnData"
                         :label="column.label"
                         :width="column.width"
                         :align="column.align"
                         :prop="column.prop"
                         :key="column.prop">
        </el-table-column>
      </el-table>
      <p class="combined">
        <span>产品总价：￥{{ combined }}</span>
      </p>
    </div>
  <div>
  <!--<p class="order" style="margin-top: 20px" ><span>订单轨迹</span></p>-->
    <!--<el-table style="width: 100%"-->
              <!--:data="track"-->
              <!--border-->
              <!--stripe-->
              <!--size="mini"-->
              <!--header-row-class-name="element-headerRowClassName">-->
      <!--<el-table-column v-for="column in columnTrack"-->
                       <!--:label="column.label"-->
                       <!--:width="column.width"-->
                       <!--:align="column.align"-->
                       <!--:prop="column.prop"-->
                       <!--:key="column.prop">-->
      <!--</el-table-column>-->
    <!--</el-table>-->
  </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {Button, Table, TableColumn} from 'element-ui'
import { getOrderdetail } from 'api/placeOrder'
import { ERR_SUCCESS } from 'api/config'
import { isNull } from 'common/js/util'
export default {
  name: 'orderMessage',
  data () {
    return {
      allData: '',
      selectItem: 0,
      combined: 0,
      message: {

      },
      columnData: [
        {prop: 'number', label: '数量', align: 'center'},
        {prop: 'ptypeName', label: '产品类型', align: 'center'}
      ],
      tableData: []
      // columnTrack: [
      // {prop: 'trackNum', label: 'No', width: '50', align: 'center'},
      // {prop: 'orderNum', label: '订单编号', align: 'center'},
      // {prop: 'orderType', label: '订单状态', align: 'center'},
      // {prop: 'handleBranch', label: '处理部门', align: 'center'},
      // {prop: 'handlePeople', label: '处理人员', align: 'center'},
      // {prop: 'productDate', label: '处理日期', align: 'center'},
      // {prop: 'productType', label: '产品类型', align: 'center'}
      // ],
      // track: []
    }
  },
  created () {
    this.$nextTick(() => {
      const {tid} = this.$route.query
      if (isNull(tid)) return
      getOrderdetail({id: tid}).then((res) => { // 获取账单详情用户信息
        if (res.code === ERR_SUCCESS) {
          this.allData = res.data
          this._change(0)
        }
      })
    })
  },
  methods: {
    totalPrice (goodsList) {
      let totalMoney = 0
      goodsList.forEach(e => {
        totalMoney += e['price'] * e['number']
      })
      this.combined = totalMoney
    },
    _change (num) {
      this.message = this.allData[num]
      if (this.allData[num].goodsList.length > 0) {
        this.tableData = this.allData[num].goodsList
        this.totalPrice(this.allData[num].goodsList)
      }
    },
    addData (index) {
      this.selectItem = index
      this._change(index)
    }
  },
  components: {
    [Button.name]: Button,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/css/variable"
  @import "~common/css/mixin"
  .order
    height 30px
    line-height 30px
    border-bottom 1px solid #c2c2c2
    margin-bottom 10px
    span
      width 100px
      border 1px solid #c2c2c2
      display block
      border-bottom none
      height 30px
      text-align center
      font-size 12px
      background-color #FFFFFF
  .change
    height 30px
    line-height 30px
    margin-bottom 20px
    li
      padding 0 10px
      float left
      border 1px solid #c2c2c2
      margin-right 20px
      font-size 12px
      cursor pointer
    .active
      background #00bafa
      border-color #00bafa
      color #fff
  .basicMessage
    background-color #FFFFFF
    overflow hidden
    margin-bottom 20px
    li
      width 33.3%
      float left
      height 40px
      line-height 40px
      border-bottom 1px solid #FFFFFF
      font-size 12px
      text-align left
      text-indent 30px
      background-color #e6ecf2
      &:nth-child(3n-1)
        background-color #dae5f2
  .combined
    height 40px
    line-height 40px
    border 1px solid #ebeef5
    boder-top none
    span
      float right
      font-size 12px
      margin-right 20px
</style>
