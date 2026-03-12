import { createApp, defineComponent, ref, provide, createRouter, createWebHashHistory } from './deps.js';
import { cart } from './cart-store.js';

import HomePage       from './components/HomePage.js';
import CollectionPage from './components/CollectionPage.js';
import ProductDetails from './components/ProductDetails.js';
import CartDetails    from './components/CartDetails.js';
import LookbookPage   from './components/LookbookPage.js';
import ComingSoonPage from './components/ComingSoonPage.js';
import OrderComplete  from './components/OrderComplete.js';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/',              redirect: '/main' },
    { path: '/main',          component: HomePage },
    { path: '/collection',    component: CollectionPage },
    { path: '/collection/:id', component: ProductDetails },
    { path: '/checkout/:id',  component: CartDetails },
    { path: '/ordercomplete', component: OrderComplete },
    { path: '/lookbook',      component: LookbookPage },
    { path: '/comingsoon',    component: ComingSoonPage },
    { path: '/:pathMatch(.*)*', redirect: '/main' }
  ],
  scrollBehavior() {
    return { top: 0 };
  }
});

const App = defineComponent({
  template: `
    <div
      class="overlay"
      :class="{ 'open-menu': menuOpen }"
      @click="closeMenu"
      aria-hidden="true"
    ></div>

    <aside
      id="side-menu"
      class="side-menu"
      :class="{ 'open-menu': menuOpen }"
      aria-label="Site navigation"
    >
      <div>
        <h3>MENU</h3>
        <nav class="navigation">
          <ul>
            <li><router-link to="/main"       @click="closeMenu">HOME</router-link></li>
            <li><router-link to="/collection" @click="closeMenu">COLLECTION</router-link></li>
            <li><router-link to="/lookbook"   @click="closeMenu">LOOKBOOK</router-link></li>
            <li><router-link to="/comingsoon" @click="closeMenu">ABOUT</router-link></li>
            <li><router-link to="/comingsoon" @click="closeMenu">BLOG</router-link></li>
          </ul>
        </nav>
      </div>
      <footer></footer>
    </aside>

    <div class="container">
      <nav>
        <ul class="nav-bar">
          <li
            class="ham"
            @click="toggleMenu"
            @keydown.enter="toggleMenu"
            role="button"
            tabindex="0"
            aria-label="Open navigation menu"
          >☰</li>
          <li><h1><router-link to="/main">K</router-link></h1></li>
          <li id="bag" :aria-label="cart.count + ' item(s) in cart'">
            <img src="images/bag.svg" alt="Shopping bag" class="bag" />
            <span v-if="cart.count > 0" class="cart-count">{{ cart.count }}</span>
          </li>
        </ul>
      </nav>

      <router-view></router-view>

      <footer></footer>
    </div>
  `,
  setup() {
    const menuOpen = ref(false);

    function toggleMenu() { menuOpen.value = !menuOpen.value; }
    function closeMenu()  { menuOpen.value = false; }

    provide('cart', cart);

    return { menuOpen, toggleMenu, closeMenu, cart };
  }
});

createApp(App).use(router).mount('#app');
