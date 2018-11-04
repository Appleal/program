<template>
  <c-dialog :title="title" @close="goBack" class="element-dialog">
    <div class="layer-wrapper" :style="layerWrapperStyle">
      <div v-show="index === 0" class="msg-wrapper">
        <div class="task-list">
          <h3>选择任务</h3>
          <ul>
            <li class="task-item" :class="{active: selectItem === item.type}" v-for="item in taskList" :key="item.title" @click="selectList(item.type)">
              <p class="title">{{item.titie}}</p>
              <p class="describe">{{item.describe}}</p>
            </li>
          </ul>
        </div>
        <div class="msg-content-left">
          <div class="task-list">
            <h3>任务预览</h3>
          </div>
          <!--自定义任务编辑模块-->
          <div  v-show="selectItem === 6 || selectItem === 2 || selectItem === 3">
            <div class="msg-app-wrapper">
              <div class="msg-app-header">
                <div class="msg-app-header-left">
                  <span class="el-icon-arrow-left"></span>
                </div>
                <div class="msg-app-header-content">
                  {{bmData.msgTitle.length > 0 ? bmData.msgTitle : ''}}
                </div>
              </div>
              <div class="taskDescription">
                <div>
                  {{bmData.taskDescription.length > 0 ? bmData.taskDescription : ''}}
                </div>
              </div>
              <div class="msg-app-content">
                  <div class="msg-app-input-content">
                    <div class="msg-app-input-content-body">
                      <c-scroll :data="data">
                        <div v-html="editorText" class="editorText"></div>
                      </c-scroll>
                    </div>
                  </div>
              </div>

              <div class="know">我知道了</div>
            </div>
          </div>
          <!--健康知识文章分类-->
          <div  v-show="selectItem === 8">
            <div class="msg-app-wrapper">
              <div class="msg-app-header">
                <div v-html="articleHtml" class="articleHtmlContent" style="height: 430px; overflow-y: auto"></div>
              </div>
            </div>
          </div>
          <!--不可编辑功能-->
          <div  v-show="selectItem === 9" style="height: 480px">
            <div class="msg-app-wrapper">
              <div class="wachat">

              </div>
            </div>
          </div>
        </div>
        <div class="msg-content-right">
          <div class="task-list" style="width: 100%; padding-left: 0px">
            <h3>任务编辑</h3>
          </div>

          <!--自定义任务编辑模块-->
          <div v-show="selectItem === 6 || selectItem === 2 || selectItem === 3">
            <div v-if="!oneUser">
              <div class="msg-input-item" style="margin-bottom: 0">
                <span class="msg-input-label">
                  <strong class="msg-input-strong">*</strong>选择客户：
                </span>
                    <div class="msg-input-content" :class="{hasCustom: bmData.custom.length > 30}">
                    <el-select v-model="bmData.custom" multiple placeholder="请选择" style="width: 100%;">
                      <el-option
                        v-for="c in bmData.customList"
                        :key="c.id"
                        :label="c.name"
                        :value="c.id">
                      </el-option>
                    </el-select>
                  </div>
              </div>
              <div class="msg-input-item" style="margin-bottom: 0">
                <div class="msg-input-content" style="margin-left: 120px">
                  <div class="msg-input-tpl-item">
                        <span class="msg-input-tpl-label">
                          已选择
                          <strong class="msg-input-strong">{{bmData.custom ? bmData.custom.length : 0}}</strong>
                          人
                          </span>
                    <span class="msg-input-tpl-button" @click="select('custom')">选择客户</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="msg-input-item" v-else >
              <span class="msg-input-label">
               客户名称：
              </span>
              <div class="msg-input-content">
                <span style="font-size: 12px; line-height: 34px">{{userName}}</span>
              </div>
            </div>
            <div class="msg-input-item">
              <span class="msg-input-label">
                <strong class="msg-input-strong">*</strong>任务标题：
              </span>
              <div class="msg-input-content">
                <el-input v-model="bmData.msgTitle"  @input="msgTitle" placeholder="请输入标题"></el-input>
              </div>
            </div>
            <div class="msg-input-item">
              <span class="msg-input-label">
                <strong class="msg-input-strong">*</strong>任务描述：
              </span>
              <div class="msg-input-content">
                <el-input v-model="bmData.taskDescription" @input="taskDescription" placeholder="请输入任务描述"></el-input>
              </div>
            </div>
            <div class="msg-input-item" style="margin-bottom: 0">
            <span class="msg-input-label">
              <strong class="msg-input-strong">*</strong>任务内容：
            </span>
            <div class="msg-input-content">
              <wang-editor ref="editor" @showCityName="updateStep"></wang-editor>
            </div>
          </div>
          </div>
          <!--健康知识文章分类-->
          <div class="" v-show="selectItem === 8" style="height: 480px">
            <div v-if="!oneUser">
              <div class="msg-input-item" style="margin-bottom: 0">
                <span class="msg-input-label" style="width: 100px">
                  <strong class="msg-input-strong">*</strong>选择客户：
                </span>
                <div class="msg-input-content" :class="{hasCustom: bmData.custom.length > 30}">
                  <el-select v-model="bmData.custom" multiple placeholder="请选择" style="width: 310px">
                    <el-option
                      v-for="c in bmData.customList"
                      :key="c.id"
                      :label="c.name"
                      :value="c.id">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="msg-input-item" style="margin-bottom: 0">
                <div class="msg-input-content" style="margin-left: 120px">
                  <div class="msg-input-tpl-item">
                        <span class="msg-input-tpl-label">
                          已选择
                          <strong class="msg-input-strong">{{bmData.custom ? bmData.custom.length : 0}}</strong>
                          人
                          </span>
                    <span class="msg-input-tpl-button" @click="select('custom')">选择客户</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="msg-input-item" v-else >
              <span class="msg-input-label">
               客户名称：
              </span>
              <div class="msg-input-content">
                <span style="font-size: 12px; line-height: 34px">{{userName}}</span>
              </div>
            </div>
            <div class="msg-input-item">
              <span class="msg-input-label" style="width: 100px">
                <strong class="msg-input-strong">*</strong>选择文章分类：
              </span>
              <div class="msg-input-content">
                <el-select v-model="getArticleType" style="width: 310px" placeholder="请选择" @change="selectArticle">
                  <el-option
                    v-for="item in getArticleTypeContent"
                    :key="item.id"
                    :label="item.typeName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="msg-input-item">
              <span class="msg-input-label" style="width: 100px">
                <strong class="msg-input-strong">*</strong>选择文章标题：
              </span>
              <div class="msg-input-content">
                <el-select v-model="articleTitle" style="width: 310px" placeholder="请选择" @change="selectTitle">
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.title"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
          <!--不可编辑功能-->
          <div class="" v-show="selectItem === 9" style="height: 480px">
            <div v-if="!oneUser">
              <div class="msg-input-item" style="margin-bottom: 0">
                <span class="msg-input-label">
                  <strong class="msg-input-strong">*</strong>选择客户：
                </span>
                <div class="msg-input-content" :class="{hasCustom: bmData.custom.length > 30}">
                  <el-select v-model="bmData.custom" multiple placeholder="请选择" style="width: 100%;">
                    <el-option
                      v-for="c in bmData.customList"
                      :key="c.id"
                      :label="c.name"
                      :value="c.id">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="msg-input-item" style="margin-bottom: 0">
                <div class="msg-input-content" style="margin-left: 100px">
                  <div class="msg-input-tpl-item">
                        <span class="msg-input-tpl-label">
                          已选择
                          <strong class="msg-input-strong">{{bmData.custom ? bmData.custom.length : 0}}</strong>
                          人
                          </span>
                    <span class="msg-input-tpl-button" @click="select('custom')">选择客户</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="msg-input-item" v-else >
              <span class="msg-input-label">
               客户名称：
              </span>
              <div class="msg-input-content">
                <span style="font-size: 12px; line-height: 34px">{{userName}}</span>
              </div>
            </div>
            <div class="msg-input-item fixedTask">
                该任务为固定任务，不可编辑
            </div>
          </div>
          <div class="msg-input-item">
            <el-button
              @click="_sendMsg"
              :loading="loading"
              style="margin: 20px 10px 0 0;float: right;"
              size="mini"
              class="element-button">发送任务</el-button>
            <el-button
              type="danger"
              @click="_cancelMsg"
              :loading="loading"
              size="mini"
              style="margin: 20px 10px 0 0;float: right;">取消</el-button>
          </div>

        </div>
      </div>
      <div v-show="index === 1" class="custom-wrapper">
        <select-custom @change="selectCustomChange"></select-custom>
      </div>
    </div>
  </c-dialog>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
