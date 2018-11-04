<template>
  <div class="notice-page">
    <div class="notice-page-left">
      <div class="notice-page-left-content">
        <list-table title="通知消息">
          <slot slot="query">
            <div class="element-notice-radio">
              <el-radio-group @change="handleChange" v-model="typeId" size="mini" >
                <el-radio-button
                v-for="(item, index) in typeList"
                :label="item.label"
                :value="item.value"
                :key="index"></el-radio-button>
              </el-radio-group>
            </div>
          </slot>
          <div class="notice-table">
            <el-table style="width: 100%"
                      v-loading="loading"
                      :data="tableData"
                      border
                      stripe
                      size="mini"
                      header-row-class-name="element-headerRowClassName">
              <el-table-column label="标题内容" prop="noticeContent" align="left" header-align="center"></el-table-column>
              <el-table-column label="时间" prop="createDate" align="center" width="240"></el-table-column>
              <el-table-column label="类型" prop="noticeTitle" align="center" width="140"></el-table-column>
            </el-table>
          </div>
          <div class="notice-pagination">
            <div class="notice-pagination-content">
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
    <div class="notice-page-right">
      <message-list ></message-list>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
import {
  RadioGroup, RadioButton, DatePicker, Button,
  Table, TableColumn, Pagination, Input, Message
} from 'element-ui'
import messageList from 'base/message-list/message-list'
import listTable from 'base/list-table/list-table'
import { ERR_SUCCESS } from 'api/config'
import { getKeyArr } from 'common/js/util'
import { getConsultantNoticeList, updateConsultantNoticeInfo } from 'api/message'

export default {
  data () {
    return {
      typeList: [{
        label: '全部通知',
        value: ''
      }, {
        label: '交易物流提醒',
        value: '18'
      }, {
        label: '服务提醒',
        value: '19'
      }],
      typeId: '全部通知',
      noticeType: '',
      tableData: [],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      loading: false
    }
  },
  created () {
    this.query()
  },
  methods: {
    rowAuthorizing (index, row) {
      row[index].authorize = !row[index].authorize
    },
    rowAction (index, bottoms, rowIndex, row) {

    },
    changePage (key, num) {
      switch (key) {
        case 'pageSize':
          this.pageSize = num
          this._getConsultantNoticeList()
          break
        case 'pageNum':
          this.pageNum = num
          this._getConsultantNoticeList()
          break
        default:
          break
      }
    },
    handleChange (key) {
      this.noticeType = getKeyArr(this.typeId, 'label', this.typeList).object.value
      this.query()
    },
    query () {
      this._getConsultantNoticeList('reset')
    },
    _getConsultantNoticeList (type) {
      let targetObj
      if (type === 'reset') {
        this.pageNum = 1
        targetObj = this
      } else {
        targetObj = this.targetObj ? this.targetObj : this
      }
      let { noticeType } = targetObj
      const { pageNum, pageSize } = this
      const postObj = { noticeType, isRead: '', pageNum, pageSize }
      this.loading = true
      getConsultantNoticeList(postObj).then(res => {
        if (res.code === ERR_SUCCESS) {
          this.targetObj = postObj
          this.tableData = res.data.dataList
          this.total = res.data.total
        } else {
          Message.error(res.msg)
        }
        this.loading = false
      })
      updateConsultantNoticeInfo({id: ''}).then(res => {})
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

page-init(notice)

.notice-table
  margin-top 10px
  padding 0 15px
  .authorize-no
    color #ff3333
.notice-pagination
  margin 21px 0
  text-align right
  .notice-pagination-content
    margin-right 20px
    inline-block-top()
.notice-columnButton.el-button+.el-button
  position relative
  margin-left 0
  &::before
    content ''
    margin 0 4px
    width 1px
    height 12px
    background-color #898989
    inline-block-top(middle)
</style>
