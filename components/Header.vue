<template>
  <header class="site-header">
    <div class="container header-row">
      <div class="brand" @click="goToHome">
        <img src="/images/index/logo.png" alt="Glove Co. logo" class="logo" />
        <h1 class="site-name">Glove Co.</h1>
      </div>

      <nav class="main-nav">
        <button class="nav-btn" @click="goToProductList">Shop</button>
        <button class="nav-btn" @click="goToAbout">About</button>
        <button class="nav-btn" @click="goToContactUs">Contact</button>
      </nav>

      <div class="actions">
        <div class="trust">Free shipping over $50</div>
        <button class="cart-btn" @click="goToCart">
          Cart ({{ cartCount }})
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCart } from '~/composables/useCart'  // Adjust path if needed
import { watch } from 'vue'

const router = useRouter()


// Use the composable to get reactive cart and cartCount
const { cartCount } = useCart()



function goToCart() {
  router.push('/cart')
}

function goToHome() {
  router.push('/')
}

function goToAbout() {
  router.push('/about')
}

function goToContactUs() {
  router.push('/contactUs')
}

function goToProductList() {
  router.push('/productList')
}

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
.brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.logo {
  width: 100px;
  height: 42px;
  object-fit: contain;
}
.site-name {
  font-size: 1.1rem;
  margin: 0;
}
.main-nav .nav-btn {
  margin: 0 0.25rem;
  background: transparent;
  border: none;
  cursor: pointer;
}
.actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}
.cart-btn {
  background: var(--primary, #1a73e8);
  color: #fff;
  border: none;
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
}
.trust {
  color: var(--muted, #6b7280);
  font-size: 0.9rem;
}
</style>
