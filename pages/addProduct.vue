<template>
  <div class="page">
    <main class="container">
      <h1>Add Product</h1>

      <form class="form" @submit.prevent="submitForm">
        <div class="row">
          <label>Title*</label>
          <input v-model="title" type="text" placeholder="Nitrile Exam Gloves (Powder-Free)" />
        </div>

        <div class="row">
          <label>Short description</label>
          <input v-model="shortDesc" type="text" placeholder="Medical-grade, tactile sensitivity." />
        </div>

        <div class="row">
          <label>Full description</label>
          <textarea v-model="fullDesc" rows="4" placeholder="Detailed description..."></textarea>
        </div>

        <div class="row grid2">
          <div>
            <label>Price (USD)*</label>
            <input v-model.number="price" type="number" step="0.01" placeholder="12.99" />
          </div>

          <div>
            <label>Quantity (inventory)</label>
            <input v-model.number="quantity" type="number" min="0" placeholder="0" />
          </div>
        </div>

        <div class="row grid2">
          <div>
            <label>Category*</label>
            <div class="category-row">
              <select v-model="category" @change="onCategorySelect">
                <option value="">Select category</option>
                <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
              </select>
              <input
                v-model="categoryInput"
                class="small-input"
                placeholder="or type a new category"
                @input="onCategoryInput"
              />
            </div>
          </div>

          <div>
            <label>Image path / URL</label>
            <input v-model="image" type="text" placeholder="/images/index/nitrile_blue.JPG" />
          </div>
        </div>

        <div class="row">
          <label>Sizes (press Enter or click Add)</label>
          <div class="sizes-row">
            <input
              v-model="sizesInput"
              @keydown="addSizeOnEnter"
              type="text"
              placeholder="S, M, L, XL ..."
            />
            <button type="button" class="btn small" @click="addSize">Add</button>
          </div>
          <div class="chips">
            <span v-for="(s, i) in sizes" :key="s" class="chip">
              {{ s }}
              <button type="button" class="chip-x" @click="removeSize(i)">×</button>
            </span>
          </div>
          <p class="hint">
            If multiple sizes are provided, the server will create one product row per size (each with its own inventory).
          </p>
        </div>

        <div class="row actions">
          <button class="btn primary" :disabled="busy || !isValid" type="submit">
            {{ busy ? 'Saving...' : 'Create Product(s)' }}
          </button>
          <button class="btn" type="button" @click="resetForm">Reset</button>
        </div>

        <div v-if="message" class="message">{{ message }}</div>
      </form>

      <aside class="preview">
        <h2>Preview</h2>
        <div class="card">
          <img :src="image || '/images/placeholder.png'" alt="preview" />
          <div class="card-body">
            <h3>{{ title || 'Product title' }}</h3>
            <p class="short">{{ shortDesc || 'Short description' }}</p>
            <p class="price">{{ price ? '$' + Number(price).toFixed(2) : '--' }}</p>
            <p class="meta">Category: {{ category || '—' }} • Sizes: {{ sizes.length ? sizes.join(', ') : '—' }}</p>
          </div>
        </div>
      </aside>
    </main>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'AddProduct',
  setup() {
    const router = useRouter()

    // Form fields
    const title = ref('')
    const shortDesc = ref('')
    const fullDesc = ref('')
    const price = ref('')
    const image = ref('')
    const category = ref('')
    const categoryInput = ref('') // For new category input
    const quantity = ref(0)

    // Sizes handling
    const sizesInput = ref('')
    const sizes = ref([])

    function addSize() {
      const s = sizesInput.value.trim().toUpperCase()
      if (!s) return
      if (!sizes.value.includes(s)) sizes.value.push(s)
      sizesInput.value = ''
    }
    function removeSize(i) {
      sizes.value.splice(i, 1)
    }
    function addSizeOnEnter(e) {
      if (e.key === 'Enter') {
        e.preventDefault()
        addSize()
      }
    }

    // Default categories
    const defaultCategories = ['Nitrile', 'Latex', 'Work Gloves']
    const categories = ref([...defaultCategories])

    // On mounted, you could fetch categories from API and merge with defaults if needed
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories')
        if (res.ok) {
          const data = await res.json()
          // Merge fetched categories with defaultCategories, avoiding duplicates
          const fetched = data.map(c => (typeof c === 'string' ? c : c.name))
          categories.value = Array.from(new Set([...defaultCategories, ...fetched]))
        }
      } catch (e) {
        // If fetch fails, keep default categories
        categories.value = [...defaultCategories]
      }
    }
    onMounted(fetchCategories)

    // Synchronize category selection and input field
    function onCategorySelect() {
      // When user selects from dropdown, clear input box
      categoryInput.value = ''
    }
    function onCategoryInput() {
      // When user types in input, clear dropdown selection
      category.value = categoryInput.value.trim()
    }

    // Validation
    const isValid = ref(false)

    function validate() {
      // Use either selected category or typed category input
      const cat = category.value.trim() || categoryInput.value.trim()
      isValid.value =
        title.value.trim().length > 0 &&
        price.value !== '' &&
        !isNaN(Number(price.value)) &&
        cat.length > 0
    }

    // Watch relevant fields to validate on change
    watch([title, price, category, categoryInput], validate, { immediate: true })

    // Busy and message states
    const busy = ref(false)
    const message = ref('')

    async function submitForm() {
      validate()
      if (!isValid.value) {
        message.value = 'Please fill required fields.'
        return
      }
      busy.value = true
      message.value = ''

      // Determine final category value: typed input overrides dropdown if present
      const finalCategory = categoryInput.value.trim() || category.value.trim()

      try {
        const payload = {
          title: title.value,
          short: shortDesc.value,
          full: fullDesc.value,
          price: Number(price.value),
          image: image.value,
          type: finalCategory,
          sizes: sizes.value,
          quantity: Number(quantity.value || 0),
        }

        const res = await fetch('/api/product', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.message || 'Failed to create product')
        }

        message.value = 'Product(s) created successfully.'
        resetForm()
        // Optionally navigate to product list page
        // router.push('/productList')
      } catch (err) {
        message.value = err.message || 'Failed to create product'
      } finally {
        busy.value = false
      }
    }

    function resetForm() {
      title.value = ''
      shortDesc.value = ''
      fullDesc.value = ''
      price.value = ''
      image.value = ''
      category.value = ''
      categoryInput.value = ''
      sizes.value = []
      quantity.value = 0
      message.value = ''
      isValid.value = false
    }

    return {
      title,
      shortDesc,
      fullDesc,
      price,
      image,
      category,
      categoryInput,
      quantity,
      sizesInput,
      sizes,
      addSize,
      removeSize,
      addSizeOnEnter,
      categories,
      isValid,
      busy,
      message,
      submitForm,
      resetForm,
      onCategorySelect,
      onCategoryInput,
    }
  },
}
</script>

