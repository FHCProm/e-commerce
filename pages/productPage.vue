<template>
  <main class="product-page">
    <section class="product-hero">
      <div class="container product-shell">
        <div class="product-gallery reveal visible">
          <div class="gallery-stage" :class="product.theme">
            <span class="product-badge">{{ product.badge }}</span>

            <div class="glove-shape hero-glove" :class="product.theme" aria-hidden="true">
              <div class="palm"></div>
              <div class="thumb"></div>
              <div class="finger f1"></div>
              <div class="finger f2"></div>
              <div class="finger f3"></div>
              <div class="finger f4"></div>
            </div>

            <div class="gallery-orbit orbit-1"></div>
            <div class="gallery-orbit orbit-2"></div>
          </div>

          <div class="gallery-thumbs">
            <button
              v-for="thumb in thumbnails"
              :key="thumb.id"
              type="button"
              class="thumb-card"
              :class="[thumb.theme, { active: activeThumb === thumb.id }]"
              @click="activeThumb = thumb.id"
              :aria-label="`View ${thumb.label}`"
            >
              <div class="glove-shape thumb-glove" :class="thumb.theme" aria-hidden="true">
                <div class="palm"></div>
                <div class="thumb"></div>
                <div class="finger f1"></div>
                <div class="finger f2"></div>
                <div class="finger f3"></div>
                <div class="finger f4"></div>
              </div>
              <span>{{ thumb.label }}</span>
            </button>
          </div>
        </div>

        <div class="product-summary reveal">
          <div class="summary-top">
            <span class="eyebrow">{{ product.category }}</span>
            <h1>{{ product.name }}</h1>
            <p class="summary-copy">
              {{ product.description }}
            </p>
          </div>

          <div class="summary-meta">
            <div class="rating-block">
              <span class="stars">{{ getStars(product.rating) }}</span>
              <strong>{{ product.rating.toFixed(1) }}</strong>
              <span>{{ product.reviewCount }} reviews</span>
            </div>

            <div class="stock-pill" :class="{ available: product.inStock }">
              <span class="dot"></span>
              {{ product.inStock ? 'In stock and ready to ship' : 'Currently unavailable' }}
            </div>
          </div>

          <div class="price-row">
            <div class="price-stack">
              <strong>${{ product.price }}</strong>
              <span>or 4 interest-free payments of ${{ installmentPrice }}</span>
            </div>
            <div class="ship-note">
              Free shipping on orders over $75
            </div>
          </div>

          <div class="option-group">
            <div class="group-head">
              <h3>Color</h3>
              <span>{{ selectedColor }}</span>
            </div>
            <div class="swatch-row">
              <button
                v-for="color in colorOptions"
                :key="color.name"
                type="button"
                class="color-swatch"
                :class="{ active: selectedColor === color.name }"
                :style="{ '--swatch-color': color.hex }"
                @click="selectedColor = color.name"
                :aria-label="color.name"
              ></button>
            </div>
          </div>

          <div class="option-group">
            <div class="group-head">
              <h3>Size</h3>
              <span>{{ selectedSize }}</span>
            </div>
            <div class="size-row">
              <button
                v-for="size in sizeOptions"
                :key="size"
                type="button"
                class="size-chip"
                :class="{ active: selectedSize === size }"
                @click="selectedSize = size"
              >
                {{ size }}
              </button>
            </div>
          </div>

          <div class="purchase-panel">
            <div class="qty-box">
              <button type="button" class="qty-btn" @click="decreaseQty" aria-label="Decrease quantity">−</button>
              <span>{{ quantity }}</span>
              <button type="button" class="qty-btn" @click="increaseQty" aria-label="Increase quantity">+</button>
            </div>

            <button type="button" class="btn btn-primary add-cart-btn">
              Add to Cart
            </button>

            <button type="button" class="btn btn-ghost">
              Save for Later
            </button>
          </div>

          <div class="assurance-grid">
            <div class="assurance-item">
              <strong>Durable build</strong>
              <span>Reinforced seams for daily wear</span>
            </div>
            <div class="assurance-item">
              <strong>Secure grip</strong>
              <span>Textured palm for confident handling</span>
            </div>
            <div class="assurance-item">
              <strong>Fast delivery</strong>
              <span>Dispatch within 48 hours</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="product-details">
      <div class="container details-grid">
        <div class="details-main">
          <article class="detail-panel reveal">
            <div class="panel-head">
              <span class="eyebrow">Overview</span>
              <h2>Built for precision, traction, and long-session comfort.</h2>
            </div>
            <p>
              {{ product.longDescription }}
            </p>
          </article>

          <article class="detail-panel reveal">
            <div class="panel-head">
              <span class="eyebrow">Specifications</span>
              <h2>Technical highlights</h2>
            </div>

            <div class="spec-grid">
              <div class="spec-line" v-for="item in specifications" :key="item.label">
                <span>{{ item.label }}</span>
                <strong>{{ item.value }}</strong>
              </div>
            </div>
          </article>

          <article class="detail-panel reveal">
            <div class="panel-head">
              <span class="eyebrow">Performance</span>
              <h2>Why customers choose it</h2>
            </div>

            <div class="feature-list">
              <div class="feature-row" v-for="feature in featureHighlights" :key="feature.title">
                <div class="feature-icon"></div>
                <div>
                  <strong>{{ feature.title }}</strong>
                  <p>{{ feature.copy }}</p>
                </div>
              </div>
            </div>
          </article>
        </div>

        <aside class="details-side">
          <div class="side-panel reveal">
            <span class="eyebrow">At a glance</span>
            <h3>Top features</h3>
            <div class="tag-cloud">
              <span v-for="tag in product.tags" :key="tag">{{ tag }}</span>
            </div>
          </div>

          <div class="side-panel reveal">
            <span class="eyebrow">Fit guide</span>
            <h3>Recommended use</h3>
            <ul class="fit-list">
              <li v-for="item in fitGuide" :key="item">{{ item }}</li>
            </ul>
          </div>

          <div class="side-panel reveal">
            <span class="eyebrow">Care</span>
            <h3>Maintenance tips</h3>
            <p class="side-copy">
              Hand wash cold, air dry flat, and avoid prolonged direct heat to preserve grip texture and flexibility over time.
            </p>
          </div>
        </aside>
      </div>
    </section>

    <section class="related-products">
      <div class="container">
        <div class="section-head reveal">
          <span class="eyebrow">You may also like</span>
          <h2>Related gloves in the same performance family</h2>
        </div>

        <div class="related-grid">
          <article
            v-for="item in relatedProducts"
            :key="item.id"
            class="related-item reveal"
          >
            <div class="related-visual" :class="item.theme">
              <div class="glove-shape small-glove" :class="item.theme" aria-hidden="true">
                <div class="palm"></div>
                <div class="thumb"></div>
                <div class="finger f1"></div>
                <div class="finger f2"></div>
                <div class="finger f3"></div>
                <div class="finger f4"></div>
              </div>
            </div>

            <div class="related-copy">
              <h3>{{ item.name }}</h3>
              <p>{{ item.short }}</p>
              <div class="related-bottom">
                <strong>${{ item.price }}</strong>
                <button type="button" class="btn btn-ghost">View</button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

