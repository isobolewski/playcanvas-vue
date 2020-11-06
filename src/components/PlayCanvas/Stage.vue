<template>
  <div>
    <Preloader :setProgressProp="splashScreen"></Preloader>
    <canvas
      id="stage"
      ref="mainStage"
      :class="{ show: showCanvas }"
      :style="dynamicStyle"
    ></canvas>
    <MiniStats :onShowMiniStats="showMiniStats"></MiniStats>
    <DisplayErrors
      :onErrorProp="onError"
      :errorMessageProp="errorMessage"
    ></DisplayErrors>
  </div>
</template>

<script>
import settings from './settings.js';
import LoadModulesMixin from './loadModulesMixin.js';
import Preloader from './Preloader';
import DisplayErrors from './DisplayErrors';
import MiniStats from './MiniStats';
import TweenMixin from './tweenMixin.js';

// Import PlayCanvas scripts (Mixins) to be used in the app
import RotateScript from '@/assets/scripts/rotate.js';
import BoxPlacementScript from '@/assets/scripts/boxPlacement.js';

export default {
  name: 'PlayCanvasStage',
  components: { Preloader, DisplayErrors, MiniStats },
  mixins: [LoadModulesMixin, RotateScript, BoxPlacementScript, TweenMixin],

  data() {
    return {
      app: undefined,
      canvas: undefined,
      initScript: false,
      showStats: false,
      showCanvas: false,
      showMiniStats: false,
      splashScreen: false,
      onError: false,
      errorMessage: undefined,
      scene: {
        name: undefined,
        path: settings.SCENE_PATH,
      },
    };
  },
  mounted() {
    this.initialize();
    const app = this.$pc.Application.getApplication();

    // Load the initial scene when app has been initialized and configured
    app.on(
      'app:configured',
      function() {
        // Show MiniStats after app is configured
        this.showMiniStats = true;
        // Initialize all needed PlayCanvas scripts before loading the scene
        this.initScript = true;
        // Get scene name set by route from store
        this.scene.name = this.$store.state.sceneName;
        this.loadScene(this.scene);
      }.bind(this)
    );

    // The app has been started and scene has been loaded
    app.on(
      'start',
      function() {
        // Set inital app state
        this.$store.commit('setApp', app);
        // Hide the splashScreen
        this.splashScreen = false;
        // Show the canvas
        this.showCanvas = true;

        this.processScene();
      }.bind(this)
    );
  },

  destroyed() {
    this.app.destroy();
    this.app = undefined;
    window.removeEventListener('resize', this.reflow);
  },

  computed: {
    dynamicStyle() {
      return {
        '--app-width': this.appWidth,
        '--app-height': this.appHeight,
      };
    },
  },

  methods: {
    /**
     * Initialize PlayCanvas application
     */
    initialize: function() {
      const pc = this.$pc;
      const canvas = this.$refs.mainStage;
      this.canvas = canvas;

      try {
        const devices = this.createInputDevices();
        const app = new pc.Application(canvas, {
          elementInput: devices.elementInput,
          keyboard: devices.keyboard,
          mouse: devices.mouse,
          gamepads: devices.gamepads,
          touch: devices.touch,
          graphicsDeviceOptions: settings.CONTEXT_OPTIONS,
          assetPrefix: settings.ASSET_PREFIX || '',
          scriptPrefix: settings.SCRIPT_PREFIX || '',
          scriptsOrder: settings.SCRIPTS || [],
        });

        this.app = app;

        // No errors
        this.onError = false;
        // Trigger splashScreen
        this.splashScreen = true;
        // Start app configuration or preload modules first
        if (settings.PRELOAD_MODULES.length > 0) {
          this.loadModules(
            settings.PRELOAD_MODULES,
            settings.ASSET_PREFIX,
            this.configure
          );
        } else {
          this.configure();
        }
      } catch (e) {
        if (e instanceof pc.UnsupportedBrowserError) {
          this.onError = true;
          this.errorMessage =
            'This page requires a browser that supports WebGL.<br/>' +
            '<a href="http://get.webgl.org">Click here to find out more.</a>';
        } else if (e instanceof pc.ContextCreationError) {
          this.onError = true;
          this.errorMessage =
            "It doesn't appear your computer can support WebGL.<br/>" +
            '<a href="http://get.webgl.org/troubleshooting/">Click here for more information.</a>';
        } else {
          this.onError = true;
          this.errorMessage = 'Could not initialize application. Error: ' + e;
        }

        return;
      }
    },

    /**
     * Configure and start PlayCanvas application, use config.json
     */
    configure: function() {
      const app = this.$pc.Application.getApplication();
      app.configure(
        settings.CONFIG_FILENAME,
        function(err) {
          if (err) {
            console.error(err);
          }

          // Add dynamic CSS
          this.configureCss(app._fillMode, app._width, app._height);

          // Do the first reflow after a timeout because of
          // iOS showing a squished iframe sometimes
          setTimeout(
            function() {
              // Reflow the canvas
              this.reflow();

              window.addEventListener('resize', this.reflow, false);
              window.addEventListener('orientationchange', this.reflow, false);

              // Do Asset preloading
              this.doPreloadAssets(app);
            }.bind(this),
            250
          );
        }.bind(this)
      );
    },

    /**
     * 	Load all assets in the asset registry that are marked as 'preload'
     */
    doPreloadAssets(app) {
      app.preload(
        function(err) {
          if (err) {
            console.error('Preload Error: ', err);
          }
          // Trigger event when the app is configured and assets are preloaded
          console.log('Assets preloaded.');
          app.fire('app:configured');
        }.bind(this)
      );
    },

    /**
     * Initialize the WebAudio Context (not used by now)
     */
    initAudioContext() {
      const app = this.$pc.Application.getApplication();
      const resumeContext = function() {
        app.systems.sound.manager.context.resume();
        window.removeEventListener('mousedown', resumeContext);
        window.removeEventListener('touchend', resumeContext);
      };

      window.addEventListener('mousedown', resumeContext);
      window.addEventListener('touchend', resumeContext);
    },

    /**
     * Load the current given scene
     */
    loadScene(scene) {
      console.log('Loading Scene named: ', scene.name);
      const app = this.$pc.Application.getApplication();
      const path = scene.path + scene.name + '.json';

      app.loadScene(
        path,
        function(err, scene) {
          if (!err) {
            // Scene loaded successfully, save it to the store
            console.log('Scene loaded. ');
            this.$store.commit('setCurrentLoadedScene', scene);
            // Hide Spash screen
            app.fire('preload:end');
            // Start the app after scene has been loaded and show the canvas
            app.start();
          } else {
            // Error
            console.log('Scene Error: ', err);
          }
        }.bind(this)
      );
    },

    /**
     * Process the loaded scene on behalf of custom needs
     */
    processScene: function() {
      const currentScene = this.$store.state.currentLoadedScene;
      // Do something in the scene...
      console.log('Process scene: ', currentScene);
    },

    /**
     * Handle resize canvas
     */
    reflow: function() {
      const pc = this.$pc;
      const app = pc.Application.getApplication();
      const canvas = this.canvas;

      app.resizeCanvas(canvas.width, canvas.height);
      canvas.style.width = '';
      canvas.style.height = '';

      const fillMode = app._fillMode;

      if (fillMode == pc.FILLMODE_NONE || fillMode == pc.FILLMODE_KEEP_ASPECT) {
        if (
          (fillMode == pc.FILLMODE_NONE &&
            canvas.clientHeight < window.innerHeight) ||
          canvas.clientWidth / canvas.clientHeight >=
            window.innerWidth / window.innerHeight
        ) {
          canvas.style.marginTop =
            Math.floor((window.innerHeight - canvas.clientHeight) / 2) + 'px';
        } else {
          canvas.style.marginTop = '';
        }
      }
    },

    /**
     * Create PlayCanvas input devices from stettings
     */
    createInputDevices: function() {
      const pc = this.$pc;
      const canvas = this.$refs.mainStage;
      const devices = {
        elementInput: new pc.ElementInput(canvas, {
          useMouse: settings.INPUT_SETTINGS.useMouse,
          useTouch: settings.INPUT_SETTINGS.useTouch,
        }),
        keyboard: settings.INPUT_SETTINGS.useKeyboard
          ? new pc.Keyboard(window)
          : null,
        mouse: settings.INPUT_SETTINGS.useMouse ? new pc.Mouse(canvas) : null,
        gamepads: settings.INPUT_SETTINGS.useGamepads
          ? new pc.GamePads()
          : null,
        touch:
          settings.INPUT_SETTINGS.useTouch && pc.platform.touch
            ? new pc.TouchDevice(canvas)
            : null,
      };

      return devices;
    },

    /**
     * Add dynamic CSS
     */
    configureCss: function(fillMode, width, height) {
      const canvas = this.$refs.mainStage;
      // Configure resolution and resize event
      if (canvas.classList) {
        canvas.classList.add('fill-mode-' + fillMode);
      }

      // Dynamic CSS media query for aspect ratio changes
      this.appWidth = width;
      this.appHeight = height;
    },
  },
};
</script>

<style lang="scss" scoped>
canvas {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  visibility: hidden;
  transition: opacity 500ms;

  &.show {
    opacity: 1;
    visibility: visible;
  }

  &.fill-mode-NONE {
    margin: auto;
  }

  &.fill-mode-KEEP_ASPECT {
    width: 100%;
    height: auto;
    margin: 0;
  }

  &.fill-mode-FILL_WINDOW {
    width: 100%;
    height: 100%;
    margin: 0;
  }

  &:focus {
    outline: none;
  }
}

@media screen and (min-aspect-ratio: var(--app-width) / var(--app-height)) {
  canvas.fill-mode-KEEP_ASPECT {
    width: auto;
    height: 100%;
    margin: 0 auto;
  }
}
</style>
