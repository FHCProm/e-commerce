<template>
  <section class="hero">
    <div class="container hero-inner">
      <!-- Slides track -->
      <div
        class="slides-track"
        :style="trackStyle"
        ref="track"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
        @pointerdown="onPointerDown"
      >
        <div
          class="slide"
          v-for="(slide, index) in slides"
          :key="index"
          :aria-hidden="index !== currentIndex"
        >
          <div class="slide-inner" :aria-label="slide.title">
            <div class="hero-copy">
              <h2>{{ slide.title }}</h2>
              <p>{{ slide.subtitle }}</p>
              <div class="hero-ctas">
                <button class="primary" @click="onPrimaryCta(slide)">
                  {{ slide.primaryCta }}
                </button>
                <button class="secondary" @click="onSecondaryCta(slide)">
                  {{ slide.secondaryCta }}
                </button>
              </div>

              <ul class="hero-benefits" aria-hidden="true">
                <li>Medical-grade</li>
                <li>Latex-free options</li>
                <li>Fast shipping</li>
              </ul>
            </div>

            <div class="hero-media" role="img" :aria-label="slide.title">
              <img :src="slide.image" :alt="slide.title" />
            </div>
          </div>
        </div>
      </div>

      <!-- Controls -->
      <button
        class="carousel-nav prev"
        @click="prevSlide"
        aria-label="Previous slide"
      >
        ‹
      </button>
      <button
        class="carousel-nav next"
        @click="nextSlide"
        aria-label="Next slide"
      >
        ›
      </button>

      <div class="carousel-dots" role="tablist" aria-label="Carousel slides">
        <button
          v-for="(_, i) in slides"
          :key="i"
          :class="{ active: i === currentIndex }"
          @click="goToSlide(i)"
          :aria-selected="i === currentIndex"
          role="tab"
          :aria-label="'Go to slide ' + (i + 1)"
        ></button>
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
      <!-- Category filter -->
      <select v-model="filters.type">
        <option value="">All types</option>
        <option
          v-for="c in uniqueCategories"
          :key="c"
          :value="c"
        >
          {{ c.charAt(0).toUpperCase() + c.slice(1) }}
        </option>
      </select>

      <!-- Size filter -->
      <select v-model="filters.size">
        <option value="">All sizes</option>
        <option
          v-for="s in uniqueSizes"
          :key="s"
          :value="s"
        >
          {{ s }}
        </option>
      </select>

      <input v-model="search" placeholder="Search gloves..." />
    </div>
  </div>

  <div class="product-grid">
    <div
      v-for="product in filteredUniqueProducts"
      :key="product.id"
      class="product-card"
    >
      <img :src="product.image" :alt="product.name" class="product-image" />
      <div class="product-info">
        <h3 class="product-name">{{ product.name }}</h3>
        <p class="product-sub">{{ product.short }}</p>
        <p class="price">${{ product.price.toFixed(2) }}</p>
        <div class="product-actions">
          <button class="view" @click="openQuickView(product)">
            Quick View
          </button>
        </div>
      </div>
    </div>
  </div>
</section>



  <!-- Cart & Modal (unchanged) -->
  <aside class="cart-drawer" :class="{ open: cartOpen }">
    <div class="cart-header">
      <h3>Your Cart</h3>
      <button @click="cartOpen = false">Close</button>
    </div>
    <div v-if="cart.length === 0" class="cart-empty">Your cart is empty</div>
    <ul class="cart-items">
      <li v-for="(item, i) in cart" :key="i">
        <span>{{ item.name }} ({{ item.size || "—" }})</span>
        <span>${{ item.price.toFixed(2) }}</span>
      </li>
    </ul>
    <div class="cart-footer" v-if="cart.length">
      <div class="total">Total: ${{ cartTotal.toFixed(2) }}</div>
      <button class="checkout">Checkout</button>
    </div>
  </aside>

  <div class="modal" v-if="quickViewProduct">
    <div class="modal-inner">
      <button class="close" @click="quickViewProduct = null">×</button>
      <img :src="quickViewProduct.image" :alt="quickViewProduct.name" />
      <h3>{{ quickViewProduct.name }}</h3>
      <p>{{ quickViewProduct.full }}</p>
      <p class="price">${{ quickViewProduct.price.toFixed(2) }}</p>

      <!-- Size selection -->
      <div class="size-selection">
        <label>Select Size:</label>
        <div class="sizes">
          <button
            v-for="size in availableSizes"
            :key="size"
            :class="['size-btn', { selected: selectedSize === size }]"
            @click="selectedSize = size"
            type="button"
          >
            {{ size }}
          </button>
        </div>
      </div>

      <!-- Quantity selection below size -->
      <div class="quantity-selection" style="margin-top: 15px">
        <label for="quantity">Quantity:</label>
        <input
          id="quantity"
          type="number"
          min="1"
          v-model.number="selectedQuantity"
          style="width: 60px; margin-left: 5px"
        />
      </div>

      <!-- Add to Cart button disabled if no size selected -->
      <button
        :disabled="!selectedSize"
        @click="addToCartWithSize"
        class="add-to-cart-btn"
      >
        Add to Cart
      </button>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from "vue";

