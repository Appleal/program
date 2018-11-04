<template>
 <c-dialog title="上传头像" @close="goBack">
  <div class="sculpture-wrapper">
    <div class="sculpture-update">
      <div class="sculpture-upload">
        <div class="sculpture-select-wrapper" v-show="!isUpload">
          <div class="sculpture-select">
            <span class="sculpture-add icon-add"></span>
            <span class="sculpture-select-label">选择图片</span>
            <input type="file" class="sculpture-select-file"
                   accept="image/png, image/jpeg, image/gif, image/jpg"
                   @change="uploadImg($event)"
                   ref="sculptureUpdate">
          </div>
          <span class="sculpture-select-subtitle">只支持JPG、PNG、GIF,大小不超过6M</span>
        </div>
        <div class="sculpture-cropper-wrapper" v-show="isUpload">
          <vueCropper ref="cropper"
                      :img="img"
                      :outputSize="1"
                      outputType="png"
                      :info="true"
                      :canScale="true"
                      :autoCrop="true"
                      :fixed="true"
                      :fixedNumber="[1, 1]">
          </vueCropper>
        </div>
      </div>
      <div class="sculpture-preview">
        <h5 class="sculpture-preview-title">预览</h5>
        <div class="sculpture-preview-img">
          <img :src="yimg" alt="设置头像">
        </div>
        <h5 class="sculpture-preview-title">80px x 80px</h5>
        <div class="sculpture-preview-img" style="margin-top: 20px;">
          <img :src="yimg" alt="设置头像" style="width: 40px;height: 40px;">
        </div>
        <h5 class="sculpture-preview-title">40px x 40px</h5>
      </div>
    </div>
    <div class="sculpture-update-buttom" v-show="isUpload">
      <el-button size="mini" @click="sculptureReUpdate">重新上传</el-button>
    </div>
    <div class="sculpture-buttom">
      <el-button size="small" @click="upload">确认</el-button>
      <el-button size="small" @click="goBack">取消</el-button>
    </div>
  </div>
 </c-dialog>
</template>

<script type="text/ecmascript-6">
import { mapGetters, mapActions } from 'vuex'
import {Button, Message} from 'element-ui'
import vueCropper from 'vue-cropper'
import cDialog from 'base/c-dialog/c-dialog'
import { ERR_SUCCESS } from 'api/config'
import { uploadPersonPicture } from 'api/upload'

export default {
  data () {
    return {
      isUpload: false,
      img: '',
      yimg: ''
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  mounted () {
    this.$nextTick(() => {
      this.cropper = this.$refs.cropper
      let that = this
      let cropperBox = document.querySelector('.cropper-crop-box')
      this.img = this.user.portraitUrl
      this.yimg = this.user.portraitUrl
      cropperBox.addEventListener('mousemove', function (e) {
        if (that.isgetCropData) return
        setTimeout(() => {
          that.cropper.getCropData((data) => {
            that.yimg = data
          })
          that.isgetCropData = false
        }, 120)
        that.isgetCropData = true
      })
    })
  },
  methods: {
    sculptureReUpdate () {
      const file = this.$refs.sculptureUpdate
      if (file) {
        file.click()
      }
    },
    upload () {
      console.log(this.file)
      if (!this.file) {
        Message.error('请选择上传的头像！')
        return
      }
      const cropper = this.$refs.cropper
      cropper.getCropData((data) => {
        const arr = data.split(',')
        const mime = arr[0].match(/:(.*?);/)[1]
        const bstr = atob(arr[1])
        let n = bstr.length
        let u8arr = new Uint8Array(n)
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        const file = new File([u8arr], this.file.name, {type: mime})
        console.log(file)
        uploadPersonPicture(file).then(res => {
          if (res.code === ERR_SUCCESS) {
            this.setUserPicture(res.data.picUrl)
            Message({
              message: '修改头像成功！',
              type: 'success'
            })
            this.$router.replace({path: '/setting'})
          } else {
            Message.error(res.msg)
          }
        })
      })
    },
    uploadImg (e) {
      let file = e.target.files[0]
      e.target.value = ''
      if (!file) return
      const reg = /.(gif|png|jpg|jpeg|bmp)$/gi
      if (!reg.test(file.name)) {
        Message.error('请选择图片！')
        return
      }
      if (file.size >= 6100 * 1024) {
        Message.error('请选择图片不得超过 6M！')
        return false
      }
      let reader = new FileReader()
      reader.onload = (e) => {
        let data
        if (typeof e.target.result === 'object') {
          data = window.URL.createObjectURL(new Blob([e.target.result]))
        } else {
          data = e.target.result
        }
        this.img = data
        this.isUpload = true
        this.file = file
      }
      reader.readAsArrayBuffer(file)
    },
    goBack () {
      this.$router.go(-1)
    },
    ...mapActions(['setUserPicture'])
  },
  components: {
    [Button.name]: Button,
    vueCropper,
    cDialog
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/css/variable"
@import "~common/css/mixin"

.sculpture-wrapper
  width 570px
  padding 20px
  box-sizing border-box
  .sculpture-update
    width 100%
    font-size 0
    .sculpture-upload
      position relative
      margin-right 20px
      width 380px
      height 380px
      background-color #f2f2f5
      inline-block-top()
    .sculpture-preview
      padding 10px 0
      width 130px
      height 360px
      background-color #f2f2f5
      box-sizing content-box
      inline-block-top()
    .sculpture-cropper-wrapper
      position absolute
      top 0
      left 0
      width 100%
      height 100%
  .sculpture-select-wrapper
    position absolute
    top 50%
    left 50%
    margin-left -120px
    margin-top  -40px
    width 240px
    height 80px
    text-align center
    .sculpture-select
      position relative
      margin 0 auto
      padding 0 10px
      height 24px
      line-height 24px
      background-color $color-background
      box-shadow 0px 1px 2px rgba(0,0,0,0.1)
      border-radius 2px
      inline-block-top()
      .sculpture-select-label
        font-size $font-size-sm
        color #333
      .sculpture-add
        margin-right 7px
        width 12px
        height 24px
        line-height 24px
        font-size $font-size-sm
        color $color-theme
        text-align center
        inline-block-top()
      .sculpture-select-file
        position absolute
        top 0
        left 0
        width 100%
        height 100%
        cursor pointer
        opacity 0
    .sculpture-select-subtitle
      display block
      margin-top 20px
      width 100%
      height 30px
      line-height 30px
      text-align center
      font-weight 400
      font-size $font-size-sm
      color #808080
  .sculpture-preview-title
    height 35px
    line-height 35px
    font-size $font-size-sm
    color $color-text
    text-align center
  .sculpture-preview-img
    width 100%
    text-align center
    img
      width 80px
      height 80px
      overflow hidden
      border-radius 2px
      inline-block-top()
  .sculpture-update-buttom
    padding 10px 0
    width 380px
    button+button
      float right
  .sculpture-buttom
    width 100%
    height 45px
    line-height 45px
    text-align center
    button:first-child
      width 76px
      background-color $color-theme
      color #fff
    button+button
      width 76px
      margin-left 10px
</style>
