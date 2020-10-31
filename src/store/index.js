import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    app: undefined,
    sceneName: undefined,
    currentLoadedScene: undefined,
  },
  mutations: {
    setApp(state, data) {
      state.app = data;
    },
    setSceneName(state, data) {
      state.sceneName = data;
    },
    setCurrentLoadedScene(state, data) {
      state.currentLoadedScene = data;
    }
  },
  actions: {
  },
  modules: {
  }
})
