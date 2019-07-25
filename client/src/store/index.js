import Vue from 'vue'
import Vuex from 'vuex'

import { getStore, setStore, removeStore } from '@/utils/localStorage'

import baseInfo from './modules/mineBaseInfo'
import standardSample from './modules/standardSample'

let state = {
  user: getStore('currentUser'),
  token: getStore('token'),
  systemName: '',
  noticeInfo: {
    type: '',
    message: '',
    time: Date.now()
  }
}
let mutations = {
  showErrorMsg(state, msg) {
    state.noticeInfo.type = 'error'
    state.noticeInfo.message = msg
    state.noticeInfo.time = Date.now()
  },
  showSuccessMsg(state, msg) {
    state.noticeInfo.type = 'success'
    state.noticeInfo.message = msg
    state.noticeInfo.time = Date.now()
  },
  showNormalMsg(state, msg) {
    state.noticeInfo.type = 'info'
    state.noticeInfo.message = msg
    state.noticeInfo.time = Date.now()
  },
  setSysConfig (state, config) {
    state.systemName = config.sysName || '矿井水源识别系统'
  },
  setUserInfo(state, {user, password = '', isRemember = false}) {
    let newInfo = {
      ...state.user,
      ...user.info
    }
    if (password && password.length) {
      newInfo.password = password
    } else {
      newInfo.password = state.user.password
    }
    setStore('currentUser', newInfo, isRemember ? 24 * 10 : 1)
    // 存储token, 10天
    setStore('token', user.token, isRemember ? 24 * 10 : 1)

    state.user = newInfo || null
    state.token = user.token || ''
  },
  logout(state) {
    state.user = null
    state.token = ''

    removeStore('currentUser')
    removeStore('token')
  }
}
let actions = {}

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  mutations,
  actions,
  modules: {
    baseInfo,
    standardSample
  },
  strict: process.env.NODE_ENV !== 'production'
})
