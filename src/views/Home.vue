<template>
  <div class="home">
    <img alt="PlayCanvas + Vue logo" src="../assets/pcvue-logo.png" />
    <HelloWorld msg="Welcome to Your PlayCanvas Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';

export default {
  name: 'Home',
  components: {
    HelloWorld,
  },
};
</script>

<style scoped>
div.home {
  display: flex;
  align-items: center;
  flex-direction: column;
}

img {
  display: block;
  width: 100%;
  height: auto;
  max-width: 400px;
}</style
>>
