<template>
  <div class="custom-page scheduling-list">
    <div v-show="tabIndex === 0">
      <list-table title="筛选查询" style="box-shadow: none;">
        <slot slot="query">
          <div class="appointment-query-item element-appointment-radio">
            <span>预约状态：</span>
            <el-radio-group v-model="statusText" size="mini" style="margin-right: 41px;">
              <el-radio-button
                v-for="_status in statusList"
                :key="_status.value"
                :label="_status.label"></el-radio-button>
            </el-radio-group>
          </div>
          <div>
            <span>精准查询：</span>
            <el-input placeholder="请输入客户编号" v-model="brmid" size="mini" style="width: auto;margin-right: 10px;">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
            <el-input placeholder="请输入客户姓名" v-model="name" size="mini" style="width: auto;margin-right: 10px;">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
            <el-button size="mini" class="element-button" style="margin-left: 10px;" @click="queryList">查询</el-button>
          </div>
        </slot>
      </list-table>
      <div class="custom-table">
        <el-table style="width: 100%"
                  :data="tableData"
                  border
                  stripe
                  v-loading="loading"
                  size="mini"
                  header-row-class-name="element-headerRowClassName">
          <el-table-column label="客户编号" align="center" prop="brmid"></el-table-column>
          <el-table-column label="客户名称" align="center" prop="name"></el-table-column>
          <el-table-column label="会员等级" align="center" prop="levelShortName"></el-table-column>
          <el-table-column label="客户类型"  align="center" prop="userType"></el-table-column>
          <el-table-column label="申请预约时间" width="145"  align="center" prop="reservationCreateTime">
            <template slot-scope="scope">
              {{_format(scope.row.reservationCreateTime )}}
            </template>
          </el-table-column>
          <el-table-column label="预约状态" align="center" prop="status">
            <template slot-scope="scope">
              {{getStatusText(scope.row.status )}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="145" align="center">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="rowAction(tableData,scope.$index, 'info')"
                type="text"
                :disabled="tableData[scope.$index].status !== 0"
                size="small">安排</el-button>
              <el-button
                @click.native.prevent="rowAction(tableData,scope.$index, 'no')"
                type="text"
                :disabled="tableData[scope.$index].status !== 0"
                size="small">不安排</el-button>
              <el-button
                @click.native.prevent="rowAction(tableData,scope.$index, 'msg')"
                type="text"
                size="small">消息</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="custom-pagination">
        <div class="custom-pagination-content">
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
    </div>
    <list-table title="预约信息" style="box-shadow: none;" hideQuery v-show="tabIndex === 1">
      <div class="scheduling-item-wrapper">
        <div class="scheduling-item">
          <span class="label">客户姓名:</span> {{scheduling.appUserName}}
        </div>
        <div class="scheduling-item">
          <span class="label">预约提交时间:</span> {{scheduling.createTime}}
        </div>
        <div class="scheduling-item">
          <span class="label">想要解决什么问题:</span> {{scheduling.issue}}
        </div>
        <div class="scheduling-item">
          <span class="label">房事情况:</span> {{scheduling.sexSituation}}
        </div>
        <div class="scheduling-item">
          <span class="label">射精情况:</span> {{scheduling.ejaculateSituation}}
        </div>
        <div class="scheduling-item">
          <span class="label">月牙情况:</span> {{scheduling.fingerCrescent}}
        </div>
        <div class="scheduling-item">
          <span class="label">阴茎勃起度:</span> {{scheduling.erectionAngle}}
        </div>
        <div class="scheduling-item">
          <span class="label">其他问题:</span> {{scheduling.additional}}
        </div>
        <div class="scheduling-item-button">
          <el-button size="mini" @click="back">返回列表</el-button>
          <!--<el-button size="mini" @click="reject">不安排</el-button>-->
          <el-button size="mini" @click="makeAppoint">安排预约</el-button>
        </div>
      </div>
    </list-table>

  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters, mapMutations } from 'vuex'
import {
  Button, Table, TableColumn, Pagination, Message,
  RadioGroup, RadioButton, Input
} from 'element-ui'
import listTable from 'base/list-table/list-table'
import { ERR_SUCCESS } from 'api/config'
import { getUnreservationInfo, getReservation } from 'api/reservation'
import { format, isNull } from 'common/js/util'

const STATUS = [
  {label: '全部', value: ''},
  {label: '待确认', value: 0},
  {label: '已安排顾问', value: 1},
  {label: '不安排', value: -2}
]

