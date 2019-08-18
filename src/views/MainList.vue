<template>
  <div class="home container">
    <div class="movielistcontainer">
      <div v-for="m in movies" :key="m._id" class="d-flex movie">
        <div class="imgcontainer">
          <img :src="m.img" alt />
        </div>
        <div class="description">
          <div class="header">
            <span>{{m.year}}</span>
            <span v-if="m.toyear">- {{m.toyear}}</span>
            <span>{{m.title}}</span>
          </div>
          <div class="body">
            <span>country: {{m.countries.join(", ")}}</span>
            <a :href="'https://imdb.com/title/'+m.imdbid" target="_blank">more</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Dashboard",
  data() {
    return {
      movies: [],
      imdbid: "",
      window
    };
  },
  async created() {
    this.movies = await window
      .fetch("db/movies/list/lastupdated/1.json", {cache: "no-store"})
      .then(res => res.json());
  },
  mounted() {},
  async beforeDestroy() {},
  methods: {},
  computed: {}
};
</script>

<style scoped>
.title {
  font-size: 2rem;
  color: white;
  padding: 30px;
}
</style>
