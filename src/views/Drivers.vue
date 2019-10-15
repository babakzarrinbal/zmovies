<template>
  <div class="container">
    <div class="btn btn-success my-2" syle="width:150px" @click="startrecognition()">start</div>
    <br />
    <textarea class="w-100 mt-2" v-model="text"></textarea>
  </div>
</template>

<script>
export default {
  name: "Drivers",
  data() {
    return {
      text: "",
      recognition: new window.webkitSpeechRecognition()
    };
  },
  async beforeDestroy() {},
  methods: {
    startrecognition() {
      let _self = this;
      this.recognition.abort();
      this.recognition.start();
      this.recognition.onresult = ev => {
        _self.text = ev.results[0][0].transcript;
      };
    }
  },
  computed: {}
};
</script>
