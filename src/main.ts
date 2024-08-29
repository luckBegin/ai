import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import Markdown from 'vue3-markdown-it';
import 'element-plus/dist/index.css'
import 'highlight.js/styles/monokai.css';
createApp(App).use(ElementPlus).use(Markdown).use(store).use(router).mount('#app')
