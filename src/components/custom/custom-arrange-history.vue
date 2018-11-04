<template>
  <div>
    <c-title>
      <p slot="title">{{ title }}</p>
      <span slot="modify" @click="modify">{{ modifyBut }}</span>
      <span slot="cancel" @click="cancal">{{ cancelBut }}</span>
    </c-title>
    <div v-for="(item, index) in userList" :key="index">
      <div class="history-arrange">
        <p class="attending">{{item.majorFunction}}(主治)</p>
        <p class="time">服用时间段：{{_format(item.beginDate)}} 至 {{_format(item.endDate)}}</p>
        <ul>
          <li>服用周期：{{item.medicDays}}天</li>
          <li>开始服用日期：{{_format(item.beginDate)}} </li>
          <li>效果反馈周期：{{item.feedbackPeriod}}天</li>
        </ul>
      </div>
      <div class="summary">
        <el-table
          :data="userList[index].userPlanDetailList"
          border
          style="width: 100%"
          size="small"
          header-row-class-name="grayElement-headerRowClassName"
          row-class-name="grayElement-headerRowClassName">

          <el-table-column label="产品" width="" align="center" prop="goodsName"></el-table-column>
          <el-table-column label="剂量" width="120" align="center">
            <template slot-scope="scope" >
              {{userList[index].userPlanDetailList[scope.$index].drugDosage}}{{userList[index].userPlanDetailList[scope.$index].useUnit}}
            </template>
          </el-table-column>
          <el-table-column label="频次" width="120" align="center">
            <template slot-scope="scope" >
              {{userList[index].userPlanDetailList[scope.$index].drugRateName}}
            </template>
          </el-table-column>
          <el-table-column label="服用方式" width="120" align="center">
            <template slot-scope="scope" >
              {{_formAge(userList[index].userPlanDetailList[scope.$index].drugUsage)}}
            </template>
          </el-table-column>
        </el-table>
      </div>
      </div>
    <div>
      <slot name="note"></slot>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {Table, TableColumn} from 'element-ui'
import { format } from 'common/js/util'
import cTitle from 'base/c-title/c-title'
import { ERR_SUCCESS } from 'api/config'
import { cancelAppUserDrugPlan } from 'api/user'

export default {
  props: {
    title: {
      type: String
    },
    tid: {
      type: [Number, String]
    },
    modifyBut: {
      type: String
    },
    cancelBut: {
      type: String
    },
    userList: {
      type: Array
    },
    drugPlan: {
      type: Array
    }
  },
  data () {
    return {
      drugId: ''
    }
  },
  created () {
  },
  computed: {
  },
  methods: {
    cancal () {
      this.$emit('showCityName', 'cancal')
      this.drugId = this.userList[0].id
      cancelAppUserDrugPlan({userid: this.tid, id: this.drugId}).then((res) => { // 取消用药
        if (res.code === ERR_SUCCESS) {
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    _formAge (e) {
      if (e === '0') {
        return '内服'
      } else {
        return '外用'
      }
    },
    _format (number) {
      return format(number)
    },
    modify () {
      this.$emit('showCityName', 'modify')
    }
  },
  watch: {
    // userList () {
    //  debugger
    // }
  },
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    cTitle
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/css/variable"
@import "~common/css/mixin"
  .blue
    .history-arrange
      background-color #b8cbe6
      overflow hidden
      li
        color #ffffff
      .time
        color #e1ebfa
  .history-arrange
    margin-top 20px
    height 108px
    overflow hidden
    background-color #e6e6e6
    ul
      margin 0 auto
      width 96%
    li
      float left
      width 40%
      height 30px
      line-height 30px
      font-size 12px
      &:last-child
        width 20%
        text-align right
    .attending
      margin-top 16px
      height 30px
      line-height 30px
      text-align center
      font-size 16px
    .time
      height 24px
      line-height 24px
      font-size 12px
      color #999999
      text-align center
</style>
