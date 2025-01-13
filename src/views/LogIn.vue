<template>
  <div class="page-log-in">
    <div class="log-in__container">
      <h1 class="log-in__title">Log in</h1>

      <form @submit.prevent="submitForm" class="log-in__form">
        <div class="log-in__field">
          <label for="email" class="log-in__label">Email</label>
          <input id="email" type="text" class="log-in__input" v-model="email" />
        </div>

        <div class="log-in__field">
          <label for="password" class="log-in__label">Password</label>
          <input
            id="password"
            type="password"
            class="log-in__input"
            v-model="password"
          />
        </div>

        <div class="log-in__errors" v-if="errors.length">
          <p class="log-in__error" v-for="error in errors" :key="error">
            {{ error }}
          </p>
        </div>

        <button type="submit" class="log-in__button">Log in</button>

        <hr class="log-in__divider" />

        <p class="log-in__alt">
          Or
          <router-link to="/sign-up" class="log-in__link"
            >click here</router-link
          >
          to sign up!
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "LogIn",
  data() {
    return {
      email: "",
      password: "",
      errors: [],
    };
  },
  mounted() {
    document.title = "Log In";
  },
  methods: {
    async submitForm() {
      axios.defaults.headers.common["Authorization"] = "";
      localStorage.removeItem("token");
      const formData = {
        email: this.email,
        password: this.password,
      };
      await axios
        .post("/api/v1/authentication/login/", formData)
        .then((response) => {
          const token = response.data.token;
          this.$store.commit("setToken", token);

          axios.defaults.headers.common["Authorization"] = "Bearer " + token;
          localStorage.setItem("token", token);
          const toPath = this.$route.query.to || "/";
          this.$router.push(toPath);
        })
        .catch((error) => {
          if (error.response) {
            for (const property in error.response.data) {
              this.errors.push(`${property}: ${error.response.data[property]}`);
            }
          } else {
            this.errors.push("Something went wrong. Please try again");

            console.log(JSON.stringify(error));
          }
        });
    },
  },
};
</script>
