<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const product = ref(null);

onMounted(async () => {
  const res = await fetch(`https://dummyjson.com/products/${route.params.id}`);
  product.value = await res.json();
});
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto">
    <router-link
      :to="{ path: '/', query: route.query }"
      class="text-blue-500 hover:text-blue-700 inline-flex items-center mb-4"
    >
      <svg
        class="w-4 h-4 mr-1"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15 19l-7-7 7-7"
        />
      </svg>
      Back to Products
    </router-link>

    <div
      v-if="product"
      class="bg-white rounded-2xl shadow-md p-6 grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      <img
        :src="product.thumbnail"
        alt=""
        class="w-full h-full object-cover rounded-lg"
      >
      <div>
        <h1 class="text-3xl font-bold mb-2 text-blue-600">
          {{ product.title }}
        </h1>
        <p class="text-lg text-gray-600 mb-1">
          {{ product.category }}
        </p>
        <p class="text-2xl font-bold text-green-600 mb-4">
          ${{ product.price }}
        </p>
        <p class="text-gray-700">
          {{ product.description }}
        </p>
      </div>
    </div>

    <div v-else class="text-center p-6 text-lg text-gray-500">
      Loading product...
    </div>
  </div>
</template>
