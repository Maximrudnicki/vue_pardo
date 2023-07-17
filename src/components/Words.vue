<template>
    <div>
        <h2>Words</h2>
        <ul>
        <li v-for="word in words" :key="word.id">
          <strong>{{ word.word }}</strong>: {{ word.definition }}
          <router-link :to="'/words/' + word.id">View</router-link>
        </li>
        </ul>
    </div>
</template>

<script>
export default {
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
    
</style>