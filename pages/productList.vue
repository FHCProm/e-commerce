<template>
  <main class="product-list-page">
    <!-- Toolbar -->
    <section class="section-bar">
      <div class="container">
        <div class="toolbar reveal">
          <label class="search-wrap" aria-label="Search products">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M21 21L16.65 16.65M18 10.5A7.5 7.5 0 1 1 3 10.5A7.5 7.5 0 0 1 18 10.5Z"
                stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <input v-model="searchQuery" type="search"
              placeholder="Search gloves, materials, or use cases..." />
          </label>

          <div class="toolbar-actions">
            <button class="filter-btn" type="button">Filter by fit</button>
            <select v-model="sortBy" class="select" aria-label="Sort products">
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Best Rated</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>
      </div>
    </section>

    <!-- Catalog -->
    <section class="catalog">
      <div class="container catalog-grid">
        <aside class="sidebar reveal" aria-label="Product filters">
          <!-- filters unchanged -->
        </aside>

        <div class="results">
          <!-- Header -->
          <div class="results-head reveal">
            <div>
              <h2>Product Listing</h2>
              <p>
                Showing {{ filteredProducts.length }} premium glove models tailored for grip, safety, and all-day wear.
              </p>
            </div>
            <p><strong>{{ filteredProducts.length }}</strong> matching products</p>
          </div>

          <!-- Loading / error states -->
          <div v-if="loading">Loading products...</div>
          <div v-else-if="loadError">Error: {{ loadError }}</div>

          <!-- Product list -->
          <div v-else class="product-list">
        <article v-for="product in filteredProducts" :key="product.id" class="product-item reveal">
        <div class="product-visual">
          <img :src="product.image" :alt="product.name" class="product-img" />
        </div>

        <div class="product-body">
          <div class="product-copy">
            <h3>{{ product.name }}</h3>
            <p>{{ product.description }}</p>
            <div class="specs">
              <span>Category: {{ product.category }}</span>
              <span>Size: {{ product.size }}</span>
              <span v-if="product.stock > 0">Stock: {{ product.stock }}</span>
              <span v-else class="out-of-stock">Out of Stock</span>
            </div>
          </div>

          <div class="purchase">
            <div class="price">
              <strong>${{ product.price }}</strong>
            </div>
            <div class="buy-row">
              <button class="btn btn-ghost" type="button">Details</button>
              <button class="btn btn-primary" type="button"
                      @click="handleAddToCart(product)"
                      :disabled="product.stock === 0">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </article>


          </div>

          <!-- Pagination -->
          <nav class="pagination reveal" aria-label="Pagination">
            <button class="page-dot active" type="button">1</button>
            <button class="page-dot" type="button">2</button>
            <button class="page-dot" type="button">3</button>
            <button class="page-dot" type="button">→</button>
          </nav>
        </div>
      </div>
    </section>
  </main>

  

</template>


<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCart } from '~/composables/useCart'

const { addToCart } = useCart()

const searchQuery = ref('')
const sortBy = ref('featured')
const products = ref([])
const loading = ref(false)
const loadError = ref(null)

async function fetchProducts() {
  loading.value = true
  try {
    const res = await fetch('/api/product')
    if (!res.ok) throw new Error('Failed to fetch products')
    const data = await res.json()

    // Normalize Prisma response into the shape your template expects
    products.value = (data?.data || []).map(p => ({
      id: p.id,
      name: p.title,
      description: p.short || p.full,
      image: p.image,
      category: p.category?.name || '',
      size: p.size,
      stock: p.inventory?.quantity ?? 0,
      price: p.price,
      featuredOrder: p.id
    }))

    console.log("Products after mapping:", products.value)
  } catch (err) {
    loadError.value = err.message
    products.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchProducts)

const filteredProducts = computed(() => {
  let result = [...products.value]
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    result = result.filter(p =>
      (p.name || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q)
    )
  }
  switch (sortBy.value) {
    case 'price-asc': result.sort((a, b) => a.price - b.price); break
    case 'price-desc': result.sort((a, b) => b.price - a.price); break
    case 'rating': result.sort((a, b) => b.rating - a.rating); break
    case 'name': result.sort((a, b) => (a.name || '').localeCompare(b.name || '')); break
    default: result.sort((a, b) => a.featuredOrder - b.featuredOrder)
  }
  return result
})