const product = ref({
  id: 1,
  name: 'AeroGrip Pro',
  badge: 'Best Seller',
  category: 'Work Gloves',
  theme: 'blue',
  price: 39,
  rating: 4.9,
  reviewCount: 186,
  inStock: true,
  description:
    'A lightweight all-purpose performance glove with breathable mesh zones, anti-slip palm texture, and flexible reinforcement for extended wear.',
  longDescription:
    'AeroGrip Pro is engineered for workers, trainers, and everyday users who need a glove that stays responsive under pressure. The ergonomic structure reduces stiffness, while the textured palm surface delivers reliable grip across tools, bars, and gear. Strategic ventilation keeps airflow moving, making it ideal for long shifts and repeated use.',
  tags: ['Breathable', 'Touch Ready', 'Grip Palm', 'Flexible Fit', 'All-Day Wear']
})

const thumbnails = ref([
  { id: 1, label: 'Front View', theme: 'blue' },
  { id: 2, label: 'Palm Grip', theme: 'black' },
  { id: 3, label: 'Side Angle', theme: 'red' },
  { id: 4, label: 'Detail View', theme: 'sand' }
])

const activeThumb = ref(1)
const selectedColor = ref('Blue')
const selectedSize = ref('M')
const quantity = ref(1)

const colorOptions = ref([
  { name: 'Blue', hex: '#1a73e8' },
  { name: 'Black', hex: '#111827' },
  { name: 'Red', hex: '#dc2626' },
  { name: 'Sand', hex: '#c08a42' }
])

