<!-- File: index.vue -->
<template>
  <header class="site-header">
    <div class="container header-row">
      <div class="brand">
        <img src="/public/images/index/logo.png" alt="Glove Co. logo" class="logo" />
        <h1 class="site-name">Glove Co.</h1>
      </div>

      <nav class="main-nav">
        <button class="nav-btn">Shop</button>
        <button class="nav-btn">About</button>
        <button class="nav-btn">Contact</button>
      </nav>

      <div class="actions">
        <div class="trust">Free shipping over $50</div>
        <button class="cart-btn" @click="openCart">
          Cart ({{ cartCount }})
        </button>
      </div>
    </div>
  </header>

  <section class="hero">
    <div class="container hero-inner">
      <div class="hero-copy">
        <h2>Premium Gloves for Every Use</h2>
        <p>Durable, comfortable, and built for performance — from medical-grade nitrile to heavy-duty work gloves.</p>
        <div class="hero-ctas">
          <button class="primary" @click="scrollToProducts">Shop Gloves</button>
          <button class="secondary" @click="scrollToProducts">View Collections</button>
        </div>
      </div>
      <div class="hero-media">
        <img src="/public/images/index/gloves-hero.png" alt="Gloves hero image" />
      </div>
    </div>
  </section>

  <section class="features container">
    <div class="feature">Trusted by professionals</div>
    <div class="feature">Quality tested</div>
    <div class="feature">Worldwide shipping</div>
  </section>

  <section class="products container" ref="productsSection">
    <div class="products-header">
      <h2>Featured Gloves</h2>

      <div class="filters">
        <select v-model="filters.type">
          <option value="">All types</option>
          <option value="nitrile">Nitrile</option>
          <option value="latex">Latex</option>
          <option value="work">Work Gloves</option>
        </select>

        <select v-model="filters.size">
          <option value="">All sizes</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
        </select>

        <input v-model="search" placeholder="Search gloves..." />
      </div>
    </div>

    <div class="product-grid">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="product-card"
      >
        <img :src="product.image" :alt="product.name" class="product-image" />
        <div class="product-info">
          <h3 class="product-name">{{ product.name }}</h3>
          <p class="product-sub">{{ product.short }}</p>

          <div class="variants">
            <label v-for="(v, idx) in product.sizes" :key="v">
              <input
                type="radio"
                :name="'size-' + product.id"
                :value="v"
                v-model="selectedSizes[product.id]"
              />
              {{ v }}
            </label>
          </div>

          <p class="price">${{ product.price.toFixed(2) }}</p>

          <div class="product-actions">
            <button class="add" @click="addToCart(product)">Add to Cart</button>
            <button class="view" @click="openQuickView(product)">Quick View</button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Simple Cart Drawer -->
  <aside class="cart-drawer" :class="{ open: cartOpen }">
    <div class="cart-header">
      <h3>Your Cart</h3>
      <button @click="cartOpen = false">Close</button>
    </div>
    <div v-if="cart.length === 0" class="cart-empty">Your cart is empty</div>
    <ul class="cart-items">
      <li v-for="(item, i) in cart" :key="i">
        <span>{{ item.name }} ({{ item.size || '—' }})</span>
        <span>${{ item.price.toFixed(2) }}</span>
      </li>
    </ul>
    <div class="cart-footer" v-if="cart.length">
      <div class="total">Total: ${{ cartTotal.toFixed(2) }}</div>
      <button class="checkout">Checkout</button>
    </div>
  </aside>

  <!-- Quick View Modal -->
  <div class="modal" v-if="quickViewProduct">
    <div class="modal-inner">
      <button class="close" @click="quickViewProduct = null">×</button>
      <img :src="quickViewProduct.image" :alt="quickViewProduct.name" />
      <h3>{{ quickViewProduct.name }}</h3>
      <p>{{ quickViewProduct.full }}</p>
      <p class="price">${{ quickViewProduct.price.toFixed(2) }}</p>
      <button @click="addToCart(quickViewProduct)">Add to Cart</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'

const products = ref([
  {
    id: 1,
    name: 'Nitrile Exam Gloves (Powder-Free)',
    short: 'Medical-grade, tactile sensitivity.',
    full: 'Disposable nitrile gloves ideal for medical, laboratory, and food handling. Powder-free, latex-free.',
    price: 12.99,
    image: '/images/index/nitrile_blue.JPG',
    type: 'nitrile',
    sizes: ['S', 'M', 'L'],
  },
  {
    id: 2,
    name: 'Latex Surgical Gloves',
    short: 'Comfort fit and excellent dexterity.',
    full: 'High-quality latex gloves for medical and clinical use. Offers superior fit and feel.',
    price: 14.99,
    image: '/images/index/latex-white.png',
    type: 'latex',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 3,
    name: 'Heavy-Duty Work Gloves',
    short: 'Reinforced palms for tough jobs.',
    full: 'Durable work gloves with reinforced palms and breathable back for construction and outdoor work.',
    price: 24.99,
    image: '/images/index/work-brown.png',
    type: 'work',
    sizes: ['M', 'L', 'XL'],
  },
])

const filters = reactive({
  type: '',
  size: '',
})
const search = ref('')
const selectedSizes = reactive({}) // track per-product selected size
const cart = ref([])
const cartOpen = ref(false)
const quickViewProduct = ref(null)