watch(filteredProducts, (val) => {
  console.log("Filtered products:", val)
})

function handleAddToCart(product) {
  addToCart({
    id: product.id,
    name: product.name,
    price: product.price,
    size: product.size || 'Default',
    quantity: 1,
  })
}
</script>






<style scoped>
/* Toolbar */
.section-bar {
  background: #f8f8f8;
  padding: 1rem 0;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-wrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.search-wrap input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

/* Catalog grid */
.catalog-grid {
  display: grid;
  grid-template-columns: 250px 1fr; /* sidebar + results */
  gap: 2rem;
  margin-top: 2rem;
}

/* Sidebar */
.sidebar {
  border-right: 1px solid #eee;
  padding-right: 1rem;
}

/* Results */
.results-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

/* Product list grid */
.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
}

/* Product card */
.product-item {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
}

.product-visual {
  margin-bottom: 1rem;
}

.product-img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 6px;
}

/* Product body */
.product-copy h3 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.product-copy p {
  font-size: 0.9rem;
  color: #555;
}

.specs span {
  display: block;
  font-size: 0.85rem;
  color: #666;
}

/* Purchase section */
.purchase {
  margin-top: 1rem;
}

.price {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.buy-row {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary {
  background: #007bff;
  color: #fff;
  border: none;
}

.btn-ghost {
  background: transparent;
  border: 1px solid #007bff;
  color: #007bff;
}

/* Pagination */
.pagination {
  margin-top: 2rem;
  display: flex;
  gap: 0.5rem;
}

.page-dot {
  padding: 0.5rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 50%;
  background: #fff;
  cursor: pointer;
}

.page-dot.active {
  background: #007bff;
  color: #fff;
  border-color: #007bff;
}
</style>



<style>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Manrope:wght@400;500;600;700;800&display=swap');

:root {
  --primary: #1a73e8;
  --accent: #0b63c6;
  --muted: #6b7280;
  --container: 1100px;

  --bg: #f6f8fc;
  --surface: rgba(255, 255, 255, 0.72);
  --surface-strong: #ffffff;
  --text: #0f172a;
  --text-soft: #475569;
  --line: rgba(15, 23, 42, 0.08);
  --line-strong: rgba(15, 23, 42, 0.14);
  --success: #0f9d58;
  --warning: #f59e0b;
  --shadow: 0 10px 30px rgba(11, 25, 55, 0.08);
  --shadow-hover: 0 18px 50px rgba(11, 25, 55, 0.14);
  --radius: 22px;
  --radius-sm: 14px;
  --radius-xs: 10px;
  --max-width: calc(var(--container) + 48px);
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
}

.product-list-page {
  margin: 0;
  font-family: "Manrope", sans-serif;
  color: var(--text);
  background:
    radial-gradient(circle at top left, rgba(26, 115, 232, 0.14), transparent 30%),
    radial-gradient(circle at 90% 20%, rgba(11, 99, 198, 0.12), transparent 24%),
    linear-gradient(180deg, #f8fbff 0%, #f4f7fb 50%, #eef3f9 100%);
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
}

.product-img {
  width: 150px;
  height: auto;
  display: block;
}

.product-list-page::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(rgba(255,255,255,0.22), rgba(255,255,255,0.22)),
    linear-gradient(90deg, rgba(15,23,42,0.03) 1px, transparent 1px),
    linear-gradient(rgba(15,23,42,0.03) 1px, transparent 1px);
  background-size: auto, 26px 26px, 26px 26px;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.8), transparent 90%);
  z-index: 0;
}

.product-list-page > * {
  position: relative;
  z-index: 1;
}

a {
  color: inherit;
  text-decoration: none;
}

button,
input,
select {
  font: inherit;
}

.container {
  width: min(100%, calc(var(--container) + 48px));
  margin: 0 auto;
  padding: 0 24px;
}

.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(18px);
  background: rgba(246, 248, 252, 0.78);
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  min-height: 78px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  font-family: "Space Grotesk", sans-serif;
  font-weight: 700;
  letter-spacing: -0.03em;
}

