import {jsonp, param} from 'common/js/jsonp'
import { callArr } from 'common/js/datacall' // 取出来是数组一项
import { getMobileArea } from 'api/user' // 取出来是数组一项

/* eslint-disable */
// 呼叫系统的判断电话是否加0，有点坑！！！
const GetZeroByPhone = function (phone) {
  try {
    var partten = /^0(([1-9]\d)|([3-9]\d{2}))\d{8}$/; //没有中间那段 -的 座机格式是 01098909899   
    if (partten.test(phone) || phone.toString().length < 11 || phone.toString().length > 11) {
        //座机
        return "";
    }
    var value = phone.substring(0, 7);
    var startIndex = 0,
        endIndex = callArr.length - 1;
    var middle = Math.floor((endIndex - startIndex) / 2);
    var loop = 0; //中断因子，若15次还未有结果，则跳出循环，防止死循环
    while (callArr[middle] != value && startIndex < endIndex && (++loop) < 15) {
        if (callArr[middle] > value) {
            endIndex = middle - 1;

        } else if (callArr[middle] < value) {
            startIndex = middle + 1;
        }
        middle = startIndex + Math.floor((endIndex - startIndex) / 2);
    }
    return (callArr[middle] == value) ? "" : "0";
  }
  catch (err) {
    return ''
  }
}

// 电话呼出
export const telephoneCall = function ({ serverIp, extension, callerid, extensionDst }) {
  const TARGET_IP = `http://${serverIp}/admin/`
  return new Promise((resolve, reject) => {
    getMobileArea({ mobile: extensionDst }).then(res => {
      if (res.data.city !== "广州") {
        extensionDst = '0' + extensionDst
      }
      const data = {
        m: 'interface',
        c: 'api',
        a: 'dial',
        variable: 'TRUNKCIDOVERRIDE=' + callerid, // 呼出的号码
        extension, // 主叫号码，必须为分机号码，必填。
        extensionDst:  extensionDst // 被叫号码，可以为分机号码或外线号码，必填。
      }
      jsonp(TARGET_IP, data).then(jres => {
        resolve(jres)
      })
    })
  })
}

// 电话弹屏
export const telephonePush = function (extension,serverIp, callback) {
  const TARGET_IP = `http://${serverIp}/interface/api/?`
  const data = {
    action: 'popscreen',
    extension,
    pop_type: 'RING',
    pop_out: 'DialIn',
    open_type: '2'
  }
  const callbackSymbol = '__jc_phoneBacl_'
  const url = TARGET_IP + param(data) + '&mixcallback=' + callbackSymbol
  const script = document.createElement('script')
  window[callbackSymbol] = function (str) {
    callback && callback(str)
  }
  script.setAttribute('src', url)
  document.querySelector('head').appendChild(script)
}

// 获取分机状态
export const getTelephoneStatus = function ({serverIp, extension}) {
  const TARGET_IP = `http://${serverIp}/admin/`
  const data = {
    m: 'interface',
    c: 'api',
    a: 'extenstatus',
    extension
  }
  return jsonp(TARGET_IP, data)
}

// 电话挂断
export const deleteTelephone = function ({serverIp, extension}) {
  const TARGET_IP = `http://${serverIp}/admin/`
  const data = {
    m: 'interface',
    c: 'api',
    a: 'hangup',
    extension
  }
  return jsonp(TARGET_IP, data)
}

// 启用/禁用呼叫等待 http://172.16.90.214/admin/?m=interface&c=api&a=getdnd&extension=6203&status=1
