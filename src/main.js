import Vue from 'vue';
import firebase from 'firebase';
import contenteditableDirective from 'vue-contenteditable-directive';
import App from './App';
import router from './router';

Vue.config.productionTip = false;
Vue.use(contenteditableDirective);

const config = {
  apiKey: 'AIzaSyBuKK7PR3RR0eheOHnIVBhWkzCDZSNfyJg',
  authDomain: 'swift-capsule-221215.firebaseapp.com',
  databaseURL: 'https://swift-capsule-221215.firebaseio.com/',
  projectId: 'swift-capsule-221215',
  storageBucket: '',
};

firebase.initializeApp(config);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});
