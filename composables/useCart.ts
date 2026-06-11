import { computed } from 'vue'
import { useState } from '#app'  // Nuxt 3 useState for global reactive state

export default function useCart() {
  // Shared reactive cart items state
  const items = useState('cart', () => [])

  // Compute total price of items in cart
  const total = computed(() =>
    items.value.reduce((sum, item) => sum + (item.price * (item.qty ?? 1)), 0)
  )

  // Add an item to the cart; if item exists, increase qty
  function addItem(newItem) {
    const existing = items.value.find(i => i.id === newItem.id)
    if (existing) {
      existing.qty = (existing.qty ?? 1) + (newItem.qty ?? 1)
    } else {
      items.value.push({ ...newItem, qty: newItem.qty ?? 1 })
    }
  }

  // Remove item by id
  function removeItem(id) {
    items.value = items.value.filter(i => i.id !== id)
  }

  // Update quantity of an item by id
  function updateQty(id, qty) {
    const item = items.value.find(i => i.id === id)
    if (item && qty > 0) {
      item.qty = qty
    }
  }

  return { items, total, addItem, removeItem, updateQty }
}
