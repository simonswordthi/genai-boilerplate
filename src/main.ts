/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Styles
import 'unfonts.css'

import { initializeApp } from 'firebase/app';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDI5bDE_c6t7KttoJ5ErjCwSxp73Y5kWfo',
  authDomain: 'genai-boilerplate.firebaseapp.com',
  projectId: 'genai-boilerplate',
  storageBucket: 'genai-boilerplate.firebasestorage.app',
  messagingSenderId: '918195805079',
  appId: '1:918195805079:web:52da146b659ec56c3dc2d2',
  measurementId: 'G-ELNNVL9SW4',
};

const firebaseApp = initializeApp(firebaseConfig)
console.log(firebaseApp.options)

const app = createApp(App)

registerPlugins(app)

app.mount('#app')
