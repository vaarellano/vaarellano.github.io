import { defineComponent, ref, reactive, inject, onMounted, useRoute, useRouter } from '../deps.js';

const COUNTRIES = [
  ['AX','Åland Islands'],['AF','Afghanistan'],['AL','Albania'],['DZ','Algeria'],
  ['AD','Andorra'],['AO','Angola'],['AG','Antigua and Barbuda'],['AR','Argentina'],
  ['AM','Armenia'],['AU','Australia'],['AT','Austria'],['AZ','Azerbaijan'],
  ['BS','Bahamas'],['BH','Bahrain'],['BD','Bangladesh'],['BB','Barbados'],
  ['BY','Belarus'],['BE','Belgium'],['BZ','Belize'],['BO','Bolivia'],
  ['BA','Bosnia and Herzegovina'],['BW','Botswana'],['BR','Brazil'],['BN','Brunei'],
  ['BG','Bulgaria'],['KH','Cambodia'],['CM','Cameroon'],['CA','Canada'],
  ['CL','Chile'],['CN','China'],['CO','Colombia'],['CR','Costa Rica'],
  ['HR','Croatia'],['CU','Cuba'],['CY','Cyprus'],['CZ','Czech Republic'],
  ['DK','Denmark'],['DO','Dominican Republic'],['EC','Ecuador'],['EG','Egypt'],
  ['SV','El Salvador'],['EE','Estonia'],['ET','Ethiopia'],['FJ','Fiji'],
  ['FI','Finland'],['FR','France'],['DE','Germany'],['GH','Ghana'],
  ['GR','Greece'],['GT','Guatemala'],['HN','Honduras'],['HK','Hong Kong'],
  ['HU','Hungary'],['IS','Iceland'],['IN','India'],['ID','Indonesia'],
  ['IR','Iran'],['IQ','Iraq'],['IE','Republic of Ireland'],['IL','Israel'],
  ['IT','Italy'],['JM','Jamaica'],['JP','Japan'],['JO','Jordan'],
  ['KZ','Kazakhstan'],['KE','Kenya'],['KW','Kuwait'],['LV','Latvia'],
  ['LB','Lebanon'],['LT','Lithuania'],['LU','Luxembourg'],['MY','Malaysia'],
  ['MX','Mexico'],['MD','Moldova'],['MA','Morocco'],['NL','Netherlands'],
  ['NZ','New Zealand'],['NG','Nigeria'],['NO','Norway'],['PK','Pakistan'],
  ['PA','Panama'],['PY','Paraguay'],['PE','Peru'],['PH','Philippines'],
  ['PL','Poland'],['PT','Portugal'],['QA','Qatar'],['RO','Romania'],
  ['RU','Russia'],['SA','Saudi Arabia'],['RS','Serbia'],['SG','Singapore'],
  ['SK','Slovakia'],['SI','Slovenia'],['ZA','South Africa'],['KR','South Korea'],
  ['ES','Spain'],['LK','Sri Lanka'],['SE','Sweden'],['CH','Switzerland'],
  ['TW','Taiwan'],['TH','Thailand'],['TN','Tunisia'],['TR','Turkey'],
  ['UA','Ukraine'],['AE','United Arab Emirates'],['GB','United Kingdom'],
  ['US','United States'],['UY','Uruguay'],['UZ','Uzbekistan'],['VE','Venezuela'],
  ['VN','Vietnam'],['YE','Yemen'],['ZM','Zambia'],['ZW','Zimbabwe']
];

