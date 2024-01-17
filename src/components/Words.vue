<template>
  <div>
    <h2>Words</h2>
    <button @click="showForm = true">Add Word</button>
    <WordForm v-if="showForm" />
    <div v-if="selectedWordId">
      <p>Are you sure you want to delete this word?</p>
      <button @click="deleteWord">OK</button>
      <button @click="cancelDeleteWord">Cancel</button>
    </div>
    <ul>
      <li v-for="word in words" :key="word.id">
        <!-- <button @click="playSound(word.word)">📢</button> -->
        <strong>{{ word.word }}</strong
        >: {{ word.definition }}
        <router-link :to="'/words/' + word.id">View</router-link>
        <button @click="confirmDeleteWord(word.id)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script>
import WordForm from "./WordForm.vue";

export default {
  components: {
    WordForm,
  },
  data() {
    return {
      showForm: false,
      selectedWordId: null,
      voicesLoaded: false,
    };
  },
  computed: {
    words() {
      return this.$store.state.words;
    },
  },
  mounted() {
    this.$store.dispatch("fetchWords");
    this.loadVoices();  
  },
  methods: {
    confirmDeleteWord(wordId) {
      this.selectedWordId = wordId;
    },
    deleteWord() {
      this.$store.dispatch("deleteWord", this.selectedWordId);
      this.selectedWordId = null;
    },
    cancelDeleteWord() {
      this.selectedWordId = null;
    },
    async loadVoices() {
      return new Promise((resolve) => {
        window.speechSynthesis.onvoiceschanged = () => {
          this.voicesLoaded = true;
          resolve();
        };
      });
    },
    async playSound(text) {
      if (!this.voicesLoaded) {
        await this.loadVoices();
      }

      const synthesis = window.speechSynthesis;
      const voices = synthesis.getVoices();
      const britishVoice = voices.find((voice) => voice.lang === "en-GB");

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = britishVoice;

      synthesis.speak(utterance);
    },
  },
};
</script>

<style scoped>
button {
  padding: 5px 10px;
  background-color: none;
  color: teal;
  border: 1px solid teal;
}
</style>