export default {
  data () {
    return {
      statusText: '全部',
      status: '',
      brmid: '',
      name: '',
      tabIndex: 0,
      scheduling: {},
      tableData: [],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      loading: false,
      statusList: STATUS
    }
  },
  computed: {
    ...mapGetters([
      'appointmentNum'
    ])
  },
  created () {
    this.$nextTick(() => {
      this.queryList()
    })
  },
  beforeDestroy () {
    this.queryTimer && clearTimeout(this.queryTimer)
  },
  methods: {
    queryList () {
      this._getUnreservationInfo('reset')
    },
    getStatusText (status) {
      for (let s of STATUS) {
        if (s.value === status) {
          return s.label
        }
      }
      return status
    },
    _format (e) {
      return format(e, '$1-$2-$3 $4:$5:$6')
    },
    changePage (key, num) {
      switch (key) {
        case 'pageSize':
          this.pageSize = num
          this._getUnreservationInfo()
          break
        case 'pageNum':
          this.pageNum = num
          this._getUnreservationInfo()
          break
        default:
          break
      }
    },
    rowAction (row, rowIndex, type) {
      const data = row[rowIndex]
      if (type === 'msg') {
        this.$router.push({name: 'chatwindow', params: {tid: `a${data.id}`}})
      } else if (type === 'info') {
        this.scheduling = {}
        this._getReservation(data.resevationId)
        this.tabIndex = 1
      } else {
        this.$router.push({path: '/appointment/reject', query: { id: data.resevationId }})
      }
    },
    back () {
      this.tabIndex = 0
    },
    reject () {
      if (isNull(this.scheduling.id)) return
      const { id } = this.scheduling
      this.$router.push({path: '/appointment/reject', query: { id }})
    },
    makeAppoint () {
      if (isNull(this.scheduling.id)) return
      const { id } = this.scheduling
      this.$router.push({path: '/appointment/make', query: { id }})
    },
    _getUnreservationInfo (type) {
      let targetObj
      if (type === 'reset') {
        this.pageNum = 1
        targetObj = this
      } else {
        targetObj = this.targetObj ? this.targetObj : this
      }
      let { status, brmid, name } = targetObj
      const { pageNum, pageSize } = this
      const postObj = { status, brmid, name, pageNum, pageSize }
      this.loading = true
      getUnreservationInfo(postObj).then(res => {
        if (res.code === ERR_SUCCESS) {
          this.targetObj = postObj
          this.tableData = res.data.dataList
          this.total = res.data.total
          let num = 0
          for (let d of this.tableData) {
            if (d.status === 0) {
              num += 1
            }
          }
          this.setAppointmentNum(num)
        } else {
          Message.error(res.msg)
        }
        this.loading = false
      })
    },
    _getReservation (id) {
      getReservation({ id }).then(res => {
        if (res.code === ERR_SUCCESS) {
          this.scheduling = res.data
        } else {
          Message.error(res.msg)
        }
      })
    },

    ...mapMutations({setAppointmentNum: 'SET_APPOINTMENTNUM'})
  },
  watch: {
    appointmentNum () {
      if (this.mapGetters > 1) {
        this.queryList()
      }
    },
    brmid (value) {
      this.brmid = value.replace(' ', '')
    },
    name (value) {
      this.name = value.replace(' ', '')
    },
    statusText () {
      const statusText = this.statusText
      const statusList = this.statusList
      for (let s of statusList) {
        if (s.label === statusText) {
          this.status = s.value
        }
      }
      this.queryList()
    },
    $route () {
      const {path} = this.$route
      if (path === '/appointment') {
        this.tabIndex = 0
        this.queryList()
        this.$router.replace({path: '/appointment', query: {}})
      }
    }
  },
  components: {
    [Button.name]: Button,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Pagination.name]: Pagination,
    [RadioGroup.name]: RadioGroup,
    [RadioButton.name]: RadioButton,
    [Input.name]: Input,
    listTable
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/css/variable"
@import "~common/css/mixin"

.scheduling-list
  margin 10px 20px
.custom-pagination
  margin 21px 0
  text-align right
  .custom-pagination-content
    margin-right 20px
    inline-block-top()
.scheduling-item-wrapper
  padding 0 20px
  border-top 1px solid #ccc
  .scheduling-item
    padding 15px 20px
    color $color-text
    font-size $font-size-md
    .label
      margin-right 24px
      width 120px
      text-align right
      inline-block-top()
.scheduling-item-button
  width 100%
  height 45px
  line-height 45px
  text-align center
  & > button
    margin-left 20px
    width 120px
.appointment-query-item
  padding-bottom 10px
  .el-radio-button__inner
    padding-top 5px
    padding-bottom 5px
</style>