import cDialog from 'base/c-dialog/c-dialog'
import { Button, Select, Option, Input, Radio, Message } from 'element-ui'
import selectCustom from 'components/home/select-custom'
import { ERR_SUCCESS } from 'api/config'
import { pushAppUserTask, uploadContent, getArticleType, getArticle } from 'api/message'
import cScroll from 'base/c-scroll/c-scroll'
import { isNull } from 'common/js/util'
import wangEditor from 'base/wang-editor/wang-editor'
const _taskList = [
  {
    type: 9, titie: '完善健康史', describe: '疾病史，手术史，过敏史'
  }, {
    type: 2, titie: '注意事项', describe: '提醒客户要注意的事情'
  }, {
    type: 3, titie: '基本分析报告', describe: '对客户首次跟进的反馈'
  }, {
    type: 8, titie: '健康知识', describe: '根据客户情况选择健康知识文章'
  }, {
    type: 6, titie: '自定义', describe: '统一模板，自定义任务'
  }
]
export default {
  data () {
    return {
      articleId: '',
      articleHtml: '',
      textLength: '',
      taskType: 8,
      getArticleType: '',
      getArticleTypeContent: [],
      data: [],
      editorText: '',
      taskList: _taskList,
      selectItem: 8,
      hasCustom: '',
      oneUser: false,
      index: 0,
      loading: false,
      userName: '',
      title: '',
      bmData: {
        timeType: false,
        taskDescription: '',
        msgTitle: '',
        custom: [],
        customList: [],
        sendTime: new Date(),
        content: ''
      },
      articleTitle: '',
      options: [],
      classification: ''
    }
  },
  created () {
    const {tid, name} = this.$route.query
    if (tid) {
      this.oneUser = true
      this.bmData.custom.push(tid)
      this.selectItem = 9
      this.taskType = 9
    } else {
      this.taskList = [{
        type: 8, titie: '健康知识', describe: '根据客户情况选择健康知识文章'
      }, {
        type: 6, titie: '自定义', describe: '统一模板，自定义任务'
      }]
    }
    if (name) {
      this.userName = name
    }
    this._getArticleType()
  },
  computed: {
    layerWrapperStyle () {
      if (this.index === 0) return ''
      if (this.index === 1) return 'width: 840px;'
      if (this.index === 2) return ''
    },
    ...mapGetters(['user'])
  },
  methods: {
    _getArticleType () {
      getArticleType().then(res => {
        this.getArticleTypeContent = res.data.list
      })
    },
    selectArticle () {
      const { getArticleType } = this
      getArticle({typeId: getArticleType}).then(res => {
        this.options = res.data.articles
        this.articleTitle = ''
        this.articleHtml = ''
      })
    },
    selectTitle (value) {
      this.options.forEach(e => {
        if (e['id'] === value) {
          this.articleId = e['id']
          this.articleHtml = e['content']
        }
      })
    },
    _sendMsg () {
      const { msgTitle, custom, taskDescription } = this.bmData
      const { editorText, taskType, articleId, getArticleType, textLength } = this
      const userId = custom.join(',')
      if (taskType === 9) {
        const ids = custom.join(',')
        pushAppUserTask({ids, taskType}).then(res => {
          if (res.code === ERR_SUCCESS) {
            Message.success('发送成功！')
            this.$router.go(-1)
          }
        })
      } else if (taskType === 8) { // 健康知识
        const ids = custom.join(',')
        if (isNull(ids)) {
          Message.error('请选择客户！')
          return
        }
        if (isNull(getArticleType)) {
          Message.error('请选择文章分类！')
          return
        }
        if (isNull(articleId)) {
          Message.error('请选择文章！')
          return
        }
        pushAppUserTask({ids, taskType, articleId}).then(res => {
          if (res.code === ERR_SUCCESS) {
            Message.success('发送成功！')
            this.$router.go(-1)
          } else {
            Message.error('提交失败')
          }
        })
      } else {
        if (isNull(userId)) {
          Message.error('请选择客户！')
          return
        }
        if (isNull(taskDescription)) {
          Message.error('请选择描述！')
          return
        }
        if (isNull(msgTitle)) {
          Message.error('请输入标题！')
          return
        }
        if (isNull(textLength)) {
          Message.error('请输入内容或者选择模板！')
          return
        }
        this.loading = true
        pushAppUserTask({
          ids: userId,
          taskContent: uploadContent(msgTitle, taskDescription, editorText),
          taskName: msgTitle,
          taskType,
          taskDescription
        }).then(res => {
          if (res.code === ERR_SUCCESS) {
            this.bmData.msgTitle = ''
            this.bmData.custom = []
            this.bmData.customList = []
            this.editorText = ''
            this.textLength = ''
            this.bmData.taskDescription = ''
            Message({
              showClose: true,
              message: '发送成功！',
              type: 'success'
            })
            this.$router.go(-1)
          } else {
            Message.error(res.msg)
          }
          this.loading = false
        })
      }
    },
    _cancelMsg () {
      this.$router.go(-1)
    },
    updateStep (data) {
      this.editorText = data
      this.textLength = data.replace(/<[^>]+>/g, '')
    },
    msgTitle (e) {
      setTimeout(() => {
        if (this.bmData.msgTitle.length > 20) {
          const msgTitle = this.bmData.msgTitle.substring(0, 20)
          this.bmData.msgTitle = msgTitle
        }
      }, 20)
    },
    taskDescription (e) {
      setTimeout(() => {
        if (this.bmData.taskDescription.length > 30) {
          const taskDescription = this.bmData.taskDescription.substring(0, 30)
          this.bmData.taskDescription = taskDescription
        }
      }, 20)
    },
    goBack () {
      this.$router.go(-1)
    },
    changeIndex (index) {
      switch (index) {
        case 0:
          this.index = 0
          this.title = '消息推送'
          break
        case 1:
          this.index = 1
          this.title = '选择用户'
          break
        case 2:
          this.index = 2
          this.title = '选择模板'
          break
        default:
          break
      }
    },
    select (type) {
      switch (type) {
        case 'custom':
          this.changeIndex(1)
          break
        case 'tpl':
          this.changeIndex(2)
          break
        default:
          this.changeIndex(0)
          break
      }
    },
    selectCustomChange (item) {
      let newCustomList = []
      let newCustom = []
      item.forEach(i => {
        newCustomList.push({
          id: i.aid,
          name: i.aName
        })
        newCustom.push(i.aid)
      })
      this.bmData.customList = newCustomList
      this.bmData.custom = newCustom
      this.changeIndex(0)
    },
    selectList (index) {
      this.selectItem = index
      this.taskType = index
      if (index === 2 || index === 3 || index === 6) {
        this.taskType = 7
        if (index === 2) {
          this.bmData.msgTitle = '注意事项'
          this.bmData.taskDescription = '服用期间需要注意的事情'
          this.editorText = `
             <br>
              <p>1、忌口：高浓度酒精、白萝卜、绿豆、芒果、咖啡、碳酸饮料、浓茶、辛辣刺激食物</p><br>
              <p>2、行为：保持手机畅通；避免熬夜、久坐；严禁酗酒、宵夜、抽烟；多运动、多吃新鲜蔬菜水果；有前列腺炎症的人多喝水，多走动。</p>
           `
          this.$refs.editor.getEditor().txt.html(this.editorText)
          this.textLength = 20
        } else if (index === 3) {
          this.bmData.msgTitle = '基本分析报告'
          this.bmData.taskDescription = '您的分析报告已生成，点击可以查看噢'
          this.editorText = `
            <br>
            <p><span style="font-weight: bold;">症状</span></p><p><span style="font-weight: bold;"></span></p>
            <p>阳痿、房事时间短、前列腺、性冷淡</p><p><br></p>
            <p><span style="font-weight: bold;">程度</span></p>
            <p>轻度/中度/重度（阳痿、早泄、前列腺、性冷淡）</p><p><br></p>
            <p><span style="font-weight: bold;">肾功能</span></p>
            <p>肾阳虚、肾阴虚、正常、阴阳两虚、肾气虚</p>
            <p><span style="font-weight: bold;"><br></span></p><p><span style="font-weight: bold;">建议</span></p>
            <p>先服用两天产品，观察效果，服用期间定期反馈情况，然后根据具体情况再做进一步的分析</p>
           `
          this.$refs.editor.getEditor().txt.html(this.editorText)
          this.textLength = 100
        } else {
          this.bmData.msgTitle = ''
          this.bmData.taskDescription = ''
          this.editorText = ''
          this.$refs.editor.getEditor().txt.html('')
        }
      }
    }
  },
  components: {
    [Button.name]: Button,
    [Select.name]: Select,
    [Option.name]: Option,
    [Input.name]: Input,
    [Radio.name]: Radio,
    selectCustom,
    wangEditor,
    cDialog,
    cScroll
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/css/variable"
  @import "~common/css/mixin"

  .layer-wrapper
    width 960px
    height 560px
    box-sizing border-box
    .msg-wrapper
      width 100%
      font-size 0
    .task-list
      padding-left 16px
      width 194px
      float left
      h3
        height 40px
        line-height 40px
        font-size 16px
      .task-item
        float left
        margin-bottom 16px
        overflow hidden
        width 100%
        height 60px
        cursor pointer
        border-radius 5px
        background-color #f2f2f2
        .describe
          padding-left 10px
          line-height 20px
          font-size 12px
        .title
          padding-left 10px
          line-height 30px
          font-size 14px
      .active
        background #4897f9
        color #fff
    .msg-content-left
      padding 12px 24px
      padding-top 0px
      width 260px
      height 250px
      inline-block-top()
    .msg-content-right
      width 440px
      height 250px
      inline-block-top()
      .msg-input-item
        margin-bottom 20px
        width 100%
        font-size 0
      .fixedTask
        float left
        height 60px
        line-height 60px
        width 428px
        font-size 14px
        background-color #f2f2f2
        border 1px solid   #e0e0e0
        color #979699
        text-align center
      .msg-input-label
        padding 0 10px
        width 100px !important
        height 35px
        line-height 35px
        font-size $font-size-sm
        color $color-text
        text-align right
        inline-block-top()
      .msg-input-strong
        color #f94848
      .msg-input-content
        width 310px
        inline-block-top()
        font-size 14px
      .hasCustom
        max-height 125px
        overflow-y auto
        border-bottom  1px solid #c2c2c2
      .msg-input-sender
        height 25px
      .msg-input-tpl-item
        width 96%
      .msg-input-tpl-label
        height 35px
        line-height 35px
        font-size $font-size-sm
        color $color-text
        inline-block-top()
      .msg-input-tpl-button
        float right
        height 35px
        line-height 35px
        font-size $font-size-sm
        color $color-theme
        cursor pointer
        inline-block-top()
        &:hover
          color #0e71ec
        &:active
          color #74acf1
  .msg-app-wrapper
    position relative
    width 260px
    background url("./iphone.png") no-repeat
    height 506px
    background-size 100% 100%
    overflow hidden
    .wachat
      margin-top 60px
      margin-left 10px
      width 240px
      background url("./WechatIMG.png") no-repeat
      background-size 100% 100%
      height 436px
      border-bottom-left-radius 38px
      border-bottom-right-radius 38px
      overflow hidden
    .msg-app-header
      width 100%
      height 35px
      line-height 35px
      margin-top 50px
      font-size 0
      .msg-app-header-left,.msg-app-header-content,.msg-app-header-right
        height 35px
        line-height 35px
        font-size $font-size-sm
        color $color-text
        inline-block-top()
      .msg-app-header-left
        float left
        padding-left 10px
        width 20px
      .msg-app-header-content
        float left
        width 220px
        padding-right 20px
        box-sizing border-box
        font-weight 500
        text-align center
        overflow hidden
        text-overflow ellipsis
        white-space nowrap
      .msg-app-header-right
        padding-right 10px
        width 60px
        text-align right
    .know
        margin 0 auto
        margin-top 10px
        position absolute
        bottom 10px
        left 30px
        border-radius 5px
        width 200px
        height 30px
        line-height 30px
        text-align center
        background #505658
        color #fff
        font-size 14px
    .taskDescription
        margin 20px auto
        padding 5px 10px
        font-size 12px
        color #333
        height 40px
        width 220px
        line-height 20px
        min-height 20px
        div
          padding 4px 10px
          background-color #f5f5f5
          height 100%
    .msg-app-content
      margin 0 auto
      width 220px
      padding 10px
      height 258px
      overflow-y auto
      .msg-app-user
        width 25px
        height 25px
        background-color #dcdcdc
        border-radius 50%
        overflow hidden
        inline-block-top()
        img
          width 25px
          height 25px
      .msg-app-input-content
        width 100%
        position relative
        padding 0 0 0 0px
        font-size $font-size-md
        inline-block-top()
        .msg-app-input-content-body
          padding 10px
          border-radius 3px
          font-size $font-size-sm
          word-wrap break-word
          .editorText
            font-size 12px
            p
              height 20px
              line-height 20px
    .msg-app-footer
      position absolute
      top 425px
      left 10px
      right 10px
      padding 0 5px
      height 35px
      font-size 0
      background-color #ededf0
      .msg-app-footer-input
        margin 5px 5px 5px 0
        width 175px
        height 25px
        border-radius 5px
        background-color #fff
        inline-block-top()
      .msg-app-footer-icon
        margin 6.5px 0
        width 25px
        height 22px
        line-height 22px
        font-size 22px
        color #898989
        text-align center
        inline-block-top()
</style>