export default {
  name: "IndexPage",
  setup() {
    // --- Carousel ---
    const slides = ref([
      { title: "Comfortable Nitrile Gloves", subtitle: "Powder-free, medical-grade", primaryCta: "Shop Nitrile", secondaryCta: "Learn more", image: "/images/index/nitrile_blue.JPG" },
      { title: "Latex Surgical Gloves", subtitle: "Excellent dexterity", primaryCta: "Shop Latex", secondaryCta: "Learn more", image: "/images/index/latex-white.png" },
      { title: "Heavy-Duty Work Gloves", subtitle: "Reinforced palms", primaryCta: "Shop Work Gloves", secondaryCta: "Learn more", image: "/images/index/work-brown.png" },
    ])
    const currentIndex = ref(0)
    const track = ref(null)
    const trackStyle = computed(() => ({ transform: `translateX(-${currentIndex.value * 100}%)` }))
    function prevSlide() { currentIndex.value = (currentIndex.value - 1 + slides.value.length) % slides.value.length }
    function nextSlide() { currentIndex.value = (currentIndex.value + 1) % slides.value.length }
    function goToSlide(i) { currentIndex.value = i }

    // --- Products from API ---
    const rawProducts = ref([])
    const products = ref([])
    const loading = ref(false)
    const loadError = ref(null)

    async function fetchProducts() {
      loading.value = true
      loadError.value = null
      try {
        const res = await fetch("/api/product")
        if (!res.ok) throw new Error("Failed to fetch products")
        const data = await res.json()
        let items = Array.isArray(data) ? data : (data?.data || data?.products || [])
        rawProducts.value = items

        products.value = items.map((p) => {
          // normalize category/type names
          let type = ""
          if (p.category?.name) {
            type = p.category.name.toLowerCase().replace(/\s+gloves?$/, "")
          } else if (p.type) {
            type = p.type.toLowerCase().replace(/\s+gloves?$/, "")
          }
          return {
            id: p.id,
            name: p.title || p.name || "Untitled",
            short: p.short || p.subtitle || "",
            full: p.full || "",
            price: Number(p.price) || 0,
            image: p.image || "/images/placeholder.png",
            type,
            size: p.size || null,
            sizes: p.size ? [p.size] : Array.isArray(p.sizes) ? p.sizes : [],
            inventory: p.inventory ? Number(p.inventory.quantity || 0) : 0,
            raw: p,
          }
        })
      } catch (err) {
        loadError.value = err.message || String(err)
        products.value = []
        rawProducts.value = []
      } finally {
        loading.value = false
      }
    }

    onMounted(fetchProducts)

    // --- Filters & search ---
    const filters = reactive({ type: "", size: "" })
    const search = ref("")

    // Build dynamic filter options from products
    const uniqueCategories = computed(() => {
      const set = new Set()
      for (const p of products.value) {
        if (p.type) {
        console.log("from unique",p.type)
        set.add(p.type.toLowerCase())
        }
      }
      return Array.from(set)
    })



    const uniqueSizes = computed(() => {
      const set = new Set()
      for (const p of products.value) {
        if (Array.isArray(p.sizes)) {
          p.sizes.forEach(s => set.add(s))
        } else if (p.size) {
          set.add(p.size)
        }
      }
      return Array.from(set)
    })

    const filteredProducts = computed(() => {
      const q = search.value.trim().toLowerCase()
      return products.value.filter((p) => {
        if (filters.type) {
          if (!p.type || p.type.toLowerCase() !== filters.type.toLowerCase()) return false
        }
        if (filters.size) {
          const s = filters.size
          const hasSize = p.size === s || (Array.isArray(p.sizes) && p.sizes.includes(s))
          if (!hasSize) return false
        }
        if (q) {
          const hay = `${p.name} ${p.short} ${p.full} ${p.type}`.toLowerCase()
          if (!hay.includes(q)) return false
        }
        return true
      })
    })

    const filteredUniqueProducts = computed(() => {
      const map = new Map()
      for (const p of filteredProducts.value) {
        if (!map.has(p.name)) map.set(p.name, p)
      }
      return Array.from(map.values())
    })

    // --- Quick View & Cart ---
    const quickViewProduct = ref(null)
    const selectedSize = ref(null)
    const selectedQuantity = ref(1)
    function getAvailableSizesFor(product) {
      if (!product) return []
      const variants = products.value.filter((p) => p.name === product.name && p.type === product.type && p.size)
      return Array.from(new Set(variants.map((v) => v.size).filter(Boolean)))
    }
    function openQuickView(product) {
      quickViewProduct.value = product
      selectedSize.value = null
      selectedQuantity.value = 1
    }
    function addToCartWithSize() {
      if (!quickViewProduct.value || !selectedSize.value) return
      const variant = products.value.find((p) =>
        p.name === quickViewProduct.value.name &&
        p.type === quickViewProduct.value.type &&
        p.size === selectedSize.value
      )
      cart.value.push({
        id: variant ? variant.id : quickViewProduct.value.id,
        name: variant ? variant.name : quickViewProduct.value.name,
        price: variant ? variant.price : quickViewProduct.value.price,
        size: variant ? variant.size : selectedSize.value,
        qty: selectedQuantity.value,
      })
      quickViewProduct.value = null
      selectedSize.value = null
      selectedQuantity.value = 1
    }
    const availableSizes = computed(() => quickViewProduct.value ? getAvailableSizesFor(quickViewProduct.value) : [])
    const cart = ref([])
    const cartOpen = ref(false)
    const cartTotal = computed(() => cart.value.reduce((sum, item) => sum + Number(item.price) * (item.qty || 1), 0))

    return {
      slides, currentIndex, track, trackStyle, prevSlide, nextSlide, goToSlide,
      products, rawProducts, loading, loadError, fetchProducts,
      filters, search, filteredProducts, filteredUniqueProducts,
      uniqueCategories, uniqueSizes,
      quickViewProduct, openQuickView, availableSizes, selectedSize, selectedQuantity, addToCartWithSize,
      cart, cartOpen, cartTotal
    }
  }
}
</script>



