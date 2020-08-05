import Vue from 'vue'
import App from './App.vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import "./assets/fontawesome/css/fontawesome.css";
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from "./store";
import '@/styles/index.scss'
import '@/icons'
import axios from 'axios'

Vue.prototype.$axios = axios;
Vue.prototype.$axios.defaults.withCredentials = true;
Vue.config.productionTip = false;
Vue.use(ElementUI);
new Vue({
    store,
    render: h => h(App),
}).$mount('#app');
