// import { nodeToString } from 'common/js/dom'
import { emojiList } from 'common/js/emoji'
// 初始化
export const init = function (appkey) {
  if (window.RongIMLib) {
    window.RongIMLib.RongIMClient.init(appkey)
  }
}

// 启动状态监听器
export const statusListener = function (appkey, token, config) {
  if (window.RongIMClient) {
    const RongIMLib = window.RongIMLib
    const RongIMClient = window.RongIMClient
    RongIMClient.setConnectionStatusListener({
      onChanged: function (status) {
        switch (status) {
          case RongIMLib.ConnectionStatus.CONNECTED:
            console.log('链接成功')
            config.success && config.success() // 连接成功
            break
          case RongIMLib.ConnectionStatus.CONNECTING:
            console.log('正在链接')
            break
          case RongIMLib.ConnectionStatus.DISCONNECTED:
            console.log('断开连接')
            config.refresh && config.refresh() // 重新启动
            break
          case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
            console.log('其他设备登录')
            config.otherCient && config.otherCient() // 其他设备登录
            break
          case RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:
            console.log('域名不正确')
            break
          case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
            console.log('网络不可用')
            config.unavailable && config.unavailable() // 网络不可用
            break
        }
      }
    })
  }
}

// 退出登录
export const disconnect = function () {
  if (window.RongIMClient) {
    const RongIMClient = window.RongIMClient
    RongIMClient.getInstance().logout()
  }
}

// 重新连接
export const reconnect = function (callback) {
  if (window.RongIMClient) {
    const RongIMClient = window.RongIMClient
    RongIMClient.reconnect(callback, {
      // 默认 false, true 启用自动重连，启用则为必选参数
      auto: true,
      // 重试频率 [100, 1000, 3000, 6000, 10000, 18000] 单位为毫秒，可选
      url: 'cdn.ronghub.com/RongIMLib-2.2.6.min.js',
      // 网络嗅探地址 [http(s)://]cdn.ronghub.com/RongIMLib-2.2.6.min.js 可选
      rate: [100, 1000, 3000, 6000, 10000]
    })
  }
}

// 启动消息监听器
export const messageListener = function (appKey, token, userid, config) {
  if (window.NIM) {
    const NIM = window.NIM
    NIM.getInstance({
      DB: false,
      autoMarkRead: true,
      appKey,
      account: `c${userid}`,
      token,
      onroamingmsgs: config.onMsg, // 收到漫游消息
      onofflinemsgs: config.onMsg, // 收到离线消息
      onmsg: config.onMsg, // 收到消息
      onsysmsg: config.onsysmsg, // tip 消息
      onsessions: function (e) {
        console.log(e)
      },
      onpushevents: config.onPushevents
    })
  }
}
// 启动音频消息监听器
export const messageAUidoListener = function (appKey, token, userid, config) {
  const Netcall = window.WebRTC
  // 是否正忙
  let beCalling = false
  // 呼叫类型
  let type = null
  // 被叫信息
  let beCalledInfo = null
  // 是否正忙
  let busy = false
  const nim = window.NIM.getInstance({
    debug: true || {
      api: 'info',
      style: 'font-size:14px;color:blue;background-color:rgba(0,0,0,0.1)'
    },
    appKey,
    account: `c${userid}`,
    token: token
  })
  const netcall = Netcall.getInstance({
    nim: nim,
    container: document.getElementById('container'),
    remoteContainer: document.getElementById('remoteContainer'),
    chromeId: '',
    // 是否开启日志打印
    debug: true
  })
  netcall.on('beCalling', function (obj) {
    const channelId = obj.channelId
    // 被叫回应主叫自己已经收到了通话请求
    netcall.control({
      channelId,
      command: Netcall.NETCALL_CONTROL_COMMAND_START_NOTIFY_RECEIVED
    })
    // 只有在没有通话并且没有被叫的时候才记录被叫信息, 否则通知对方忙并拒绝通话
    if (!netcall.calling && !beCalling) {
      type = obj.type
      beCalling = true
      beCalledInfo = obj
    } else {
      if (netcall.calling) {
        busy = netcall.notCurrentChannelId(obj)
      } else if (beCalling) {
        busy = beCalledInfo.channelId !== channelId
      }
      if (busy) {
        netcall.control({
          channelId,
          command: Netcall.NETCALL_CONTROL_COMMAND_BUSY
        })
        // 拒绝通话
        netcall.response({
          accepted: false,
          beCalledInfo: obj
        })
      }
    }
  })
  console.log(type)
  netcall.on('callAccepted', function (obj) {
    console.log('on callAccepted', obj)
    // 取消呼叫倒计时
    // 可以开启音视频连接操作。。。
  })
}

