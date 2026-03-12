import { reactive } from './deps.js';

export const cart = reactive({
  items: JSON.parse(localStorage.getItem('rk-cart') || '[]'),

  get count() {
    return this.items.length;
  },

  add(product) {
    if (!this.has(product.id)) {
      this.items.push({ ...product });
      this._save();
    }
  },

  remove(productId) {
    const idx = this.items.findIndex(i => i.id === productId);
    if (idx > -1) {
      this.items.splice(idx, 1);
      this._save();
    }
  },

  has(productId) {
    return this.items.some(i => i.id === productId);
  },

  clear() {
    this.items.splice(0, this.items.length);
    this._save();
  },

  _save() {
    localStorage.setItem('rk-cart', JSON.stringify(this.items));
  }
});
