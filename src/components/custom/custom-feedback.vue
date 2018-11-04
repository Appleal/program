<template>
  <div class="custom-feedback-dialog">
     <div class="feedback-header">
      <c-title>
        <p slot="title">效果反馈</p>
      </c-title>
     </div>
     <div class="feedback-content-wrapper">
     <c-scroll :data="data">
        <div  v-if="data.length > 0">
          <div class="feedback-item-wrapper" v-for="d in data" :key="d.id">
              <div class="feedback-item-left">
                <h3 class="feedback-title">{{d.majorFunction}}</h3>
                <span class="feedback-user-text">{{d.name}}</span>
                <span class="feedback-user-text">({{d.userid}})</span>
              </div>
              <div class="feedback-item-right">
                <div class="feedback-item">
                  <div class="feedback-item-content">
                    <span class="feedback-item-label">{{d.createTime}}</span>
                  </div>
                </div>
                <div class="feedback-item">
                  <div class="feedback-item-content">
                    <span class="feedback-item-label">睡眠质量：</span>
                    <span class="feedback-item-text">{{d.sleepSituation}}</span>
                  </div>
                  <div class="feedback-item-content">
                    <span class="feedback-item-label feedback-item-labelMax">小便频次：</span>
                    <span class="feedback-item-text">{{d.urinateFrequency}}</span>
                  </div>
                </div>
                <div class="feedback-item">
                  <div class="feedback-item-content">
                    <span class="feedback-item-label">晨勃情况：</span>
                    <span class="feedback-item-text">{{d.morningErection}}</span>
                  </div>
                  <div class="feedback-item-content">
                    <span class="feedback-item-label feedback-item-labelMax">夜勃情况：</span>
                    <span class="feedback-item-text">{{d.nightErection}}</span>
                  </div>
                </div>
                <div class="feedback-item">
                  <div class="feedback-item-content">
                    <span class="feedback-item-label">勃起硬度：</span>
                    <span class="feedback-item-text">{{d.erectionSolidity}}</span>
                  </div>
                  <div class="feedback-item-content">
                    <span class="feedback-item-label feedback-item-labelMax">勃起速度：</span>
                    <span class="feedback-item-text">{{d.erectionSpeed}}</span>
                  </div>
                </div>
                <div class="feedback-item">
                  <div class="feedback-item-content">
                    <span class="feedback-item-label">勃起角度：</span>
                    <span class="feedback-item-text">{{d.sexImpulse}}</span>
                  </div>
                  <div class="feedback-item-content">
                    <span class="feedback-item-label feedback-item-labelMax">性冲动：</span>
                    <span class="feedback-item-text">{{d.sexImpulse}}</span>
                  </div>
                </div>
                <div class="feedback-item">
                  <div class="feedback-item-content">
                    <span class="feedback-item-label">遗精滑精：</span>
                    <span class="feedback-item-text">{{d.spermatorrhea}}</span>
                  </div>
                  <div class="feedback-item-content">
                    <span class="feedback-item-label feedback-item-labelMax">排尿情况：</span>
                    <span class="feedback-item-text">{{d.urinateIssue}}</span>
                  </div>
                </div>
              </div>
          </div>
        </div>
        <div class="feedback-item-wrapper temporarily" v-else>
          暂无数据
        </div>
     </c-scroll>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
import { Pagination, Message } from 'element-ui'
import cScroll from 'base/c-scroll/c-scroll'
import cTitle from 'base/c-title/c-title'
import { getAppUserDrugFeed } from 'api/feedback'
import { ERR_SUCCESS } from 'api/config'
import { isNull, dictKeyGetArray } from 'common/js/util'

export default {
  data () {
    return {
      data: []
    }
  },
  created () {
    this.$nextTick(() => {
      const {tid} = this.$route.query
      if (isNull(tid)) return
      this.tid = tid
      this._getAppUserDrugFeed(tid)
    })
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    _getAppUserDrugFeed (userid) {
      getAppUserDrugFeed({userid}).then(res => {
        if (res.code === ERR_SUCCESS) {
          this.data = res.data.dataList || []
        } else {
          Message.error(res.msg)
        }
      })
    },
    _dictKeyGetArray (d) {
      if (isNull(d)) return
      if (!isNull(d.sleepQuality)) {
        let sleepText = ''
        dictKeyGetArray({
          value: d.appUserDrugFeedList.sleepQuality,
          targetArray: d.smzlList,
          valueKey: 'id'
        }, (f) => {
          sleepText += ` ${f.name}`
        })
        d.sleepText = sleepText.substr(1)
      }
      if (!isNull(d.sleepQuality)) {
        let sleepText = ''
        dictKeyGetArray({
          value: d.sleepQuality,
          targetArray: d.smzlList,
          valueKey: 'id'
        }, (f) => {
          sleepText += ` ${f.name}`
        })
        d.sleepText = sleepText.substr(1)
      }
      if (!isNull(d.erectionAngle)) {
        let erectionAngleText = ''
        dictKeyGetArray({
          value: d.erectionAngle,
          targetArray: d.bqjdList,
          valueKey: 'id'
        }, (f) => {
          erectionAngleText += ` ${f.name}`
        })
        d.erectionAngleText = erectionAngleText.substr(1)
      }
      if (!isNull(d.sexDuration)) {
        let sexDurationText = ''
        dictKeyGetArray({
          value: d.sexDuration,
          targetArray: d.xjscList,
          valueKey: 'id'
        }, (f) => {
          sexDurationText += ` ${f.name}`
        })
        d.sexDurationText = sexDurationText.substr(1)
      }

      if (!isNull(d.sexRecently)) {
        d.sexRecentlyText = d.sexRecently === 0 ? '有' : '无'
      }
      if (!isNull(d.midwaySlump)) {
        d.midwaySlumpText = d.midwaySlump === 0 ? '有' : '无'
      }
      if (!isNull(d.erection)) {
        d.erectionCaseText = d.erection === 0 ? '有' : '无'
      }
    }
  },
  components: {
    [Pagination.name]: Pagination,
    cScroll,
    cTitle
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
  .feedback-header
    margin 0 0 10px 0
    height 35px
    line-height 35px
  .feedback-content-wrapper
    height 426px
  .feedback-item-wrapper
    position relative
    margin-bottom 20px
    font-size 0
    overflow hidden
    .feedback-item-left
      position absolute
      top 0
      left 0
      bottom 0
      width 140px
      background-color #dae4f2
      .feedback-title
        margin 35px auto 25px auto
        color #ff9000
        font-size $font-size-lg
        text-align center
      .feedback-user-text
        display block
        height 16px
        line-height 16px
        color $color-theme
        font-size $font-size-sm
        text-align center
    .feedback-item-right
      margin-left 150px
      padding 10px 20px
      background-color #dadfe6
    .feedback-item
      font-size 0
      .feedback-item-content
        height 30px
        line-height 30px
        font-size $font-size-sm
        inline-block-top()
        .feedback-item-label,.feedback-item-text
          height 30px
          line-height 30px
          color #7a8799
          color #525a66
          inline-block-top()
        .feedback-item-labelMax
          width 120px
          text-align right
        .feedback-item-text
          padding 0 10px
          width 180px
  .temporarily
    font-size 14px
    color #999
    text-align center
    line-height 200px
  .feedback-footer
    margin 21px 0
    text-align right
    .feedback-pagination-content
      margin-right 20px
      inline-block-top()
</style>
