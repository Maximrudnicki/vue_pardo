<template>
    <div class="word-form">
        <h5>Add Word:</h5>
        <form @submit.prevent="submitForm">
            <input v-focus v-model="word" type="text" placeholder="Word" required/>
      
            <input v-model="definition" type="text" placeholder="Definition" required/>
            <button type="submit">Submit</button>
        </form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            word: '',
            definition: ''
        };
    },
    methods: {
        submitForm() {
            const userId = this.$store.state.words[0].user;
            const formData = {
                user: userId,
                word: this.word,
                definition: this.definition
            };
            this.$store.dispatch('addWord', formData);
            this.word = '';
            this.definition = '';
        }
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