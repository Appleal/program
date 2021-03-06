let baseURL = ''

const PREFIX_URL_PROD = 'http://yibang.yijiankang.net:8080' // 正式环境

// const PREFIX_URL_DEV = 'http://172.16.128.164:6101' // 测试环境
const PREFIX_URL_DEV = 'http://120.79.144.107' // 阿里云测试环境

const PREFIX_URL_TEST = 'http://localhost:9090' // 本地环境

if (process.env.NODE_ENV === 'production') {
  baseURL = PREFIX_URL_PROD
} else {
  if (process.env.NODE_TYPE === 'test') {
    baseURL = PREFIX_URL_TEST
  } else {
    baseURL = PREFIX_URL_DEV
  }
}

module.exports = {
  proxy: {
    '/yjk-consult': {
      target: baseURL,
      changeOrigin: true, // 是否跨域
      pathRewrite: {
        '^/yjk-consult': '/yjk-consult'
      }
    }
  }
}
