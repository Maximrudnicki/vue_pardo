<template>
  <div class="constructor-container">
    <div class="header">
      <h2 class="word-title">Constructor</h2>
      <router-link class="exit-button" to="/training" v-if="!words"
        >Exit</router-link
      >
    </div>

    <div v-if="currentWord" class="game-container">
      <div class="word-display">
        <p class="word-definition">
          {{ currentWord.definition }}
          <span v-if="isAnswerSubmitted" class="word-answer"
            >- {{ currentWord.word }}</span
          >
        </p>

        <div class="display-word-container">
          <span
            v-for="letter in displayWord"
            :key="letter"
            class="display-letter"
            :class="{
              'before-check': !isAnswerSubmitted,
              correct: isAnswerSubmitted && isCorrect,
              incorrect: isAnswerSubmitted && !isCorrect,
            }"
          >
            {{ letter }}
          </span>
        </div>
      </div>

      <div class="letters-grid">
        <button
          v-for="(letter, index) in shuffledLetters"
          :key="index"
          @click="selectLetter(letter)"
          class="letter-button"
          :disabled="isAnswerSubmitted"
        >
          {{ letter }}
        </button>
      </div>

      <div class="action-buttons">
        <button
          v-if="!isAnswerSubmitted"
          @click="checkAnswer"
          class="action-button"
        >
          Check
        </button>
        <button v-else @click="nextWord" class="action-button">Next</button>
      </div>
    </div>

    <div v-else class="results-container">
      <p class="no-words">No more words</p>
      <div class="results">
        <h3 class="results-title">Result:</h3>
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
      selectedLetters: [],
      result: [],
      isAnswerSubmitted: false,
      isCorrect: null,
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
    shuffledLetters() {
      const letters = this.shuffleArray(this.currentWord.word.split(""));
      return letters.filter((letter, index) => {
        return letters.indexOf(letter, index + 1) === -1;
      });
    },
    displayWord() {
      return this.selectedLetters.join("");
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
    selectLetter(letter) {
      this.selectedLetters.push(letter);
    },
    checkAnswer() {
      this.isAnswerSubmitted = true;
      const userAnswer = this.selectedLetters.join("");
      if (userAnswer === this.currentWord.word) {
        const wordId = this.currentWord.id;
        this.result.push({ word_id: wordId, is_learned: true });
        this.isCorrect = true;
      } else {
        const wordId = this.currentWord.id;
        this.result.push({ word_id: wordId, is_learned: false });
        this.isCorrect = false;
      }
    },
    nextWord() {
      if (this.currentIndex < this.$store.state.words.length - 1) {
        this.currentIndex++;
        this.selectedLetters = [];
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
        let request = [];

        for (let i = 0; i < this.result.length; i++) {
          let updates = [
            {
              field: "constructor",
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

<style scoped>
.constructor-container {
  max-width: 600px;
  margin: 0 auto;
  margin-top: 80px;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.word-title {
  font-size: 1.8rem;
  color: var(--primary-color);
  margin: 0;
}

.exit-button {
  padding: 8px 16px;
  background-color: var(--primary-color);
  color: var(--background-color);
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.exit-button:hover {
  background-color: var(--accent-color);
}

.game-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
}

.word-display {
  text-align: center;
}

.word-definition {
  font-size: 1.25rem;
  margin-bottom: 20px;
  color: var(--text-color);
}

.word-answer {
  font-weight: bold;
}

.display-word-container {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-bottom: 20px;
}

.display-letter {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--primary-color);
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: bold;
}

.before-check {
  background-color: var(--background-color);
}

.correct {
  background-color: var(--success-color);
  color: var(--background-color);
  border-color: var(--success-color);
}

.incorrect {
  background-color: var(--error-text-color);
  color: var(--background-color);
  border-color: var(--error-text-color);
}

.letters-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  max-width: 400px;
}

.letter-button {
  width: 40px;
  height: 40px;
  border: none;
  background-color: var(--highlight-color);
  color: var(--text-color);
  border-radius: 8px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.letter-button:hover:not(:disabled) {
  background-color: var(--primary-color);
  color: var(--background-color);
}

.letter-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.action-button {
  padding: 10px 20px;
  font-size: 1rem;
  background-color: var(--primary-color);
  color: var(--background-color);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.action-button:hover {
  background-color: var(--accent-color);
}

.results-container {
  text-align: center;
}

.no-words {
  font-size: 1.2rem;
  margin-bottom: 20px;
  color: var(--text-color);
}

.results-title {
  font-size: 1.4rem;
  color: var(--primary-color);
  margin-bottom: 15px;
}

.results-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.results-list li {
  padding: 10px;
  background-color: var(--primary-color);
  color: var(--background-color);
  border-radius: 4px;
}
</style>