const sizeOptions = ref(['XS', 'S', 'M', 'L', 'XL'])

const specifications = ref([
  { label: 'Material', value: 'Synthetic mesh + reinforced palm' },
  { label: 'Grip Type', value: 'Textured anti-slip coating' },
  { label: 'Closure', value: 'Flexible compression cuff' },
  { label: 'Use Case', value: 'Work, training, utility' },
  { label: 'Weight', value: 'Lightweight performance build' }
])

const featureHighlights = ref([
  {
    title: 'Breathable structure',
    copy: 'Ventilated zones help release heat and reduce moisture during demanding use.'
  },
  {
    title: 'Confident palm traction',
    copy: 'Grip texture is tuned for control on tools, bars, and frequently handled equipment.'
  },
  {
    title: 'Flexible movement',
    copy: 'Articulated shaping supports natural hand motion without bulky stiffness.'
  }
])

const fitGuide = ref([
  'Choose your normal size for a close performance fit',
  'Size up if you prefer extra room at the fingertips',
  'Best for general work, gym use, and light outdoor utility'
])

const relatedProducts = ref([
  {
    id: 2,
    name: 'ForgeShield X1',
    short: 'Heavy-duty abrasion resistance for demanding work.',
    price: 58,
    theme: 'black'
  },
  {
    id: 3,
    name: 'PulseFlex Trainer',
    short: 'Compression support with tactile gym-ready control.',
    price: 34,
    theme: 'red'
  },
  {
    id: 4,
    name: 'NorthClad Thermal',
    short: 'Insulated warmth and weather-ready grip.',
    price: 49,
    theme: 'sand'
  }
])

const installmentPrice = computed(() => (product.value.price / 4).toFixed(2))

const getStars = (rating) => {
  if (rating >= 4.8) return '★★★★★'
  if (rating >= 4.3) return '★★★★☆'
  if (rating >= 3.8) return '★★★☆☆'
  return '★★☆☆☆'
}

const increaseQty = () => {
  quantity.value += 1
}

const decreaseQty = () => {
  if (quantity.value > 1) quantity.value -= 1
}

let observer

const initRevealObserver = () => {
  if (observer) observer.disconnect()

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.14 }
  )

  document.querySelectorAll('.reveal:not(.visible)').forEach((el) => {
    observer.observe(el)
  })
}