.brand-mark {
  width: 42px;
  height: 42px;
  border-radius: 13px;
  position: relative;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.35),
    0 10px 25px rgba(26, 115, 232, 0.28);
  overflow: hidden;
}

.brand-mark::before,
.brand-mark::after {
  content: "";
  position: absolute;
  border-radius: 999px;
  background: rgba(255,255,255,0.9);
}

.brand-mark::before {
  width: 10px;
  height: 22px;
  left: 10px;
  top: 10px;
  transform: rotate(18deg);
  box-shadow: 8px -2px 0 rgba(255,255,255,0.88), 16px -1px 0 rgba(255,255,255,0.78);
}

.brand-mark::after {
  width: 14px;
  height: 10px;
  right: 6px;
  bottom: 7px;
  transform: rotate(-14deg);
  opacity: 0.9;
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.brand-text strong {
  font-size: 1.02rem;
}

.brand-text span {
  font-size: 0.76rem;
  color: var(--muted);
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-top: 4px;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-chip,
.icon-button {
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.66);
  backdrop-filter: blur(12px);
  color: var(--text);
  border-radius: 999px;
  transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
}

.nav-chip {
  padding: 10px 16px;
  font-weight: 700;
  font-size: 0.92rem;
}

.nav-chip:hover,
.icon-button:hover {
  transform: translateY(-2px);
  border-color: rgba(26, 115, 232, 0.28);
  box-shadow: 0 10px 20px rgba(26, 115, 232, 0.12);
  background: rgba(255, 255, 255, 0.96);
}

.icon-button {
  width: 44px;
  height: 44px;
  display: inline-grid;
  place-items: center;
  cursor: pointer;
}

.hero {
  padding: 40px 0 20px;
}

.hero-shell {
  display: grid;
  grid-template-columns: 1.25fr 0.75fr;
  gap: 22px;
  align-items: stretch;
}

.hero-main,
.hero-side {
  border: 1px solid var(--line);
  border-radius: 28px;
  overflow: hidden;
  position: relative;
  background: var(--surface);
  backdrop-filter: blur(18px);
  box-shadow: var(--shadow);
}

.hero-main {
  padding: clamp(28px, 5vw, 52px);
  min-height: 370px;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background:
    radial-gradient(circle at 85% 20%, rgba(26, 115, 232, 0.18), transparent 26%),
    linear-gradient(145deg, rgba(255,255,255,0.86), rgba(245,248,255,0.7));
}

.hero-main::before {
  content: "";
  position: absolute;
  right: -80px;
  top: 50%;
  width: 360px;
  height: 360px;
  border-radius: 34% 66% 63% 37% / 43% 37% 63% 57%;
  transform: translateY(-50%) rotate(-14deg);
  background: linear-gradient(145deg, rgba(26, 115, 232, 0.16), rgba(11, 99, 198, 0.22));
  filter: blur(2px);
  z-index: -1;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  padding: 8px 12px;
  border-radius: 999px;
  color: var(--accent);
  background: rgba(26, 115, 232, 0.08);
  border: 1px solid rgba(26, 115, 232, 0.12);
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hero h1 {
  margin: 16px 0 14px;
  font-family: "Space Grotesk", sans-serif;
  font-size: clamp(2.5rem, 5vw, 5rem);
  line-height: 0.95;
  letter-spacing: -0.05em;
  max-width: 10ch;
}

.hero-copy {
  max-width: 58ch;
  color: var(--text-soft);
  font-size: clamp(1rem, 1.6vw, 1.08rem);
  line-height: 1.7;
}

.hero-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 26px;
}

.metric {
  padding: 12px 14px;
  border-radius: 14px;
  background: rgba(255,255,255,0.72);
  border: 1px solid rgba(15,23,42,0.08);
  min-width: 132px;
}

.metric strong {
  display: block;
  font-family: "Space Grotesk", sans-serif;
  font-size: 1.15rem;
  margin-bottom: 2px;
}

.metric span {
  color: var(--muted);
  font-size: 0.88rem;
}

.hero-side {
  padding: 22px;
  display: grid;
  gap: 16px;
  background: linear-gradient(180deg, rgba(255,255,255,0.86), rgba(247,250,255,0.88));
}

.mini-panel {
  border-radius: 18px;
  border: 1px solid var(--line);
  background: rgba(255,255,255,0.75);
  padding: 18px;
  position: relative;
  overflow: hidden;
}

.mini-panel h3 {
  margin: 0 0 10px;
  font-family: "Space Grotesk", sans-serif;
  font-size: 1.05rem;
  letter-spacing: -0.03em;
}

.mini-panel p {
  margin: 0;
  color: var(--text-soft);
  line-height: 1.65;
  font-size: 0.95rem;
}

.glove-art {
  min-height: 168px;
  display: grid;
  place-items: center;
  background:
    radial-gradient(circle at 30% 30%, rgba(26, 115, 232, 0.16), transparent 28%),
    linear-gradient(135deg, #f8fbff, #eef4ff);
}

.glove-illustration {
  width: 180px;
  height: 140px;
  position: relative;
  transform: rotate(-10deg);
  filter: drop-shadow(0 12px 18px rgba(11, 99, 198, 0.14));
}

.glove-illustration .palm,
.glove-illustration .thumb,
.glove-illustration .finger {
  position: absolute;
  background: linear-gradient(180deg, #2d89ff, #0d5fbd);
  border-radius: 28px;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.28);
}

.glove-illustration .palm {
  width: 92px;
  height: 88px;
  left: 48px;
  top: 38px;
  border-radius: 32px 32px 36px 36px;
}

.glove-illustration .thumb {
  width: 36px;
  height: 68px;
  left: 18px;
  top: 58px;
  transform: rotate(-30deg);
  border-radius: 22px;
}

.glove-illustration .finger {
  width: 22px;
  top: 6px;
  border-radius: 18px 18px 12px 12px;
}

.glove-illustration .f1 { left: 50px; height: 52px; }
.glove-illustration .f2 { left: 75px; height: 62px; }
.glove-illustration .f3 { left: 100px; height: 58px; }
.glove-illustration .f4 { left: 125px; height: 48px; }

.hero-note {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.hero-note .tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--success);
  font-weight: 800;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.hero-note .tag::before {
  content: "";
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--success);
  box-shadow: 0 0 0 6px rgba(15, 157, 88, 0.12);
}

.section-bar {
  padding: 18px 0 6px;
}

.toolbar {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 18px;
  align-items: center;
  padding: 18px;
  border: 1px solid var(--line);
  border-radius: 24px;
  background: rgba(255,255,255,0.68);
  backdrop-filter: blur(16px);
  box-shadow: var(--shadow);
}

.search-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  padding: 12px 14px;
  border-radius: 16px;
  background: rgba(248, 250, 255, 0.95);
  border: 1px solid rgba(15,23,42,0.08);
}

