<template>
  <main class="cart-page">
    <h1>Your Cart</h1>

    <div v-if="items.length === 0" class="empty-cart">
      Your cart is empty.
    </div>

    <ul v-else class="cart-items">
      <li v-for="item in items" :key="item.id + '-' + item.size" class="cart-item">
        <div class="item-info">
          <strong>{{ item.name }}</strong>
          <p>Price: {{ formatPrice(item.price) }}</p>
          <p>Quantity: 
            <button @click="decreaseQty(item)">-</button>
            {{ item.quantity }}
            <button @click="increaseQty(item)">+</button>
          </p>
          <p>Subtotal: {{ formatPrice(item.price * item.quantity) }}</p>
        </div>
        <button @click="handleremoveItem(item.id, item.size)" class="remove-btn">Remove</button>
      </li>
    </ul>

    <div v-if="items.length > 0" class="cart-summary">
      <p><strong>Total: {{ formatPrice(total) }}</strong></p>
      <NuxtLink to="/checkout" class="checkout-btn">Proceed to Checkout</NuxtLink>
    </div>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { useCart } from '~/composables/useCart'

// Destructure cart state and methods
const { cart, removeItem, updateQty } = useCart()
const items = cart

// Compute total price
const total = computed(() => {
  return items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
})

// Format price helper
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
}

// Increase quantity by 1
const increaseQty = (item) => {
  updateQty(item.id, item.size, item.quantity + 1)
}

// Decrease quantity by 1, minimum 1
const decreaseQty = (item) => {
  if (item.quantity > 1) {
    updateQty(item.id, item.size, item.quantity - 1)
  }
}

// Remove item by id and size
const handleRemoveItem = (id, size) => {
  removeItem(id, size)
}
</script>


<style scoped>
/* Your existing styles */
.cart-page {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.empty-cart {
  font-style: italic;
  color: #666;
}

.cart-items {
  list-style: none;
  padding: 0;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding: 1rem 0;
}

.item-info p {
  margin: 0.25rem 0;
}

.remove-btn {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.remove-btn:hover {
  background: #c0392b;
}

.cart-summary {
  margin-top: 1.5rem;
  text-align: right;
}

.checkout-btn {
  display: inline-block;
  background: #27ae60;
  color: white;
  padding: 0.75rem 1.5rem;
  text-decoration: none;
  border-radius: 4px;
}

.checkout-btn:hover {
  background: #219150;
}
</style>
