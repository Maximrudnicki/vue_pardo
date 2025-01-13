<template>
  <div class="flashcard-container">
    <router-link 
      to="/training" 
      class="exit-button"
      v-if="!words"
    >
      Exit
    </router-link>

    <div v-if="currentWord" class="card-content">
      <h3 class="word-title">{{ currentWord.word }}</h3>
      
      <div class="translation-space">
        <div class="translation" v-if="isAnswerSubmitted">
          {{ currentWord.definition }}
        </div>
      </div>

      <button 
        v-if="!isAnswerSubmitted"
        @click="checkWord" 
        class="action-button"
      >
        Submit
      </button>
      <button 
        v-else
        @click="nextWord" 
        class="action-button"
      >
        Next
      </button>
    </div>

    <div v-else class="completion-message">
      <p>All words completed! 🎉</p>
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
        let request = [];

        for (let i = 0; i < this.result.length; i++) {
          let updates = [
            {
              field: "cards",
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
.flashcard-container {
  width: 100%;
  max-width: 600px;
  margin: 80px auto 0;
  padding: 0 1rem;
  font-family: var(--font-family);
}

.exit-button {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;
}

.exit-button:hover {
  background-color: var(--accent-color);
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
}

.word-title {
  color: var(--primary-color);
  font-size: 1.8rem;
  text-align: center;
  margin-bottom: 1.5rem;
  font-weight: 400;
}

.translation-space {
  height: 60px; /* Фиксированная высота для перевода */
  display: flex;
  justify-content: center;
  align-items: center;
}

.translation {
  color: var(--text-color);
  font-size: 1.5rem;
  text-align: center;
  margin: 1.5rem 0;
  animation: fadeIn 0.3s ease-out;
}

.action-button {
  width: 100%;
  padding: 0.8rem;
  border: none;
  border-radius: 4px;
  background-color: var(--primary-color);
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.action-button:hover {
  background-color: var(--accent-color);
}

.completion-message {
  text-align: center;
  padding: 2rem;
  color: var(--text-color);
  font-size: 1.2rem;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
