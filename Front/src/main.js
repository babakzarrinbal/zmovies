// my own proto functions
require("./utils/prototypes");
import serverconfig from "./config";
window.serverconfig = serverconfig;

// bootstrap css
import "bootstrap/dist/css/bootstrap.min.css";

// dateformatter
// var dateFormat = require("dateformat");
// Date.prototype.format = function(forma) {
//   return dateFormat(this, forma);
// };

//toastr
// window.toastr = require("toastr");
// window.toastr.options.preventDuplicates = true;
// import "toastr/build/toastr.min.css";

//socket
// import sio from "./connections/socket";

//http
import http from "./connections/http";

// custom styles
import "./scss/globalstyle.scss";
import "./scss/vue-transitions.scss";

// fast click to disable touch delay
var attachFastClick = require("fastclick");
attachFastClick.attach(document.body);

// prepairing vue
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
require("./serviceworker/registerServiceWorker");
Vue.mixin({
  data: function() {
    return {
      ...http
      // socket: sio.socket,
      // socketcall: sio.socketcall,
      // socketreconnect: sio.socketreconnect
    };
  }
});

// initializing app
Vue.config.productionTip = true;
new Vue({
  router,
  data: {
    user: null,
    showmoviedetail: false,
    movie: {}
  },
  render: h => h(App)
}).$mount("#app");
