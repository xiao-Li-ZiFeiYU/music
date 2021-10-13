import Vue from 'vue'

import Vuex from 'vuex'

Vue.use(Vuex)

// 响应动作
const active = {}

// 修改数据
const mutations = {
  updateSwitchMusicId(state,val) {
    state.switchMusicId = val
  }
}

// 存储数据
const state = {
  switchMusicId: ''
}

export default new Vuex.Store({
  active,
  mutations,
  state
})
