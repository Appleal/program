<template>
  <div class="userMsg">
    <user-msg></user-msg>
    <p class="order">
      <span>填写订单</span>
    </p>
    <div class="drug">
      <ul class="list">
        <li>
          <label>订单名称：</label>
          <el-input placeholder="请输入订单名称" size="small" style="width: auto;margin-right: 10px;">
          </el-input>
        </li>
      </ul>
      <div class="custom-table">
        <el-table style="width: 100%"
                  :data="tableData"
                  border
                  stripe
                  size="mini"
                  header-row-class-name="element-headerRowClassName">
          <el-table-column label="产品名称" width="" align="center">
            <template slot-scope="scope">
                <el-select v-model="scope.row.labe" filterable="" remote="" reserve-keyword placeholder="请输入关键词" :remote-method="remoteMethod" :loading="loading">
                  <el-option v-for="item in options4" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="单价" prop="unitPrice" width="" align="center">
          </el-table-column>

          <el-table-column label="数量" width="" align="center">
            <template slot-scope="scope" >
                <el-input size="mini" v-model="scope.row.productNum"  @change="sendValueChange" >
                </el-input>
            </template>
          </el-table-column>
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
                v-for="(columnButton, columnButtonIndex) in columnButtonData"
                :key="columnButton"
                @click.native.prevent="rowAction(columnButtonIndex, columnButtonData, scope.$index, tableData)"
                class="custom-columnButton"
                type="text"
                size="small">
                <span>{{columnButton}}</span>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="addTh" @click = addTh()>添加+</div>
        <div class="summary">
          <el-table style="width: 100%"
                    :data="tableSummary"
                    :show-header = 'false'
                    border
                    stripe
                    size="mini"
                    header-row-class-name="element-headerRowClassName">
            <el-table-column v-for="column in summaryColumnData"
                             :label="column.label"
                             :width="column.width"
                             :align="column.align"
                             :prop="column.prop"
                             :key="column.prop">
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="pay">
      <div class="paying">
        <p class="title">
          <span>已支付金额：￥{{ payMount }}</span>
        </p>
        <ul>
          <li v-for="(item) in getUnPayDeposit" :key="item.orderName">
            <div class="icon"></div>
            <div class="price">${{ item.amount}}</div>
            <div class="pay-list">
              <p>支付单编号：{{ item.orderNo }}</p>
              <p>支付单名称：{{ item.orderName }}</p>
            </div>

          </li>

        </ul>
      </div>
      <div class="unpaid">
        <p class="title">
          <span>待支付金额：￥{{ waitPay }}</span>
        </p>
        <p class="pay-price"><label>最低支付金额：</label><input placeholder="￥1000" v-model="ordermini" /></p>
        <p class="pay-price"><label>设置订单总价：</label><input placeholder="￥2000" v-model="orderAllprice" @change="getorderAllprice"/></p>
        <p class="hint mt">{{ answer }}</p>
        <p class="hint">若退包率超过3%，最低支付金额将不能低于应付总额的30%</p>
      </div>
    </div>
    <div class="but">
      <router-link to="/orderstep/medicationArrange"> 下一步 </router-link>
      <router-link to="/orderstep/auditlist"> 上一步 </router-link>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {Button, Input, Table, Select, TableColumn, Option} from 'element-ui'
