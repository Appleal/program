<template>
  <div class="wapper">
    <c-scroll :data="userList">
       <div class="arrange-wapper">
      <div class="showArrange" v-if="showArrange"> <!--第一页数据 展示  当前用药 历史用药  暂无用药-->
        <div class="not-arrange" v-if="medication" >
          <c-title>
            <p slot="title">用药安排</p>
          </c-title>
          <div class="add-list">
            <div class="arrange-icon">
              <img src="./arrange.png">
            </div>
            <div class="arrange-add">
              <p>暂无用药安排或您已取消用药安排 </p>
              <P>客户无法再接收到【用药提醒】</P>
              <button @click="addArrange">新增用药安排</button>
            </div>
          </div>
        </div>
        <div class="curfrent" v-else>
          <arrange-history title="当前用药" @showCityName="updateStep" class="blue" :modifyBut="modifyBut" :tid="tid" :cancelBut="cancelBut" :userList="DrugPlan">
            <div slot="note" class="notes" v-if="note">
              <label>备注:</label>
              <span v-html="remark"></span>
              <!--<span v-html="remarkHtml"></span>-->
            </div>
          </arrange-history>
        </div>
        <arrange-history title="历史用药" :userList="userList" v-if="userList.length>0"></arrange-history>
      </div>

      <div class="editArrange" v-else>
        <div class="symptoms">
          <strong class="msg-input-strong">*</strong>
          <label>主治症状：</label>
          <div class="select-symptoms auditlist symptom">
            <el-checkbox-group v-model="majorFunction" size="mini" >
            <el-checkbox-button v-for="item in symptomtypeListText" size="mini" :label="item" :key="item">{{item}}</el-checkbox-button>
          </el-checkbox-group>
          </div>
        </div>
        <div>
          <ul class="arrange">
            <li>
              <strong class="msg-input-strong">*</strong>
              <label>服用周期：</label>
              <el-input placeholder="请输入数字" @input="changeMedicDays" v-model="medicDays" size="mini" style="width: auto;margin-right: 10px;">
              </el-input>
            </li>
            <li>
              <strong class="msg-input-strong">*</strong>
              <label>开始服用日期：</label>
              <el-date-picker
                v-model="beginDate"
                type="date"
                size="mini"
                class="startdate"
                placeholder="选择日期"
                :picker-options="pickerOptions"
              >
              </el-date-picker>
            </li>
            <li>
              <strong class="msg-input-strong">*</strong>
              <label>效果反馈周期：</label>
              <el-select v-model="feedbackPeriod" placeholder="请选择" size="mini" style="width: 190px" class="downSelct">
                <el-option
                  v-for="item in feedbackoop"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </li>
          </ul>
        </div>
        <div class="custom-table">
          <el-table style="width: 100%"
                    :data="userPlanDetailList"
                    border
                    stripe
                    size="mini"
                    header-row-class-name="element-headerRowClassName">

            <el-table-column label="产品名称" width="220" align="center">
              <template slot-scope="scope">
                <el-select v-model="scope.row.goodsid" style="width: 200px"  size="mini"   placeholder="请输入关键词" @change="changeType(scope.row.goodsid, scope.row, UserGoods, scope.$index)">
                  <el-option
                    v-for="item in UserGoods" :key="item.id"
                    :label="item.name" :value="item.id"
                    v-show="!goodsidObj[item.id]"
                    :disabled="item.disabled">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>

            <el-table-column label="类型" width="120" align="center">
              <template slot-scope="scope" >
                <span>{{scope.row.ptypeName}}</span>
                <!--保健品-->
              </template>
            </el-table-column>

            <el-table-column label="剂量" width="160" align="center">
              <template slot-scope="scope" >
                <div style="width: 110px; display: inline-block">
                  <el-select v-model="scope.row.drugDosage"  placeholder="请选择"  size="mini" >
                    <el-option
                      v-for="item in scope.row.dosageList"
                      :key="item.id"
                      :value="item.id"
                      :label="item.name"
                    >
                    </el-option>
                  </el-select>
                </div>
                <span>{{scope.row.useUnit}}</span>
              </template>
            </el-table-column>

            <el-table-column label="频次" prop="unitPrice" width="" align="center">
              <template slot-scope="scope">
                <el-select v-model="scope.row.drugRate" size="mini"  placeholder="请选择">
                  <el-option
                    v-for="item in scope.row.frequencyList"
                    :key="item.id"
                    :value="item.id"
                    :label="item.name"
                    >
                  </el-option>
                </el-select>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="80" align="center">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="rowAction( scope.$index, userPlanDetailList)"
                  type="text"
                  size="small">
                  <span style="color: red">删除</span>
                </el-button>
              </template>
            </el-table-column>

            <el-table-column label="排序" width="160" align="center">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="firstRow(scope.$index, userPlanDetailList[scope.$index])"
                  class="custom-columnButton"
                  type="text"
                  size="small"
                >
                  <span class="icon-firstRow" style="font-size: 26px"></span>
                </el-button>
                <el-button
                  @click.native.prevent="upRow(scope.$index, userPlanDetailList[scope.$index])"
                  class="custom-columnButton"
                  type="text"
                  size="small"
                >
                  <span class="icon-upRow" style="font-size: 14px"></span>
                </el-button>
                <el-button
                  @click.native.prevent="downRow(scope.$index, userPlanDetailList[scope.$index])"
                  class="custom-columnButton"
                  type="text"
                  size="small"
                >
                  <span class="icon-downRow" style="font-size: 14px"></span>
                </el-button>
                <el-button
                  @click.native.prevent="lastRow(scope.$index, userPlanDetailList[scope.$index], userPlanDetailList)"
                  class="custom-columnButton"
                  type="text"
                  size="small"
                >
                  <span class="icon-lastRow" style="font-size: 26px"></span>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="addTh">
            <el-button @click = addTh() size="mini" style="width: 200px" :disabled="addState">添加+</el-button>
          </div>

          <div class="note">
            <label>备注：</label>
            <textarea v-model="remark" @input="changeContent"></textarea>
            <p>
              <span class="msg-input-tpl-label">
                  已输入
                  <strong class="remark-title">  {{remark ? remark.length : 0}} </strong>/500
                  字
                  </span>
            </p>
          </div>

          <div class="btn">
            <button class="save" @click="save(active)">保存</button>
            <button class="cancel" @click="cancel">取消</button>
          </div>
        </div>
      </div>
    </div>
    </c-scroll>
  </div>
