<template>
  <header class="site-header">
    <div class="container header-row">
      <div class="brand">
        <img src="/images/index/logo.png" alt="Glove Co. logo" class="logo" />
        <h1 class="site-name">Glove Co.</h1>
      </div>

      <nav class="main-nav">
        <button class="nav-btn">Shop</button>
        <button class="nav-btn">About</button>
        <button class="nav-btn">Contact</button>
      </nav>

      <div class="actions">
        <div class="trust">Free shipping over $50</div>
        <button class="cart-btn" @click="$emit('open-cart')">
          Cart ({{ cartCount }})
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
const props = defineProps({
  cartCount: { type: Number, default: 0 }
})
defineEmits(['open-cart', 'scroll-to-products'])
</script>

<style scoped>
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
.cart-btn { background: var(--primary, #1a73e8); color: #fff; border: none; padding: 0.4rem 0.75rem; border-radius: 6px; cursor: pointer; }
.trust { color: var(--muted, #6b7280); font-size: 0.9rem; }
</style>