<style scoped>
.page {
  padding: 40px 16px;
  color: var(--muted);
  background: #fff;
}
.container {
  max-width: var(--container);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 28px;
  align-items: start;
}
h1 {
  grid-column: 1 / -1;
  color: var(--primary);
  margin-bottom: 6px;
}
.form {
  background: #fff;
  padding: 18px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(20,20,20,0.04);
}
.row {
  margin-bottom: 12px;
}
.grid2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
label {
  font-weight: 600;
  color: var(--muted);
  display: block;
  margin-bottom: 6px;
}
input[type="text"],
input[type="number"],
select,
textarea {
  width: 100%;
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  outline: none;
  font-size: 14px;
  color: #111827;
}
.small-input {
  margin-left: 8px;
  width: 230px;
}
.category-row {
  display: flex;
  gap: 8px;
  align-items: center;
}
.sizes-row {
  display: flex;
  gap: 8px;
  align-items: center;
}
.chips {
  margin-top: 8px;
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 999px;
  background: #f3f4f6;
  margin-right: 8px;
  font-weight: 600;
  color: #374151;
}
.chip-x {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
}
.hint {
  font-size: 12px;
  color: var(--muted);
  margin-top: 6px;
}
.actions {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-top: 12px;
}
.btn {
  padding: 10px 14px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  background: white;
  cursor: pointer;
}
.btn.primary {
  background: var(--primary);
  color: white;
  border-color: var(--accent);
}
.btn.small {
  padding: 8px 10px;
}
.preview {
  position: sticky;
  top: 20px;
}
.card {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #eef2ff;
}
.card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  background: #f9fafb;
}
.card-body {
  padding: 12px;
}
.price {
  color: var(--primary);
  font-weight: 700;
  margin: 8px 0;
}
.meta {
  color: var(--muted);
  font-size: 13px;
}
.message {
  margin-top: 12px;
  color: var(--accent);
  font-weight: 600;
}
@media (max-width: 980px) {
  .container {
    grid-template-columns: 1fr;
  }
  .preview {
    position: relative;
  }
}
</style>
