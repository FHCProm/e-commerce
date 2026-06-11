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
            <button @click="decreaseQty(item)" :disabled="item.quantity <= 1">-</button>
            {{ item.quantity }}
            <button @click="increaseQty(item)">+</button>
          </p>
          <p>Subtotal: {{ formatPrice(item.price * item.quantity) }}</p>
        </div>
       <button @click="handleRemoveItem(item.id, item.size)" class="remove-btn">Remove</button>

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

const { cart, removeItem, updateQty } = useCart()
const items = cart

const total = computed(() => {
  return items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
}

const increaseQty = (item) => {
  updateQty(item.id, item.size, item.quantity + 1)
}

const decreaseQty = (item) => {
  const newQty = item.quantity - 1
  updateQty(item.id, item.size, newQty)
}

const handleRemoveItem = (id, size) => {
  removeItem(id, size)
}
</script>



<style scoped>


/* Quantity buttons container */
.item-info p {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Style the quantity buttons */
.item-info button {
  width: 32px;
  height: 32px;
  background-color: #1a73e8; /* Primary blue */
  border: none;
  border-radius: 6px;
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
  line-height: 1;
  cursor: pointer;
  user-select: none;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.2s ease;
}

/* Hover and active states */
.item-info button:hover {
  background-color: #155ab6; /* Darker blue */
}

.item-info button:active {
  background-color: #0f3d7a; /* Even darker */
}

/* Disable button style (optional) */
.item-info button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  color: #666;
}

/* Optional: add focus outline for accessibility */
.item-info button:focus-visible {
  outline: 2px solid #ffab00;
  outline-offset: 2px;
}



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
