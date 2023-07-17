<template>
    <div>
      <h2>Word Details</h2>
  
      <div v-if="word">
        <strong>{{ word.word }}</strong>: {{ word.definition }}
      </div>
    </div>
  </template>
  
  <script>
  export default {
    computed: {
      word() {
        const wordId = parseInt(this.$route.params.id, 10);
        if (this.$store.state.words.length == 0) {
          this.$store.dispatch('fetchWords');
        }
        return this.$store.getters.getWordById(wordId);
      }
    },
    mounted() {
    
    }
  }
  </script>
  
  <style scoped>
  
  </style>