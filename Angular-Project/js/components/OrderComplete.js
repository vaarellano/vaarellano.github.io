import { defineComponent } from 'vue';

export default defineComponent({
  name: 'OrderComplete',
  template: `
    <div id="ordercomplete-page">
      <header>
        <div class="logo"></div>
      </header>
      <h1>THANK YOU!</h1>
      <div class="ordercomplete-body">
        <p>Your order has been placed. We'll send a confirmation to your email shortly.</p>
        <router-link to="/collection">
          <button class="shop">KEEP SHOPPING</button>
        </router-link>
      </div>
    </div>
  `
});
