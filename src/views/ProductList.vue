<script setup lang="ts">
import type { Product } from '../types/product';
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchProducts } from '@/api/product';
import Filters from '@/components/Filters.vue';
import ProductCard from '@/components/ProductCard.vue';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { useFiltersStore } from '@/store/filters';

const route = useRoute();
const router = useRouter();
const filtersStore = useFiltersStore();

const products = ref<Product[]>([]);
const totalProducts = ref(0);
const limit = ref(9);
const currentPage = ref(1);
const isLoading = ref(false);

// use cache
const categoryCache = ref<Record<string, Product[]>>({});

async function loadProducts(search: string, category: string, page: number) {
  isLoading.value = true;

  if (category === 'all') {
    const skip = (page - 1) * limit.value;
    const data = await fetchProducts(skip, limit.value, search, '');
    products.value = data.products;
    totalProducts.value = data.total;
  } else {
    // check cache first
    if (!categoryCache.value[category]) {
      const data = await fetchProducts(0, 1000, '', category);
      categoryCache.value[category] = data.products;
    }

    const filtered = categoryCache.value[category].filter(p =>
      p.title.toLowerCase().includes(search.toLowerCase()),
    );

    totalProducts.value = filtered.length;

    const skip = (page - 1) * limit.value;
    products.value = filtered.slice(skip, skip + limit.value);
  }

  isLoading.value = false;
}

function debounce<T extends (...args: any[]) => void>(fn: T, delay = 400) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeoutId)
      clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

const debouncedSearchUpdate = debounce((newSearch: string) => {
  router.replace({
    query: {
      search: newSearch || undefined,
      category:
        filtersStore.category !== 'all' ? filtersStore.category : undefined,
      page: undefined,
    },
  });
});

function immediateCategoryUpdate(newCategory: string) {
  router.replace({
    query: {
      search: filtersStore.search || undefined,
      category: newCategory !== 'all' ? newCategory : undefined,
      page: undefined,
    },
  });
}

watch(
  () => route.query,
  (newQuery) => {
    const search = (newQuery.search as string) || '';
    const category = (newQuery.category as string) || 'all';
    const page = Number(newQuery.page) || 1;

    filtersStore.search = search;
    filtersStore.category = category;
    currentPage.value = page;

    loadProducts(search, category, page);
  },
  { immediate: true },
);

watch(
  () => filtersStore.search,
  (newSearch) => {
    debouncedSearchUpdate(newSearch);
  },
);

watch(
  () => filtersStore.category,
  (newCategory) => {
    immediateCategoryUpdate(newCategory);
  },
);
</script>

<template>
  <div class="flex flex-col h-full w-full">
    <header class="mb-8">
      <h1 class="text-3xl font-extrabold text-center">
        Products
      </h1>
    </header>

    <div class="flex justify-center mb-6">
      <Filters />
    </div>

    <div class="flex-1 flex flex-col px-4">
      <div
        v-if="isLoading"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
      >
        <Skeleton v-for="n in 6" :key="n" class="h-64 w-full rounded-xl" />
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <ProductCard v-for="p in products" :key="p.id" :product="p" />
      </div>

      <div class="flex justify-center mt-8">
        <Pagination
          v-slot="{ page }"
          :items-per-page="limit"
          :total="totalProducts"
          :default-page="currentPage"
          @update:page="
            (newPage: number) => {
              router.replace({
                query: {
                  search: filtersStore.search || undefined,
                  category:
                    filtersStore.category !== 'all'
                      ? filtersStore.category
                      : undefined,
                  page: newPage !== 1 ? newPage : undefined,
                },
              });
            }
          "
        >
          <PaginationContent v-slot="{ items }">
            <PaginationPrevious
              :disabled="page === 1"
              class="bg-muted text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted-foreground hover:text-background transition-colors"
              @click="
                () => {
                  if (page > 1) {
                    router.replace({
                      query: {
                        search: filtersStore.search || undefined,
                        category:
                          filtersStore.category !== 'all'
                            ? filtersStore.category
                            : undefined,
                        page: page - 1 !== 1 ? page - 1 : undefined,
                      },
                    });
                  }
                }
              "
            />
            <template v-for="(item, index) in items" :key="index">
              <PaginationItem
                v-if="item.type === 'page'"
                :value="item.value"
                @click="
                  () => {
                    router.replace({
                      query: {
                        search: filtersStore.search || undefined,
                        category:
                          filtersStore.category !== 'all'
                            ? filtersStore.category
                            : undefined,
                        page: item.value !== 1 ? item.value : undefined,
                      },
                    });
                  }
                "
              >
                <Button
                  variant="outline"
                  size="icon"
                  class="transition-colors rounded-lg"
                  :class="{
                    'bg-primary text-primary-foreground font-semibold shadow-md border-primary hover:bg-primary/90':
                      item.value === currentPage,
                    'bg-muted text-muted-foreground hover:bg-muted-foreground/80 hover:text-background':
                      item.value !== currentPage,
                  }"
                >
                  {{ item.value }}
                </Button>
              </PaginationItem>
              <PaginationEllipsis
                v-else-if="item.type === 'ellipsis'"
                :index="index"
                class="text-muted-foreground"
              />
            </template>
            <PaginationNext
              :disabled="page * limit >= totalProducts"
              class="bg-muted text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted-foreground hover:text-background transition-colors"
              @click="
                () => {
                  if (page * limit < totalProducts) {
                    router.replace({
                      query: {
                        search: filtersStore.search || undefined,
                        category:
                          filtersStore.category !== 'all'
                            ? filtersStore.category
                            : undefined,
                        page: page + 1 !== 1 ? page + 1 : undefined,
                      },
                    });
                  }
                }
              "
            />
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  </div>
</template>
