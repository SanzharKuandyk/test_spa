import { createRouter, createWebHistory } from 'vue-router';
import ProductDetailed from '@/views/ProductDetailed.vue';
import ProductList from '@/views/ProductList.vue';

const routes = [
  {
    path: '/',
    name: 'ProductList',
    component: ProductList,
  },
  {
    path: '/product/:id',
    name: 'ProductDetailed',
    component: ProductDetailed,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
