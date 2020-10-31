// Rotate Mixin
const Rotate = {
  watch: {
    initScript: function () {
      this.initRotate();
    }
  },

  methods: {
    initRotate() {
      const Rotate = this.$pc.createScript('rotate');
      // Setup attributes
      Rotate.attributes.add('x', { type: 'number', description: 'The entity to be spawned after clicking.' });
      Rotate.attributes.add('y', { type: 'number', description: 'The main camera entity in the scene.' });
      Rotate.attributes.add('z', { type: 'number', description: 'The main camera entity in the scene.' });

      Rotate.prototype.update = function (dt) {
        this.entity.rotate(this.x * dt, this.y * dt, this.z * dt);
      };
    }
  }
}

export default Rotate