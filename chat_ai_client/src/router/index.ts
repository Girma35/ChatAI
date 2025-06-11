import { createRouter, createWebHistory } from "vue-router";
import Home from '../views/Home.vue'
import Chat from "../views/Chat.vue";
import Auth from "../views/Auth.vue";

// import NotFound from "../views/NotFound.vue";
// import About from "../views/About.vue";
// import Register from "../views/Register.vue";
// import Dashboard from "../views/Dashboard.vue";
// import Profile from "../views/Profile.vue";

const routes = [
  { path : "/", name: "Home", component: Home },
  {  path: "/chat", name: "Chat", component: Chat },
  {path: "/auth", name: "Auth", component: Auth },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
