import {createApp} from 'vue'
import VueToast from 'vue-toast-notification';

// Import one of the available themes
import 'vue-toast-notification/dist/theme-default.css';
//import 'vue-toast-notification/dist/theme-sugar.css';

import App from './App.vue'

createApp(App)
  .use(VueToast)
  .mount('#app')
