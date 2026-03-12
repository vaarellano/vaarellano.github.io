// Central re-export of Vue 3 + Vue Router 4 CDN builds.
// All components import from this file so the module cache guarantees
// a single shared Vue instance across the entire app.

export {
  createApp,
  defineComponent,
  ref,
  reactive,
  computed,
  inject,
  provide,
  onMounted,
  watch
} from 'https://unpkg.com/vue@3.4.21/dist/vue.esm-browser.js';

export {
  createRouter,
  createWebHashHistory,
  useRoute,
  useRouter
} from 'https://unpkg.com/vue-router@4.3.0/dist/vue-router.esm-browser.js';
