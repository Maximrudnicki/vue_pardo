<template>
  <div class="page-sign-up">
    <div class="sign-up__container">
      <h1 class="sign-up__title">Sign up</h1>

      <form @submit.prevent="submitForm" class="sign-up__form">
        <div class="sign-up__field">
          <label for="username" class="sign-up__label">Username</label>
          <input
            id="username"
            type="text"
            class="sign-up__input"
            v-model="username"
          />
        </div>

        <div class="sign-up__field">
          <label for="email" class="sign-up__label">Email</label>
          <input
            id="email"
            type="text"
            class="sign-up__input"
            v-model="email"
          />
        </div>

        <div class="sign-up__field">
          <label for="password" class="sign-up__label">Password</label>
          <input
            id="password"
            type="password"
            class="sign-up__input"
            v-model="password"
          />
        </div>

        <div class="sign-up__field">
          <label for="password2" class="sign-up__label">Repeat password</label>
          <input
            id="password2"
            type="password"
            class="sign-up__input"
            v-model="password2"
          />
        </div>

        <div class="sign-up__errors" v-if="errors.length">
          <p class="sign-up__error" v-for="error in errors" :key="error">
            {{ error }}
          </p>
        </div>

        <button type="submit" class="sign-up__button">Sign up</button>

        <hr class="sign-up__divider" />

        <p class="sign-up__alt">
          Or
          <router-link to="/log-in" class="sign-up__link"
            >click here</router-link
          >
          to log in!
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "SignUp",
  data() {
    return {
      username: "",
      email: "",
      password: "",
      password2: "",
      errors: [],
    };
  },
  methods: {
    submitForm() {
      this.errors = [];
      if (this.username === "") {
        this.errors.push("The username is missing");
      }
      if (this.email === "") {
        this.errors.push("The email is missing");
      }
      if (this.password === "") {
        this.errors.push("The password is too short");
      }
      if (this.password !== this.password2) {
        this.errors.push("The passwords doesn't match");
      }
      if (!this.errors.length) {
        const formData = {
          username: this.username,
          email: this.email,
          password: this.password,
        };
        axios
          .post("/api/v1/authentication/register/", formData)
          .then((response) => {
            this.$router.push("/log-in");
          })
          .catch((error) => {
            if (error) {
              for (const property in error) {
                this.errors.push(
                  `${property}: ${error.response.data[property]}`
                );
              }
              console.log(JSON.stringify(error.message));
            } else if (error) {
              this.errors.push("Something went wrong. Please try again");

              console.log(JSON.stringify(error));
            }
          });
      }
    },
  },
};
</script>
