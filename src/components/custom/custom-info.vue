<template>
  <div class="custom-info-dialog">
    <c-scroll :data="reportList">
      <div class="custom-info-wrapper">
        <div class="custom-info">
          <div class="custom-info-portrait">
            <img v-if="chatCustomer.portraitUrl" :src="chatCustomer.portraitUrl">
          </div>
          <h3 v-if="chatCustomer.nickName"
            class="custom-info-username">{{chatCustomer.name}}</h3>
          <span v-if="chatCustomer.id" class="custom-info-userId">({{chatCustomer.aNo}})</span>
          <div class="custom-form-buttom" v-if="chatCustomer.id">
            <div class="custom-form-buttom-item" v-show="!edit"  style="width: 100%">
              <el-button size="mini" @click="handleClick('edit')">
                <span class="icon-buttom icon-edit buttom-edit"></span>
              </el-button>
            </div>
            <!--<div class="custom-form-buttom-item" v-show="!edit" :class="{relation:chatCustomer.relationType !== 1}">-->
              <!--<el-button size="mini" @click="handleClick('follow')">-->
                <!--<span class="icon-buttom icon-delete buttom-delete"></span>-->
              <!--</el-button>-->
            <!--</div>-->
            <div class="custom-form-buttom-item" v-show="edit">
              <el-button size="mini" class="buttom-delete" @click="handleClick('cancel')">取消</el-button>
            </div>
            <div class="custom-form-buttom-item" v-show="edit">
              <el-button size="mini" class="buttom-edit" @click="handleClick('save')">保存</el-button>
            </div>
          </div>
        </div>
        <div class="custom-form">
          <div class="custom-form-item">
            <div class="custom-form-item-content">
              <label class="custom-form-label">症状 : </label>
              <div class="custom-form-input">
                <el-select
                    v-show="edit"
                    v-model="chatCustomer.symptomTypeId"
                    size="mini"
                    @change="cSelectChange"
                    multiple
                    collapse-tags>
                  <el-option
                    v-for="item in chatCustomer.symptomTypeList"
                    :key="item.name"
                    :label="item.name"
                    :value="item.name">
                  </el-option>
                </el-select>
                <span class="custom-info-text" v-show="!edit">{{chatCustomer.symptomTypeText}}</span>
              </div>
            </div>
          </div>
          <div class="custom-form-item">
            <div class="custom-form-item-content">
              <label class="custom-form-label">类型 : </label>
              <div class="custom-form-input">
                <el-select @change="newUserTypeList(chatCustomer)" v-model="chatCustomer.userType" placeholder="客户类型" size="mini" v-show="edit">
                  <el-option
                    v-for="userTypeList in chatCustomer.userTypeList"
                    :key="userTypeList.id"
                    :label="userTypeList.name"
                    :value="userTypeList.id">
                  </el-option>
                </el-select>
                <span class="custom-info-text" v-show="!edit">{{chatCustomer.userTypeText}}</span>
              </div>
              <span title="请输入正确的年龄数字！" v-show="chatCustomer.ageVerify" class="icon-exclamation"></span>
            </div>
          </div>

          <div class="custom-form-item">
            <div class="custom-form-item-content">
              <label class="custom-form-label">昵称 : </label>
              <div class="custom-form-input">
                <el-input v-model="chatCustomer.nickName" size="mini" v-show="edit" >
                </el-input>
                <span class="custom-info-text">{{chatCustomer.nickName}}</span>
              </div>
            </div>
          </div>
          <div class="custom-form-item">
            <div class="custom-form-item-content">
              <label class="custom-form-label">性别 : </label>
              <div class="custom-form-input">
                <el-select v-model="chatCustomer.gender" size="mini" v-show="edit">
                  <el-option v-for="item in genderDictJson"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <span class="custom-info-text" v-show="!edit">{{_genderFormat(chatCustomer.gender)}}</span>
              </div>
            </div>
          </div>
          <div class="custom-form-item">
            <div class="custom-form-item-content">
              <label class="custom-form-label">身高 : </label>
              <div class="custom-form-input">
                <el-input v-model="chatCustomer.height" size="mini"
                    v-show="edit" @change="change('height', 'isHeight')">
                  <template slot="append">cm</template>
                </el-input>
                <span class="custom-info-text" v-show="!edit">{{chatCustomer.height}}cm</span>
              </div>
              <span title="请输入正确的身高数字！" v-show="chatCustomer.heightVerify" class="icon-exclamation"></span>
            </div>
          </div>
          <div class="custom-form-item">
            <div class="custom-form-item-content">
              <label class="custom-form-label">体重 : </label>
              <div class="custom-form-input">
                <el-input v-model="chatCustomer.weight" size="mini"
                    v-show="edit" @change="change('weight', 'isWeight')">
                  <template slot="append">kg</template>
                </el-input>
                <span class="custom-info-text" v-show="!edit">{{chatCustomer.weight}}kg</span>
              </div>
              <span title="请输入正确的体重数字！" v-show="chatCustomer.weightVerify" class="icon-exclamation"></span>
            </div>
          </div>
          <div class="custom-form-item">
            <div class="custom-form-item-content">
              <label class="custom-form-label">生日 : </label>
              <div class="custom-form-input">
                <el-date-picker
                  v-model="chatCustomer.birthDate"
                  size="mini"
                  type="date"
                  v-show="edit"
                  style="width: 150px"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期">
                </el-date-picker>
                <span class="custom-info-text" v-show="!edit">{{_format(chatCustomer.birthDate)}}</span>
              </div>
            </div>
          </div>
          <div class="custom-form-item">
            <div class="custom-form-item-content">
              <label class="custom-form-label">职业 : </label>
              <div class="custom-form-input">
                <el-select v-model="chatCustomer.career" size="mini" v-show="edit">
                  <el-option v-for="item in careerDictJson"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <span class="custom-info-text" v-show="!edit">{{chatCustomer.career}}</span>
              </div>
            </div>
          </div>
          <div class="custom-form-item">
            <div class="custom-form-item-content">
              <label class="custom-form-label">城市 : </label>
              <div class="custom-form-input">
                <el-cascader
                    style="width: 100%"
                    placeholder="请选择省市区"
                    expand-trigger="hover"
                    :options="cityList"
                    v-model="cityValue"
                    size="mini"
                    v-show="edit"
                    @change="handleChange">
                </el-cascader>
                <span class="custom-info-text" v-show="!edit">{{chatCustomer.area}}</span>
              </div>
            </div>
          </div>
          <!--<div class="custom-form-item">-->
            <!--<div class="custom-form-item-content">-->
              <!--<label class="custom-form-label">微信 : </label>-->
              <!--<div class="custom-form-input">-->
                <!--<el-input v-model="chatCustomer.wechat" size="mini" v-show="edit"></el-input>-->
                <!--<span class="custom-info-text" v-show="!edit">{{chatCustomer.wechat}}</span>-->
              <!--</div>-->
            <!--</div>-->
          <!--</div>-->
          <div class="custom-form-item">
            <div class="custom-form-item-content">
              <label class="custom-form-label">文化程度 : </label>
              <div class="custom-form-input">
                <el-select v-model="chatCustomer.educationLevel" size="mini" v-show="edit">
                  <el-option v-for="item in educationLevelDictJson"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <span class="custom-info-text" v-show="!edit">{{chatCustomer.educationLevel}}</span>
              </div>
            </div>
          </div>
          <div class="custom-form-item">
            <div class="custom-form-item-content">
              <label class="custom-form-label">婚姻 : </label>
              <div class="custom-form-input">
                <el-select v-model="chatCustomer.marriageInfo" size="mini" v-show="edit">
                  <el-option v-for="item in marriageInfoDictJson"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <span class="custom-info-text" v-show="!edit">{{chatCustomer.marriageInfo}}</span>
              </div>
            </div>
          </div>
          <!--<div class="custom-form-item">-->
            <!--<div class="custom-form-item-content">-->
              <!--<label class="custom-form-label">QQ : </label>-->
              <!--<div class="custom-form-input">-->
                <!--<el-input v-model="chatCustomer.qq" size="mini" v-show="edit"></el-input>-->
                <!--<span class="custom-info-text" v-show="!edit">{{chatCustomer.qq}}</span>-->
              <!--</div>-->
            <!--</div>-->
          <!--</div>-->
          <div class="custom-form-item" style="width: 33.3%;">
            <div class="custom-form-item-content">
              <label class="custom-form-label">身份证 : </label>
              <div class="custom-form-input">
                <el-input v-model="chatCustomer.idcardNo" size="mini"
                    v-show="edit" @change="change('idcardNo', 'isIdCard')">
                </el-input>
                <span class="custom-info-text" v-show="!edit">{{_interception(chatCustomer.idcardNo)}}</span>
              </div>
              <span style="right: 190px;" title="请输入正确的身份证号！" v-show="chatCustomer.idcardNoVerify" class="icon-exclamation"></span>
            </div>
          </div>
        </div>
        </div>
        <div class="custom-info-title-wrapper">
          <c-title>
            <p slot="title">统计信息</p>
          </c-title>
        </div>
        <div class="statistical-wrapper">
          <div class="statistical-item">
            <div class="statistical-item-content">
              <h3 class="statistical-item-title">消费金额</h3>
              <span class="statistical-item-text">{{_formatCurrency(countInfo.totalRecharge)}}</span>
            </div>
          </div>
          <div class="statistical-item">
            <div class="statistical-item-content">
              <h3 class="statistical-item-title">已签收订单</h3>
              <span class="statistical-item-text">{{countInfo.orderNumber}}</span>
            </div>
          </div>
          <div class="statistical-item">
            <div class="statistical-item-content">
              <h3 class="statistical-item-title">会员等级</h3>
              <span class="statistical-item-text">{{countInfo.levelShortname}}</span>

            </div>
          </div>
          <div class="statistical-item">
            <div class="statistical-item-content">
              <h3 class="statistical-item-title">成长值</h3>
              <span class="statistical-item-text">{{countInfo.levelScore}}</span>
            </div>
          </div>
          <div class="statistical-item">
            <div class="statistical-item-content">
              <h3 class="statistical-item-title">可用积分</h3>
              <span class="statistical-item-text">{{countInfo.levelPoints}}</span>
            </div>
          </div>
        </div>
        <div class="custom-info-title-wrapper" >
          <c-title>
            <p slot="title">健康史</p>
          </c-title>
        </div>
        <div class="physical-wrapper" >
          <div>
            <div class="physical-item">
              <span class="physical-item-label">疾病史</span>
            </div>
            <div class="physical-item physical-DiseaseHistory-item">
              <span class="physical-item-label">
                {{chatCustomer.appDiseaseHistory ?
                chatCustomer.appDiseaseHistory.diseaseHistory : '暂无'}}
              </span>
            </div>
          </div>
          <div>
            <div class="physical-item">
              <span class="physical-item-label">手术史</span>
            </div>
            <div class="physical-item physical-DiseaseHistory-item">
              <span class="physical-item-label">
                 {{chatCustomer.appDiseaseHistory ?
                chatCustomer.appDiseaseHistory.surgeryHistory : '暂无'}}
              </span>
            </div>
          </div>
          <div>
            <div class="physical-item">
              <span class="physical-item-label">过敏史</span>
            </div>
            <div class="physical-item physical-DiseaseHistory-item">
              <span class="physical-item-label">
                 {{chatCustomer.appDiseaseHistory ?
                chatCustomer.appDiseaseHistory.allergyHistory : '暂无'}}
             </span>
            </div>
          </div>
        </div>
        <div class="custom-info-title-wrapper" >
          <c-title>
            <p slot="title">体检报告</p>
          </c-title>
        </div>
        <template v-if="reportList.length > 0">
          <div class="physical-wrapper" v-for="(report, index) in reportList" :key="index">
            <div class="physical-header">
              <span class="physical-header-item">体检报告{{index+1}}</span>
              <span class="physical-header-item">{{report.hospital}}</span>
              <span class="physical-header-item">体检日期：{{_format(report.examDate)}}</span>
            </div>
            <div>
              <div class="physical-item">
                <span class="physical-item-label">体检结果</span>
              </div>
              <div class="physical-item" style="width: 80%;">
                <span class="physical-item-text">{{report.examResult}}</span>
              </div>
              <div class="physical-item">
                <span class="physical-item-label">相关照片</span>
              </div>
              <div class="physical-item" style="width: 80%;">
                <div class="physical-picture-wrapper">
                  <div class="physical-picture" v-for="r in report.appUserExamPhotoList" :key="r.id">
                    <img :src="r.photoUrl" @click="handlPhotoUrlClick(r.photoUrl)">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <h4 class="null-tip">暂无数据</h4>
        </template>
    </c-scroll>
  </div>
