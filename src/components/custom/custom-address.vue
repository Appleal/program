<template>
  <div class="custom-feedback-dialog">
    <c-scroll :data="data">
      <div v-show="address.id">
        <div class="address-item">
          <span class="address-item-label"><strong>*</strong>收货人：</span>
          <div class="address-item-input">
            <el-input placeholder="收货人" v-model="address.receiver" size="small"></el-input>
          </div>
        </div>
        <div class="address-item">
          <span class="address-item-label"><strong>*</strong>所在地区：</span>
          <div class="address-item-input">
            <el-cascader
                style="width: 100%"
                placeholder="请选择省市区"
                expand-trigger="click"
                :options="cityList"
                v-model="address.areaList"
                size="small"
                @change="handleChange">
            </el-cascader>
          </div>
        </div>
        <div class="address-item">
          <span class="address-item-label"><strong>*</strong>详细地址：</span>
          <div class="address-item-input">
            <el-input type="textarea" placeholder="请选择详细的地址" :rows="4"
              v-model="address.address" size="small"></el-input>
          </div>
        </div>
        <div class="address-button">
          <el-button size="small" @click="handleClick('save')">保存修改</el-button>
        </div>
      </div>
      <el-table style="width: 100%"
                      :data="data"
                      border
                      stripe
                      size="mini"
                      header-row-class-name="element-headerRowClassName">
        <el-table-column label="收货人" width="90" align="center" prop="receiver"></el-table-column>
        <el-table-column label="所在地区" align="center" prop="area"></el-table-column>
        <el-table-column label="详细地址" align="center" prop="address"></el-table-column>
        <el-table-column label="联系方式" width="100" align="center" prop="mobile"></el-table-column>
        <el-table-column label="操作" width="220" align="center">
          <template slot-scope="scope">
            <div class="custom-address-button-wrapper">
              <span class="custom-address-button" @click="handleClick('edit', scope.$index)">修改</span>
              <!--<span class="custom-address-button" @click="handleClick('delete', scope.$index)">删除</span>-->
              <span class="custom-address-button">
                <el-button type="info" @click="handleClick('mo', scope.$index)"
                   :disabled="data[scope.$index].defultAddress === 1"
                   size="mini" plain >默认地址</el-button>
              </span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </c-scroll>
  </div>
</template>

<script type="text/ecmascript-6">
import { Input, Button, Cascader, Message, Table, TableColumn } from 'element-ui'
import cScroll from 'base/c-scroll/c-scroll'
import { getAppUserAddressList, updateAppUserAddress, delAppUserAddress, setDefaultAppUserAddress } from 'api/user'
import { ERR_SUCCESS } from 'api/config'
import { isNull, recursion } from 'common/js/util'
import CityList from 'common/js/CityList'

const _CityList = recursion(CityList)

export default {
  data () {
    return {
      data: [],
      address: {},
      cityList: _CityList
    }
  },
  created () {
    this.$nextTick(() => {
      const {tid} = this.$route.query
      if (isNull(tid)) return
      this.tid = tid
      this._getAppUserAddressList(tid)
    })
  },
  computed: {
  },
  methods: {
    handleChange (value) {
      if (value && value.length > 0) {
        this.address.area = value.join(' ')
      }
    },
    _getAppUserAddressList (userid) {
      getAppUserAddressList({userid}).then(res => {
        if (res.code === ERR_SUCCESS) {
          this.data = res.data
        } else {
          Message.error(res.msg)
        }
      })
    },
    _updateAppUserAddress (userAddress) {
      updateAppUserAddress(userAddress).then(res => {
        if (res.code === ERR_SUCCESS) {
          let data = this.data
          for (let d of data) {
            if (d.id === this.address.id) {
              d.receiver = this.address.receiver
              d.area = this.address.area
              d.address = this.address.address
              this.address = {}
              break
            }
          }
          Message({
            showClose: true,
            message: '修改成功！',
            type: 'success'
          })
        } else {
          Message.error(res.msg)
        }
      })
    },
    _setDefaultAppUserAddress ({id, userid}) {
      setDefaultAppUserAddress({id, userid}).then(res => {
        if (res.code === ERR_SUCCESS) {
          this._getAppUserAddressList(this.tid)
          Message({
            showClose: true,
            message: '设置成功！',
            type: 'success'
          })
          this.address = {}
        } else {
          Message.error(res.msg)
        }
      })
    },
    _delAppUserAddress (id) {
      delAppUserAddress({id}).then(res => {
        if (res.code === ERR_SUCCESS) {
          Message({
            showClose: true,
            message: '删除成功！',
            type: 'success'
          })
        } else {
          Message.error(res.msg)
        }
      })
    },
    handleClick (type, index) {
      switch (type) {
        case 'edit':
          this.address = this.data[index]
          this.address.areaList = this.data[index].area.split(' ')
          break
        case 'delete':
          this._delAppUserAddress(this.data[index].id)
          break
        case 'mo':
          this._setDefaultAppUserAddress({id: this.data[index].id, userid: this.data[index].appUserid})
          break
        case 'save':
          if (isNull(this.address.id)) {
            Message.error('请选择修改的地址选项！')
            return
          }
          this._updateAppUserAddress(this.address)
          break
        default:
          break
      }
    }
  },
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Input.name]: Input,
    [Cascader.name]: Cascader,
    [Button.name]: Button,
    cScroll
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/css/variable"
@import "~common/css/mixin"

.custom-feedback-dialog
  position relative
  width 100%
  height 430px
  overflow-y auto
  .address-item
    padding 4px 0
    width 100%
    font-size 0
    .address-item-label
      padding-right 10px
      width 140px
      height 35px
      line-height 35px
      color $color-text
      font-size $font-size-sm
      text-align right
      inline-block-top()
      strong
        color #ff8d8d
    .address-item-input
      width 460px
      inline-block-top()
  .address-button
    padding 10px 0
    width 600px
    text-align right
  .custom-address-button-wrapper
    width 100%
    font-size 0
    .custom-address-button
      margin-right 5px
      padding 0 5px
      height 30px
      line-height 30px
      color $color-theme
      font-size $font-size-sm
      cursor pointer
      inline-block-top()
      &:hover
        color #1776ea
      &:active
        color #558acc

</style>
