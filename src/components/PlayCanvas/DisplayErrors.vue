<template>
  <div class="application-errors-table-wrapper" :class="{ show: onError }">
    <table class="error-table">
      <tr>
        <td align="center">
          <div style="display: table-cell; vertical-align: middle;">
            <div style="" v-html="errorMessage">{{ errorMessage }}</div>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'DisplayErrors',
  mounted() {
    this.errorMessage = undefined;
  },

  data() {
    return {
      errorMessage: undefined,
      onError: false,
    };
  },
  watch: {
    onErrorProp: function(onError) {
      this.onError = onError;
      this.errorMessage = this.errorMessageProp;
    },
  },
  props: ['onErrorProp', 'errorMessageProp'],
  methods: {},
};
</script>

<style lang="scss" scoped>
.application-errors-table-wrapper {
  display: none;

  &.show {
    display: block;
  }
}

.error-table {
  background-color: #8ce;
  width: 100%;
  height: auto;
  position: absolute;
  bottom: 0;
}
</style>
