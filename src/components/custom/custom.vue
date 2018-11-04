<template>
  <c-table-scroll :data="tableData">
    <div class="custom-page-left-content">
      <list-table title="客户列表">
        <slot slot="query">
          <div class="custom-query-item">
            <span>客户类型：</span>
            <el-radio-group @change="handleChange('userType')" v-model="userTypeId" size="mini" style="margin-right: 2px;">
              <el-radio-button
              v-for="(item, index) in userTypeList"
              :label="item.newName"
              :value="item.name"
              :key="index"></el-radio-button>
            </el-radio-group>

            <el-select v-model="relationType" placeholder="请选择类型" class="inputColor" style="width: 150px; color: #00bafa; margin-right: 2px" size="mini">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>

            <el-date-picker
              v-model="value6"
              style="width: 220px"
              size="mini"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>
          <div>
            <span>精准查询：</span>
            <el-select v-model="userGrade"
              placeholder="请输入会员等级"
              filterable
              clearable
              size="small" @change="query('reset')">
              <el-option label="VIP1" value="VIP1"></el-option>
              <el-option label="VIP2" value="VIP2"></el-option>
              <el-option label="VIP3" value="VIP3"></el-option>
              <el-option label="VIP4" value="VIP4"></el-option>
              <el-option label="VIP5" value="VIP5"></el-option>
            </el-select>
            <el-input placeholder="请输入客户编号" v-model="aNo" size="small" style="width: auto;margin-right: 10px;">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
            <el-input placeholder="请输入客户姓名" v-model="aName" size="small" style="width: auto;margin-right: 10px;">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
            <el-button size="small" style="margin-left: 10px;" @click="query">查询</el-button>
          </div>
        </slot>
        <div class="custom-table">
          <el-table style="width: 100%"
                    v-loading="loading"
                    :data="tableData"
                    border
                    stripe
                    size="mini"
                    header-row-class-name="element-headerRowClassName">
            <el-table-column label="客户编号" align="center" prop="aNo"></el-table-column>
            <el-table-column label="客户姓名" width="72" align="center" prop="aName"></el-table-column>
            <el-table-column label="手机号" width="90" align="center" prop="mobile"></el-table-column>
            <el-table-column label="会员等级" width="70" align="center" prop="userGrade"></el-table-column>
            <el-table-column label="客户类型" width="72" align="center" prop="userType"></el-table-column>
            <el-table-column label="最近跟进记录" align="center" prop="content">
              <template slot-scope="scope">
                <div v-if="tableData[scope.$index].content" class="custom-item-follow">
                  <span class="custom-item-content">
                    {{tableData[scope.$index].content}}
                  </span>
                  <span class="custom-item-followTime">
                    {{tableData[scope.$index].createTime}}
                  </span>
                  <el-popover placement="bottom" trigger="click" >
                    <el-button class="custom-item-followButton" slot="reference">hover 激活</el-button>
                    <div class="custom-item-follow-popover">
                      <span class="custom-item-content"
                        v-html="textFormt(tableData[scope.$index].content)"
                      ></span>
                      <span class="custom-item-followTime">
                        {{_format(tableData[scope.$index].createTime)}}
                      </span>
                      <span class="custom-item-user">
                        记录：{{tableData[scope.$index].consulantName}}
                      </span>
                    </div>
                  </el-popover>
                </div>
                <div v-else>
                  无
                </div>
              </template>
            </el-table-column>
            <el-table-column label="资料所有人" width="82" align="center" prop="owner"></el-table-column>
            <el-table-column label="被授权人" width="72" align="center" prop="dominator">
              <template slot-scope="scope">
                  <span v-for="(dominator, i) in tableData[scope.$index].dominator" :key="dominator.id">
                    {{i > 0 ? `/${dominator.name}` : dominator.name}}
                  </span>
              </template>
            </el-table-column>
            <el-table-column label="授权/分配日期" width="100" align="center" prop="updateTime">
              <template slot-scope="scope">
                {{_formUpdateTime(tableData[scope.$index].updateTime)}}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" align="center">
              <template slot-scope="scope">
                <el-button
                 class="custom-columnButton"
                  @click.native.prevent="rowAction(tableData,scope.$index, '消息')" type="text" size="small">
                  消息
                </el-button>
                <el-button
                  class="custom-columnButton"
                  :disabled="scope.row.relationType !== 1"
                  @click.native.prevent="rowAction(tableData,scope.$index, '授权')" type="text" size="small">
                  授权
                </el-button>
                <el-button
                 class="custom-columnButton"
                 :disabled="scope.row.relationType !== 1"
                  @click.native.prevent="rowAction(tableData,scope.$index, '下单')"
                  type="text" size="small">
                  下单
                </el-button>
                <el-button
                 class="custom-columnButton"
                  @click.native.prevent="rowAction(tableData,scope.$index, '详情')"
                  type="text" size="small">
                  详情
                </el-button>
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
  </c-table-scroll>
</template>

<script type="text/ecmascript-6">
import { mapMutations, mapGetters } from 'vuex'
import {
  RadioGroup, RadioButton, Button, Table, TableColumn, DatePicker,
  Pagination, Input, Popover, Select, Option, Message
} from 'element-ui'
import listTable from 'base/list-table/list-table'
import cTableScroll from 'base/c-table-scroll/c-table-scroll'
import { ERR_SUCCESS } from 'api/config'
import { brmOrderGoUrl } from 'api/brm'
import {getAppUserType, getAppUser} from 'api/user'
import {getKeyArr, format} from 'common/js/util'