export const connect = function (appKey, token, userid) {
  const NIM = window.NIM
  return new Promise(function (resolve, reject) {
    NIM.getInstance({
      DB: false,
      appKey,
      account: `c${userid}`, // 当前用户
      token,
      onconnect: function (userId) {
        console.log('SDK 连接成功')
        resolve({userId})
      },
      onloginportschange: function (loginPorts) {
        console.log(loginPorts)
      },
      ondisconnect: function (obj) {
        console.log('SDK 连接断开', obj)
      },
      onerror: function (error) {
        console.log('SDK 连接失败', error)
      },
      onPushEvents: function (param) {
        console.log('订阅事件', param.msgEvents)
      }
    })
  })
}

// 更新消息为已读
export const removeRead = function (accounts) {
  const nimText = localStorage.getItem('tokenAndUser')
  const user = JSON.parse(nimText)
  var nim = window.NIM.getInstance({
    appKey: user.appkey,
    account: `c${user.userid}`,
    token: user.neteaseToken
  })
  nim.setCurrSession(accounts)
}

// 订阅用户登录状态事件
const subscribeMultiPortEvent = function (accounts) {
  const nimText = localStorage.getItem('tokenAndUser')
  const user = JSON.parse(nimText)
  var nim = window.NIM.getInstance({
    appKey: user.appkey,
    account: `c${user.userid}`,
    token: user.neteaseToken
  })
  nim.subscribeEvent({
    // type 1 为登录事件，用于同步多端登录状态
    type: 1,
    accounts: accounts,
    subscribeTime: 3600 * 24 * 30,
    // 同步订阅事件，保证每次登录时会收到推送消息
    sync: true,
    done: function onSubscribeEvent (err, res) {
      if (err) {
        console.error('订阅好友事件失败', err)
      } else {
        console.info('订阅好友事件', res)
      }
    }
  })
}

// 获取 会话列表
export const getConversationList = function (appKey, token, userid) {
  return new Promise(function (resolve, reject) {
    window.NIM.getInstance({
      appKey,
      account: `c${userid}`,
      token,
      onsessions: function (sessions) {
        for (var i = 0; i < sessions.length; i++) {
          if (sessions[i].scene === 'p2p') {
            var tmpUser = sessions[i].to
            // 如果会话列表不是好友，需要订阅关系
            subscribeMultiPortEvent([tmpUser])
          }
        }
        resolve(sessions)
      }
    }, null)
  })
}

export const getEmojiList = function () {
  let arr = []
  for (let key in emojiList) {
    let obj = {}
    obj['symbol'] = key
    obj['nodeString'] = '<span style="width: 32px; height: 32px; display: inline-block"><img style="height: 32px; width: 32px" src="' + emojiList[key].file + '"></span>'
    obj['url'] = emojiList[key].file
    arr.push(obj)
  }
  return arr
}

// 获取历史信息
export const getHistoryMessages = function (neteaseToken, appkey, userid, targetId) {
  return new Promise(function (resolve, reject) {
    var nim = window.NIM.getInstance({
      appKey: appkey,
      account: `c${userid}`,
      token: neteaseToken
    })
    nim.getHistoryMsgs({
      scene: 'p2p',
      to: targetId,
      done: function (error, list) {
        console.log(error)
        console.log(list)
        resolve({list})
      }
    })
  })
}

// 发送文本消息
export const sendTextMessage = function (targetId, token, appKey, account, { content, extra }, callBack) {
  var nim = window.NIM.getInstance({
    appKey,
    account,
    token
  })
  nim.sendText({
    scene: 'p2p',
    to: targetId,
    text: content,
    done: function (e, list) {
      callBack && callBack(e, 1, list)
    }
  })
}

