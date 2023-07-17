import { createStore } from 'vuex'
import axios from "axios";

export default createStore({
  state: {
    words: [],
    isAuthenticated: false,
    token: '',
    isLoading: false
  },
  getters: {
    getWordById: (state) => (wordId) => {
      return state.words.find((word) => word.id === wordId);
    },
    learnedWords(state) {
      return state.words.filter((word) => word.learned);
    },
  },
  mutations: {
    initializeStore(state) {
      if (localStorage.getItem('token')) {
          state.token = localStorage.getItem('token')
          state.isAuthenticated = true
      } else {
          state.token = ''
          state.isAuthenticated = false
      } 
    },
    setIsLoading(state, status) {
      state.isLoading = status
    },
    setToken(state, token) {
      state.token = token
      state.isAuthenticated = true
    },  
    removeToken(state) {
        state.token = ''
        state.isAuthenticated = false
    },
    setWords(state, words) {
      state.words = words;
    },
  },
  actions: {
    async fetchWords({ commit }) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const response = await axios.get("/api/v1/vocab/", config);
        commit("setWords", response.data);
      } catch (error) {
        console.error(error);
      }
    },
  },
  modules: {
  }
})
