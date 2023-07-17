<template>
    <div>
        <h2>Words</h2>
        <button @click="showForm = true">Add Word</button>
        <WordForm v-if="showForm" />
        <ul>
        <li v-for="word in words" :key="word.id">
          <strong>{{ word.word }}</strong>: {{ word.definition }}
          <router-link :to="'/words/' + word.id">View</router-link>
        </li>
        </ul>
    </div>
</template>

<script>
import WordForm from './WordForm.vue';

export default {
  components: {
    WordForm,
  },
  data() {
    return {
      showForm: false,
    };
  },
  computed: {
    words() {
      return this.$store.state.words;
    }
  },
  mounted() {
    this.$store.dispatch('fetchWords');
  }
}
</script>

<style scoped>
button {
  padding: 5px 10px;
  background-color: none;
  color: teal;
  border: 1px solid teal;
}
</style>