import userMsg from './user-msg.vue'
import listTable from 'base/list-table/list-table'
import { ERR_SUCCESS } from 'api/config'
import { getUnPayDeposit, getGoods } from 'api/placeOrder'
export default {
  data () {
    return {
      userid: ' ',
      payMount: 0, // 已支付定金，后台提供
      answer: 'I cannot give you an answer until you ask a question!',
      waitPay: 0, // 待支付金额
      allPrices: 0, // 药品总价
      notPayMount: 0, // 未支付金额
      orderAllprice: 0, // 订单总额
      ordermini: 0,
      cboxNumber: 1,
      value: '',
      columnData: [
        {prop: 'allPrice', label: '价格', width: '120', align: 'center'},
        {prop: 'repertory', label: '库存', width: '150', align: 'center'}
      ],
      columnButtonData: ['删除'],
      tableData: [{
        unitPrice: '998',
        productNum: 1,
        allPrice: '998',
        repertory: '充足'
      }, {
        unitPrice: '998',
        productNum: 1,
        allPrice: '998',
        repertory: '充足'
      }],
      options4: [],
      value9: [],
      list: [],
      loading: false,
      states: ['Alabama', 'Alaska', 'Arizona',
        'Arkansas', 'California', 'Colorado',
        'Connecticut', 'Delaware', 'Florida'],
      // 合计
      summaryColumnData: [
        {prop: 'unitPrice', label: '单价', width: '390', align: 'center'},
        {prop: 'productNum', label: '数量', width: '200', align: 'center'},
        {prop: 'allPrice', label: '价格', width: '120', align: 'center'},
        {prop: 'repertory', label: '库存', width: '150', align: 'center'},
        {prop: 'prountPrice', label: '产品价格', width: '200', align: 'center'}
      ],
      // 合计table
      tableSummary: [{
        unitPrice: '合计',
        productNum: '',
        allPrice: '',
        repertory: '产品总价',
        prountPrice: ''
      }],
      getUnPayDeposit: [] // 支付订单数据
    }
  },
  methods: {
    addTh () {
      this.calculate()
    },
    sendValueChange () {
      for (var i = 0; i < this.tableData.length; i++) {
        this.tableData[i].allPrice = this.tableData[i].unitPrice * parseInt(this.tableData[i].productNum)
      }
      this.calculate()
    },
    calculate () {
      this.allPrices = 0
      this.cboxNumber = 0
      for (var i = 0; i < this.tableData.length; i++) {
        this.allPrices += parseInt(this.tableData[i].allPrice)
        this.cboxNumber += parseInt(this.tableData[i].productNum)
      }
      this.tableSummary[0].allPrice = '￥' + this.allPrices
      this.tableSummary[0].prountPrice = '￥' + this.allPrices
      this.tableSummary[0].productNum = this.cboxNumber + '盒'
    },
    rowAction (index, bottoms, rowIndex, row) { // 删除一行数据
      this.tableData.splice(1, rowIndex)
      this.calculate()
    },
    payAmount (obj) { // 获取已支付定金
      for (var i = 0; i < obj.length; i++) {
        this.payMount += parseInt(obj[i].amount)
      }
      return this.formatCurrency(this.payMount)
    },
    getorderAllprice () { // 计算剩余支付
      this.waitPay = this.orderAllprice - this.payMount
    },
    addPrice (n) {
    },
    getAnswer (info) {
      setTimeout(() => {
        this.payMount = info
      }, 500)
    },
    remoteMethod (query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.options4 = this.list.filter(item => {
            return item.label.toLowerCase()
              .indexOf(query.toLowerCase()) > -1
          })
        }, 300)
      } else {
        this.options4 = []
      }
    }
  },
  mounted () {
    this.list = this.states.map(item => {
      return { value: item, label: item }
    })
  },
  created () {
    this.calculate()
    let data = {
      index: 3
    }
    this.$emit('showCityName', data)
    var userInfo = JSON.parse(localStorage.getItem('userMessage'))
    this.userid = userInfo.data.id

    // 获取订单余额信息
    getUnPayDeposit({
      userid: this.userid
    }).then((res) => {
      if (res.code === ERR_SUCCESS) {
        this.payAmount(res.data)
      }
    }).catch((error) => {
      console.log(error)
    })
    // 获取药品信息
    getGoods().then((res) => {
      if (res.code === ERR_SUCCESS) {
      }
    }).catch((error) => {
      console.log(error)
    })
  },
  updated () {
    window.scroll(0, 0)
  },
  watch: {
    ordermini: function (newQuestion, oldQuestion) {
      this.answer = newQuestion
      this.getAnswer(newQuestion)
    }
  },
  components: {
    [Button.name]: Button,
    [Input.name]: Input,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Select.name]: Select,
    [Option.name]: Option,
    userMsg,
    listTable
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .userMsg
    width 98%
    margin 0 auto
    margin-top 20px
  .order
    height 30px
    line-height 30px
    border-bottom 1px solid #c2c2c2
    margin-bottom 10px
    span
      width 100px
      border 1px solid #c2c2c2
      display inline-block
      border-bottom none
      height 30px
      text-align center
      font-size 12px
      background-color #FFFFFF
  textarea
    width 99%
    height 120px
    resize none
    border:none
    border 1px solid #d3cbcb
    padding-left 6px
    padding-top 6px
    outline none
    color #666
  .but
    height 50px
    margin-top 30px
    a
      float right
      width 120px
      height 36px
      border-radius 3px
      background-color #e6e6e6
      border 1px solid #b3b3b3
      text-align center
      line-height 36px
      cursor pointer
      margin-right 26px
      &:hover
        background-color #2873d0
        border 1px solid #2873d0
        color #FFFFFF
  .pay
    overflow hidden
    margin-bottom 20px
  .paying
     width 50%
     float left
     li
       float left
       width 86%
       margin-left 2%
       height 72px
       background-color #e6e6e6
       margin-bottom 14px
       .icon
          width 80px
          float left
          height 72px
          text-align center
          line-height 72px
       .pay-list
         margin-left 80px
         margin-right 100px
         p
           height 36px
           line-height 36px
           float left
     .price
        height 72px
        width 100px
        line-height 70px
        font-size 24px
        text-align center
        float right
        color #4d4d4d
        font-weight bold
   .unpaid
      width 50%
      float left
  .title
    height 30px
    width 90%
    float left
    line-height 30px
    border-bottom 1px solid #c2c2c2
    margin-bottom 20px
    span
      width 200px
      border 1px solid #c2c2c2
      display inline-block
      border-bottom none
      height 30px
      text-align center
      font-size 12px
      background-color #FFFFFF
  .pay-price
      float left
      width 80%
      margin-bottom 10px
      font-size 12px
      label
        width 100px
        float left
        height 32px
        line-height 32px
      input
        width 300px
        line-height 30px
        height 30px
        border 1px solid #c2c2c2
        padding-left 4px
  .order-price
    float:left
    width 80%
  .hint
    float left
    width 100%
    height 22px
    line-height 22px;
    color #b3b3b3
    font-size 12px
   .mt
      margin-top 20px
  .list
    width 100%
    height 40px
    li
      float left
      width 30%
      margin-left 30px
  .drug
    margin-bottom 20px
  .addTh
    height 40px
    line-height 40px
    text-align center
    cursor pointer
    border-left 1px solid #ebeef5
    border-right 1px solid #ebeef5
    bordr-top none
</style>