</template>

<script type="text/ecmascript-6">
import {
  Message, Button, Input, Table, Select, DatePicker, TableColumn,
  Option, Form, FormItem, Checkbox, CheckboxButton, CheckboxGroup,
  ButtonGroup
} from 'element-ui'
import { mapGetters } from 'vuex'
import cTitle from 'base/c-title/c-title'
import cScroll from 'base/c-scroll/c-scroll'
import { ERR_SUCCESS } from 'api/config'
import { getPlanInitInfo, getAppUserGoods, getAppUserHistoryDrugPlan, addAppUserDrugPlan, getAppUserDrugPlan, updateAppUserDrugPlan } from 'api/user'
import { isNull, format } from 'common/js/util'
import arrangeHistory from './custom-arrange-history.vue'
export default {
  data () {
    return {
      addState: false,
      active: 'add',
      modifyBut: '修改用药',
      cancelBut: '取消用药',
      userList: [], // 历史用药
      DrugPlan: [], // 新增用药
      tid: '',
      drugId: '', // 药品id
      editTable: '',
      showArrange: true,
      medication: false,
      note: false,
      majorFunction: [], // 症状
      symptomtypeListText: [], // 症状列表数据
      medicDays: '', // 服用周期
      beginDate: '', // 开始时间
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now()
        }
      },
      feedbackPeriod: 0, // 效果反馈周期
      feedbackoop: [ // 效果反馈周期数据
        {label: '一天', value: 1},
        {label: '二天', value: 2},
        {label: '三天', value: 3},
        {label: '四天', value: 4},
        {label: '五天', value: 5},
        {label: '六天', value: 6},
        {label: '七天', value: 7}
      ],
      UserGoodsState: [],
      UserGoods: [], // 药品信息
      frequencys: [], // 频次
      userid: ' ',
      value: '',
      columnButtonData: [],
      userPlanDetailList: [],
      remark: '', // 备注
      hasOrderIdList: {},
      goodsidObj: {}
    }
  },
  created () {
    this.hasOrderList = 0
    this.UserGoodsClone = []
    this.$nextTick(() => {
      const {tid} = this.$route.query
      if (isNull(tid)) return
      this.tid = tid
      this._getAppUserGoods(tid)
      this._getAppUserHistoryDrugPlan(tid)
      this._getAppUserDrugPlan(tid)
    })
    this._getPlanInitInfo()
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    changeMedicDays (e) {
      setTimeout(() => {
        if (e < 1) {
          this.medicDays = ''
        } else {
          this.medicDays = e.replace(/[^0-9]/g, '')
        }
      }, 20)
    },
    updateStep (data) { // 用药头部修改/取消
      if (data === 'cancal') {
        this.medication = true
        this.UserGoodsChange()
        this._getAppUserHistoryDrugPlan(this.tid)
      } else {
        this.showArrange = false // 修改用药
        this.active = 'modify'
        this._getAppUserDrugPlans(this.tid)
        this.UserGoodsChange()
        this.adTable()
      }
    },
    _conversion (list) {
      const arr = []
      list.forEach(e => {
        arr.push(e['name'])
      })
      this.symptomtypeListText = arr
    },
    _getAppUserGoods (userid) { // 获取药品信息
      getAppUserGoods({userid: userid}).then((res) => {
        if (res.code === ERR_SUCCESS) {
          this.UserGoods = res.data
          this.UserGoodsClone = res.data
          this.UserGoodsState = res.data
          if (res.data && res.data.length > 0) {
            this.hasOrderList = 2
          } else {
            this.hasOrderList = 1
          }
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    _getAppUserHistoryDrugPlan (userid) { // 获取用药安排历史记录
      getAppUserHistoryDrugPlan({userid: userid}).then((res) => {
        if (res.code === ERR_SUCCESS) {
          this.userList = res.data
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    _getAppUserDrugPlan (userid) { // 获取新增用药
      getAppUserDrugPlan({userid: userid}).then((res) => {
        if (res.code === ERR_SUCCESS) {
          if (!res.data) {
            this.medication = true
          } else {
            this.drugId = res.data.id
            this.medication = false
            this.note = true
            this.showArrange = true
            this.DrugPlan = []
            this.DrugPlan.push(res.data)
            const dataList = res.data
            this._chanBr(dataList.remark)
            this.userPlanDetailList = dataList.userPlanDetailList
            this.medicDays = dataList.medicDays
            this.beginDate = dataList.beginDate
            this.remark = dataList.remark
            this.feedbackPeriod = dataList.feedbackPeriod
            this.majorFunction = dataList.majorFunction.split(',')
          }
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    _getAppUserDrugPlans (userid) { // 获取新增用药
      getAppUserDrugPlan({userid: userid}).then((res) => {
        if (res.code === ERR_SUCCESS) {
          if (!res.data) {
            this.medication = true
          } else {
            const dataList = res.data
            this._chanBr(dataList.remark)
            this.medicDays = dataList.medicDays
            this.beginDate = dataList.beginDate
            this.remark = dataList.remark
            this.feedbackPeriod = dataList.feedbackPeriod
            this.majorFunction = dataList.majorFunction.split(',')
            this.userPlanDetailList = dataList.userPlanDetailList
            this.adTable()
          }
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    _chanBr (data) {
      this.remark = data.replace(/(\r\n|\r|\n)/g, '<br>')
    },
    _addAppUserDrugPlan (userInfo) { // 提交新增用药安排
      addAppUserDrugPlan(userInfo).then((res) => {
        if (res.code === ERR_SUCCESS) {
          this._getAppUserDrugPlan(this.tid) // 获取保存之后的新增用药
          return Message.success('提交成功')
        } else {
          return Message.error(res.msg)
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    _getPlanInitInfo () { // 获取用药跟症状
      getPlanInitInfo().then((res) => {
        if (res.code === ERR_SUCCESS) {
          this._conversion(res.data.symptomtypeList)
          // this.frequencys = res.data.goodsxypcList
        } else {
          this.isPost = -1
        }
      })
    },
    addArrange () {
      if (this.hasOrderList === 0) {
        return Message.error('数据正在加载中...')
      } else if (this.hasOrderList === 1) {
        return Message.error('该客户未曾签收订单...')
      } else {
        this.showArrange = false
        this.userPlanDetailList = []
        this.medicDays = ''
        this.beginDate = ''
        this.feedbackPeriod = ''
        this.remark = ''
        this.majorFunction = []
      }
    },
    upRow (rowIndex, row) { // 向上移动排序
      this.userPlanDetailList[rowIndex].sort -= 1
      this.userPlanDetailList[rowIndex - 1].sort += 1
      this.userPlanDetailList.splice(rowIndex, 1)
      this.userPlanDetailList.splice(rowIndex - 1, 0, row)
    },
    downRow (rowIndex, row) {
      this.userPlanDetailList[rowIndex].sort += 1
      this.userPlanDetailList[rowIndex + 1].sort -= 1
      this.userPlanDetailList.splice(rowIndex, 1)
      this.userPlanDetailList.splice(rowIndex + 1, 0, row)
    },
    firstRow (rowIndex, row) {
      this.userPlanDetailList[rowIndex].sort = 0
      this.userPlanDetailList[0].sort = rowIndex
      this.userPlanDetailList.splice(rowIndex, 1)
      this.userPlanDetailList.splice(0, 0, row)
    },
    lastRow (rowIndex, row, userPlanDetailList) {
      const dataLength = userPlanDetailList.length - 1
      this.userPlanDetailList[rowIndex].sort = dataLength
      this.userPlanDetailList[dataLength].sort = rowIndex
      this.userPlanDetailList.splice(rowIndex, 1)
      this.userPlanDetailList.splice(dataLength, 0, row)
    },
    changeType (userName, item, options, index) { // 获取相对应的类型
      let newOptions = options.slice()
      newOptions.forEach(scale => {
        console.log(scale)
        if (scale['id'] == userName) { /* eslint-disable-line eqeqeq */
          item.ptypeName = scale['ptypeName']
          item.useUnit = scale['useUnit']
          item.drugDosage = scale['drugDosage'] // 计量
          item.dosageList = scale['dosageList']// 剂量列表
          item.drugRate = scale['drugRate'] // 频次
          item.frequencyList = scale['frequencyList'] // 计量列表
          item.sortIndex = index
        }
      })
      this.UserGoods = newOptions
      this.UserGoodsChange()
    },
    UserGoodsChange () {
      const { userPlanDetailList } = this
      let goodsidObj = []
      for (let userGood of userPlanDetailList) {
        goodsidObj[userGood.goodsid] = true
      }
      this.goodsidObj = goodsidObj
    },
    addTh () {
      if (this.addState) return
      this.userPlanDetailList.push({
        goodsid: '',
        drugDosage: '',
        drugRate: ''
      })
      this.adTable()
    },
    adTable () {
      const {UserGoodsState, userPlanDetailList} = this
      if (userPlanDetailList.length === UserGoodsState.length) {
        this.addState = true
      } else {
        this.addState = false
      }
    },
    rowAction (rowIndex, row) { // 删除一行数据
      this.userPlanDetailList.splice(rowIndex, 1)
      this.UserGoodsChange()
      this.adTable()
    },
    save (str) {
      const {beginDate, medicDays, feedbackPeriod, majorFunction} = this
      if (isNull(majorFunction)) {
        Message.error('请选择主治症状！')
        return
      }
      if (isNull(medicDays)) {
        Message.error('请选择服用周期！')
        return
      }
      if (isNull(beginDate)) {
        Message.error('请选择开始时间！')
        return
      }
      if (isNull(feedbackPeriod)) {
        Message.error('请选择效果反馈周期！')
        return
      }
      if (this.vaTable()) return
      if (str === 'add') { // 新增用药
        let newUser = []
        this.userPlanDetailList.forEach(e => {
          let {goodsid, drugDosage, drugRate, sortIndex} = e
          newUser.push({goodsid, drugDosage, drugRate, sortIndex})
        })
        const editTable = {
          'planInfo': {
            'userid': this.tid,
            'majorFunction': this.majorFunction.join(','),
            'beginDate': format(this.beginDate, '$1-$2-$3 $4:$5:$6'),
            'medicDays': this.medicDays,
            'feedbackPeriod': this.feedbackPeriod,
            'remark': this.remark
          },
          'userPlanDetailList': newUser
        }
        this._addAppUserDrugPlan(editTable) // 提交数据
        // localStorage.setItem('editTable', JSON.stringify(editTable))
      } else {
        // 提交修改之后的数据
        let newUser = []
        this.userPlanDetailList.forEach(e => {
          let {goodsid, drugDosage, drugRate, sortIndex} = e
          newUser.push({goodsid, drugDosage, drugRate, sortIndex})
        })
        const editTable = {
          'planInfo': {
            'id': this.drugId,
            'userid': this.tid,
            'majorFunction': this.majorFunction.join(','),
            'beginDate': format(this.beginDate, '$1-$2-$3 $4:$5:$6'),
            'medicDays': this.medicDays,
            'feedbackPeriod': this.feedbackPeriod,
            'remark': this.remark
          },
          'userPlanDetailList': newUser
        }
        // this.userPlanDetailList.forEach(e => {
        // e.drugRate = this._corDrugeverse(e.drugRate)
        // })
        updateAppUserDrugPlan(editTable).then((res) => {
          if (res.code === ERR_SUCCESS) {
            Message.success('保存成功')
            this._getAppUserDrugPlan(this.tid) // 获取保存之后的新增用药
          } else {
            Message.error(res.msg)
          }
        }).catch((error) => {
          console.log(error)
        })
        // localStorage.setItem('editTable', JSON.stringify(editTable))
      }
    },
    changeContent (e) {
      setTimeout(() => {
        if (this.remark.length > 500) {
          const textData = this.remark.substring(0, 500)
          this.remark = textData
        }
      }, 20)
    },
    cancel () {
      this.showArrange = true
      this.userPlanDetailList = []
      this.remark = ''
      this._getAppUserDrugPlans(this.tid)
    },
    vaTable () {
      for (let _t of this.userPlanDetailList) {
        // if (!_t.ptypeName) {
        // Message.error('产品类型不能为空！')
        // return true
        // }
        if (!_t.drugDosage) {
          Message.error('剂量数量，请输入正确的数字！')
          return true
        }
        if (!_t.drugRate) {
          Message.error('频次不能为空！')
          return true
        }
      }
      return false
    }
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
    [DatePicker.name]: DatePicker,
    [ButtonGroup.name]: ButtonGroup,
    cTitle,
    arrangeHistory,
    cScroll
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/css/variable"
@import "~common/css/mixin"
.wapper
  height 430px
  overflow-y auto
.msg-input-strong
  color red
  float left
  line-height 34px
  padding 0 3px
.custom-columnButton
  float left
  padding 0
  width 26px
  line-height 26px
  color #559ef9
.arrange-wapper
  position relative
  .add-list
    margin 0 auto
    padding-top 40px
    height 200px
    width 600px
    .arrange-icon
      float left
      width 200px
    .arrange-add
      float left
      button
        width 120px
        height 30px
        line-height 30px
        cursor pointer
        border-radius 5px
        border:none
        outline none
        background-color #2873d0
        color #ffffff
        margin-top 20px
      p
        font-size 14px
        color #2673ee
        &:first-child
          margin-top 20px
          line-height 30px
.arrange
  margin-top 10px
  margin-bottom 10px
  overflow hidden
  li
    float left
    width 33%
    label
      font-size 12px
    input
      display none
.el-input__inner
  display none
.addTh
  height 40px
  line-height 40px
  text-align center
  cursor pointer
  color #3275fa
  border-left 1px solid #ebeef5
  border-right 1px solid #ebeef5
  border-bottom: 1px solid #ebeef5
.note
  margin 0 auto
  margin-top 20px
  width 100%
  height 100px
  label
    float left
    display inline-block
    padding-top 6px
    width 40px
    height 80px
    font-size 12px
  textarea
    display inline-block
    float left
    padding 6px 0 0 6px
    width 834px
    height 80px
    border 1px solid #f2f2f2
    resize none
    outline none
.symptoms
    height 30px
    line-height 30px
    label
      float left
      font-size 12px
    .select-symptoms
      float left
  .current
    margin-bottom 20px
.notes
    line-height 40px
    font-size 12px
    label
      float left
      display inline-block
      width 36px
    span
      margin-top 10px
      display inline-block
      width 800px
      line-height 20px
.btn
    width 100%
    height 40px
    line-height 40px
    button
      float right
      margin-top 20px
      margin-left 20px
      width 100px
      height 34px
      line-height 34px
      cursor pointer
      border-radius 5px
      border:none
      outline none
      background-color #2873d0
      color #ffffff
    .cancel
      background-color #da4444
.msg-input-tpl-label
    float left
    margin-left 40px
    margin-top 20px
    font-size 12px
    .remark-title
      color red
</style>