.search-wrap svg {
  flex: 0 0 auto;
  color: var(--muted);
}

.search-wrap input {
  width: 100%;
  border: 0;
  outline: none;
  background: transparent;
  color: var(--text);
}

.toolbar-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 10px;
}

.select,
.filter-btn {
  border-radius: 14px;
  border: 1px solid var(--line);
  background: rgba(255,255,255,0.95);
  color: var(--text);
  padding: 12px 14px;
  font-weight: 700;
  transition: 0.25s ease;
}

.select:focus,
.filter-btn:hover {
  outline: none;
  border-color: rgba(26, 115, 232, 0.35);
  box-shadow: 0 0 0 4px rgba(26, 115, 232, 0.1);
}

.catalog {
  padding: 18px 0 90px;
}

.catalog-grid {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 22px;
  align-items: start;
}

.sidebar {
  position: sticky;
  top: 98px;
  border: 1px solid var(--line);
  border-radius: 24px;
  padding: 22px;
  background: rgba(255,255,255,0.72);
  backdrop-filter: blur(16px);
  box-shadow: var(--shadow);
}

.sidebar h2,
.results-head h2 {
  margin: 0;
  font-family: "Space Grotesk", sans-serif;
  font-size: 1.25rem;
  letter-spacing: -0.04em;
}

.filter-group + .filter-group {
  margin-top: 22px;
  padding-top: 22px;
  border-top: 1px solid rgba(15,23,42,0.07);
}

