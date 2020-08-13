import Vue from 'vue'
import SygIcon from './SvgIcon'
import FaIcon from "./FaIcon";
// svg component

// register globally
Vue.component('fa-icon', FaIcon);
Vue.component('svg-icon', SygIcon);
// eslint-disable-next-line no-undef
const req = require.context('./svg', false, /\.svg$/);
const requireAll = requireContext => requireContext.keys().map(requireContext);
requireAll(req);
