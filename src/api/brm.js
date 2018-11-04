import { BASE_ENV } from 'api/config'
import { param } from 'common/js/jsonp'

export const brmOrderGoUrl = function (data) {
  let baseUrl = ''
  if (BASE_ENV === 'pro') {
    baseUrl = 'http://brm.yjk.com/Order/OpenOrderIndex.aspx'
  } else {
    baseUrl = 'http://172.16.100.81:81/Order/OpenOrderIndex.aspx'
  }
  baseUrl += (baseUrl.indexOf('?') < 0 ? '?' : '&') + param(data)
  window.open(baseUrl, '_blank')
}