const applyPointerGlow = () => {
  document.querySelectorAll('.btn-primary, .btn-ghost, .size-chip, .thumb-card, .color-swatch, .qty-btn').forEach((el) => {
    if (el.dataset.glowBound === 'true') return

    el.dataset.glowBound = 'true'

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      if (
        el.classList.contains('btn-primary') ||
        el.classList.contains('active')
      ) {
        el.style.backgroundImage = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.22), transparent 40%), linear-gradient(135deg, var(--primary), var(--accent))`
      } else {
        el.style.backgroundImage = `radial-gradient(circle at ${x}px ${y}px, rgba(26,115,232,0.08), transparent 38%), linear-gradient(0deg, rgba(255,255,255,0.96), rgba(255,255,255,0.96))`
      }
    })

    el.addEventListener('mouseleave', () => {
      el.style.backgroundImage = ''
    })
  })
}

onMounted(async () => {
  await nextTick()
  initRevealObserver()
  applyPointerGlow()
})

onBeforeUnmount(() => {
  if (observer) observer.disconnect()
})
</script>

<style scoped>
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
  --shadow: 0 10px 30px rgba(11, 25, 55, 0.08);
  --shadow-hover: 0 18px 50px rgba(11, 25, 55, 0.14);
}

* {
  box-sizing: border-box;
}

main {
  display: block;
}

.product-page {
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

.product-page::before {
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

.product-page > * {
  position: relative;
  z-index: 1;
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

.product-hero {
  padding: 36px 0 20px;
}

.product-shell {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 22px;
  align-items: start;
}

.product-gallery,
.product-summary,
.detail-panel,
.side-panel,
.related-item {
  border: 1px solid var(--line);
  background: rgba(255,255,255,0.74);
  backdrop-filter: blur(16px);
  box-shadow: var(--shadow);
}

.product-gallery,
.product-summary {
  border-radius: 28px;
  overflow: hidden;
}

.gallery-stage {
  position: relative;
  min-height: 520px;
  display: grid;
  place-items: center;
  overflow: hidden;
  isolation: isolate;
}

.gallery-stage.blue {
  background: linear-gradient(135deg, #dbeafe, #eff6ff);
}

.gallery-stage.black {
  background: linear-gradient(135deg, #dfe4ea, #f8fafc);
}

.gallery-stage.red {
  background: linear-gradient(135deg, #fee2e2, #fff1f2);
}

.gallery-stage.sand {
  background: linear-gradient(135deg, #f6efe2, #fffaf0);
}

.gallery-stage::before {
  content: "";
  position: absolute;
  inset: 20px;
  border-radius: 30px;
  background: radial-gradient(circle at top, rgba(255,255,255,0.72), rgba(255,255,255,0.12));
  border: 1px solid rgba(255,255,255,0.4);
  z-index: -1;
}

.product-badge {
  position: absolute;
  top: 18px;
  left: 18px;
  z-index: 3;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(255,255,255,0.88);
  border: 1px solid rgba(15,23,42,0.08);
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.gallery-orbit {
  position: absolute;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.5);
  opacity: 0.75;
}

.orbit-1 {
  width: 360px;
  height: 360px;
}

.orbit-2 {
  width: 480px;
  height: 480px;
}

.hero-glove {
  transform: rotate(-8deg) scale(1.55);
}

.gallery-thumbs {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  padding: 16px;
  background: rgba(255,255,255,0.78);
  border-top: 1px solid var(--line);
}

.thumb-card {
  border: 1px solid var(--line);
  background: rgba(255,255,255,0.94);
  border-radius: 18px;
  padding: 12px;
  cursor: pointer;
  transition: 0.25s ease;
  display: grid;
  justify-items: center;
  gap: 10px;
  color: var(--text);
}

.thumb-card.active,
.thumb-card:hover {
  transform: translateY(-2px);
  border-color: rgba(26, 115, 232, 0.28);
  box-shadow: 0 12px 24px rgba(26, 115, 232, 0.12);
}

.thumb-card span {
  font-size: 0.82rem;
  font-weight: 800;
  color: var(--text-soft);
}

.thumb-glove {
  transform: rotate(-10deg) scale(0.6);
  transform-origin: center;
  width: 82px;
  height: 92px;
}

.product-summary {
  padding: 30px;
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

.product-summary h1,
.section-head h2,
.panel-head h2 {
  margin: 16px 0 12px;
  font-family: "Space Grotesk", sans-serif;
  letter-spacing: -0.05em;
  line-height: 0.98;
}

.product-summary h1 {
  font-size: clamp(2.2rem, 4vw, 4rem);
  max-width: 10ch;
}

.summary-copy,
.detail-panel p,
.side-copy,
.feature-row p,
.related-copy p {
  color: var(--text-soft);
  line-height: 1.72;
}

.summary-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin: 22px 0;
}

.rating-block,
.stock-pill {
  border: 1px solid var(--line);
  background: rgba(255,255,255,0.82);
  border-radius: 16px;
  padding: 12px 14px;
}

.rating-block {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
}

.stars {
  color: #f59e0b;
  letter-spacing: 0.08em;
}

.stock-pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--text-soft);
  font-weight: 700;
}

.stock-pill .dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #cbd5e1;
}

.stock-pill.available .dot {
  background: var(--success);
  box-shadow: 0 0 0 6px rgba(15,157,88,0.12);
}

.price-row {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 18px;
  padding: 18px 0 22px;
  border-top: 1px solid rgba(15,23,42,0.07);
  border-bottom: 1px solid rgba(15,23,42,0.07);
}

.price-stack strong {
  display: block;
  font-family: "Space Grotesk", sans-serif;
  font-size: 2.2rem;
  line-height: 1;
  letter-spacing: -0.05em;
}

.price-stack span,
.ship-note {
  color: var(--muted);
  font-size: 0.92rem;
  font-weight: 700;
}

.option-group {
  padding-top: 22px;
}

.group-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.group-head h3 {
  margin: 0;
  font-size: 0.98rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
}

.group-head span {
  font-weight: 800;
}

.swatch-row,
.size-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.color-swatch,
.size-chip,
.qty-btn,
.btn {
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease, background 0.25s ease;
}

.color-swatch {
  width: 42px;
  height: 42px;
  border-radius: 999px;
  border: 2px solid transparent;
  cursor: pointer;
  background: var(--swatch-color);
  box-shadow: inset 0 0 0 4px rgba(255,255,255,0.86);
}

.color-swatch.active {
  border-color: var(--primary);
  transform: scale(1.06);
  box-shadow: 0 10px 18px rgba(26,115,232,0.18), inset 0 0 0 4px rgba(255,255,255,0.86);
}

.size-chip {
  border: 1px solid var(--line);
  background: rgba(255,255,255,0.94);
  color: var(--text);
  border-radius: 14px;
  padding: 12px 16px;
  font-weight: 800;
  cursor: pointer;
}

.size-chip.active,
.size-chip:hover {
  border-color: transparent;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 14px 24px rgba(26,115,232,0.22);
}

.purchase-panel {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 12px;
  padding-top: 26px;
}

.qty-box {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  border: 1px solid var(--line);
  background: rgba(255,255,255,0.92);
  border-radius: 16px;
  padding: 8px;
  min-width: 126px;
  justify-content: space-between;
  font-weight: 800;
}

.qty-btn {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  border: 0;
  cursor: pointer;
  background: rgba(26,115,232,0.08);
  color: var(--accent);
  font-size: 1.2rem;
  font-weight: 800;
}

.qty-btn:hover {
  transform: translateY(-1px);
}

.btn {
  border: 0;
  cursor: pointer;
  border-radius: 14px;
  font-weight: 800;
}

.btn:active {
  transform: translateY(1px) scale(0.98);
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary), var(--accent));
  color: white;
  padding: 14px 18px;
  box-shadow: 0 14px 24px rgba(26,115,232,0.24);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 34px rgba(26,115,232,0.32);
}

.btn-ghost {
  background: rgba(255,255,255,0.94);
  color: var(--text);
  border: 1px solid var(--line);
  padding: 14px 16px;
}

.btn-ghost:hover {
  transform: translateY(-2px);
}

.assurance-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 24px;
}

.assurance-item {
  padding: 14px;
  border-radius: 16px;
  border: 1px solid var(--line);
  background: rgba(255,255,255,0.72);
}

.assurance-item strong {
  display: block;
  font-family: "Space Grotesk", sans-serif;
  margin-bottom: 4px;
  font-size: 0.98rem;
}

.assurance-item span {
  color: var(--muted);
  font-size: 0.88rem;
}

.product-details {
  padding: 10px 0 24px;
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 22px;
  align-items: start;
}

.details-main {
  display: grid;
  gap: 18px;
}

.detail-panel,
.side-panel {
  border-radius: 24px;
  padding: 24px;
}

.panel-head h2 {
  font-size: clamp(1.5rem, 2.2vw, 2.2rem);
  max-width: 16ch;
}

.spec-grid {
  display: grid;
  gap: 10px;
  margin-top: 18px;
}

.spec-line {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid rgba(15,23,42,0.07);
}

.spec-line span {
  color: var(--muted);
  font-weight: 700;
}

.spec-line strong {
  text-align: right;
}

.feature-list {
  display: grid;
  gap: 18px;
  margin-top: 18px;
}

.feature-row {
  display: grid;
  grid-template-columns: 40px 1fr;
  gap: 14px;
  align-items: start;
}

.feature-icon {
  width: 40px;
  height: 40px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(26,115,232,0.14), rgba(11,99,198,0.22));
  border: 1px solid rgba(26,115,232,0.16);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.28);
}

.feature-row strong,
.side-panel h3,
.related-copy h3 {
  font-family: "Space Grotesk", sans-serif;
  letter-spacing: -0.03em;
}

.feature-row p {
  margin: 6px 0 0;
}

.details-side {
  display: grid;
  gap: 18px;
  position: sticky;
  top: 24px;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
}

.tag-cloud span {
  display: inline-flex;
  align-items: center;
  padding: 9px 12px;
  border-radius: 999px;
  background: rgba(26,115,232,0.07);
  color: var(--accent);
  border: 1px solid rgba(26,115,232,0.1);
  font-size: 0.84rem;
  font-weight: 800;
}

.fit-list {
  margin: 16px 0 0;
  padding-left: 18px;
  color: var(--text-soft);
  line-height: 1.8;
}

.related-products {
  padding: 20px 0 90px;
}

.section-head {
  margin-bottom: 18px;
}

.section-head h2 {
  font-size: clamp(1.8rem, 3vw, 3rem);
  max-width: 14ch;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.related-item {
  border-radius: 24px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.related-item:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
}

.related-visual {
  min-height: 220px;
  display: grid;
  place-items: center;
  position: relative;
}

.related-visual.blue {
  background: linear-gradient(135deg, #dbeafe, #eff6ff);
}

.related-visual.black {
  background: linear-gradient(135deg, #dfe4ea, #f8fafc);
}

.related-visual.red {
  background: linear-gradient(135deg, #fee2e2, #fff1f2);
}

.related-visual.sand {
  background: linear-gradient(135deg, #f6efe2, #fffaf0);
}

.related-copy {
  padding: 18px;
}

.related-copy h3 {
  margin: 0 0 8px;
  font-size: 1.18rem;
}

.related-copy p {
  margin: 0 0 16px;
}

.related-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.related-bottom strong {
  font-family: "Space Grotesk", sans-serif;
  font-size: 1.3rem;
}

.glove-shape {
  width: 132px;
  height: 168px;
  position: relative;
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

.small-glove {
  transform: rotate(-10deg) scale(1.05);
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

@media (max-width: 1100px) {
  .product-shell,
  .details-grid,
  .related-grid {
    grid-template-columns: 1fr;
  }

  .details-side {
    position: static;
  }
}

@media (max-width: 820px) {
  .purchase-panel,
  .assurance-grid,
  .gallery-thumbs {
    grid-template-columns: 1fr;
  }

  .price-row,
  .group-head,
  .spec-line,
  .related-bottom {
    align-items: start;
    flex-direction: column;
  }

  .gallery-stage {
    min-height: 400px;
  }

  .hero-glove {
    transform: rotate(-8deg) scale(1.22);
  }
}

@media (max-width: 640px) {
  .product-summary,
  .detail-panel,
  .side-panel {
    padding: 20px;
  }

  .thumb-card {
    grid-template-columns: 1fr;
  }

  .summary-meta {
    flex-direction: column;
  }

  .product-summary h1 {
    max-width: 12ch;
  }
}
</style>
