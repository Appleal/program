<template>
  <div>
    <div id="editor"></div>
  </div>
</template>

<script type="text/ecmascript-6">
import E from 'wangeditor'

const COMPONENT_NAME = 'WangEditor'

export default {
  name: COMPONENT_NAME,
  mounted () {
    this.$nextTick(() => {
      const that = this
      const editor = new E('#editor')
      editor.customConfig.menus = [
        'head', // 标题
        'bold', // 粗体
        'fontSize', // 字号
        'fontName', // 字体
        'italic', // 斜体
        'foreColor', // 文字颜色
        'backColor', // 背景颜色
        'justify' // 对齐方式
      ]
      editor.customConfig.onchange = function (html) {
        // html 即变化之后的内容
        that.subimit(html)
      }
      editor.create()
      this.editor = editor
    })
  },
  methods: {
    getEditor () {
      return this.editor
    },
    subimit (html) {
      this.$emit('showCityName', html)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/css/variable"
@import "~common/css/mixin"

#editor
  position relative
  z-index 100
  div
    display none
.w-e-text-container
  height 200px !important

</style>
