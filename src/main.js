import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./plugins/ant-design-vue.js";
import BaiduMap from "vue-baidu-map";
import { List } from "ant-design-vue";

Vue.use(BaiduMap, {
  ak: "77MUSztR6Sy9KHUhZMXRSfTG7ujgOGEx"
});

Vue.use(List);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
