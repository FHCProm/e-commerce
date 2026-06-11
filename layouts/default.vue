<template>
  <Header :cart-count="cartCount" @open-cart="onOpenCart" @scroll-to-products="onScrollToProducts" />

  <main>
    <slot />
  </main>

  <Footer />
</template>

<script setup>
import { ref, computed } from 'vue'
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'

const cart = ref([])
const cartCount = computed(() => cart.value.length)

function onOpenCart() {
  window.dispatchEvent(new CustomEvent('layout-open-cart'))
}

function onScrollToProducts() {
  window.dispatchEvent(new CustomEvent('layout-scroll-to-products'))
}

// Remove export keyword here:
function addToLayoutCart(item) {
  cart.value.push(item)
}

// If you want to expose this function to parent or outside,
// use defineExpose({ addToLayoutCart }) here.
</script>


<style scoped>
main {
  min-height: 60vh;
  display: block;
}
</style>
