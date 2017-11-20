import Vue from 'vue';
import iView from 'iview';
import router from './router.js';
import api from './api';
import App from './page/app.vue';
import 'iview/dist/styles/iview.css';

Vue.use(iView);
api.install = function(Vue){
	Vue.prototype.api = this;
}
Vue.use(api);

window.app = new Vue({
	el: '#app',
	router: router,
	render: h => h(App)
});
