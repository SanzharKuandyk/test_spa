<script setup lang="ts">
import type { Product } from '../types/product';
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchProducts } from '@/api/product';
import Filters from '@/components/Filters.vue';
import ProductCard from '@/components/ProductCard.vue';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Button } from '../components/ui/button';

const products = ref<Product[]>([]);
const filteredProducts = ref<Product[]>([]);
const isLoading = ref(false);
const currentPage = ref(1);
const totalProducts = ref(0);
const limit = ref(12);

const route = useRoute();
const router = useRouter();

let debounceTimer: number;

async function loadProducts(search: string, category: string, page = 1) {
  isLoading.value = true;
  const skip = (page - 1) * limit.value;

  let data;
  let filtered = [];

  if (category && category !== 'all') {
    // fetch by category, ignore search in API
    data = await fetchProducts(skip, limit.value, '', category);

    // local search filtering
    if (search) {
      filtered = data.products.filter((p: Product) =>
        p.title.toLowerCase().includes(search.toLowerCase()),
      );
    } else {
      filtered = data.products;
    }

    totalProducts.value = filtered.length;
  } else if (search) {
    // fetch by search
    data = await fetchProducts(skip, limit.value, search, '');

    filtered = data.products;
    totalProducts.value = data.total;
  } else {
    // fetch all
    data = await fetchProducts(skip, limit.value, '', '');
    filtered = data.products;
    totalProducts.value = data.total;
  }

  products.value = filtered;
  filteredProducts.value = filtered;
  isLoading.value = false;
}

function changePage(page: number) {
  router.replace({
    query: {
      ...route.query,
      page: page !== 1 ? page : undefined,
    },
  });
}

watch(
  () => [route.query.category, route.query.search, route.query.page],
  ([newCategory, newSearch, newPage], oldValue) => {
    const [oldCategory, oldSearch, _] = oldValue || [];

    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      const isSearchChanged = newSearch !== oldSearch;
      const isCategoryChanged = newCategory !== oldCategory;

      if (isSearchChanged || isCategoryChanged) {
        currentPage.value = 1;
        router.replace({
          query: {
            ...route.query,
            page: undefined,
            search: newSearch || undefined,
            category: newCategory || undefined,
          },
        });
      } else {
        currentPage.value = Number(newPage) || 1;
      }

      loadProducts(
        (newSearch as string) || '',
        (newCategory as string) || '',
        currentPage.value,
      );
    }, 300);
  },
  { immediate: true },
);
</script>

<template>
  <div class="flex flex-col h-full w-full">
    <header class="mb-6">
      <h1 class="text-2xl font-bold text-center">
        Products
      </h1>
    </header>

    <div class="flex justify-center mb-6">
      <Filters class="w-[400px]" />
    </div>

    <div class="flex-1 flex flex-col px-4">
      <div v-if="isLoading" class="text-center p-4">
        Loading products...
      </div>

      <div v-else class="flex-1 overflow-auto max-h-[600px]">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ProductCard v-for="p in filteredProducts" :key="p.id" :product="p" />
        </div>
      </div>

      <div class="flex justify-center mt-4 text-white">
        <Pagination
          v-slot="{ page }"
          :items-per-page="limit"
          :total="totalProducts"
          :default-page="currentPage"
          @update:page="changePage"
        >
          <PaginationContent v-slot="{ items }">
            <PaginationPrevious
              :disabled="page === 1"
              class="text-white hover:text-blue-500"
              @click="changePage(page - 1)"
            />

            <template v-for="(item, index) in items" :key="index">
              <PaginationItem
                v-if="item.type === 'page'"
                :value="item.value"
                @click="changePage(item.value)"
              >
                <Button
                  class="w-10 h-10 p-0 text-white hover:text-blue-500"
                  variant="outline"
                  :style="
                    item.value === currentPage
                      ? 'background-color: #2563eb; color: white; border-color: #2563eb;'
                      : ''
                  "
                >
                  {{ item.value }}
                </Button>
              </PaginationItem>

              <PaginationEllipsis
                v-else-if="item.type === 'ellipsis'"
                :index="index"
              />
            </template>

            <PaginationNext
              :disabled="page * limit >= totalProducts"
              class="text-white hover:text-blue-500"
              @click="changePage(page + 1)"
            />
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  </div>
</template>
