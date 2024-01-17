<template>
  <div>
    <h2>Cards</h2>
    <router-link to="/training" @click="submitResult">Exit</router-link>

    <div v-if="currentWord">
      <p>
        <strong>{{ currentWord.word }} </strong> -
        <span v-if="isAnswerSubmitted">{{ currentWord.definition }}</span>
      </p>
      <button @click="checkWord" v-if="!isAnswerSubmitted">Check</button>
      <button @click="nextWord" v-if="isAnswerSubmitted">Next</button>
    </div>
    <div v-else>
      <p>No more words</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      currentIndex: 0,
      isAnswerSubmitted: false,
      result: [],
    };
  },
  mounted() {
    this.$store.dispatch("fetchWords");
  },
  computed: {
    currentWord() {
      return this.randomWords[this.currentIndex];
    },
    randomWords() {
      const shuffledWords = this.shuffleArray(this.$store.state.words);
      return shuffledWords.slice(0, 5);
    },
  },
  methods: {
    shuffleArray(array) {
      const shuffledArray = array.slice();
      for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [
          shuffledArray[j],
          shuffledArray[i],
        ];
      }
      return shuffledArray;
    },
    checkWord() {
      this.isAnswerSubmitted = true;
      const wordId = this.currentWord.id;
      this.result.push({ word_id: wordId, is_learned: true });
      this.playSound();
    },
    playSound() {
      const synthesis = window.speechSynthesis;
      const voices = synthesis.getVoices();
      const britishVoice = voices.find((voice) => voice.lang === "en-GB");

      const utterance = new SpeechSynthesisUtterance(this.currentWord.word);
      utterance.voice = britishVoice;

      synthesis.speak(utterance);
    },
    nextWord() {
      if (this.currentIndex < this.$store.state.words.length - 1) {
        this.currentIndex++;
        this.isAnswerSubmitted = false;
        this.submitResult();
      } else {
        this.currentIndex = 0;
      }
    },
    submitResult() {
      if (this.result.length === 5) {
        const token = localStorage.getItem("token");
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        for (let i = 0; i < this.result.length; i++) {
          const formData = {
            result: this.result[i].is_learned,
            training: "cards",
          };
          axios.patch(
            `/api/v1/vocab/${this.result[i].word_id}/trainings`,
            formData,
            config
          );
        }
      }
    },
  },
};
</script>

<style scoped></style>
