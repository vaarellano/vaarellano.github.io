import { defineComponent, ref, computed, onMounted } from 'vue';

export default defineComponent({
  name: 'CollectionPage',
  template: `
    <div id="collection-page">
      <header>
        <div class="logo"></div>
      </header>
      <h1>SPRING 2026 ALL BLACK COLLECTION</h1>
      <p>Premium kicks from the top brands. Search by name or color, sort to find your next pair.</p>

      <div class="filter">
        <h2>SEARCH</h2>
        <input
          v-model="query"
          type="search"
          placeholder="Search by brand or color..."
          aria-label="Search products"
        />
        <div class="filter-row">
          <select v-model="orderProp" aria-label="Sort products">
            <option value="brand">Brand (A–Z)</option>
            <option value="-brand">Brand (Z–A)</option>
            <option value="numericPrice">Price: Low to High</option>
            <option value="-numericPrice">Price: High to Low</option>
            <option value="color">Color (A–Z)</option>
          </select>
        </div>
      </div>

      <div class="products">
        <div v-if="loading" class="state-msg">Loading products...</div>
        <div v-else-if="error" class="state-msg error-msg">{{ error }}</div>
        <template v-else>
          <div
            v-for="shoe in sortedProducts"
            :key="shoe.id"
            class="sneakers"
          >
            <div class="img-container">
              <div class="show">VIEW</div>
              <img
                :src="shoe.imageUrl"
                :alt="shoe.brand + ' — ' + shoe.color"
                class="product-image"
                loading="lazy"
              />
            </div>
            <p class="product-color">{{ shoe.color }}</p>
            <h2 class="product-brand">{{ shoe.brand }}</h2>
            <p class="product-color">{{ shoe.price }}</p>
            <router-link :to="'/collection/' + shoe.id">
              <button class="shop product-btn">SHOP</button>
            </router-link>
          </div>
          <div v-if="sortedProducts.length === 0" class="state-msg">
            No products match your search.
          </div>
        </template>
      </div>
    </div>
  `,
  setup() {
    const products = ref([]);
    const query = ref('');
    const orderProp = ref('brand');
    const loading = ref(true);
    const error = ref(null);

    onMounted(async () => {
      try {
        const res = await fetch('js/products/product-list.json');
        if (!res.ok) throw new Error('Network error');
        const data = await res.json();
        products.value = data.map(p => ({
          ...p,
          numericPrice: parseFloat(p.price.replace(/[^0-9.]/g, ''))
        }));
      } catch {
        error.value = 'Could not load products. Please refresh and try again.';
      } finally {
        loading.value = false;
      }
    });

    const filteredProducts = computed(() => {
      if (!query.value.trim()) return products.value;
      const q = query.value.toLowerCase();
      return products.value.filter(
        p => p.brand.toLowerCase().includes(q) || p.color.toLowerCase().includes(q)
      );
    });

    const sortedProducts = computed(() => {
      const desc = orderProp.value.startsWith('-');
      const key = desc ? orderProp.value.slice(1) : orderProp.value;
      return [...filteredProducts.value].sort((a, b) => {
        if (a[key] < b[key]) return desc ? 1 : -1;
        if (a[key] > b[key]) return desc ? -1 : 1;
        return 0;
      });
    });

    return { query, orderProp, loading, error, sortedProducts };
  }
});
