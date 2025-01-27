<template>
  <div class="all-together-container">
    <div class="header">
      <h2 class="training-title">All Together</h2>
      <router-link class="exit-button" to="/training">Exit</router-link>
    </div>

    <div class="training-content">
      <Cards v-if="currentTraining === 'cards'" :words="randomWords" />
      <WordTranslate v-if="currentTraining === 'wordTranslate'" :words="randomWords" />
      <Constructor v-if="currentTraining === 'constructor'" :words="randomWords" />
      <WordAudio v-if="currentTraining === 'wordAudio'" :words="randomWords" />
    </div>

    <div class="action-container" v-if="currentTraining !== 'completed'">
      <button @click="nextTraining" class="action-button">Next Training</button>
    </div>
  </div>
</template>

<script>
import Cards from "./Cards.vue";
import WordTranslate from "./WordTranslate.vue";
import Constructor from "./Constructor.vue";
import WordAudio from "./WordAudio.vue";

export default {
  components: { Cards, WordTranslate, Constructor, WordAudio },
  data() {
    return {
      currentTraining: 'cards',
    }
  },
  mounted() {
    this.$store.dispatch("fetchWords");
  },
  computed: {
    randomWords() {
      const shuffledWords = this.shuffleArray(this.$store.getters.unlearnedWords);
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
    nextTraining() {
      switch (this.currentTraining) {
        case 'cards':
          this.currentTraining = 'wordTranslate';
          break;
        case 'wordTranslate':
          this.currentTraining = 'constructor';
          break;
        case 'constructor':
          this.currentTraining = 'wordAudio';
          break;
        case 'wordAudio':
          this.currentTraining = 'completed';
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style scoped>
.all-together-container {
  max-width: 800px;
  margin: 40px auto 0;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.training-title {
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
  text-decoration: none;
}

.exit-button:hover {
  background-color: var(--accent-color);
}

.training-content {
  background-color: var(--background-color);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.action-container {
  display: flex;
  justify-content: center;
}

.action-button {
  padding: 12px 24px;
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

.constructor-container {
  max-width: 600px;
  margin: 0 auto;
  margin-top: 0px;
  padding: 20px;
}

.training-page {
  margin-top: 0px;
  padding: 20px;
  font-family: Arial, sans-serif;
}

@media (max-width: 768px) {
  .all-together-container {
    padding: 15px;
  }

  .training-title {
    font-size: 1.5rem;
  }

  .training-content {
    padding: 15px;
    min-height: 300px;
  }
}

@media (max-width: 480px) {
  .header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .training-content {
    padding: 10px;
  }

  .action-button {
    width: 100%;
    max-width: 300px;
  }
}
</style>