const cartCount = computed(() => cart.value.length)
const cartTotal = computed(() => cart.value.reduce((s, i) => s + i.price, 0))

function addToCart(product) {
  const size = selectedSizes[product.id] || null
  cart.value.push({
    id: product.id,
    name: product.name,
    price: product.price,
    size,
  })
  alert(`${product.name} added to cart.`)
}

function openCart() {
  cartOpen.value = true
}

function openQuickView(product) {
  quickViewProduct.value = product
}

function scrollToProducts() {
  const el = productsSection.value
  if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth' })
}

const productsSection = ref(null)

const filteredProducts = computed(() => {
  return products.value.filter((p) => {
    if (filters.type && p.type !== filters.type) return false
    if (filters.size && (!p.sizes || !p.sizes.includes(filters.size))) return false
    if (search.value && !`${p.name} ${p.short} ${p.full}`.toLowerCase().includes(search.value.toLowerCase())) return false
    return true
  })
})
</script>

<style scoped>
:root {
  --primary: #1a73e8;
  --accent: #0b63c6;
  --muted: #6b7280;
  --container: 1100px;
}

.container {
  max-width: var(--container);
  margin: 0 auto;
  padding: 0 1rem;
}

/* Header */
.site-header {
  border-bottom: 1px solid #eee;
  background: #fff;
}
.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0;
}
.brand { display: flex; align-items: center; gap: 0.5rem; }
.logo { width: 42px; height: 42px; object-fit: contain; }
.site-name { font-size: 1.1rem; margin: 0; }
.main-nav .nav-btn { margin: 0 0.25rem; background: transparent; border: none; cursor: pointer; }
.actions { display: flex; gap: 1rem; align-items: center; }
.cart-btn { background: var(--primary); color: #fff; border: none; padding: 0.4rem 0.75rem; border-radius: 6px; cursor: pointer; }

/* Hero */
.hero { background: #f7fbff; padding: 2.5rem 0; }
.hero-inner { display: flex; gap: 2rem; align-items: center; }
.hero-copy { flex: 1; }
.hero-copy h2 { margin: 0 0 0.5rem; font-size: 1.8rem; }
.hero-copy p { color: var(--muted); margin-bottom: 1rem; }
.hero-ctas .primary, .primary { background: var(--primary); color: #fff; border: none; padding: 0.6rem 1rem; border-radius: 6px; cursor: pointer; }
.hero-ctas .secondary, .secondary { background: transparent; border: 1px solid var(--primary); color: var(--primary); padding: 0.6rem 1rem; border-radius: 6px; cursor: pointer; }
.hero-media img { width: 320px; border-radius: 8px; object-fit: cover; }

/* Features */
.features { display: flex; gap: 1rem; justify-content: center; padding: 1rem 0; color: var(--muted); }

/* Products */
.products { padding: 1.5rem 0; }
.products-header { display: flex; justify-content: space-between; align-items: center; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap; }
.filters { display: flex; gap: 0.5rem; align-items: center; }
.filters select, .filters input { padding: 0.4rem; border-radius: 6px; border: 1px solid #ddd; }

.product-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; }

.product-card { background: #fff; border: 1px solid #eee; border-radius: 8px; padding: 0.75rem; display: flex; gap: 0.75rem; align-items: flex-start; }
.product-image { width: 100px; height: 100px; object-fit: cover; border-radius: 6px; }
.product-info { flex: 1; }
.product-name { margin: 0; font-size: 1rem; }
.product-sub { color: var(--muted); font-size: 0.9rem; margin: 0.25rem 0; }
.variants label { margin-right: 0.5rem; font-size: 0.85rem; }
.price { font-weight: 700; margin-top: 0.5rem; }
.product-actions { display: flex; gap: 0.5rem; margin-top: 0.6rem; }
.add { background: var(--primary); color: #fff; border: none; padding: 0.4rem 0.6rem; border-radius: 6px; cursor: pointer; }
.view { background: transparent; border: 1px solid #ddd; padding: 0.4rem 0.6rem; border-radius: 6px; cursor: pointer; }

/* Cart Drawer */
.cart-drawer { position: fixed; right: -360px; top: 0; width: 320px; height: 100%; background: #fff; box-shadow: -8px 0 20px rgba(0,0,0,0.08); transition: right 0.25s ease; padding: 1rem; z-index: 60; }
.cart-drawer.open { right: 0; }
.cart-header { display: flex; justify-content: space-between; align-items: center; }
.cart-items { list-style: none; padding: 0; margin: 1rem 0; }
.cart-empty { color: var(--muted); }

/* Quick View Modal */
.modal { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; z-index:80; }
.modal-inner { background:#fff; padding:1rem; border-radius:8px; max-width:600px; width:90%; position:relative; }
.modal-inner img { width: 100%; height: 240px; object-fit:cover; border-radius:6px; }
.close { position:absolute; top:10px; right:10px; background:transparent; border:none; font-size:1.25rem; cursor:pointer; }

/* Responsive */
@media (max-width: 800px) {
  .hero-inner { flex-direction: column-reverse; text-align: center; }
  .hero-media img { width: 100%; max-width: 420px; }
  .product-card { align-items: center; flex-direction: column; }
}
</style>
