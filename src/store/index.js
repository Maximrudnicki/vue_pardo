import { createStore } from "vuex";
import axios from "axios";

export default createStore({
  state: {
    words: [],
    isAuthenticated: false,
    token: "",
    isLoading: false,
  },
  getters: {
    getWordById: (state) => (wordId) => {
      return state.words.find((word) => word.id === wordId);
    },
    unlearnedWords(state) {
      return state.words.filter((word) => word.is_learned === false);
    },
  },
  mutations: {
    initializeStore(state) {
      if (localStorage.getItem("token")) {
        state.token = localStorage.getItem("token");
        state.isAuthenticated = true;
      } else {
        state.token = "";
        state.isAuthenticated = false;
      }
    },
    setIsLoading(state, status) {
      state.isLoading = status;
    },
    setToken(state, token) {
      state.token = token;
      state.isAuthenticated = true;
    },
    removeToken(state) {
      state.token = "";
      state.isAuthenticated = false;
    },
    setWords(state, words) {
      state.words = words;
    },
    addWord(state, word) {
      state.words.push(word);
    },
    deleteWord(state, wordId) {
      state.words = state.words.filter((word) => word.id !== wordId);
    },
    updateWord(state, updatedWord) {
      const index = state.words.findIndex(word => word.id === updatedWord.id);
      if (index !== -1) {
        state.words.splice(index, 1, updatedWord);
      }
    },
    updateWordStatus(state, updatedWord) {
      const index = state.words.findIndex(word => word.id === updatedWord.id);
      if (index !== -1) {
        state.words.splice(index, 1, updatedWord);
      }
    },
  },
  actions: {
    async fetchWords({ commit }) {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const response = await axios.get("/api/v1/vocab/", config);
        response.data.data.sort((a, b) => {
          return b.created_at.seconds - a.created_at.seconds;
        });        
        commit("setWords", response.data.data);
      } catch (error) {
        console.error(error);
      }
    },
    async addWord({ commit }, formData) {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const response = await axios.post("/api/v1/vocab/", formData, config);
        const newWord = response.data;
        commit("addWord", newWord);
      } catch (error) {
        console.error(error);
      }
    },
    async deleteWord({ commit }, wordId) {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        await axios.delete(`/api/v1/vocab/${wordId}`, config);
        commit("deleteWord", wordId);
      } catch (error) {
        console.error(error);
      }
    },
    async updateWord({ commit }, formData) {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const response = await axios.patch(`/api/v1/vocab/${formData.id}`, formData, config);
        const updatedWord = response.data;
        commit("updateWord", updatedWord);
      } catch (error) {
        console.error(error);
      }
    },
    async updateWordStatus({ commit }, formData) {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        console.log(formData)
        const response = await axios.patch(`/api/v1/vocab/${formData.id}/status`, formData, config);
        const updatedWordStatus = response.data;
        commit("updateWordStatus", updatedWordStatus);
      } catch (error) {
        console.error(error);
      }
    },
  },
  modules: {},
});
