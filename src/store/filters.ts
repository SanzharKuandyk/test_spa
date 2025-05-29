import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useFiltersStore = defineStore('filters', () => {
  const search = ref('');
  const category = ref('all');
  const page = ref(1);

  return { search, category, page };
});
