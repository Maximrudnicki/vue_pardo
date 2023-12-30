<template>
    <div>
      <h2>Word Details</h2>
      <router-link to='/'>Back</router-link>
      <div v-if="word">
        <strong>{{ word.word }}</strong>: {{ word.definition }}
      </div>

      <button @click="showForm = true">Edit</button>

      <div v-if="showForm">
        <form  @submit.prevent="submitForm">
          <input v-model="definition" type="text" placeholder="Definition" required/>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
</template> 
  
<script>
  export default {
    data() {
        return {
          showForm: false,
          definition: ''
        };
    },
    computed: {
      word() {
        const wordId = parseInt(this.$route.params.id, 10);
        if (this.$store.state.words.length == 0) {
          this.$store.dispatch('fetchWords');
        }
        return this.$store.getters.getWordById(wordId);
      }
    },
    methods: {
      submitForm() {
        const updatedWord = {
          id: this.word.id,
          definition: this.definition,
        };
        this.$store.dispatch('updateWord', updatedWord);
        this.showForm = false;
       }
    },
    mounted() {
    
    }
  }
</script>
  
<style scoped>
  form {
    display: flex;
    flex-direction: column;
  }

  input {
    width: 100%;
    border: 2px solid teal;
    padding: 10px 15px;
    margin-top: 15px;
  } 

  button {
    align-self: flex-end;
    margin-top: 15px;
    padding: 5px 10px;
    background-color: none;
    color: teal;
    border: 1px solid teal;
  }
</style>