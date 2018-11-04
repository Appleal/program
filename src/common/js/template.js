import Vue from 'vue'
import chatText from 'base/chat-template/chat-text'
import chatImage from 'base/chat-template/chat-image'
import chatVoice from 'base/chat-template/chat-voice'
import chatVideo from 'base/chat-template/chat-video'
import chatTalk from 'base/chat-template/chat-talk'
import chatCall from 'base/chat-template/chat-call'
import chatOther from 'base/chat-template/chat-other'
import chatTips from 'base/chat-template/chat-tips'

const selectComponent = (data) => {
  const objectName = data.type
  switch (objectName) {
    case 'text':
      return chatText
    case 'tip':
      return chatTips
    case 'image':
      return chatImage
    case 'audio':
      return chatVoice
    case 'video':
      return chatVideo
    case 'app:talkTimeMessage':
      return chatTalk
    case 'app:callTimeMessage':
      return chatCall
    default:
      return chatOther
  }
}

export const append = (el, components) => {
  el.appendChild(components.$el)
}

export const unshift = (el, components) => {
  el.insertBefore(components.$el, el.childNodes[0])
}

export const createdComponents = (data) => {
  let ExtendComponent = selectComponent(data)
  const Template = Vue.extend(ExtendComponent)
  const component = new Template({})
  component.data = data
  component.$mount()
  return component
}
