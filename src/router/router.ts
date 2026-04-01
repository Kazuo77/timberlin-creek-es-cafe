import { createRouter, createWebHashHistory } from 'vue-router';
import WelcomePage from '../pages/WelcomePage.vue';
import MainPage from '../pages/MainPage.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: WelcomePage },
    { path: '/main', component: MainPage },
  ],
});

export default router;