.filter-group h3 {
  margin: 0 0 14px;
  font-size: 0.94rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
}

.filter-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 0;
  color: var(--text-soft);
  font-weight: 600;
}

.filter-option input {
  accent-color: var(--primary);
  width: 16px;
  height: 16px;
}

.option-left {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}

.swatch {
  width: 14px;
  height: 14px;
  border-radius: 999px;
  border: 1px solid rgba(15,23,42,0.08);
}

.range-row {
  display: flex;
  justify-content: space-between;
  color: var(--muted);
  font-size: 0.88rem;
  margin-bottom: 10px;
}

input[type="range"] {
  width: 100%;
  accent-color: var(--primary);
}

.results {
  display: grid;
  gap: 18px;
}

.results-head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
  padding: 4px 2px 12px;
}

.results-head p {
  margin: 8px 0 0;
  color: var(--text-soft);
}

.product-list {
  display: grid;
  gap: 16px;
}

.product-item {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 0;
  border: 1px solid var(--line);
  border-radius: 26px;
  overflow: hidden;
  background: rgba(255,255,255,0.76);
  backdrop-filter: blur(16px);
  box-shadow: var(--shadow);
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

.product-item:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
  border-color: rgba(26, 115, 232, 0.2);
}

.product-visual {
  position: relative;
  min-height: 230px;
  display: grid;
  place-items: center;
  padding: 20px;
  overflow: hidden;
  isolation: isolate;
}

.product-visual::before {
  content: "";
  position: absolute;
  inset: 16px;
  border-radius: 24px;
  background: radial-gradient(circle at top, rgba(255,255,255,0.7), rgba(255,255,255,0.12));
  border: 1px solid rgba(255,255,255,0.4);
  z-index: -1;
}

.product-visual.blue {
  background: linear-gradient(135deg, #dbeafe, #eff6ff);
}

.product-visual.black {
  background: linear-gradient(135deg, #dfe4ea, #f8fafc);
}

.product-visual.red {
  background: linear-gradient(135deg, #fee2e2, #fff1f2);
}

.product-visual.sand {
  background: linear-gradient(135deg, #f6efe2, #fffaf0);
}

.product-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 2;
  padding: 8px 10px;
  border-radius: 999px;
  background: rgba(255,255,255,0.86);
  border: 1px solid rgba(15,23,42,0.08);
  font-weight: 800;
  font-size: 0.76rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.product-body {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 22px;
  padding: 24px;
  align-items: start;
}

.product-copy h3 {
  margin: 0;
  font-family: "Space Grotesk", sans-serif;
  font-size: clamp(1.2rem, 2vw, 1.5rem);
  letter-spacing: -0.04em;
}

.product-copy p {
  margin: 10px 0 16px;
  color: var(--text-soft);
  line-height: 1.72;
  max-width: 58ch;
}

.specs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.specs span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 12px;
  border-radius: 999px;
  background: rgba(26, 115, 232, 0.07);
  color: var(--accent);
  border: 1px solid rgba(26, 115, 232, 0.1);
  font-size: 0.85rem;
  font-weight: 800;
}

.purchase {
  min-width: 170px;
  display: grid;
  justify-items: end;
  gap: 12px;
}

.price {
  text-align: right;
}

.price strong {
  display: block;
  font-family: "Space Grotesk", sans-serif;
  font-size: 1.9rem;
  letter-spacing: -0.05em;
  line-height: 1;
}

.price span {
  color: var(--muted);
  font-size: 0.88rem;
  font-weight: 700;
}

.rating {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--text-soft);
  font-size: 0.9rem;
  font-weight: 700;
}

.stars {
  color: #f59e0b;
  letter-spacing: 0.08em;
  font-size: 0.95rem;
}

.buy-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.btn {
  border: 0;
  cursor: pointer;
  border-radius: 14px;
  font-weight: 800;
  transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease, color 0.25s ease;
}

.btn:active {
  transform: translateY(1px) scale(0.98);
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary), var(--accent));
  color: white;
  padding: 13px 16px;
  box-shadow: 0 14px 24px rgba(26, 115, 232, 0.24);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 34px rgba(26, 115, 232, 0.32);
}

