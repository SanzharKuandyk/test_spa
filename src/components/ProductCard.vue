<script setup>
import { useRoute } from 'vue-router';

defineProps(['product']);
const route = useRoute();
</script>

<template>
  <router-link
    :to="{
      name: 'ProductDetailed',
      params: { id: product.id },
      query: route.query,
    }"
    class="group block rounded-2xl border border-border shadow-sm hover:shadow-lg transition duration-300 ease-in-out overflow-hidden bg-card w-[300px] h-[300px] flex flex-col"
  >
    <div class="relative w-full h-40 bg-muted overflow-hidden">
      <img
        :src="product.thumbnail"
        alt=""
        class="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
      >
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"
      />
    </div>

    <div class="p-3 flex-1 flex flex-col">
      <h2
        class="text-base font-semibold text-foreground group-hover:text-primary transition-colors overflow-hidden whitespace-nowrap text-ellipsis"
      >
        {{ product.title }}
      </h2>
      <p
        class="text-sm text-muted-foreground mb-1 overflow-hidden whitespace-nowrap text-ellipsis"
      >
        {{ product.category }}
      </p>
      <p class="font-bold text-primary mt-auto">
        ${{ product.price }}
      </p>
    </div>
  </router-link>
</template>
