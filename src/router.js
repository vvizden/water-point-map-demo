import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/map",
      redirect: "/map/" + new Date().getFullYear()
    },
    {
      path: "/map/:year",
      name: "map-year",
      component: () => import("./views/BMap.vue"),
      props: true
    },
    {
      path: "/",
      redirect: "/map"
    },
    {
      path: "*",
      redirect: "/map"
    },
    {
      path: "/home",
      name: "home",
      component: Home
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
    }
  ]
});
