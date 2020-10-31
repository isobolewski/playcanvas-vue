const ASSET_PREFIX = "";
const SCRIPT_PREFIX = "";
const SCENE_PATH = "scenes/";
const CONTEXT_OPTIONS = {
    'antialias': true,
    'alpha': true,
    'preserveDrawingBuffer': false,
    'preferWebGl2': true,
    'maxPixelRatio': window.devicePixelRatio,
};
const SCRIPTS = [];
const CONFIG_FILENAME = "assets/config.json";
const INPUT_SETTINGS = {
    useKeyboard: true,
    useMouse: true,
    useGamepads: false,
    useTouch: true
};

const PRELOAD_MODULES = [
    { 'moduleName': 'BASIS', 'glueUrl': 'js/basis.wasm.js', 'wasmUrl': 'js/basis.wasm.wasm', 'fallbackUrl': 'js/basis.js', 'preload': false },
    { 'moduleName': 'Ammo', 'glueUrl': 'js/ammo.wasm.js', 'wasmUrl': 'js/ammo.wasm.wasm', 'fallbackUrl': 'js/ammo.js', 'preload': true },
];

export default {
    ASSET_PREFIX,
    SCRIPT_PREFIX,
    SCENE_PATH,
    CONTEXT_OPTIONS,
    SCRIPTS,
    CONFIG_FILENAME,
    INPUT_SETTINGS,
    PRELOAD_MODULES
}