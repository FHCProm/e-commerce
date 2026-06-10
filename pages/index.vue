<template>
  <section class="hero">
    <h1>Welcome to Our E-Commerce Store</h1>
    <p>Find the best products at unbeatable prices.</p>
  </section>

  <section class="products">
    <h2>Featured Products</h2>
    <div class="product-list">
      <div
        v-for="product in products"
        :key="product.id"
        class="product-card"
      >
        <img :src="product.image" :alt="product.name" />
        <h3>{{ product.name }}</h3>
        <p>{{ product.description }}</p>
        <p class="price">${{ product.price.toFixed(2) }}</p>
        <button @click="addToCart(product)">Add to Cart</button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

// Sample product data (replace with API or store data)
const products = ref([
  {
    id: 1,
    name: 'Stylish Sneakers',
    description: 'Comfortable and trendy sneakers for everyday wear.',
    price: 79.99,
    image: '/images/products/sneakers.jpg',
  },
  {
    id: 2,
    name: 'Classic Watch',
    description: 'Elegant watch with leather strap.',
    price: 149.99,
    image: '/images/products/watch.jpg',
  },
  {
    id: 3,
    name: 'Wireless Headphones',
    description: 'Noise-cancelling over-ear headphones.',
    price: 199.99,
    image: '/images/products/headphones.jpg',
  },
])

function addToCart(product) {
  // Placeholder for adding product to cart logic
  alert(`Added ${product.name} to cart!`)
}
</script>

<style scoped>
.hero {
  text-align: center;
  padding: 2rem;
  background-color: #f5f5f5;
}

.products {
  padding: 2rem;
}

.product-list {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  width: 220px;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.product-card img {
  max-width: 100%;
  border-radius: 4px;
}

.price {
  font-weight: bold;
  margin: 0.5rem 0;
}

button {
  background-color: #007bff;
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
