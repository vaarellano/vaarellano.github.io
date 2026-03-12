import { defineComponent, ref, inject, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'ProductDetails',
  template: `
    <div v-if="loading" class="state-msg">Loading product...</div>
    <div v-else-if="error" class="state-msg error-msg">{{ error }}</div>
    <div v-else-if="product" id="product-page">
      <div class="product-main-section">
        <div class="product-image-container">
          <img :src="activeImage" :alt="product.brand + ' — ' + product.color" loading="lazy" />
          <div class="thumbnail-row">
            <img
              v-for="(img, i) in product.productImages"
              :key="i"
              :src="img.imageUrl"
              :alt="product.brand + ' view ' + (i + 1)"
              :class="{ active: activeImage === img.imageUrl }"
              @click="activeImage = img.imageUrl"
              loading="lazy"
            />
          </div>
        </div>
        <div class="product-details">
          <h1>{{ product.brand }}</h1>
          <p class="product-color">{{ product.color }}</p>
          <h2>{{ product.price }}</h2>
          <p>Premium quality sneaker. Part of our curated collection featuring the best styles from {{ product.brand }}. Authentic and brand new in box.</p>
          <button v-if="inCart" class="remove-btn" @click="removeFromCart">
            Remove from Cart
          </button>
        </div>
      </div>

      <div class="product-image-section">
        <div class="product-image-grid">
          <img
            v-for="(img, i) in product.productImages.slice(2, 5)"
            :key="i"
            :src="img.imageUrl"
            :alt="product.brand"
            loading="lazy"
          />
        </div>
      </div>

      <div class="product-information">
        <h1>{{ product.brand }}</h1>
        <p>Authentic sneakers from our curated selection. Each pair is carefully verified for authenticity. We partner directly with authorized retailers to bring you the freshest kicks at competitive prices.</p>
        <p>Free shipping on orders over $150. 30-day returns accepted. All shoes are brand new in box unless otherwise noted.</p>
      </div>

      <div id="purchase-bar">
        <div class="purchase-container">
          <div class="shoe-size">SIZE</div>
          <div class="add-to-cart">
            <router-link :to="'/checkout/' + product.id" @click="addToCart">
              ADD TO CART
            </router-link>
          </div>
        </div>
      </div>
    </div>
  `,
  setup() {
    const route = useRoute();
    const cart = inject('cart');
    const product = ref(null);
    const activeImage = ref('');
    const loading = ref(true);
    const error = ref(null);

    const inCart = computed(() => product.value && cart.has(product.value.id));

    async function loadProduct(id) {
      loading.value = true;
      error.value = null;
      product.value = null;
      try {
        const res = await fetch(`js/products/product-${id}.json`);
        if (!res.ok) throw new Error('Not found');
        const data = await res.json();
        product.value = Array.isArray(data) ? data[0] : data;
        activeImage.value = product.value.imageUrl;
      } catch {
        error.value = 'Could not load product. Please go back and try again.';
      } finally {
        loading.value = false;
      }
    }

    function addToCart() {
      if (product.value && !inCart.value) {
        cart.add(product.value);
      }
    }

    function removeFromCart() {
      if (product.value) cart.remove(product.value.id);
    }

    onMounted(() => loadProduct(route.params.id));
    watch(() => route.params.id, id => id && loadProduct(id));

    return { product, activeImage, loading, error, inCart, addToCart, removeFromCart };
  }
});
