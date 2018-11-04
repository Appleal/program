import * as types from './mutation-types'
import { setToken, clearStorage, clearToken } from 'common/js/storage'
import { disconnect, reconnect } from 'common/js/im'
import { quicksort } from 'common/js/util'

export const setUser = function ({commit}, user) {
  setToken(user.token)
  commit(types.SET_USER, user)
  commit(types.SET_LOGIN, true)
}

export const setUserPicture = function ({commit, state}, url) {
  state.user.portraitUrl = url
  commit(types.SET_USER, state.user)
}

export const appStart = function ({ commit }) {
  commit(types.SET_LOGIN, true)
}

export const setConversationList = function ({commit}, conversationList) {
  // commit(types.SET_IM, true)
  commit(types.SET_CONVERSATION_LIST, conversationList)
}

export const setConversationListItem = function ({ commit, state }, payload) {
  let conversationList = state.conversationList.slice()
  for (let i = 0; i < conversationList.length; i++) {
    if (conversationList[i].id === payload.state.id) {
      conversationList.splice(i, 1, payload.state)
      break
    }
  }
  conversationList = quicksort(conversationList.slice(), 'lastTime')
  commit(types.SET_CONVERSATION_LIST, conversationList)
}

export const addConversationListItem = function ({commit, state}, payload) {
  let conversationList = state.conversationList.slice()
  conversationList.push(payload.state)
  conversationList = quicksort(conversationList.slice(), 'lastTime')
  commit(types.SET_CONVERSATION_LIST, conversationList)
}

export const setCall = function ({commit, state}, call) {
  commit(types.SET_CALL, call)
}
export const setTelephone = function ({commit, state}, telephone) {
  commit(types.SET_TELEPHONE, telephone)
}
export const userOut = function ({commit, state}) {
  if (state.isConnect) {
    // disconnect()
  }
  clearStorage()
  clearToken()
  commit(types.SET_IM, false)
  commit(types.SET_LOGIN, false)
  commit(types.SET_CONVERSATION_LIST, [])
  commit(types.SET_APPOINTMENTNUM, 0)
  commit(types.SET_CONNECT_TYPE, 0)
}

export const refresh = function ({ commit, state }) {
  commit(types.SET_CONNECT_TYPE, 1)
  reconnect({
    onSuccess: function (userId) {
      commit(types.SET_CONNECT_TYPE, 2)
      console.log('Reconnect successfully.' + userId)
    },
    onTokenIncorrect: function () {
      if (state.isConnect) {
        disconnect()
      }
      clearStorage()
      clearToken()
      commit(types.SET_IM, false)
      commit(types.SET_LOGIN, false)
      commit(types.SET_CONVERSATION_LIST, [])
      commit(types.SET_APPOINTMENTNUM, 0)
      commit(types.SET_CONNECT_TYPE, 0)
      // 融云A用户登录，获取A的会话列表之后，退出登录之后，B用户登录，获取B的会话列表，
      // A的会话列表和B的会话列表一样, 所以改为reload，不是跳login路由，尴尬
      window.location.reload()
    },
    onError: function (errorCode) {
      console.log(errorCode)
    }
  })
}

export const imConnectSuccess = function ({ commit }) {
  commit(types.SET_IM, true)
  commit(types.SET_CONNECT_TYPE, 2)
}
export const imConnectBreak = function ({ commit }) {
  commit(types.SET_CONNECT_TYPE, 0)
}
export const imConnecting = function ({ commit }) {
  commit(types.SET_CONNECT_TYPE, 1)
}
