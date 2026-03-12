import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HomePage',
  template: `
    <div id="home-page">
      <header>
        <div class="logo"></div>
      </header>
      <h1>ROCKTOWN KICKS</h1>
      <p>Curated sneakers for the culture. We carry heat from Nike, Adidas, Vans, and New Balance — sourced fresh from the best drops. Based in Harrisonburg, VA, built for everywhere.</p>
      <div class="collection">
        <div class="img"></div>
        <p>SPRING 2026</p>
        <h2>ALL BLACK COLLECTION</h2>
        <router-link to="/collection"><button class="shop">SHOP</button></router-link>
      </div>
      <div class="lookbook">
        <div class="img"></div>
        <p>SPRING 2026</p>
        <h2>RUGRATS KIT</h2>
        <router-link to="/lookbook"><button class="shop">VIEW</button></router-link>
      </div>
      <div class="blog">
        <div class="img"></div>
        <p>SPRING 2026</p>
        <h2>ASIA SNEAKER FACTORY</h2>
        <router-link to="/comingsoon"><button class="read">READ</button></router-link>
      </div>
      <div class="about">
        <div class="img"></div>
        <p>HBURG VA</p>
        <h2>SMALL TOWN CO.</h2>
        <router-link to="/comingsoon"><button class="read">READ</button></router-link>
      </div>
    </div>
  `
});