const COMPONENTS_NAME = 'custom-page'

export default {
  name: COMPONENTS_NAME,
  data () {
    return {
      relationType: 0, // 类型
      dataLabel: '',
      options: [{
        value: 0,
        label: '不限日期'
      }, {
        value: 1,
        label: '分配日期'
      }, {
        value: 2,
        label: '授权日期'
      }, {
        value: 3,
        label: '最后跟进日期'
      }],
      value6: '', // 开始时间， 结束时间
      startTime: '', // 开始时间
      entTime: '', // 结束时间
      userType: '',
      aNo: '',
      aName: '',
      userGrade: '',
      userTypeId: '全部',
      userTypeList: [{
        'id': '全部',
        'name': '全部',
        'newName': '全部'
      }],
      tableData: [],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      loading: false
    }
  },
  created () {
    if (this.$route.query.isNew) {
      this.isNew = this.$route.query.isNew
    }
    const { userTypeListText } = this
    this.$nextTick(() => {
      getAppUserType().then(res => {
        if (res.code === ERR_SUCCESS) {
          // console.log(res.data)
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
    this.dataForm(this.relationType)
  },
  computed: {
    ...mapGetters(['custom', 'user'])
  },
  methods: {
    dataForm (value) {
      this.options.forEach(e => {
        if (e.value === value) {
          this.dataLabel = e.label
        }
      })
    },
    _formUpdateTime (value) {
      if (value) {
        return value.substr(0, 10)
      } else {
        return '-'
      }
    },
    textFormt (e) {
      if (e.indexOf('\n') > -1) {
        const contents = e.split('\n')
        let newContents = []
        for (let c of contents) {
          newContents.push(c)
        }
        return newContents.join('<br/>')
      }
      return e
    },
    changePage (key, num) {
      switch (key) {
        case 'pageSize':
          this.pageSize = num
          this._getAppUser()
          break
        case 'pageNum':
          this.pageNum = num
          this._getAppUser()
          break
        default:
          break
      }
    },
    _format (e) {
      return format(e)
    },
    rowAuthorizing (index, row) {
      row[index].authorize = !row[index].authorize
    },
    rowAction (row, rowIndex, type) {
      const rowData = this.tableData[rowIndex]
      switch (type) {
        case '消息':
          this.$router.push({name: 'chatwindow', params: {tid: `a${rowData.aid}`}})
          break
        case '详情':
          this.$router.push({path: '/custom/item', query: {tid: rowData.aid}})
          break
        case '授权':
          this.setCustom(rowData)
          this.$router.push({path: '/custom/authorize', query: {tid: rowData.aid}})
          break
        case '下单':
          const brmToken = this.user.brmToken
          brmOrderGoUrl({
            token: brmToken,
            customer: rowData.aNo
          })
          break
        default:
          break
      }
    },
    query () {
      this._getAppUser('reset')
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
    _getAppUser (type) {
      let targetObj
      if (type === 'reset') {
        this.pageNum = 1
        targetObj = this
      } else {
        targetObj = this.targetObj ? this.targetObj : this
      }
      let { userType, aNo, aName, userGrade, relationType, startTime, endTime, value6 } = targetObj
      const { pageNum, pageSize } = this
      userType = userType === '全部' ? '' : userType
      if (value6) {
        startTime = format(value6[0], '$1-$2-$3 $4:$5:$6')
        endTime = format(value6[1], '$1-$2-$3 $4:$5:$6')
      } else {
        startTime = null
        endTime = null
      }
      const postObj = { userType, aNo, aName, userGrade, relationType, startTime, endTime, pageNum, pageSize }
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
          newName = '意向客户'
          break
        case '保留客户':
          index = 3
          newName = '保留客户'
          break
        case '待转客户':
          index = 4
          newName = '待转客户'
          break
      }
      d.newName = newName
      d.index = index
    },
    ...mapMutations({ setCustom: 'SET_CUSTOM' })
  },
  watch: {
    custom () {
      const {tableData, custom} = this
      for (let i = 0; i < tableData.length; i++) {
        let t = tableData[i]
        if (t.aid === custom.aid) {
          t.dominator = custom.dominator
          return
        }
      }
    },
    aNo (value) {
      this.aNo = value.replace(' ', '')
    },
    aName (value) {
      this.aName = value.replace(' ', '')
    },
    relationType (e) {
      this.dataForm(e)
    },
    $route () {
      if (this.$route.path === '/custom') {
        this.query()
      }
    }
  },
  components: {
    [RadioGroup.name]: RadioGroup,
    [RadioButton.name]: RadioButton,
    [Button.name]: Button,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Pagination.name]: Pagination,
    [Input.name]: Input,
    [Popover.name]: Popover,
    [Select.name]: Select,
    [Option.name]: Option,
    cTableScroll,
    [DatePicker.name]: DatePicker,
    listTable
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/css/variable"
@import "~common/css/mixin"

.custom-query-item
  padding-bottom 10px
  span
    font-size $font-size-sm
.custom-table
  position relative
  margin 10px 15px 0 15px
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
    min-width 220px
    max-width 660px
    line-height 25px
    font-size 13px
    text-align left
    word-wrap break-word
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

</style>