.btn-ghost {
  background: rgba(255,255,255,0.92);
  color: var(--text);
  border: 1px solid var(--line);
  padding: 13px 14px;
}

.btn-ghost:hover {
  transform: translateY(-2px);
  background: white;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 10px;
  padding-top: 8px;
}

.page-dot {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
  background: rgba(255,255,255,0.85);
  color: var(--text);
  font-weight: 800;
  transition: 0.25s ease;
  cursor: pointer;
}

.page-dot.active,
.page-dot:hover {
  background: linear-gradient(135deg, var(--primary), var(--accent));
  color: white;
  border-color: transparent;
  transform: translateY(-2px);
  box-shadow: 0 12px 22px rgba(26, 115, 232, 0.24);
}

.site-footer {
  padding: 26px 0 40px;
  color: var(--muted);
  font-size: 0.92rem;
}

.footer-line {
  border-top: 1px solid rgba(15,23,42,0.08);
  padding-top: 18px;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.glove-shape {
  width: 132px;
  height: 168px;
  position: relative;
  transform: rotate(-10deg);
  filter: drop-shadow(0 16px 24px rgba(15, 23, 42, 0.16));
}

.glove-shape .palm,
.glove-shape .thumb,
.glove-shape .finger {
  position: absolute;
  border-radius: 24px;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -8px 18px rgba(0,0,0,0.08);
}

.glove-shape .palm {
  left: 34px;
  top: 54px;
  width: 68px;
  height: 84px;
  border-radius: 28px 28px 30px 30px;
}

.glove-shape .thumb {
  left: 6px;
  top: 76px;
  width: 28px;
  height: 60px;
  transform: rotate(-28deg);
  border-radius: 18px;
}

.glove-shape .finger {
  top: 10px;
  width: 16px;
  border-radius: 16px 16px 10px 10px;
}

.glove-shape .f1 { left: 36px; height: 50px; }
.glove-shape .f2 { left: 54px; height: 64px; }
.glove-shape .f3 { left: 72px; height: 60px; }
.glove-shape .f4 { left: 90px; height: 46px; }

.glove-shape.blue .palm,
.glove-shape.blue .thumb,
.glove-shape.blue .finger {
  background: linear-gradient(180deg, #2f8eff, #0b63c6);
}

.glove-shape.black .palm,
.glove-shape.black .thumb,
.glove-shape.black .finger {
  background: linear-gradient(180deg, #394150, #111827);
}

.glove-shape.red .palm,
.glove-shape.red .thumb,
.glove-shape.red .finger {
  background: linear-gradient(180deg, #ef4444, #b91c1c);
}

.glove-shape.sand .palm,
.glove-shape.sand .thumb,
.glove-shape.sand .finger {
  background: linear-gradient(180deg, #d6b98b, #9a6b33);
}

@keyframes staggerUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.intro-animate > * {
  opacity: 0;
  animation: staggerUp 0.8s ease forwards;
}

.intro-animate > *:nth-child(1) { animation-delay: 0.05s; }
.intro-animate > *:nth-child(2) { animation-delay: 0.14s; }
.intro-animate > *:nth-child(3) { animation-delay: 0.23s; }
.intro-animate > *:nth-child(4) { animation-delay: 0.32s; }
.intro-animate > *:nth-child(5) { animation-delay: 0.41s; }

@media (max-width: 1024px) {
  .hero-shell,
  .catalog-grid,
  .product-item,
  .product-body {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: static;
  }

  .purchase {
    justify-items: start;
    min-width: 0;
  }

  .price {
    text-align: left;
  }

  .buy-row {
    justify-content: flex-start;
  }
}

@media (max-width: 720px) {
  .nav {
    min-height: 72px;
  }

  .nav-chip {
    display: none;
  }

  .toolbar {
    grid-template-columns: 1fr;
  }

  .toolbar-actions {
    justify-content: stretch;
  }

  .toolbar-actions > * {
    flex: 1 1 100%;
  }

  .product-visual {
    min-height: 200px;
  }

  .results-head {
    align-items: start;
    flex-direction: column;
  }

  .footer-line {
    flex-direction: column;
  }
}
</style>
