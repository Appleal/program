import axios from 'axios'

// 获取消息发送的模板
export function getTemplate () {
  const url = '/yjk-consult/msgtemp/list'
  return axios.post(url, {}).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 发送消息
export function sendMsg ({userId, content, sendTime, msgTitle}) {
  const url = '/yjk-consult/batSendMsg/sendMsg'
  return axios.post(url, {userId, content, sendTime, msgTitle}).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 推送任务
export function pushAppUserTask ({ids, taskName, taskDescription, taskContent, taskType, articleId}) {
  const url = '/yjk-consult/appUserTask/pushAppUserTask'
  return axios.post(url, {ids, taskName, taskDescription, taskContent, taskType, articleId}).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 查询铃铛消息接口
export function getConsultantNoticeList (notice) {
  const url = '/yjk-consult/consultantNotice/getConsultantNoticeList'
  return axios.post(url, notice).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 查询铃铛消息明细接口
export function getConsultantNoticeInfo ({id}) {
  const url = '/yjk-consult/consultantNotice/getConsultantNoticeInfo'
  return axios.post(url, {id}).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 已读铃铛消息接口
export function updateConsultantNoticeInfo (notice) {
  const url = '/yjk-consult/consultantNotice/updateConsultantNoticeInfo'
  return axios.post(url, notice).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 转换
export function uploadContent (title, Description, html) {
  return `
  <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1.0">
        <title>${title}</title>
        <style>
          h3,p{
          margin: 0;
          }
          p{
            line-height: 20px;
          }
          img{
          width: auto;
          height: auto;
          max-width: 100%;
          max-height: 100%;
          }
          .article{ margin: 0 auto; font-size: 14px; padding: 0 12px; max-width: 640px; }
        </style>
      </head>
      <body class="article" style="max-width: 100%; width: calc(100% - 24px)">
        ${html}
      </body>
    </html>
  `
}

// 选择文章类别
export function getArticleType (userid) {
  const url = '/yjk-consult/appUserTask/getArticleType'
  return axios.get(url, {}).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 选择文章
export function getArticle ({typeId}) {
  const url = '/yjk-consult/appUserTask/getArticle'
  return axios.get(url, {
    params: {
      typeId
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
