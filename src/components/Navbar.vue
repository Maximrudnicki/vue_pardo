<template>
    <div class="navbar">
      <div @click="$router.push('/')">Pardo</div>
      <div class="navbar__btns">
        <button @click="$router.push('/')">Words</button>
        <button style="margin-left: 20px" @click="$router.push('/groups')">Groups</button>
        <button style="margin-left: 20px" @click="$router.push('/training')">Training</button>
        <button style="margin-left: 20px" @click="$router.push('/about')">About</button>
        <button style="margin-left: 20px" @click="$router.push('/log-in')">LogIn</button>
        <button style="margin-left: 20px" @click="$router.push('/sign-up')">SignUp</button>
      </div>
    </div>
  </template>
  <script>
  export default {
  }
  </script>
  
  <style scoped>
  .navbar {
    height: 50px;
    background-color: lightgray;
    box-shadow: 2px 2px 4px gray;
    display: flex;
    align-items: center;
    padding: 0 15px;
  }
  .navbar__btns {
    margin-left: auto;
  }
  button {
    padding: 5px 10px;
    background-color: none;
    color: teal;
    border: 1px solid teal;
  }
  </style>
  