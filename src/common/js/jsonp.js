
export function jsonp (url, data, callbackName) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    const callbackSymbol = `cb${Math.floor(Math.random() * 10000000000000000)}`
    if (callbackName) {
      url += `&${callbackName}=${callbackSymbol}`
    } else {
      url += `&callback=${callbackSymbol}`
    }
    window[callbackSymbol] = function (res) {
      document.querySelector('head').removeChild(script)
      delete window.callbackSymbol
      resolve(res)
    }
    script.setAttribute('src', url)
    document.querySelector('head').appendChild(script)
  })
}

export function param (data) {
  let url = ''
  for (var k in data) {
    let value = data[k] !== undefined ? data[k] : ''
    url += '&' + k + '=' + encodeURIComponent(value)
  }
  return url ? url.substring(1) : ''
}