<style scoped>
.container {
  max-width: var(--container);
  margin: 0 auto;
  padding: 0 1rem;
}

/* HERO */
.hero {
  background: #f7fbff;
  padding: 2rem 0;
}
.hero-inner {
  position: relative;
  overflow: hidden;
  max-width: var(--container);
  margin: 0 auto;
  padding: 1rem 0;
}

/* track */
.slides-track {
  display: flex;
  width: 100%;
  will-change: transform;
}

/* each slide is full panel */
.slide {
  flex: 0 0 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 340px;
  box-sizing: border-box;
  padding: 0.5rem 0;
}

/* inner content (group) centered as a unit */
.slide-inner {
  width: 100%;
  max-width: 900px; /* limit group width so it is centered in panel */
  display: flex;
  gap: 1.25rem; /* small gap between text and image */
  align-items: center;
  justify-content: center; /* center the group horizontally */
  padding: 0.75rem 1rem;
  box-sizing: border-box;
}

/* left text and right image widths (as a centered group) */
.hero-copy {
  display: flex;
  flex-direction: column; /* stack text + button */
  align-items: center; /* center horizontally */
  justify-content: center; /* center vertically if needed */
  text-align: center; /* ensure text aligns too */
}
.hero-copy h2 {
  font-size: 2.1rem;
  margin: 0 0 0.6rem;
  line-height: 1.12;
}
.hero-copy p {
  font-size: 1.02rem;
  margin: 0 0 0.9rem;
  color: #4a5568;
}
.hero-ctas {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
}
.hero-ctas button {
  min-width: 120px;
  padding: 0.55rem 0.9rem;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
}
.hero-ctas .primary {
  background: var(--primary);
  color: #fff;
}
.hero-ctas .secondary {
  background: transparent;
  border: 2px solid var(--primary);
  color: var(--primary);
}
.hero-benefits {
  display: flex;
  gap: 1rem;
  list-style: none;
  padding: 0;
  margin: 0.8rem 0 0;
  color: var(--muted);
  font-weight: 600;
}

/* image block a bit smaller to sit close to text */
.hero-media {
  flex: 0 1 320px;
  max-width: 320px;
  display: flex;
  justify-content: center;
}
.hero-media img {
  width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 12px 28px rgba(8, 20, 40, 0.08);
  display: block;
}

