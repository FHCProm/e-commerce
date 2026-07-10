import { useState } from '#app'
import { computed } from 'vue'

export function useCart() {
  const cart = useState('cart', () => [])

  function addToCart(product) {
    if (!product.size) {
      alert('Please select a size before adding to cart.')
      return
    }
    if (!product.quantity || product.quantity < 1) {
      alert('Please select a valid quantity before adding to cart.')
      return
    }

    const existingIndex = cart.value.findIndex(
      (item) => item.id === product.id && item.size === product.size
    )

    if (existingIndex !== -1) {
      cart.value[existingIndex].quantity += product.quantity
    } else {
      cart.value.push({ ...product })
    }

    alert(`${product.name} (${product.size}) x${product.quantity} added to cart.`)
  }

  function updateQty(id, size, quantity) {
    const index = cart.value.findIndex(item => item.id === id && item.size === size)
    if (index === -1) return

    if (quantity <= 0) {
      cart.value.splice(index, 1)
    } else {
      cart.value[index].quantity = quantity
    }
  }

  function removeItem(id, size) {
    const index = cart.value.findIndex(item => item.id === id && item.size === size)
    if (index !== -1) {
      cart.value.splice(index, 1)
    }
  }

  // 👇 show number of distinct products instead of total quantity
  const cartCount = computed(() => cart.value.length)

  return {
    cart,
    addToCart,
    updateQty,
    removeItem,
    cartCount,
  }
}

