<template>
  <main>
    <section class="contact-hero">
      <div class="container">
        <h1>Contact Us</h1>
        <p>
          We’d love to hear from you! Whether you have questions about our products, manufacturing capabilities, or partnership opportunities, our team is ready to assist.
        </p>
      </div>
    </section>

    <section class="contact-form-section">
      <div class="container">
        <form @submit.prevent="handleSubmit" class="contact-form" novalidate>
          <div class="form-group">
            <label for="name">Full Name<span aria-hidden="true">*</span></label>
            <input
              id="name"
              type="text"
              v-model="form.name"
              required
              aria-required="true"
              :aria-invalid="errors.name ? 'true' : 'false'"
              :aria-describedby="errors.name ? 'name-error' : null"
              placeholder="Your full name"
            />
            <p v-if="errors.name" id="name-error" class="error-msg">{{ errors.name }}</p>
          </div>

          <div class="form-group">
            <label for="email">Email Address<span aria-hidden="true">*</span></label>
            <input
              id="email"
              type="email"
              v-model="form.email"
              required
              aria-required="true"
              :aria-invalid="errors.email ? 'true' : 'false'"
              :aria-describedby="errors.email ? 'email-error' : null"
              placeholder="you@example.com"
            />
            <p v-if="errors.email" id="email-error" class="error-msg">{{ errors.email }}</p>
          </div>

          <div class="form-group">
            <label for="subject">Subject<span aria-hidden="true">*</span></label>
            <input
              id="subject"
              type="text"
              v-model="form.subject"
              required
              aria-required="true"
              :aria-invalid="errors.subject ? 'true' : 'false'"
              :aria-describedby="errors.subject ? 'subject-error' : null"
              placeholder="Subject of your message"
            />
            <p v-if="errors.subject" id="subject-error" class="error-msg">{{ errors.subject }}</p>
          </div>

          <div class="form-group">
            <label for="message">Message<span aria-hidden="true">*</span></label>
            <textarea
              id="message"
              v-model="form.message"
              required
              aria-required="true"
              :aria-invalid="errors.message ? 'true' : 'false'"
              :aria-describedby="errors.message ? 'message-error' : null"
              placeholder="Write your message here"
              rows="6"
            ></textarea>
            <p v-if="errors.message" id="message-error" class="error-msg">{{ errors.message }}</p>
          </div>

          <button type="submit" class="btn btn-primary">Send Message</button>

          <p v-if="successMessage" class="success-msg" role="alert">{{ successMessage }}</p>
        </form>
      </div>
    </section>

    <section class="contact-info">
      <div class="container">
        <h2>Our Contact Information</h2>
        <p>
          <strong>Address:</strong> 123 Industrial Park, Manufacturing City, Country<br />
          <strong>Phone:</strong> +1 (555) 123-4567<br />
          <strong>Email:</strong> info@abcglovecorp.com
        </p>
      </div>
    </section>
  </main>
</template>

<script>
export default {
  name: 'ContactPage',
  data() {
    return {
      form: {
        name: '',
        email: '',
        subject: '',
        message: '',
      },
      errors: {},
      successMessage: '',
    };
  },
  methods: {
    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },
    validateForm() {
      this.errors = {};

      if (!this.form.name.trim()) {
        this.errors.name = 'Name is required.';
      }
      if (!this.form.email.trim()) {
        this.errors.email = 'Email is required.';
      } else if (!this.validateEmail(this.form.email)) {
        this.errors.email = 'Please enter a valid email address.';
      }
      if (!this.form.subject.trim()) {
        this.errors.subject = 'Subject is required.';
      }
      if (!this.form.message.trim()) {
        this.errors.message = 'Message is required.';
      }

      return Object.keys(this.errors).length === 0;
    },
    handleSubmit() {
      if (this.validateForm()) {
        // Here you would normally send the form data to a server or API
        // For this example, we just simulate success
        this.successMessage = 'Thank you for contacting us! We will get back to you shortly.';
        this.form = {
          name: '',
          email: '',
          subject: '',
          message: '',
        };
        this.errors = {};
      } else {
        this.successMessage = '';
      }
    },
  },
};
</script>

<style scoped>
.container {
  max-width: var(--container);
  margin-inline: auto;
  padding: 0 1rem;
}

.contact-hero {
  padding: clamp(3rem, 5vw, 5rem) 0 2rem;
  text-align: center;
}

.contact-hero h1 {
  font-size: clamp(2.5rem, 6vw, 4rem);
  margin-bottom: 0.5rem;
}

.contact-hero p {
  font-size: 1.1rem;
  color: var(--muted);
  max-width: 600px;
  margin-inline: auto;
}

.contact-form-section {
  padding: clamp(2rem, 4vw, 4rem) 0;
}

.contact-form {
  max-width: 600px;
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: 600;
  margin-bottom: 0.4rem;
  color: var(--accent);
}

input,
textarea {
  padding: 0.65rem 1rem;
  border: 1.5px solid var(--muted);
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.3s ease;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 6px var(--primary);
}

.error-msg {
  color: #d9534f;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.success-msg {
  margin-top: 1rem;
  color: #28a745;
  font-weight: 600;
  font-size: 1rem;
  text-align: center;
}

button.btn-primary {
  background-color: var(--primary);
  color: white;
  border: none;
  padding: 0.85rem 1.5rem;
  font-weight: 700;
  font-size: 1.1rem;
  border-radius: 9999px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  align-self: flex-start;
}

button.btn-primary:hover {
  background-color: var(--accent);
}

.contact-info {
  padding: clamp(3rem, 5vw, 5rem) 0;
  text-align: center;
  color: var(--muted);
  font-size: 1.05rem;
  max-width: 600px;
  margin-inline: auto;
}

.contact-info h2 {
  font-size: clamp(2rem, 5vw, 3rem);
  margin-bottom: 1rem;
  color: var(--accent);
}

@media (max-width: 600px) {
  .contact-form {
    max-width: 100%;
  }

  .contact-info {
    padding: 2rem 1rem;
  }
}
</style>
