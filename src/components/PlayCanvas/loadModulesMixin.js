// LoadModules Mixin
const LoadModulesMixin = {

    methods: {
        loadModules(modules, urlPrefix, doneCallback) {
            if (typeof modules === "undefined" || modules.length === 0) {
                // caller may depend on callback behaviour being async
                setTimeout(doneCallback);
            } else {
                let asyncCounter = modules.length;
                const asyncCallback = function () {
                    asyncCounter--;
                    if (asyncCounter === 0) {
                        doneCallback();
                    }
                };

                const wasm = this.wasmSupported();
                modules.forEach(function (m) {
                    // eslint-disable-next-line
                    if (!m.hasOwnProperty('preload') || m.preload) {
                        if (wasm) {
                            this.loadWasmModuleAsync(m.moduleName, urlPrefix + m.glueUrl, urlPrefix + m.wasmUrl, asyncCallback);
                        } else {
                            if (!m.fallbackUrl) {
                                throw new Error('wasm not supported and no fallback supplied for module ' + m.moduleName);
                            }
                            this.loadWasmModuleAsync(m.moduleName, urlPrefix + m.fallbackUrl, "", asyncCallback);
                        }
                    } else {
                        asyncCallback();
                    }
                }.bind(this));
            }
        },

        // Check WASM support
        wasmSupported() {
            try {
                if (typeof WebAssembly === "object" && typeof WebAssembly.instantiate === "function") {
                    const module = new WebAssembly.Module(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));
                    if (module instanceof WebAssembly.Module)
                        return new WebAssembly.Instance(module) instanceof WebAssembly.Instance;
                }
            } catch (e) {
                console.log('WASM support error: ', e);
            }
            return false;
        },

        // Load a script
        loadScriptAsync(url, moduleName, doneCallback) {
            const checkScript = document.getElementById(moduleName);
            if (checkScript === null) {
                const tag = document.createElement('script');
                tag.setAttribute('id', moduleName);
                tag.onload = function () {
                    doneCallback();
                };
                tag.onerror = function () {
                    throw new Error('failed to load ' + url);
                };
                tag.async = true;
                tag.setAttribute('src', url);
                document.body.appendChild(tag);
            } else {
                checkScript.onload = function () {
                    doneCallback();
                };
            }
        },

        // Load and initialize a wasm module
        loadWasmModuleAsync: function (moduleName, jsUrl, binaryUrl, doneCallback) {
            const checkModule = window[moduleName];
            if (checkModule === undefined) {
                this.loadScriptAsync(jsUrl, moduleName, function () {
                    const lib = window[moduleName];
                    window[moduleName + 'Lib'] = lib;
                    lib({
                        locateFile: function () {
                            return binaryUrl;
                        },
                    }).then(function (instance) {
                        window[moduleName] = instance;
                        doneCallback();
                    });
                });
            } else {
                doneCallback();
            }
        }
    }
}

export default LoadModulesMixin