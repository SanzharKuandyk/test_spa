<script setup>
defineProps(['product']);
</script>

<template>
  <router-link
    :to="`/product/${product.id}`"
    class="border rounded-lg shadow p-4 hover:shadow-md transition"
  >
    <img
      :src="product.thumbnail"
      alt=""
      class="w-full h-48 object-cover mb-2"
    >
    <h2 class="font-bold text-lg">
      {{ product.title }}
    </h2>
    <p class="text-sm text-gray-500">
      {{ product.category }}
    </p>
    <p class="font-semibold">
      ${{ product.price }}
    </p>
  </router-link>
</template>
