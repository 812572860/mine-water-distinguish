import axios from '@/utils/axios'
// import { getAllBaseInfoList, saveBaseInfo, deleteBaseInfo } from '@/api'

const types = {
  mine: {
    type: 'mine',
    state: 'mineList'
  },
  aquifer: {
    type: 'aquifer',
    state: 'aquiferList'
  },
  mineLayer: {
    type: 'mineLayer',
    state: 'mineLayer'
  },
  mineLevel: {
    type: 'mineLevel',
    state: 'mineLevel'
  },
  sampleCharacter: {
    type: 'sampleCharacter',
    state: 'sampleCharacter'
  },
  sampleSource: {
    type: 'sampleSource'
  }
}

const state = {
  baseConfigList: []
}

const getters = {
  // 矿井名称
  mineList: state => {
    return (
      state.baseConfigList.filter(item => item.type === types.mine.type) || []
    )
  },
  // 含水层（充水层）
  aquiferList: state => {
    return (
      state.baseConfigList.filter(item => item.type === types.aquifer.type) ||
      []
    )
  },
  // 开采煤层
  mineLayerList: state => {
    return (
      state.baseConfigList.filter(item => item.type === types.mineLayer.type) ||
      []
    )
  },
  // 开采水平
  mineLevelList: state => {
    return (
      state.baseConfigList.filter(item => item.type === types.mineLevel.type) ||
      []
    )
  },
  // 水样点性状
  sampleCharacterList: state => {
    return (
      state.baseConfigList.filter(
        item => item.type === types.sampleCharacter.type
      ) || []
    )
  },
  // 充水水源
  sampleSourceList: state => {
    return (
      state.baseConfigList.filter(
        item => item.type === types.sampleSource.type
      ) || []
    )
  }
}

const mutations = {
  setList(state, data) {
    state.baseConfigList = data || []
  },
  insertInfo(state, info) {
    state.baseConfigList = state.baseConfigList.concat([info])
  },
  updateInfo(state, info) {
    let index = state.baseConfigList.findIndex(item => item.id === info.id)
    if (index > -1) {
      state.baseConfigList.splice(index, 1, info)
    }
  },
  removeInfo(state, info) {
    let index = state.baseConfigList.findIndex(item => item.id === info.id)
    if (index > -1) {
      state.baseConfigList.splice(index, 1)
    }
  }
}

const actions = {
  getList({ commit }) {
    axios.get('/data/base.json')
      .then(res => {
        commit('setList', res || [])
      })
      .catch(err => {
        commit('showErrorMsg', err.message || '获取煤矿基础配置信息失败！', {
          root: true
        })
      })
  },
  // saveConfig({ commit }, data) {
  //   if (data && data.name) {
  //     let info = { ...data }
  //     if (info.id < 0) delete info.id
  //     saveBaseInfo(info)
  //       .then(res => {
  //         if (data.id < 0) {
  //           commit('insertInfo', res.data)
  //         } else {
  //           commit('updateInfo', res.data)
  //         }
  //         commit('showSuccessMsg', '煤矿基础配置信息保存成功！', {
  //           root: true
  //         })
  //       })
  //       .catch(err => {
  //         commit(
  //           'showErrorMsg',
  //           err.message || '煤矿基础配置信息保存失败！',
  //           {
  //             root: true
  //           }
  //         )
  //       })
  //   }
  // },
  // deleteConfig({ commit }, info) {
  //   if (info && info.id) {
  //     deleteBaseInfo(info)
  //       .then(res => {
  //         commit('removeInfo', res.data)
  //         commit('showSuccessMsg', '煤矿基础配置信息删除成功！', {
  //           root: true
  //         })
  //       })
  //       .catch(err => {
  //         commit(
  //           'showErrorMsg',
  //           err.message || '煤矿基础配置信息保存失败！',
  //           {
  //             root: true
  //           }
  //         )
  //       })
  //   }
  // }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
