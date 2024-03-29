<template>
  <div>
    <h2>Word Audio</h2>
    <router-link to="/training" v-if="!this.words" @click="submitResult">Exit</router-link>

    <div v-if="currentWord">
      <button @click="playSound">📢</button>

      <span v-if="isAnswerSubmitted" class="button">{{ currentWord.word }}</span>
      <br /><br />

      <input
        type="text"
        v-model="userAnswer"
        placeholder="Enter the word"
        :class="{
          'input is-sunken': !isAnswerSubmitted,
          'input is-correct': isCorrect === true,
          'input is-incorrect': isCorrect === false,
        }"
      />
      <br /><br />

      <button @click="checkAnswer" v-if="!isAnswerSubmitted">Check</button>
      <button @click="nextWord" v-if="isAnswerSubmitted">Next</button>
    </div>
    <div v-else>
      <p>No more words</p>
      <div>
        <h3>Result:</h3>
        <ul>
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
        for (let i = 0; i < this.result.length; i++) {
          const formData = {
            result: this.result[i].is_learned,
            training: "word_audio",
          };
          axios.patch(
            `/api/v1/vocab/${this.result[i].word_id}/trainings`,
            formData,
            config
          );
        }
        // this.$emit("trainingCompleted");
      }
    },
  },
};
</script>

<style scoped>
.input {
  display: block;
  width: 200px;
  height: 40px;
  margin: 10px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #fff;
  color: #000;

  &.is-raised {
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  }

  &.is-sunken {
    box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.2);
  }

  &.is-correct {
    background-color: #c8ffef;
    color: #009839;
  }

  &.is-incorrect {
    background-color: #fdb8b8;
    color: #9e0303;
  }
}
.button {
  margin-left: 10px;
}
</style>
