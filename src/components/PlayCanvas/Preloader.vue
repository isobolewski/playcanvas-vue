<template>
  <div class="application-splash-wrapper" :class="{ hide: !status }">
    <div class="application-splash">
      <img alt="PlayCanvas logo" src="@/assets/pclogo.png" />
      <div class="progress-bar-container">
        <div class="progress-bar" ref="progressBar"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Preloader',
  mounted() {
    const progressBar = this.$refs.progressBar;
    this.progressBar = progressBar;
    this.status = false;
  },

  data() {
    return {
      progressBar: undefined,
      status: false,
    };
  },
  watch: {
    setProgressProp: function(status) {
      this.status = status;
      const app = this.$pc.Application.getApplication();
      app.on('preload:end', function() {
        app.off('preload:progress');
      });
      app.on('preload:progress', this.setProgress);
    },
  },
  props: ['setProgressProp'],
  methods: {
    setProgress: function(value) {
      const progressBar = this.progressBar;
      value = Math.min(1, Math.max(0, value));
      progressBar.style.width = value * 100 + '%';
    },
  },
};
</script>

<style lang="scss" scoped>
.application-splash-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: #283538;
  opacity: 1;
  visibility: visible;
  transition: opacity 500ms;

  &.hide {
    opacity: 0;
    visibility: hidden;
  }

  .application-splash {
    position: absolute;
    top: calc(50% - 28px);
    width: 264px;
    left: calc(50% - 132px);

    img {
      width: 100%;
    }

    .progress-bar-container {
      margin: 20px auto 0 auto;
      height: 2px;
      width: 100%;
      background-color: #1d292c;

      .progress-bar {
        width: 0%;
        height: 100%;
        background-color: #f60;
      }
    }
  }
}

@media (max-width: 480px) {
  .application-splash {
    width: 170px;
    left: calc(50% - 85px);
  }
}
</style>
