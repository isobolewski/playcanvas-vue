<template>
  <div class="stage-wrapper">
    <Stage></Stage>
    <a
      class="powered-by-playcanvas no-select"
      href="https://playcanvas.com"
      rel="noopener"
      target="_blank"
    >
      <img
        alt="Powered by PlayCanvas logo"
        src="../assets/powered-by-playcanvas.png"
        width="257"
        height="51"
    /></a>
  </div>
</template>

<script>
// @ is an alias to /src
import Stage from '@/components/PlayCanvas/Stage';

export default {
  name: 'Tween',
  components: {
    Stage,
  },
  props: {
    sceneName: {
      type: String,
    },
  },
  mounted() {
    // Save scene name from route to store
    this.$store.commit('setSceneName', this.sceneName);
  },
};
</script>

<style lang="scss" scoped></style>
