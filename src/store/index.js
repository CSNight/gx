import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);
// eslint-disable-next-line
const modulesFiles = require.context('./modules', true, /\.js$/);

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
    // set './app.js' => 'app'
    const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1');
    const value = modulesFiles(modulePath);
    modules[moduleName] = value.default;
    return modules
}, {});
const getters = {
    baseUrl: state => state.app.BASE_API,
};
const store = new Vuex.Store({
    modules,
    getters
});

export default store
