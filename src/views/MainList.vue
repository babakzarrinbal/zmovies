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
      movies: [
        {
          _id: 1,
          year: 2018,
          toyear: 2019,
          title: "testmovie",
          img:
            "https://m.media-amazon.com/images/M/MV5BMTAzNDNkYTItMTcyNi00ZTEyLWJhMjgtZDI4MjBmMzg1ZWI5XkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_UX182_CR0,0,182,268_AL_.jpg",
          imdbid: "tt5168736",
          countries: ["us", "ca", "uk"],
          imdbrate: 5.7,
          trailers: [
            {
              releasedate: "",
              links: [{ url: "", quality: "" }]
            }
          ],
          links: [
            {
              quality: "480p",
              url: "https://links.com/links.mkv",
              extractpage: "https://test.test"
            },
            {
              quality: "720p",
              url: "https://links.com/links.mkv",
              extractpage: "https://test.test"
            }
          ]
        },
        {
          _id: 2,
          year: 2019,
          toyear: 0,
          title: "testmovie2",
          img: "https://test.com/img.png",
          imdbid: "tt4236770",
          countries: ["us", "ca", "uk"],
          imdbrate: 5.7,
          links: [
            {
              quality: "480p",
              url: "https://links.com/links.mkv",
              extractpage: "https://test.test"
            },
            {
              quality: "720p",
              url: "https://links.com/links.mkv",
              extractpage: "https://test.test"
            }
          ]
        },
        {
          _id: 3,
          year: 2018,
          toyear: 0,
          title: "testmovie3",
          img: "https://test.com/img.png",
          imdbid: "tt9151704",
          countries: ["us"],
          imdbrate: 5.7,
          links: [
            {
              quality: "480p",
              url: "https://links.com/links.mkv",
              extractpage: "https://test.test"
            },
            {
              quality: "720p",
              url: "https://links.com/links.mkv",
              extractpage: "https://test.test"
            }
          ]
        }
      ],
      imdbid: "",
      window
    };
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
