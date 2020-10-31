<template>
  <div class="pc-ministats-wrapper"></div>
</template>

<script>
export default {
  name: 'MiniStats',
  mounted() {},

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
      this.MiniStats = new this.$pcx.MiniStats(app);
    },
  },
};
</script>

<style lang="scss" scoped></style>