// 发送提醒消息
export const sendTipMsg = function (targetId, callBack) {
  const nimText = localStorage.getItem('tokenAndUser')
  const user = JSON.parse(nimText)
  var nim = window.NIM.getInstance({
    appKey: user.appkey,
    account: `c${user.userid}`,
    token: user.neteaseToken
  })
  nim.sendTipMsg({
    isLocal: true,
    scene: 'p2p',
    to: targetId,
    tip: '你撤回了一条消息',
    done: function (e, list) {
      console.log(e)
      console.log(list)
      callBack && callBack(1, list)
    }
  })
}

// 更新已读/未读消息
export const readMessage = function (msg) {
  const nimText = localStorage.getItem('tokenAndUser')
  let message = ''
  const user = JSON.parse(nimText)
  var nim = window.NIM.getInstance({
    appKey: user.appkey,
    account: `c${user.userid}`,
    token: user.neteaseToken
  })
  message = nim.isMsgRemoteRead(msg)
  return message
}
// 更新我的资料
export const updateMyInfo = function (nick, avatar, callback) {
  const nimText = localStorage.getItem('tokenAndUser')
  const user = JSON.parse(nimText)
  var nim = window.NIM.getInstance({
    appKey: user.appkey,
    account: `c${user.userid}`,
    token: user.neteaseToken
  })
  nim.updateMyInfo({
    nick,
    avatar,
    custom: '{type: "newCustom", value: "new"}',
    done: function (error, user) {
      callback(error, user)
    }
  })
}

// 语音转文字
export const setaudioToText = function (url, callBack) {
  const nimText = localStorage.getItem('tokenAndUser')
  const user = JSON.parse(nimText)
  var nim = window.NIM.getInstance({
    appKey: user.appkey,
    account: `c${user.userid}`,
    token: user.neteaseToken
  })
  nim.audioToText({
    url: url,
    done: function (error, obj) {
      callBack(error, obj)
    }
  })
}

// 撤回消息
export const withdrawNim = function (url, callBack) {
  const nimText = localStorage.getItem('tokenAndUser')
  const user = JSON.parse(nimText)
  var nim = window.NIM.getInstance({
    appKey: user.appkey,
    account: `c${user.userid}`,
    token: user.neteaseToken
  })
  nim.deleteMsg({
    msg: url,
    done: function (error) {
      console.log('撤回消息' + (!error ? '成功' : '失败'), error)
      console.log(error)
      callBack(error)
    }
  })
}

// 已读消息文本发送
export const readReceiptMessage = function (targetId) {
  if (window.RongIMClient) {
    const RongIMClient = window.RongIMClient
    const RongIMLib = window.RongIMLib
    RongIMClient.getInstance().clearUnreadCount(RongIMLib.ConversationType.PRIVATE, targetId, {
      onSuccess: function (message) {
        console.log(`已读信息: ${targetId}`)
      },
      onError: function (errorCode, message) {
        console.log('发送失败' + errorCode)
      }
    })
  }
}

// 图片发送
export const sendImage = function (targetId, token, appKey, account, { base64Str, id, imageUri }, callBack) {
  var nim = window.NIM.getInstance({
    appKey,
    account,
    token
  })
  nim.sendFile({
    scene: 'p2p',
    to: targetId,
    type: 'image',
    blob: id,
    done: function (error, msg) {
      console.log(error)
      console.log(msg)
      callBack(error, msg)
    }
  })
}

// 电话记录自定义消息
let TalkTimeMessageInit = false
export const sendTalkTimeMessage = function (targetId, { content }, callBack) {
  if (window.RongIMClient) {
    const RongIMClient = window.RongIMClient
    const RongIMLib = window.RongIMLib
    if (!TalkTimeMessageInit) {
      const messageName = 'TalkTimeMessage' // 消息名称。
      const objectName = 'app:talkTimeMessage' // 消息内置名称，请按照此格式命名。
      const mesasgeTag = new RongIMLib.MessageTag(true, true)// 消息是否保存是否计数，true true 保存且计数，false false 不保存不计数。
      const prototypes = ['senderUserId', 'talkTime'] // 消息类中的属性名。
      RongIMClient.registerMessageType(messageName, objectName, mesasgeTag, prototypes)
      TalkTimeMessageInit = true
    }
    const msg = new RongIMClient.RegisterMessage.TalkTimeMessage(content)
    RongIMClient.getInstance().sendMessage(RongIMLib.ConversationType.PRIVATE, targetId, msg, {
      onSuccess: function (message) {
        callBack && callBack(1)
      },
      onError: function (errorCode, message) {
        callBack && callBack(0)
      }
    })
  }
}

