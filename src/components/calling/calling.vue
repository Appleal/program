<template>
  <c-table-scroll :data="tableData">
    <div class="custom-page-left-content">
      <list-table title="未接来电" :hideQuery="true">
        <div class="custom-table">
          <el-table style="width: 100%"
                    :data="tableData"
                    border
                    stripe
                    size="mini"
                    header-row-class-name="element-headerRowClassName">
            <el-table-column label="客户编号" align="center" prop="customerID"></el-table-column>
            <el-table-column label="客户姓名" align="center" prop="customerName"></el-table-column>
            <el-table-column label="会员等级" width="69" align="center" prop="levelShortname"></el-table-column>
            <el-table-column label="客户类型" width="82" align="center" prop="userType"></el-table-column>
            <el-table-column label="来电时间" width="140" align="center" prop="createDate">
              <template slot-scope="scope">
                {{tableData[scope.$index].createDate}}
              </template>
            </el-table-column>
            <el-table-column label="被呼叫者" align="center" prop="consultantName"></el-table-column>
            <el-table-column label="操作" width="" align="center">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="rowAction(tableData, scope.$index)" type="text" size="small">
                  回电
                </el-button>
                <el-button
                  @click.native.prevent="moreFollow(tableData[scope.$index].userId)" type="text" size="small">
                  跟进记录
                </el-button>
                <span style="color: green; margin-left: 10px" v-if="tableData[scope.$index].status === '1'">已处理</span>
                <el-button
                  v-else
                  style="color: red"
                  @click.native.prevent="dealFollow(tableData[scope.$index].TelId)" type="text" size="small">
                  未处理
                </el-button>
                <!--<el-button-->
                  <!--@click.native.prevent="moreFollow(tableData[scope.$index].userId)" type="text" size="small">-->
                  <!--详情-->
                <!--</el-button>-->
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
      </list-table>
    </div>
    <router-view></router-view>
  </c-table-scroll>
</template>

<script type="text/ecmascript-6">
import {mapGetters, mapActions} from 'vuex'
import {Button, Table, TableColumn, Pagination, Input, Message, MessageBox} from 'element-ui'
import { telephoneCall } from 'common/js/phone'
import cTableScroll from 'base/c-table-scroll/c-table-scroll'
import listTable from 'base/list-table/list-table'
import { ERR_SUCCESS } from 'api/config'
import { getNoAnswerTel, updateTelStatus } from 'api/user'
import {format} from 'common/js/util'

export default {
  data () {
    return {
      tableData: [],
      pageSize: 10,
      pageNum: 1,
      total: 0
    }
  },
  computed: {
    ...mapGetters(['call', 'user'])
  },
  created () {
    this.$nextTick(() => {
      this.query()
    })
  },
  methods: {
    changePage (key, num) {
      switch (key) {
        case 'pageSize':
          this.pageSize = num
          break
        case 'pageNum':
          this.pageNum = num
          break
        default:
          break
      }
      let size = this.pageSize * (this.pageNum - 1)
      this.tableData = this.tableDataClone.slice(size, this.pageSize + size)
    },
    rowAction (row, rowIndex) {
      if (this.isClick) return
      this.isClick = true
      const userid = row[rowIndex].userId
      const { callerid, extension, serverIp } = this.user
      const extensionDst = row[rowIndex].tel
      console.log(extensionDst)
      telephoneCall({ serverIp, extension, extensionDst, callerid }).then(res => {
        if (res.result === '1') {
          this.setCall({
            userid: `a${userid}`,
            type: 'outgoing',
            phone: extensionDst
          })
        }
      })
    },
    dealFollow (id) {
      MessageBox.confirm('是否已处理该客户未接来电?', '确认处理来电', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(action => {
        const that = this
        updateTelStatus({id, status: 1}).then(res => {
          if (res.code === ERR_SUCCESS) {
            Message({
              message: '修改状态成功！',
              type: 'success'
            })
            that._getNoAnswerTel()
          } else {
            Message.error(res.msg)
          }
        })
      }).catch(erro => {
      })
    },
    rowActionDescribe (userId) {
      this.$router.push({path: '/custom/item', query: {tid: userId}})
    },
    moreFollow (userId) {
      this.$router.push({path: '/custom/item', query: {tid: userId, type: 'f'}})
    },
    query () {
      this._getNoAnswerTel()
    },
    _getNoAnswerTel () {
      getNoAnswerTel().then(res => {
        if (res.code === ERR_SUCCESS) {
          this.tableDataClone = res.data.list
          this.tableData = res.data.list.slice(0, 10)
          this.total = res.data.count
        } else {
          Message.error(res.msg)
        }
      })
    },
    _format (e) {
      return format(e)
    },
    ...mapActions([
      'setCall'
    ])
  },
  components: {
    [Button.name]: Button,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Pagination.name]: Pagination,
    [Input.name]: Input,
    listTable,
    cTableScroll
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/css/variable"
@import "~common/css/mixin"

.custom-query-item
  padding-bottom 10px
  span
    font-size $font-size-md
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
.custom-item-follow
  position relative
  .custom-item-content,.custom-item-followTime
    display block
    height 25px
    line-height 25px
    font-size 13px
    text-align left
    no-wrap()
  .custom-item-content
    color $color-text
  .custom-item-followTime
    color #999
  .custom-item-followButton
    position absolute
    top 0
    left 0
    width 100%
    bottom 0
    z-index 10
    opacity 0
.custom-item-follow-popover
  font-size 0
  .custom-item-content
    display block
    height 25px
    line-height 25px
    font-size 13px
    text-align left
    color $color-text
  .custom-item-followTime,.custom-item-user
    width 50%
    height 25px
    line-height 25px
    font-size 13px
    color #999
    inline-block-top()
  .custom-item-user
    text-align right
    inline-block-top()
.calling-button
  color $color-theme
</style>