/* controls/dots */
.carousel-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(26, 115, 232, 0.85);
  border: none;
  color: #fff;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.carousel-nav.prev {
  left: 12px;
}
.carousel-nav.next {
  right: 12px;
}
.carousel-dots {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.6rem;
  z-index: 30;
}
.carousel-dots button {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  background: #cbd5e1;
  cursor: pointer;
}
.carousel-dots button.active {
  background: var(--primary);
}

/* MOBILE: stack content, center, keep image close to text */
@media (max-width: 768px) {
  .slide-inner {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 1rem;
    text-align: center;
    max-width: 92%;
  }
  .hero-copy {
    max-width: 100%;
  }
  .hero-copy h2 {
    font-size: 1.5rem;
  }
  .hero-copy p {
    font-size: 0.98rem;
  }

  .hero-copy button {
    margin: 20px auto; /* auto centers horizontally */
  }

  .hero-media {
    max-width: 280px;
  }
  .carousel-nav.prev {
    left: 8px;
  }
  .carousel-nav.next {
    right: 8px;
  }
  .carousel-dots {
    bottom: 8px;
  }
}

/* rest of page styles (unchanged) */
.features {
  display: flex;
  gap: 1rem;
  justify-content: center;
  padding: 1rem 0;
  color: var(--muted);
}
.products {
  padding: 1.5rem 0;
}
.products-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}
.filters {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
.filters select,
.filters input {
  padding: 0.4rem;
  border-radius: 6px;
  border: 1px solid #ddd;
}
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}
.product-card {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 0.75rem;
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}
.product-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 6px;
}
.product-info {
  flex: 1;
}
.product-name {
  margin: 0;
  font-size: 1rem;
}
.product-sub {
  color: var(--muted);
  font-size: 0.9rem;
  margin: 0.25rem 0;
}
.price {
  font-weight: 700;
  margin-top: 0.5rem;
}
.product-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.6rem;
}
.add {
  background: var(--primary);
  color: #fff;
  border: none;
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  cursor: pointer;
}
.view {
  background: transparent;
  border: 1px solid #ddd;
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  cursor: pointer;
}

.cart-drawer {
  position: fixed;
  right: -360px;
  top: 0;
  width: 320px;
  height: 100vh;
  background: #fff;
  box-shadow: -8px 0 24px rgba(15, 15, 15, 0.08);
  transition: right 0.25s ease;
  z-index: 60;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}
.cart-drawer.open {
  right: 0;
}
.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}
.cart-empty {
  color: var(--muted);
  padding: 1rem 0;
}
.cart-items {
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1 1 auto;
  overflow: auto;
}
.cart-items li {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px dashed #f1f1f1;
}
.cart-footer {
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.checkout {
  background: var(--accent);
  color: #fff;
  border: none;
  padding: 0.6rem;
  border-radius: 6px;
  cursor: pointer;
}

/* Modal styles */
.modal {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(10, 10, 10, 0.45);
  z-index: 70;
}
.modal-inner {
  background: #fff;
  padding: 1.25rem;
  border-radius: 8px;
  max-width: 720px;
  width: 90%;
  position: relative;
}
.modal .close {
  position: absolute;
  right: 0.5rem;
  top: 0.5rem;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}
.modal img {
  width: 160px;
  height: 160px;
  object-fit: cover;
  border-radius: 6px;
}

/* Size selection container */
.size-selection {
  margin-bottom: 10px;
}

/* Quantity selection container */
.quantity-selection {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px; /* space below quantity before Add to Cart button */
}

/* Quantity input styling */
.quantity-selection input[type="number"] {
  width: 60px;
  padding: 6px 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-align: center;
  outline: none;
  transition: border-color 0.3s ease;
}

/* Focus style for quantity input */
.quantity-selection input[type="number"]:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

/* Hide default number input arrows in Webkit browsers */
.quantity-selection input[type="number"]::-webkit-inner-spin-button,
.quantity-selection input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Size selection styles */
.size-selection {
  margin: 1rem 0;
}
.sizes {
  display: flex;
  gap: 0.5rem;
}
.size-btn {
  padding: 0.4rem 0.8rem;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
  border-radius: 4px;
  user-select: none;
}
.size-btn.selected {
  border-color: var(--primary);
  background: #e8f0fe;
  font-weight: bold;
}
.size-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
.add-to-cart-btn {
  display: inline-block; /* Ensure button is always displayed */
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-weight: 600;
  background: var(--primary);
  color: black;
  border: none;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.add-to-cart-btn:disabled {
  opacity: 0.6; /* Visually indicate disabled state */
  cursor: not-allowed; /* Change cursor to indicate disabled */
  pointer-events: none; /* Prevent clicks */
  /* DO NOT use display:none or visibility:hidden */
}
</style>
