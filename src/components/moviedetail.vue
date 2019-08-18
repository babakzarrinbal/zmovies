<template>
  <div id="maincontainer">
    <div class="btn close" @click="$emit('hide')">X</div>
    <div class="videocontainer">
      <video :src="currentlink"></video>
    </div>
    <div class="detail">
      <div class="title">{{movie.title}}</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      currentlink:''
    };
  },
  components: {},
  async created() {},
  methods: {},
  watch: {},
  computed: {
    movie() {
      return this.$root.movie;
    }
  }
};
</script>
<style scoped lang="scss">
#maincontainer {
  width: 100vw;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  background: white;
}
.btn.close {
  color: white;
}
.videocontainer {
  width: 100%;
  background: black;
  video {
    width: 100%;
  }
}
</style>