export default defineComponent({
  name: 'CartDetails',
  template: `
    <div id="checkout-page">
      <div class="checkout-banner"></div>

      <div class="product-overview">
        <h2>PRODUCT OVERVIEW</h2>
        <hr />
        <div v-if="loading" class="state-msg">Loading...</div>
        <div v-else-if="error" class="state-msg error-msg">{{ error }}</div>
        <div v-else-if="product" class="overview-container">
          <div class="overview-image">
            <img :src="product.imageUrl" :alt="product.brand" loading="lazy" />
          </div>
          <div class="overview-description">
            <h3>{{ product.brand }}</h3>
            <p>{{ product.price }}</p>
            <p>Authentic sneaker, new in box. Verified and ready to ship.</p>
          </div>
        </div>
      </div>

      <div class="checkout-form">
        <form @submit.prevent="placeOrder" novalidate>
          <div class="billing">
            <h2>BILLING INFORMATION</h2>
            <hr />
            <div>
              <label for="firstName">FIRST NAME <span class="req">*</span></label>
              <input type="text" id="firstName" v-model.trim="form.firstName" :class="{ invalid: errors.firstName }" autocomplete="given-name" />
              <span class="field-error" v-if="errors.firstName">{{ errors.firstName }}</span>
            </div>
            <div>
              <label for="lastName">LAST NAME <span class="req">*</span></label>
              <input type="text" id="lastName" v-model.trim="form.lastName" :class="{ invalid: errors.lastName }" autocomplete="family-name" />
              <span class="field-error" v-if="errors.lastName">{{ errors.lastName }}</span>
            </div>
            <div>
              <label for="email">E-MAIL <span class="req">*</span></label>
              <input type="email" id="email" v-model.trim="form.email" :class="{ invalid: errors.email }" autocomplete="email" />
              <span class="field-error" v-if="errors.email">{{ errors.email }}</span>
            </div>
            <div>
              <label for="country">COUNTRY</label>
              <select id="country" v-model="form.country" autocomplete="country">
                <option v-for="[code, name] in countries" :key="code" :value="code">{{ name }}</option>
              </select>
            </div>
            <div>
              <label for="zip">ZIP / POSTAL CODE <span class="req">*</span></label>
              <input type="text" id="zip" v-model.trim="form.zip" :class="{ invalid: errors.zip }" autocomplete="postal-code" />
              <span class="field-error" v-if="errors.zip">{{ errors.zip }}</span>
            </div>
          </div>

          <div class="address">
            <h3>ADDRESS</h3>
            <hr />
            <address>
              <div>
                <label for="houseNumber">HOUSE NUMBER</label>
                <input type="text" id="houseNumber" v-model.trim="form.houseNumber" autocomplete="address-line1" />
              </div>
              <div>
                <label for="aptNumber">APT NUMBER</label>
                <input type="text" id="aptNumber" v-model.trim="form.aptNumber" autocomplete="address-line2" />
              </div>
              <div>
                <label for="streetName">STREET NAME <span class="req">*</span></label>
                <input type="text" id="streetName" v-model.trim="form.streetName" :class="{ invalid: errors.streetName }" autocomplete="street-address" />
                <span class="field-error" v-if="errors.streetName">{{ errors.streetName }}</span>
              </div>
              <div>
                <label for="city">CITY <span class="req">*</span></label>
                <input type="text" id="city" v-model.trim="form.city" :class="{ invalid: errors.city }" autocomplete="address-level2" />
                <span class="field-error" v-if="errors.city">{{ errors.city }}</span>
              </div>
              <div>
                <label for="state">STATE / PROVINCE <span class="req">*</span></label>
                <input type="text" id="state" v-model.trim="form.state" :class="{ invalid: errors.state }" autocomplete="address-level1" />
                <span class="field-error" v-if="errors.state">{{ errors.state }}</span>
              </div>
              <div>
                <label for="telephone">TELEPHONE</label>
                <input type="tel" id="telephone" v-model.trim="form.telephone" autocomplete="tel" />
              </div>
            </address>
          </div>

          <div class="shipping">
            <h2>SHIPPING METHOD</h2>
            <hr />
            <div class="ups">
              <label for="ups">UPS — $15.00</label>
              <input type="radio" id="ups" name="shippingMethod" value="ups" v-model="form.shippingMethod" />
            </div>
            <div class="free">
              <label for="free">FREE (5–7 days)</label>
              <input type="radio" id="free" name="shippingMethod" value="free" v-model="form.shippingMethod" />
            </div>
          </div>

          <div class="payment">
            <h2>PAYMENT METHOD</h2>
            <hr />
            <div class="creditCard">
              <input type="radio" id="creditCard" name="paymentMethod" value="creditCard" v-model="form.paymentMethod" />
              <label for="creditCard">CREDIT CARD</label>
              <img src="images/creditcard.png" alt="Credit Card" />
            </div>
            <div class="payPal">
              <input type="radio" id="payPal" name="paymentMethod" value="payPal" v-model="form.paymentMethod" />
              <label for="payPal">PAYPAL</label>
              <img src="images/paypal.png" alt="PayPal" />
            </div>
            <div v-if="form.paymentMethod === 'creditCard'">
              <label for="cardNumber">CARD NUMBER <span class="req">*</span></label>
              <input
                type="text"
                id="cardNumber"
                v-model="form.cardNumber"
                :class="{ invalid: errors.cardNumber }"
                placeholder="1234 5678 9012 3456"
                maxlength="19"
                autocomplete="cc-number"
                @input="formatCard"
              />
              <span class="field-error" v-if="errors.cardNumber">{{ errors.cardNumber }}</span>
            </div>
            <div>
              <input type="submit" id="order" value="PLACE ORDER" />
            </div>
          </div>
        </form>
      </div>
    </div>
  `,
  setup() {
    const route = useRoute();
    const router = useRouter();
    const cart = inject('cart');
    const product = ref(null);
    const loading = ref(true);
    const error = ref(null);

    const form = reactive({
      firstName: '', lastName: '', email: '', country: 'US', zip: '',
      houseNumber: '', aptNumber: '', streetName: '', city: '', state: '', telephone: '',
      shippingMethod: 'free', paymentMethod: 'creditCard', cardNumber: ''
    });

    const errors = reactive({});

    onMounted(async () => {
      try {
        const res = await fetch(`js/products/product-${route.params.id}.json`);
        if (!res.ok) throw new Error('Not found');
        const data = await res.json();
        product.value = Array.isArray(data) ? data[0] : data;
        if (!cart.has(product.value.id)) cart.add(product.value);
      } catch {
        error.value = 'Could not load product details.';
      } finally {
        loading.value = false;
      }
    });

    function formatCard(e) {
      const digits = e.target.value.replace(/\D/g, '').slice(0, 16);
      form.cardNumber = digits.replace(/(.{4})/g, '$1 ').trim();
    }

    function validate() {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      Object.keys(errors).forEach(k => delete errors[k]);

      if (!form.firstName) errors.firstName = 'First name is required.';
      if (!form.lastName) errors.lastName = 'Last name is required.';
      if (!form.email || !emailRe.test(form.email)) errors.email = 'A valid email address is required.';
      if (!form.zip) errors.zip = 'ZIP / postal code is required.';
      if (!form.streetName) errors.streetName = 'Street name is required.';
      if (!form.city) errors.city = 'City is required.';
      if (!form.state) errors.state = 'State / province is required.';
      if (form.paymentMethod === 'creditCard') {
        const digits = form.cardNumber.replace(/\s/g, '');
        if (!digits || digits.length !== 16) errors.cardNumber = 'A valid 16-digit card number is required.';
      }

      return Object.keys(errors).length === 0;
    }

    function placeOrder() {
      if (validate()) {
        cart.clear();
        router.push('/ordercomplete');
      }
    }

    return { product, loading, error, form, errors, countries: COUNTRIES, formatCard, placeOrder };
  }
});
