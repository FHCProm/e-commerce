export function useCart() {
  // useState creates a global reactive state scoped to the user session
  const cart = useState('cart', () => [])

  function addToCart(product: {
    id: number | string
    name: string
    price: number
    size: string
    quantity: number
  }) {
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

  function removeFromCart(index: number) {
    cart.value.splice(index, 1)
  }

  function clearCart() {
    cart.value = []
  }

  return {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
  }
}
