<template>
  <div class="container">
    <div>
      <br />
      <div v-if="!restaurants.length" class="alert alert-warning">No Record for this Time Period</div>
      <div v-for="item in restaurants" :key="item.driver_id" class="list-group mb-3">
        <div
          class="d-flex flex-column bz-card bg-light"
          @click="detailshow_id = detailshow_id== item.restaurant_id  ?  null : item.restaurant_id;$event.target.scrollIntoView(true);"
        >
          <div class="p-2">
            <div class="d-flex text-left flex-wrap justify-content-between">
              <div class="m-1">
                <strong>{{item.name}}</strong>
              </div>
              <div class="m-1" v-on:click.stop>
                <a :href="'tel:' + item.phone">Call</a>
              </div>
            </div>
            <div class="d-flex small text-left flex-wrap justify-content-between">
              <div class="m-1">
                <strong>Orders Milage (km):</strong>
                {{item.total_milage}}
              </div>
              <div class="m-1">
                <strong>Income (£):</strong>
                {{item.total_cost}}
              </div>

              <div class="m-1">
                <strong>Orders:</strong>
                {{item.total_orders}}
              </div>
            </div>
          </div>

          <div v-if="detailshow_id == item.restaurant_id" class="mt-2" style="background: #ffef96">
            <div
              v-for="(itm, idx) in item.orders"
              :key="idx"
              class="border-bottom p-2 border-danger small"
            >
              <div class="d-flex flex-wrap justify-content-between text-left">
                <div class="m-1">
                  Income (£):
                  {{itm.total}}
                </div>
                <div class="m-1">
                  Order id:
                  {{itm.order_id}}
                </div>

                <div class="m-1">
                  Milage (km):
                  {{itm.milage}}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Merchants",
  data() {
    return {
      detailshow_id: null
    };
  },
  async beforeDestroy() {},
  methods: {},
  computed: {
    restaurants() {
      // let drivers = ((this.$root.mainData || {}).drivers || []).slice();
      let orders = ((this.$root.mainData || {}).orders || []).slice();
      // let shifts = ((this.$root.mainData || {}).shifts || []).slice();
      return orders.reduce((result, o) => {
        let restaurant = result.find(
          r => r._id == (o.restaurant_id || {})._id || null
        );
        if (!restaurant) {
          restaurant = {
            _id: (o.restaurant_id || {})._id || null,
            restaurant_id: (o.restaurant_id || {})._id || "ptp",
            name: o.restaurant_id
              ? o.restaurant_id.restaurantname
              : "Point To Point",
            phone: o.restaurant_id
              ? "tel:" +
                (o.restaurant_id.phone || {}).code +
                (o.restaurant_id.phone || {}).number
              : "",
            total_cost: 0,
            total_milage: 0,
            total_orders: 0,
            orders: []
          };
          result.push(restaurant);
        }
        let order = {
          total: o.billings.amount.total || 0,
          order_id: o.order_id,
          milage: Math.bzround((o.delivery_milage || {}).total || 0, 2)
        };
        restaurant.orders.push(order);
        restaurant.total_cost += order.total;
        restaurant.total_cost = Math.bzround(restaurant.total_cost, 2);
        restaurant.total_milage += order.milage;
        restaurant.total_milage = Math.bzround(restaurant.total_milage, 2);
        restaurant.total_orders += 1;
        return result;
      }, []);
    },
    finalData: function() {
      let result = [];
      let drivers = ((this.$root.mainData || {}).drivers || []).slice();
      let orders = ((this.$root.mainData || {}).orders || []).slice();
      let shifts = ((this.$root.mainData || {}).shifts || []).slice();
      if (!orders && !drivers && !shifts) return result;
      let restaurants = {};
      for (let item of orders) {
        if (!item.restaurant_id) {
          restaurants.ptp.push(item);
        }
        if (restaurants[item.restaurant_id._id]) {
          restaurants[item.restaurant_id._id].push(item);
        } else {
          restaurants[item.restaurant_id._id] = [];
          restaurants[item.restaurant_id._id].push(item);
        }
      }
      for (let restaurant of Object.keys(restaurants)) {
        var tmp_obj = {};
        var total_cost = 0;
        var total_milage = 0;
        tmp_obj.restaurant_id = restaurant;
        tmp_obj.total_orders = restaurants[restaurant].length;
        tmp_obj.orders = [];
        for (let order of restaurants[restaurant]) {
          let tmp_order = {};
          total_cost += order.billings.amount.total || 0;
          tmp_obj.name = order.restaurant_id.restaurantname || "";
          tmp_obj.phone =
            "tel:" +
            (order.restaurant_id.phone || {}).code +
            (order.restaurant_id.phone || {}).number;
          tmp_order.total = order.billings.amount.total || 0;
          tmp_order.order_id = order.order_id;
          tmp_order.milage = (
            (order.delivery_milage || {}).deliver || 0
          ).toFixed(2);
          total_milage += (order.delivery_milage || {}).deliver || 0;
          tmp_obj.orders.push(tmp_order);
        }
        tmp_obj.total_cost = Math.bzround(total_cost.toFixed(2), 2);
        tmp_obj.total_milage = total_milage.toFixed(2);
        result.push(tmp_obj);
      }
      console.log(result);
      return result.sort((a, b) => (a.total_orders > b.total_orders ? -1 : 1));
    }
  }
};
</script>
