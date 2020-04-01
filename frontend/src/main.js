import Vue from 'vue';
import App from './App.vue';
import router from './router';
import Element from 'element-ui';
import VueRouter from 'vue-router';
import VueAxios from 'vue-axios';
import VueAuthenticate from 'vue-authenticate';
import axios from 'axios';

/** vue-router
 *  @url https://router.vuejs.org/guide/
 *  corresponding routes directing: ./router/index.js
 *
 *  By injecting the router, we get access to it as this.$router as
 *  well as the current route as this.$route inside of any component.

 */
Vue.use(VueRouter);
Vue.use(Element);

Vue.use(VueAxios, axios);

Vue.use(VueAuthenticate, {
	providers: {
		baseUrl: 'https://localhost:9000/',
		procore: {
			name: 'procore',
			authorizationEndpoint: 'http://login-sandbox.procore.com/oauth/authorize',
			clientId: 'f25a5b1d1f33ca7581c3f24bd11d291d46e870a2e67b394395df55193e55e385',
			redirectUri: 'https://c3dc89b8.ngrok.io/api/callback', // Your client app URL
			oauthType: '2.0',
			responseType: 'code',
			scopes: []
		}
	}
});

new Vue({
	router,
	render: h => h(App)
}).$mount('#app');
