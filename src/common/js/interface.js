export const msgListInterface = function (msg) {
  return {
    id: msg.target, // id
    name: msg.name || msg.target, // 名称
    lastTime: msg.time, // 时间
    content: msg.text, // 消息
    file: msg.file,
    objectName: msg.type, // 消息类型
    num: msg.unreadMessageCount || 0 // 未读信息
  }
}

export const msgItemInterface = function (msg) {
  return {
    id: msg.targetId, // id
    senderUserId: msg.senderUserId, // 发送人Id
    name: msg.name || msg.targetId, // 名称
    lastTime: msg.sentTime, // 时间
    content: msg.content, // 消息
    objectName: msg.objectName, // 消息类型
    upload: msg.upload ? msg.upload : false,
    progress: msg.progress ? msg.progress : '0'
  }
}
