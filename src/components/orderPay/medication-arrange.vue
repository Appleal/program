<template>
  <div class="userMsg">
    <user-msg></user-msg>
    <p class="order">
      <span>用药安排</span>
    </p>

    <p class="symptoms">主治症状：阳痿</p>
    <ul class="cycle-list">
      <li>服用周期：20天</li>
      <li>推送条件：收货后第 1 天</li>
      <li>服用周期：三天</li>
    </ul>
    <el-table
      :data="showtableData"
      border
      stripe
      style="width: 100%"
      size="mini"
      header-row-class-name="element-headerRowClassName">
      <el-table-column v-for="item in showTableColumn"
                       :label="item.label"
                       :width="item.width"
                       :align="item.align"
                       :prop="item.prop"
                       :key="item.prop">
      </el-table-column>
    </el-table>
    <div class="medication-btn">
      <el-button>取消用药安排</el-button>
      <el-button>修改用药安排</el-button>
    </div>
    <p class="medication-note">备注：无</p>
    <el-checkbox-group v-model="checkboxGroup4" size="mini">
      <el-checkbox-button v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox-button>
    </el-checkbox-group>
    <ul class="arrange">
      <li>
        <label>服用周期：</label>
        <el-input placeholder="13天" size="small" style="width: auto;margin-right: 10px;" disabled="">
        </el-input>
      </li>
      <li>
        <label>推送条件：</label>
        <el-select v-model="startdata" placeholder="请选择" class="downSelct" >
          <el-option
            v-for="item in deliveryonditions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            @change="_deliveryonditions"
          >
          </el-option>
        </el-select>
      </li>
      <li>
        <label>效果反馈周期：</label>
        <el-select v-model="cycle" placeholder="请选择" class="downSelct">
          <el-option
            v-for="item in feedbackoop"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </li>
    </ul>
    <div class="custom-table">
      <el-table style="width: 100%"
                :data="tableData"
                border
                stripe
                size="mini"
                header-row-class-name="element-headerRowClassName">
        <el-table-column label="排序" width="" align="center">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="rowUp(scope.$index, tableData)"
              class="custom-columnButton"
              type="text"
              size="small">
              <span>向上排序</span>
            </el-button>
            <el-button
              @click.native.prevent="rowDown(scope.$index, tableData)"
              class="custom-columnButton"
              type="text"
              size="small">
              <span>向下排序</span>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="产品名称" width="" align="center">
          <template slot-scope="scope">
            <el-select v-model="scope.row.label" class="medium" filterable="" remote="" reserve-keyword placeholder="请输入关键词">
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
    <p class="hint" >桑娃补肾丸、太子参黄精、必邦软胶囊未被安排</p>
    <div class="remark">
      <label>填写备注：</label>
      <textarea placeholder="请输入备注内容"></textarea>
    </div>
    <div class="but">
      <router-link to="/orderstep/placeorder"> 提交 </router-link>
      <router-link to="/orderstep/placeorder"> 上一步 </router-link>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Vue from 'vue'
import {Button, Input, Table, Select, TableColumn, Option, Form, FormItem, Checkbox, CheckboxButton, CheckboxGroup} from 'element-ui'
import userMsg from './user-msg.vue'
import listTable from 'base/list-table/list-table'
export default {
  data () {
    return {
      checkboxGroup4: ['上海'],
      cities: ['上海', '北京', '广州', '深圳'],
      deliveryonditions: [
        {label: '1天', value: '0'},
        {label: '2天', value: '1'},
        {label: '3天', value: '2'},
        {label: '4天', value: '3'},
        {label: '5天', value: '4'},
        {label: '6天', value: '5'},
        {label: '7天', value: '6'}
      ],
      feedbackoop: [
        {label: '立刻生效', value: '0'},
        {label: '收货后第一天', value: '1'},
        {label: '收货后第二天', value: '2'},
        {label: '收货后第三天', value: '3'},
        {label: '收货后第四天', value: '4'}
      ],
      showtableData: [],
      showTableColumn: [
        {prop: 'product', label: '产品', width: '120', align: 'center'},
        {prop: 'measurement', label: '计量', width: '320', align: 'center'},
        {prop: 'frequency', label: '频次', width: '420', align: 'center'},
        {prop: 'takeWay', label: '服用方式', width: '220', align: 'center'}
      ],
      startdata: '',
      cycle: '',
      userid: ' ',
      value: '',
      columnData: [
        {prop: 'allPrice', label: '价格', width: '120', align: 'center'},
        {prop: 'repertory', label: '库存', width: '150', align: 'center'}
      ],
      columnButtonData: ['删除'],
      tableData: [],
      options4: [],
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
    rowUp (rowIndex, row) {
      var rm = this.tableData[rowIndex - 1]
      this.tableData[rowIndex - 1] = this.tableData[rowIndex]
      this.tableData[rowIndex] = rm
      Vue.set(this.tableData[rowIndex - 1])
    },
    rowDown (rowIndex, row) {
      var rm = this.tableData[rowIndex + 1]
      this.tableData[rowIndex + 1] = this.tableData[rowIndex]
      this.tableData[rowIndex] = rm
      Vue.set(this.tableData[rowIndex + 1])
    },
    _deliveryonditions () {
    },
    addTh () {
      this.tableData.push({
        unitPrice: '998',
        productNum: 1,
        allPrice: '998',
        repertory: '充足'
      })
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
    }
  },
  created () {
    this.calculate()
    let data = {
      index: 4
    }
    this.$emit('showCityName', data)
    var userInfo = JSON.parse(localStorage.getItem('userMessage'))
    this.userid = userInfo.data.id
  },
  updated () {
    window.scroll(0, 0)
  },
  components: {
    [Button.name]: Button,
    [Input.name]: Input,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Select.name]: Select,
    [Option.name]: Option,
    [Form.name]: Form,
    [FormItem.name]: FormItem,
    [Checkbox.name]: Checkbox,
    [CheckboxButton.name]: CheckboxButton,
    [CheckboxGroup.name]: CheckboxGroup,
    userMsg,
    listTable
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .symptoms
    height 30px
    line-height 30px
  .cycle-list
    height 40px
    line-height 40px
    li
      float left
      width 33%
  .medication-btn
    text-align right
    margin-top 40px
  .medication-note
    height 30px
    line-height 30px

  .custom-table
    margin-bottom 10px
  .hint
    color #ff3333
    font-size 12px
    margin-left 20px
    margin-bottom 20px
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
  .userMsg
    width 98%
    margin 0 auto
    margin-top 20px
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
  .remark
    label
      width 80px
      font-size 12px
      display block
      float left
      line-height 20px
      height 120px
      text-align right
    textarea
      width 900px
      height 120px
      resize none
      display block
      border:none
      border 1px solid #d3cbcb
      padding-left 6px
      padding-top 6px
      outline none
      color #666
  .arrange
    margin-left 20px
    overflow hidden
    margin-bottom 20px
    margin-top 20px
    li
      float left
      width 33%
      input
        display none

  .el-input__inner
    display none
  .addTh
    height 40px
    line-height 40px
    text-align center
    cursor pointer
    border-left 1px solid #ebeef5
    border-right 1px solid #ebeef5
    bordr-top none
</style>
