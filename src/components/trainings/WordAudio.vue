<template>
  <div class="training-page">
    <header class="training-header">
      <router-link
        class="training-exit-button"
        to="/training"
        v-if="!this.words"
        >Exit</router-link
      >
    </header>

    <div v-if="currentWord" class="word-container">
      <div class="vertical-layout">
        <button
          @click="playSound"
          class="action-button"
          style="margin-bottom: 10px"
        >
          📢
        </button>
        <span
          v-if="isAnswerSubmitted"
          class="answer-display"
          style="margin-bottom: 10px"
          >{{ currentWord.word }}</span
        >
      </div>

      <input
        type="text"
        v-model="userAnswer"
        placeholder="Enter the word"
        class="input"
        :class="{
          'is-sunken': !isAnswerSubmitted,
          'is-correct': isCorrect === true,
          'is-incorrect': isCorrect === false,
          'top-space': !isAnswerSubmitted === true,
        }"
      />
      <br />

      <!-- Кнопки для проверки ответа и перехода к следующему слову -->
      <button
        @click="checkAnswer"
        v-if="!isAnswerSubmitted"
        class="action-button"
      >
        Submit
      </button>
      <button @click="nextWord" v-if="isAnswerSubmitted" class="action-button">
        Next
      </button>
    </div>
    <div v-else class="results-container">
      <div>
        <h3>Result:</h3>
        <ul class="results-list">
          <li v-for="(answer, index) in result" :key="index">
            {{ answer }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  props: {
    words: {
      type: Array,
      required: false,
    },
  },
  data() {
    return {
      currentIndex: 0,
      isAnswerSubmitted: false,
      userAnswer: "",
      isCorrect: null,
      result: [],
    };
  },
  mounted() {
    if (!this.words) {
      this.$store.dispatch("fetchWords");
    }
  },
  computed: {
    currentWord() {
      return this.randomWords[this.currentIndex];
    },
    randomWords() {
      let shuffleWords;
      if (this.words) {
        shuffleWords = this.shuffleArray(this.words);
      } else {
        shuffleWords = this.shuffleArray(this.$store.state.words);
      }
      const shuffledWords = shuffleWords;
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
    checkAnswer() {
      this.isAnswerSubmitted = true;
      this.playSound();

      if (
        this.userAnswer.toLowerCase() === this.currentWord.word.toLowerCase()
      ) {
        const wordId = this.currentWord.id;
        this.result.push({ word_id: wordId, is_learned: true });
        this.isCorrect = true;
      } else {
        const wordId = this.currentWord.id;
        this.result.push({ word_id: wordId, is_learned: false });
        this.isCorrect = false;
      }
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
        this.userAnswer = "";
        this.isCorrect = null;
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
        let request = [];

        for (let i = 0; i < this.result.length; i++) {
          let updates = [
            {
              field: "word_audio",
              value: true,
            },
          ];

          let requestItem = {
            id: this.result[i].word_id,
            updates: updates,
          };

          request.push(requestItem);
        }
        axios.patch(`/api/v1/vocab`, request, config);
        // this.$emit("trainingCompleted");
      }
    },
  },
};
</script>
