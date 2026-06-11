<template>
  <footer class="site-footer">
    <div class="container footer-inner">
      <div class="footer-col">
        <img src="/images/index/logo.png" alt="Glove Co. logo" class="footer-logo" />
        <p class="muted">Glove Co. — quality gloves for professionals and everyday use.</p>
      </div>

      <div class="footer-col">
        <h4>Shop</h4>
        <ul>
          <li>All Gloves</li>
          <li>Nitrile</li>
          <li>Latex</li>
          <li>Work Gloves</li>
        </ul>
      </div>

      <div class="footer-col">
        <h4>Company</h4>
        <ul>
          <li>About</li>
          <li>Contact</li>
          <li>Shipping</li>
          <li>Returns</li>
        </ul>
      </div>

      <div class="footer-col">
        <h4>Join our newsletter</h4>
        <form @submit.prevent="onSubscribe">
          <input v-model="email" type="email" placeholder="you@example.com" required />
          <button class="primary small" type="submit">Subscribe</button>
        </form>
        <div class="muted small">© {{ year }} Glove Co.</div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, computed } from 'vue'
const email = ref('')
const year = computed(() => new Date().getFullYear())

function onSubscribe() {
  alert(`Subscribed ${email.value} to newsletter.`)
  email.value = ''
}
</script>

<style scoped>
.site-footer { background: #0f1724; color: #fff; padding: 2rem 0; margin-top: 2rem; }
.footer-inner { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; align-items: start; }
.footer-col h4 { margin: 0 0 0.5rem; }
.footer-col ul { list-style: none; padding: 0; margin: 0; color: #cbd5e1; }
.footer-col ul li { margin: 0.35rem 0; }
.footer-logo { width: 48px; height: 48px; object-fit: contain; }
.muted { color: #9aa4b2; }
.small { font-size: 0.85rem; }
.primary.small { padding: 0.35rem 0.6rem; font-size: 0.9rem; margin-left: 0.5rem; }
input[type="email"] { padding: 0.45rem; border-radius: 6px; border: 1px solid #ccc; }
</style>
