<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { fetchCategoryList } from '../api/product';

const route = useRoute();
const router = useRouter();

const search = ref(route.query.search || '');
const category = ref(route.query.category || '');
const categories = ref(['all']);

onMounted(async () => {
  try {
    const data = await fetchCategoryList();
    categories.value = ['all', ...data];
  } catch (err) {
    console.error('Failed to fetch categories:', err);
  }
});

watch([search, category], () => {
  const c = category.value === 'all' ? '' : category.value;
  router.replace({
    query: {
      ...route.query,
      search: search.value || undefined,
      category: c || undefined,
    },
  });
});
</script>

<template>
  <div class="flex gap-4 items-center justify-center w-full max-w-[400px]">
    <Input v-model="search" placeholder="Search products..." class="w-64" />
    <Select v-model="category" class="w-40">
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