// 语音电话记录自定义消息
let CallTimeMessageInit = false
export const sendCallTimeMessage = function (targetId, { content }, callBack) {
  if (window.RongIMClient) {
    const RongIMClient = window.RongIMClient
    const RongIMLib = window.RongIMLib
    if (!CallTimeMessageInit) {
      const messageName = 'CallTimeMessage' // 消息名称。
      const objectName = 'app:callTimeMessage' // 消息内置名称，请按照此格式命名。
      const mesasgeTag = new RongIMLib.MessageTag(true, true)// 消息是否保存是否计数，true true 保存且计数，false false 不保存不计数。
      const prototypes = ['senderUserId', 'talkTime'] // 消息类中的属性名。
      RongIMClient.registerMessageType(messageName, objectName, mesasgeTag, prototypes)
      TalkTimeMessageInit = true
    }
    const msg = new RongIMClient.RegisterMessage.CallTimeMessage(content)
    RongIMClient.getInstance().sendMessage(RongIMLib.ConversationType.PRIVATE, targetId, msg, {
      onSuccess: function (message) {
        callBack && callBack(1)
      },
      onError: function (errorCode, message) {
        callBack && callBack(0)
      }
    })
  }
}

// 启动语音监听器
let voiceObj = {}
export const voicePlay = function (audioFile, callBack) {
  if (!window.RongIMLib) return
  const RongIMLib = window.RongIMLib
  if (!voiceObj.init) {
    RongIMLib.RongIMVoice.init()
    voiceObj.init = true
  }
  if (voiceObj.lastAudio) {
    RongIMLib.RongIMVoice.stop(voiceObj.lastAudio)
    voiceObj.callBack && voiceObj.callBack()
  }
  const duration = audioFile.length / 1024
  RongIMLib.RongIMVoice.preLoaded(audioFile, function () {
    RongIMLib.RongIMVoice.play(audioFile, duration)
  })
  voiceObj.lastAudio = audioFile
  voiceObj.callBack = callBack
}
export const voiceStop = function (audioFile, callBack) {
  if (!window.RongIMLib) return
  const RongIMLib = window.RongIMLib
  RongIMLib.RongIMVoice.stop(voiceObj.lastAudio)
  voiceObj.lastAudio = null
}

export const callPlay = function (targetId) {
  if (window.RongIMLib) {
    const RongIMLib = window.RongIMLib
    const config = {
      // 发起音视频超时时间, 默认 15000 毫秒
      timeout: 15000,
      RongIMLib: RongIMLib
    }
    let RongCallLib = window.RongCallLib.init(config)
    let CallType = RongIMLib.VoIPMediaType
    let params = {
      conversationType: RongIMLib.ConversationType.PRIVATE,
      targetId: targetId,
      inviteUserIds: targetId.split(),
      mediaType: CallType.MEDIA_AUDIO
    }
    RongCallLib.call(params)
  }
}

export const callListener = function (configMessage) {
  if (window.RongIMLib) {
    if (window.RongIMLib) {
      const RongIMLib = window.RongIMLib
      const config = {
        // 发起音视频超时时间, 默认 15000 毫秒
        timeout: 15000,
        RongIMLib: RongIMLib
      }
      const RongCallLib = window.RongCallLib.init(config)
      const watcher = function (result) {
        // result => {type: 'added', data: ''}
        console.log(result)
      }
      RongCallLib.videoWatch(watcher)
      RongCallLib.commandWatch(function (message) {
        switch (message.messageType) {
          case 'InviteMessage':
            configMessage.InviteMessage && configMessage.InviteMessage(message) // 电话呼入
            break
          case 'HungupMessage': // 电话呼入取消
            configMessage.HungupMessage && configMessage.HungupMessage(message) // 取消通话
            break
          case 'AcceptMessage': // 电话呼出接通
            configMessage.AcceptMessage && configMessage.AcceptMessage(message) // 电话呼出接通
            break
          case 'SummaryMessage': // 对方结束通话
            configMessage.SummaryMessage && configMessage.SummaryMessage(message) // 对方结束通话
            break
          default:
            configMessage.otherMessage && configMessage.otherMessage(message)
        }
        // command => 消息指令;
      })
    }
  }
}
