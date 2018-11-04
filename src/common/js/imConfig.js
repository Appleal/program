export const MESSAGE_TYPE = [
  'text',
  'ImageMessage',
  'app:orderMessage',
  'app:appointmentMessage',
  'app:effectFeedbackMessage',
  'app:talkTimeMessage'
]

export const getMessageType = function (type) {
  let obj = {}
  switch (type) {
    case MESSAGE_TYPE[0]:
      obj.messageName = 'text'
      obj.objectName = 'text'
      obj.type = 'text'
      break
    case MESSAGE_TYPE[1]:
      obj.messageName = 'image'
      obj.objectName = 'image'
      obj.type = 'image'
      break
    default:
      obj.messageName = MESSAGE_TYPE[type]
      obj.objectName = MESSAGE_TYPE[type]
  }
  return obj
}
