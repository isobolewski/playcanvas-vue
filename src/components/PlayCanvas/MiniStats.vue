<template>
  <div class="pc-ministats-wrapper"></div>
</template>

<script>
import * as pcx from 'playcanvas/build/playcanvas-extras';
export default {
  name: 'MiniStats',
  mounted() {
    window.pc = this.$pc;
    window.pcx = pcx;
  },

  destroyed() {
    document.body.removeChild(this.MiniStats.div);
    this.MiniStats = undefined;
  },

  data() {
    return {
      MiniStats: undefined,
    };
  },
  computed: {},
  watch: {
    onShowMiniStats: function(showMiniStats) {
      if (showMiniStats) {
        this.initMiniStats();
      }
    },
  },
  props: ['onShowMiniStats'],
  methods: {
    initMiniStats() {
      const app = this.$pc.Application.getApplication();
      this.MiniStats = new pcx.MiniStats(app);
      this.MiniStats.div.id = 'ministats';
    },
  },
};
</script>

<style lang="scss" scoped></style>
