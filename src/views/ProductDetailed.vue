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
  <div class="p-6">
    <router-link to="/" class="text-blue-500">
      &larr; Back to Products
    </router-link>
    <div v-if="product" class="max-w-2xl mx-auto mt-6">
      <img
        :src="product.thumbnail"
        alt=""
        class="w-full h-64 object-cover mb-4"
      >
      <h1 class="text-3xl font-bold mb-2">
        {{ product.title }}
      </h1>
      <p class="text-lg text-gray-600 mb-2">
        {{ product.category }}
      </p>
      <p class="text-xl font-semibold mb-4">
        ${{ product.price }}
      </p>
      <p class="text-gray-700">
        {{ product.description }}
      </p>
    </div>
    <div v-else class="text-center p-4">
      Loading product...
    </div>
  </div>
</template>
