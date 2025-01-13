<template>
  <div class="navbar">
    <div class="navbar__brand" @click="$router.push('/')">Pardo</div>
    <div class="navbar__btns">
      <button @click="$router.push('/')" class="navbar__btn">Words</button>
      <button @click="$router.push('/training')" class="navbar__btn">Training</button>
      <button @click="$router.push('/about')" class="navbar__btn">About</button>
      <button @click="$router.push('/log-in')" class="navbar__btn">LogIn</button>
      <button @click="$router.push('/sign-up')" class="navbar__btn navbar__btn--primary">SignUp</button>
    </div>
  </div>
</template>
