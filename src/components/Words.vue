<template>
  <div class="words-page">
    <!-- Header -->
    <header class="header">
      <h1>MY DICTIONARY</h1>
    </header>

    <WordForm v-if="showForm" />

    <main class="content">
      <div class="word-actions">
        <button @click="toggleForm" class="add-word-button">{{ showForm ? '×' : '+' }}</button>
      </div>

      <div class="words-list">
        <ul>
          <li v-for="word in words" :key="word.id" class="word-card">
            <div class="word-content">
              <strong>{{ word.word }}</strong> <span>{{ word.definition }}</span>
            </div>

            <div class="word-actions">
              <button @click="showDetails(word.id)" class="action-button">View</button>
              <button @click="confirmDeleteWord(word.id)" class="action-button">Delete</button>
            </div>

            <WordDetails :word="word" :show="showWordDetails" @cancel="cancelWordDetails" />
            <DeleteWord :show="selectedWordId" :wordId="selectedWordId" @delete="deleteWord" @cancel="cancelDeleteWord" />
          </li>
        </ul>
      </div>
    </main>
  </div>
</template>

<script>
import WordForm from "./WordForm.vue";
import WordDetails from "./modals/WordDetails.vue";
import DeleteWord from "./modals/DeleteWord.vue";

export default {
  components: {
    WordForm,
    WordDetails,
    DeleteWord,
  },
  data() {
    return {
      showForm: false,
      showWordDetails: null,
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
    toggleForm() {
      this.showForm = !this.showForm;
    },
    showDetails(wordId) {
      this.showWordDetails = wordId;
    },
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
    cancelWordDetails() {
      this.showWordDetails = null;
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
