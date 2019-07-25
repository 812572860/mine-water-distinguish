import SampleWater from '@/models/SampleWater'
import { getAllStandardSampleList } from '@/api/sample'
const state = {
  list: []
}

const mutations = {
  setList (state, data) {
    state.list = data || []
  },
  insertSample (state, info) {
    const sample = new SampleWater(info)
    state.list = state.list.concat([sample])
  },
  updateSample (state, info) {
    const index = state.list.findIndex(item => item.id === info.id)
    if(index > -1) {
      const sample = new SampleWater(info)
      state.list.splice(index, 1, sample)
    }
  },
  removeSample (state, info) {
    const index = state.list.findIndex(item => item.id === info.id)
    if (index > -1) {
      state.list.splice(index, 1)
    }
  }
}

const actions = {
  getAllSampleList ({commit}) {
    getAllStandardSampleList().then(res => {
      commit(
        'setList',
        res.result &&
          res.result.items &&
          res.result.items.map(item => new SampleWater(item))
      )
      // commit(
      //   'setList',
      //   res.result &&
      //   res.result.items &&
      //   [res.result.items[0]]
      // )
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}