<template>
  <div class="training-page">
    <header class="training-header">
      <router-link
        class="training-exit-button"
        to="/training"
        v-if="!this.words"
      >
        Exit
      </router-link>
    </header>

    <div v-if="currentWord" class="word-container">
      <h4 class="word-title">{{ currentWord.word }}</h4>
      <!-- <button @click="playSound(currentWord.word)" class="play-sound-button">📢</button> -->

      <ul class="answers-list">
        <li
          v-for="(translation, i) in shuffledTranslations"
          :key="i"
          @click="selectAnswer(i, translation, currentIndex)"
          :class="[
            'answer-item',
            { selected: selectedAnswer === i, disabled: isAnswerSubmitted },
            isAnswerSubmitted &&
            translation.definition === correctAnswer.definition
              ? 'correct'
              : '',
            isAnswerSubmitted &&
            translation.definition !== correctAnswer.definition &&
            selectedAnswer === i
              ? 'incorrect'
              : '',
          ]"
        >
          {{ translation.definition }}
        </li>
      </ul>
      <div class="action-buttons">
        <button
          @click="submitAnswer"
          v-if="!isAnswerSubmitted"
          class="action-button"
        >
          Submit
        </button>
        <button
          @click="nextWord"
          v-if="isAnswerSubmitted"
          class="action-button"
        >
          Next
        </button>
      </div>
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
      selectedAnswer: null,
      selectedTranslation: null,
      selectedAnswers: [],
      isAnswerSubmitted: false,
      correctAnswer: null,
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
    shuffledTranslations() {
      const allTranslations = this.$store.state.words.filter(
        (word) => word.id !== this.currentWord.id
      );
      const shuffledTranslations = this.shuffleArray(allTranslations).slice(
        0,
        4
      );
      const correctTranslationIndex = Math.floor(Math.random() * 4);
      shuffledTranslations.splice(correctTranslationIndex, 0, this.currentWord);
      this.correctAnswer = shuffledTranslations[correctTranslationIndex];
      return shuffledTranslations;
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
    selectAnswer(index, translation, currentIndex) {
      if (this.isAnswerSubmitted) {
        return;
      }
      if (this.selectedAnswers.length !== currentIndex) {
        this.selectedAnswers.pop();
      }
      this.selectedAnswers.push(this.shuffledTranslations[index].definition);
      this.selectedAnswer = index;
      this.selectedTranslation = translation.definition;
    },
    submitAnswer() {
      this.isAnswerSubmitted = true;

      if (this.selectedTranslation === this.correctAnswer.definition) {
        const wordId = this.currentWord.id;
        this.result.push({ word_id: wordId, is_learned: true });
      } else if (this.selectedTranslation !== this.correctAnswer.definition) {
        const wordId = this.currentWord.id;
        this.result.push({ word_id: wordId, is_learned: false });
      }
    },
    nextWord() {
      if (this.currentIndex < this.$store.state.words.length - 1) {
        this.currentIndex++;
        this.selectedAnswer = null;
        this.isAnswerSubmitted = false;
        this.correctAnswer = null;
        this.submitResult();
      } else {
        this.currentIndex = 0;
      }
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
      const synthesis = window.speechSynthesis;
      const voices = synthesis.getVoices();
      const britishVoice = voices.find((voice) => voice.lang === "en-GB");

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = britishVoice;

      synthesis.speak(utterance);
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
              field: "word_translation",
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
