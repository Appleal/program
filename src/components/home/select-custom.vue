<template>
  <div class="custom-wrapper">
    <div class="custom-query-wrapper">
      <div class="custom-query-item">
        <span>客户类型：</span>
        <el-radio-group @change="handleChange('userType')" v-model="userTypeId" size="mini" style="margin-right: 41px;">
          <el-radio-button
          v-for="(item, index) in userTypeList"
          :label="item.newName"
          :value="item.name"
          :key="index"></el-radio-button>
        </el-radio-group>
      </div>
      <div class="custom-query-item">
        <span>精准查询：</span>
        <el-input placeholder="请输入客户编号" v-model="aNo" size="small" style="width: auto;margin-right: 10px;">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <el-input placeholder="请输入客户姓名" v-model="aName" size="small" style="width: auto;margin-right: 10px;">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <el-select v-model="userGrade"
              placeholder="请输入会员等级"
              clearable
              filterable
              size="small" @change="query('reset')">
              <el-option label="VIP1" value="VIP1"></el-option>
              <el-option label="VIP2" value="VIP2"></el-option>
              <el-option label="VIP3" value="VIP3"></el-option>
              <el-option label="VIP4" value="VIP4"></el-option>
              <el-option label="VIP5" value="VIP5"></el-option>
        </el-select>
        <el-button size="small" style="margin-left: 10px;" @click="query">查询</el-button>
      </div>
    </div>
    <div class="custom-table">
      <el-table style="width: 100%"
                v-loading="loading"
                :data="tableData"
                border
                stripe
                ref="tableData"
                size="mini"
                height="380"
                @selection-change="selectionChange"
                header-row-class-name="element-headerRowClassName">
         <el-table-column type="selection" align="center" width="55"></el-table-column>
        <el-table-column label="客户编号" align="center" prop="aNo"></el-table-column>
        <el-table-column label="客户姓名" align="center" prop="aName"></el-table-column>
        <el-table-column label="会员等级" align="center" prop="userGrade"></el-table-column>
        <el-table-column label="客户类型" align="center" prop="userType"></el-table-column>
      </el-table>
    </div>
    <div class="custom-pagination">
      <div style="font-size: 14px">已选<span style="color: red; padding: 0 4px">{{totalNum}}</span>名客户</div>
      <!--<div class="custom-pagination-content">-->
          <!--<el-pagination-->
            <!--:page-sizes="[10, 20, 50, 100, 200]"-->
            <!--:page-size="pageSize"-->
            <!--:current-page="pageNum"-->
            <!--layout="total, sizes, prev, pager, next, jumper"-->
            <!--@current-change="(n)=> this.changePage('pageNum', n)"-->
            <!--@size-change="(n)=> this.changePage('pageSize', n)"-->
            <!--@next-click="(n)=> this.changePage('pageNum', n)"-->
            <!--@prev-click="(n)=> this.changePage('pageNum', n)"-->
            <!--:total="total">-->
          <!--</el-pagination>-->
      <!--</div>-->
      <div class="select-custom-button">
        <el-button @click="save" size="mini" style="width: 120px;" class="element-button">确认</el-button>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {
  RadioGroup, RadioButton, Button, Table,
  TableColumn, Pagination, Input, Select, Option, Message
} from 'element-ui'
import { ERR_SUCCESS } from 'api/config'
import {getAppUserType, getAppUser} from 'api/user'
import {getKeyArr} from 'common/js/util'

export default {
  data () {
    return {
      totalNum: 0,
      loading: false,
      aNo: '',
      userType: '',
      aName: '',
      userGrade: '',
      userTypeId: '全部',
      userTypeList: [{
        'id': '全部',
        'name': '全部',
        'newName': '全部'
      }],
      tableData: [],
      pageSize: 1000,
      pageNum: 1,
      total: 0
    }
  },
  created () {
    this.selectionChangeData = []
    const { userTypeListText } = this
    this.$nextTick(() => {
      this.query()
      getAppUserType().then(res => {
        if (res.code === ERR_SUCCESS) {
          let data = this.userTypeList.concat(res.data)
          data.forEach(d => {
            userTypeListText(d)
          })
          data.sort((a, b) => a.index - b.index)
          this.userTypeList = data.slice(0, 5)
          if (this.isNew === 'new') {
            for (let u of this.userTypeList) {
              if (u.name === '新客户') {
                this.userTypeId = u.id
                this.userType = u.id
              }
            }
          }
          this.query()
        } else {
          Message.error(res.msg)
        }
      })
    })
  },
  mounted () {
  },
  methods: {
    query () {
      this._getAppUser('reset')
    },
    // changePage (key, num) {
    // switch (key) {
    // case 'pageSize':
    // this.pageSize = num
    // this._getAppUser()
    //  break
    // case 'pageNum':
    // this.pageNum = num
    //  this._getAppUser()
    // break
    // default:
    // break
    // }
    // },
    _getAppUser (type) {
      let targetObj
      if (type === 'reset') {
        this.pageNum = 1
        targetObj = this
      } else {
        targetObj = this.targetObj ? this.targetObj : this
      }
      let { userType, aNo, aName, userGrade } = targetObj
      const { pageNum, pageSize } = this
      userType = userType === '全部' ? '' : userType
      const postObj = { userType, aNo, aName, userGrade, pageNum, pageSize }
      this.loading = true
      getAppUser(postObj).then(res => {
        if (res.code === ERR_SUCCESS) {
          this.targetObj = postObj
          this.tableData = res.data.dataList
          this.total = res.data.total
        } else {
          Message.error(res.msg)
        }
        this.loading = false
      })
    },
    selectionChange (item) {
      const num = item.length
      this.totalNum = num
      this.selectionChangeData = item
    },
    handleChange (key) {
      switch (key) {
        case 'userType':
          this.userType = getKeyArr(this.userTypeId, 'newName', this.userTypeList).object.id
          break
        default:
          break
      }
      this._getAppUser('reset')
    },
    save () {
      console.log(this.selectionChangeData)
    },
    userTypeListText (d) {
      const name = d.name
      let newName = name
      let index = 10
      switch (name) {
        case '全部':
          index = 0
          newName = '全部'
          break
        case '新客户':
          index = 1
          newName = '新客户'
          break
        case '意向客户':
          index = 2
          newName = '意向客户(A类)'
          break
        case '保留客户':
          index = 3
          newName = '保留客户(B类)'
          break
        case '待转客户':
          index = 4
          newName = '待转客户(C类)'
          break
      }
      d.newName = newName
      d.index = index
    }
  },
  components: {
    [RadioGroup.name]: RadioGroup,
    [RadioButton.name]: RadioButton,
    [Button.name]: Button,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Pagination.name]: Pagination,
    [Select.name]: Select,
    [Option.name]: Option,
    [Input.name]: Input
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/css/variable"
@import "~common/css/mixin"

.custom-wrapper
  position relative
  width 100%
  height 100%
  .custom-query-wrapper
    padding 10px 20px
  .custom-query-item
    padding-bottom 10px
    span
      font-size $font-size-md
  .custom-table
    padding 0 15px
.custom-pagination
  margin 21px 20px
  .custom-pagination-content
    inline-block-top()
  .select-custom-button
    float right
    height 32px
    line-height 32px
    inline-block-top()
</style>
