<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFiltersStore } from '@/store/filters';
import { fetchCategoryList } from '../api/product';

const filtersStore = useFiltersStore();

const categories = ref<string[]>(['all']);

onMounted(async () => {
  try {
    const data = await fetchCategoryList();
    categories.value = ['all', ...data];
  } catch (err) {
    console.error('Failed to fetch categories:', err);
  }
});
</script>

<template>
  <div class="flex gap-4 items-center justify-center w-full max-w-[400px]">
    <Input
      v-model="filtersStore.search"
      placeholder="Search products..."
      class="w-64"
    />

    <Select v-model="filtersStore.category" class="w-40">
      <SelectTrigger class="bg-black text-white">
        <SelectValue placeholder="Select category" />
      </SelectTrigger>
      <SelectContent class="max-h-60 overflow-y-auto">
        <SelectItem v-for="cat in categories" :key="cat" :value="cat">
          {{ cat.charAt(0).toUpperCase() + cat.slice(1) }}
        </SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>