</template>

<script type="text/ecmascript-6">
import {mapGetters} from 'vuex'
import {Button, Input, Select, Option, Message, MessageBox, DatePicker, Cascader} from 'element-ui'
import cScroll from 'base/c-scroll/c-scroll'
import cTitle from 'base/c-title/c-title'
import {verify} from 'common/js/verify'
import {
  marriageInfoDictJson, genderDictJson, careerDictJson, educationLevelDictJson
} from 'common/js/dictText'
import { ERR_SUCCESS } from 'api/config'
import { getAppUserInfo, updataAppUserInfo } from 'api/placeOrder'
import { getAppUserCountInfo, getAppUserExamReportList, consultantAppUserUnAuthorize } from 'api/user'
import {format, genderFormat, dictKeyGetArrays, dictKeyGetArray, isNull, formatCurrency, recursionInfo} from 'common/js/util'
import CityList from 'common/js/CityList'

const _CityList = recursionInfo(CityList)

export default {
  data () {
    return {
      cityValue: [],
      cityList: _CityList,
      edit: false,
      chatCustomer: {},
      marriageInfoDictJson: marriageInfoDictJson,
      genderDictJson: genderDictJson,
      careerDictJson: careerDictJson,
      educationLevelDictJson: educationLevelDictJson,
      countInfo: {
        totalRecharge: 0,
        orderNumber: 0,
        levelShortname: '',
        levelScore: 0,
        levelPoints: 0
      },
      reportList: []
    }
  },
  created () {
    this.$nextTick(() => {
      const {tid} = this.$route.query
      if (isNull(tid)) return
      getAppUserInfo({userid: tid}).then((res) => {
        if (res.code === ERR_SUCCESS) {
          this._dictChatCustomer(res.data)
          this.chatCustomerClone = Object.assign({}, res.data)
          this.chatCustomer = res.data
        } else {
          Message.error(res.msg)
        }
      })
      getAppUserCountInfo({userid: tid}).then((res) => {
        if (res.code === ERR_SUCCESS && res.data) {
          this.countInfo = res.data
          if (!res.data.totalRecharge) {
            this.countInfo.totalRecharge = 0
          }
        } else {
          Message.error(res.msg)
        }
      })
      getAppUserExamReportList({userid: tid}).then((res) => {
        if (res.code === ERR_SUCCESS) {
          this.reportList = res.data
        } else {
          Message.error(res.msg)
        }
      })
    })
  },
  computed: {
    ...mapGetters(['config'])
  },
  methods: {
    handleChange (value) {
      if (value && value.length > 0) {
        this.chatCustomer.area = value.join(' ')
      }
    },
    _interception (value) {
      const cardNo = value + ''
      if (cardNo.length > 0) {
        return cardNo.substr(0, 14) + '******'
      }
    },
    handlPhotoUrlClick (url) {
      window.open(url, '_blank')
    },
    cSelectChange (e) {
      if (e.length === 0) {
        this.chatCustomer.symptomType = ''
      } else {
        this.chatCustomer.symptomType = e.join(' ')
      }
    },
    _formatCurrency (e) {
      return formatCurrency(e)
    },
    _genderFormat (e) {
      return genderFormat(e)
    },
    _format (e) {
      return format(e)
    },
    change (key, verifyCallback) {
      if (this.edit) {
        let v = !verify(this.chatCustomer[key], verifyCallback)
        if (this.chatCustomer.hasOwnProperty(`${key}Verify`)) {
          this.chatCustomer[`${key}Verify`] = v
        } else {
          this.$set(this.chatCustomer, `${key}Verify`, v)
        }
      }
    },
    handleClick (type) {
      switch (type) {
        case 'follow':
          if (this.chatCustomer.relationType !== 1) return
          MessageBox.confirm('是否确认删除该客户资料？', '删除客户资料', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this._consultantAppUserUnAuthorize()
            this.$router.push({path: '/custom'})
          }).catch(() => {})
          break
        case 'edit':
          this.cityValue = this.chatCustomer.area.split(' ')
          this.edit = true
          break
        case 'save':
          if (this.chatCustomer.ageVerify || this.chatCustomer.heightVerify ||
          this.chatCustomer.weightVerify || this.chatCustomer.idcardNoVerify) return
          this.edit = false
          const {id, userType, symptomType, nickName, gender, height, weight, birthDate, idcardNo, area, marriageInfo, educationLevel, career, wechat, qq} = this.chatCustomer
          const userInfo = {id, userType, symptomType, nickName, gender, height, weight, birthDate, idcardNo, area, marriageInfo, educationLevel, career, wechat, qq}
          updataAppUserInfo({userInfo}).then(res => {
            if (res.code === ERR_SUCCESS) {
              const {tid} = this.$route.params
              this.$parent._getAppUserInfo && this.$parent._getAppUserInfo(tid)
              this.chatCustomerClone = Object.assign({}, this.chatCustomer)
              this._dictChatCustomer(this.chatCustomer)
              Message({
                message: '保存成功！',
                type: 'success'
              })
            } else {
              Message.error(res.msg)
            }
          })
          break
        case 'cancel':
          this.chatCustomer = Object.assign({}, this.chatCustomerClone)
          this._dictChatCustomer(this.chatCustomer)
          this.edit = false
          break
        default:
      }
    },
    _consultantAppUserUnAuthorize () {
      const userid = this.chatCustomer.id
      consultantAppUserUnAuthorize({userid}).then(res => {
        if (res.code === ERR_SUCCESS) {
          Message({
            message: '删除客户资料成功！',
            type: 'success'
          })
        } else {
          Message.error(res.msg)
        }
      })
    },
    _dictChatCustomer (chatCustomer) {
      if (isNull(chatCustomer)) return
      if (!isNull(chatCustomer.symptomType)) {
        let symptomTypeText = ''
        dictKeyGetArrays({
          value: chatCustomer.symptomType,
          targetArray: chatCustomer.symptomTypeList,
          valueKey: 'name'
        }, (f) => {
          symptomTypeText += ` ${f.name}`
        })
        chatCustomer.symptomTypeText = symptomTypeText.substr(1)
        chatCustomer.symptomTypeId = chatCustomer.symptomType.split(' ')
      } else {
        chatCustomer.symptomTypeText = ''
        chatCustomer.symptomTypeId = []
      }
      if (!isNull(chatCustomer.userType)) {
        let userTypeText = ''
        dictKeyGetArray({
          value: chatCustomer.userType,
          targetArray: chatCustomer.userTypeList,
          valueKey: 'name'
        }, (f) => {
          userTypeText += ` ${f.name}`
        })
        chatCustomer.userTypeText = userTypeText.substr(1)
        this.newUserTypeList(chatCustomer)
      }
    },
    newUserTypeList (chatCustomer) {
      if (isNull(chatCustomer) || isNull(chatCustomer.userTypeList)) return
      let newUserTypeList = []
      let _ll = chatCustomer.userTypeList
      for (let j = 0; j < _ll.length; j++) {
        let _lll = _ll[j]
        if (_lll.id === '已成交客户' && chatCustomer.userType === '已成交客户') {
          newUserTypeList.push(_lll)
        } else if (_lll.id === '新客户' && chatCustomer.userType === '新客户') {
          newUserTypeList.push(_lll)
        } else if (_lll.id !== '新客户' && _lll.id !== '已成交客户') {
          newUserTypeList.push(_lll)
        }
      }
      chatCustomer.userTypeList = newUserTypeList
      if (isNull(chatCustomer.portraitUrl)) {
        chatCustomer.portraitUrl = this.config.customPortraitUrl
      }
    }
  },
  components: {
    [Cascader.name]: Cascader,
    [Button.name]: Button,
    [Input.name]: Input,
    [Select.name]: Select,
    [Option.name]: Option,
    [DatePicker.name]: DatePicker,
    cTitle,
    cScroll
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/css/variable"
@import "~common/css/mixin"
.custom-info-dialog
  position relative
  width 100%
  height 430px
  overflow-y auto
.custom-info-wrapper
  position relative
  width 100%
  font-size 0
  inline-block-top()
  .custom-info
    position relative
    float left
    width 180px
    height 180px
    background-color #e6ecf2
    .custom-info-portrait
      display block
      margin 0 auto
      margin-top 10px
      width 75px
      height 75px
      border-radius 50%
      overflow hidden
      img
        width 75px
        height 75px
        border-radius 50%
    .custom-info-username,.custom-info-userId
      display block
      margin 0 auto
      font-size $font-size-md
      color $color-text
      text-align center
      no-wrap()
    .custom-info-username
      height 28px
      line-height 28px
  .custom-form
    margin-top -1px
    margin-left 180px
    height 180px
    .custom-form-item
      position relative
      width 33.3%
      background-color #e1ecfa
      inline-block-top()
    .custom-form-item-content
      height 44px
      line-height 44px
      border-top 1px solid #fff
      border-left 1px solid #fff
    .custom-form-label
      padding-right 10px
      width 55px
      font-size $font-size-sm
      text-align right
      background-color #cedaf2
      inline-block-top()
    .custom-info-text
      display block
      width 150px
      height 44px
      line-height 44px
      color $color-text
      font-size $font-size-sm
      no-wrap()
    .custom-form-input
      padding 0 5px
      width 150px
      height 35px
      inline-block-top()
    .icon-exclamation
      position absolute
      top 50%
      right 5px
      transform translateY(-50%)
      font-size $font-size-md
      color #F94848
      inline-block-top()
.custom-form-buttom
  position absolute
  left 0
  bottom 0
  width 100%
  height 35px
  font-size 0
  background-color #f0f5fc
  .custom-form-buttom-item
    width 50%
    height 35px
    line-height 35px
    text-align center
    inline-block-top()
    button
      padding 0
      width 100%
      height 100%
      background-color transparent
      border none
      border-radius 0
      inline-block-top()
    button:hover
        background-color #CFCFCF
    button:active
        background-color #DEDEDE
    &.relation
      .buttom-delete
        color #CCC
      button:hover
        cursor not-allowed
        background-color transparent
  .buttom-edit
    color #4897f9
  .buttom-delete
    color #f85959
  .icon-buttom
    font-size $font-size-lg
.custom-info-title-wrapper
  margin-top 34px
  width 100%
  height 45px
  .custom-info-title
    height 40px
    line-height 40px
    font-size $font-size-md
    inline-block-top()
.statistical-wrapper
  width 100%
  font-size 0
  .statistical-item
    width 20%
    inline-block-top()
    .statistical-item-content
      width 100%
      font-size 18px
    .statistical-item-title
      padding 10px 0 20px 0
      width 100%
      height 30px
      line-height 30px
      font-size $font-size-md
      color $color-text
      text-align center
    .statistical-item-text
      display block
      width 100%
      height 35px
      line-height 35px
      font-size $font-size-sm
      color #4897f9
      text-align center
      font-size 18px
    &:nth-child(2)
        .statistical-item-text
          color #0cc9c7
    &:nth-child(3)
        .statistical-item-text
          color #f96948
    &:nth-child(4)
        .statistical-item-text
          color #c3c125
    &:nth-child(5)
        .statistical-item-text
          color #f9c148
.physical-wrapper
  margin-top 10px
  width 100%
  border 1px solid #c2c2c2
  box-sizing border-box
  font-size 0
  .physical-header
    width 100%
    font-size 0
    .physical-header-item
      padding 0 20px
      width 33.3%
      height 42px
      line-height 42px
      font-size $font-size-md
      font-weight 400
      color $color-text
      box-sizing border-box
      inline-block-top()
    .physical-header-item+.physical-header-item
      font-weight 500
      text-align center
    .physical-header-item+.physical-header-item+.physical-header-item
      font-weight 400
      text-align right
  .physical-item
    margin-top -1px
    margin-left -1px
    width 20%
    border-top 1px solid #c2c2c2
    border-left 1px solid #c2c2c2
    inline-block-top()
    .physical-item-label,.physical-item-text
      display block
      padding 0 10px
      height 42px
      line-height 42px
      font-size $font-size-sm
      color $color-text
      no-wrap()
    .physical-item-label
      text-align center
  .physical-DiseaseHistory-item
    width 80%
    .physical-item-label
      text-align left
  .physical-picture-wrapper
    padding 5px 10px
    font-size 0
    .physical-picture
      margin-right 15px
      inline-block-top()
      img
        max-width 200px
.null-tip
  text-align center
  line-height 40px
  </style>
