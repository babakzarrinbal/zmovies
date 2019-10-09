<template>
  <div class="container-fluid pl-0 pr-0" style="margin:0;width:100%;max-width: 100%;">
    <textarea
      ref="textarea"
      :style="{'fontSize':pbsettings.fontsize+'px'}"
      id="texteditor"
      @click="showpopup=null"
      v-model="currstory"
    ></textarea>
    <div id="controllers">
      <div class="title">{{story.title||""}}</div>
      <div class="palyback">
        <div class="previous reverse button" @click="prev()">
          <img src="img/ttsicons/next.svg" alt="prev" class="btnimg" />
        </div>
        <div class="playpause button" @click="showpopup= null;play()">
          <img
            :src="'img/ttsicons/'+(playing?'pause':'play')+'.svg'"
            alt="play/pause"
            class="btnimg"
          />
        </div>
        <div class="next button" @click="next()">
          <img src="img/ttsicons/next.svg" alt="next " class="btnimg" />
        </div>
        <div class="goto reverse button" @click="goto()">
          <img src="img/ttsicons/refresh.svg" alt="goto button" class="btnimg" />
        </div>
      </div>

      <div class="menues">
        <div
          class="list button"
          :class="{'active': showpopup== 'list'}"
          @click="showpopup = showpopup== 'list'?null:'list'"
        >
          <img src="img/ttsicons/list.svg" alt="list" class="btnimg" />
        </div>
        <div
          class="bookmarks button"
          :class="{'active': showpopup == 'bookmark'}"
          @click="showpopup = showpopup == 'bookmark' ? null: 'bookmark'"
        >
          <img src="img/ttsicons/bookmark.svg" alt="bookmarks" class="btnimg" />
        </div>
        <div
          class="playbacksettings button"
          :class="{'active': showpopup== 'setting'}"
          @click="showpopup = showpopup == 'setting' ? null: 'setting'"
        >
          <img src="img/ttsicons/settings.svg" alt="playbacksettings" class="btnimg" />
        </div>
      </div>
    </div>
    <div v-if="showpopup == 'setting'" class="pbsettingspopup">
      <h5>Playback Settings</h5>
      <div class="inputs">
        <div class="checkbox">
          <label>
            <input type="checkbox" v-model="pbsettings.follow" />Follow
          </label>
        </div>
        <div class="form-group">
          <label style="margin:0;">Select Voice:</label>
          <select class="form-control" v-model="pbsettings.voice">
            <option v-for="(v, i) in pbsettings.voices" :value="v" :key="i">{{v.name}}</option>
          </select>
        </div>
        <div class="form-group numberinput">
          <label for="speed">Speed:</label>
          <div
            class="decrease"
            @click="pbsettings.speed =(pbsettings.speed- 0.1)<0?0:(pbsettings.speed - 0.1).round(1) "
          >
            <img src="img/ttsicons/minus.svg" class="signimg" />
          </div>
          <input
            type="number"
            class="form-control ninput"
            step="0.1"
            min="0"
            @change="pbsettings.speed = pbsettings.speed<0?0 :pbsettings.speed;"
            id="speed"
            v-model="pbsettings.speed"
          />
          <div
            class="increase"
            @click="pbsettings.speed =pbsettings.speed<0?0:(pbsettings.speed + 0.1).round(1) "
          >
            <img src="img/ttsicons/plus.svg" class="signimg" />
          </div>
        </div>
        <div class="form-group numberinput">
          <label for="pich">Pitch:</label>
          <div class="decrease" @click="pbsettings.pitch>0 &&  pbsettings.pitch--; ">
            <img src="img/ttsicons/minus.svg" class="signimg" />
          </div>
          <input
            type="number"
            class="form-control ninput"
            id="pitch"
            step="1"
            min="0"
            max="2"
            @change="pbsettings.pitch = pbsettings.pitch<0?0 :pbsettings.pitch>2?2 :pbsettings.pitch"
            v-model="pbsettings.pitch"
          />
          <div class="increase" @click="pbsettings.pitch<2 && pbsettings.pitch++">
            <img src="img/ttsicons/plus.svg" class="signimg" />
          </div>
        </div>
        <div class="form-group numberinput">
          <label for="fontsize">Font size:</label>
          <div class="decrease" @click="pbsettings.fontsize--">
            <img src="img/ttsicons/minus.svg" class="signimg" />
          </div>
          <input
            type="number"
            class="form-control ninput"
            min="1"
            step="1"
            id="fontsize"
            v-model="pbsettings.fontsize"
          />
          <div class="increase" @click="pbsettings.fontsize++">
            <img src="img/ttsicons/plus.svg" class="signimg" />
          </div>
        </div>
      </div>
    </div>
    <div v-if="showpopup == 'list'" class="storylistpopup">
      <h5 class="heading">
        <div class="listbtns newbtn btn btn-info" @click="newstory()">New</div>
        <div class="listbtns savebtn btn btn-primary" @click="importstory()">Import</div>
        <div class="listbtns importbtn btn btn-success" @click="savestorycontent()">Save</div>Stories
      </h5>
      <ul class="list-group">
        <li
          class="list-group-item"
          :class="{'active':s.active}"
          v-for="(s,i) in stories"
          :key="i"
          @click="selectstory(s.id)"
        >
          <span class="title">{{s.title}}</span>
          <span class="close" @click.stop="removestory(s)">X</span>
        </li>
      </ul>
    </div>
    <div v-if="showpopup == 'bookmark'" class="bookmarkspopup">bookmark</div>
  </div>
</template>

<script>
export default {
  name: "TTS",
  data() {
    let stories = JSON.parse(window.localStorage.getItem("ttsstories") || "[]");
    let story = stories.find(s => s.active) || {};
    let currstory = story.id
      ? window.localStorage.getItem("ttsstory_" + story.id) || ""
      : "";
    return {
      window,
      speech: window.speechSynthesis,
      stories,
      currstory,
      story,
      playing: false,
      currentspeechutterance: null,
      showpopup: null,
      pbsettings: {
        follow: true,
        voices: [],
        voice: null,
        speed: 1.3,
        pitch: 1,
        fontsize: 13
      }
    };
  },
  created() {
    let getvoicesinterval = window.setInterval(() => {
      let voices = window.speechSynthesis.getVoices();
      if (voices.length) {
        this.pbsettings.voices = voices;
        this.pbsettings.voice = this.pbsettings.voices[0];
        window.clearInterval(getvoicesinterval);
      }
    }, 500);

    // window.localStorage.setItem(
    //   "ttsstories",
    //   JSON.stringify([
    //     {
    //       id: 1,
    //       position: 5,
    //       title: "testing text",
    //       bookmarks: [{ id: 1, title: "test bookmark", from: 2, to: 4 }]
    //     }
    //   ])
    // );

    // window.localStorage.setItem(
    //   "ttsstory_1",
    //   `About six hours later, I walked out, Mom by my side. It was late afternoon, and I had eventually managed to puzzle together the little bits I could remember of the events of the morning. I had been cycling back home, following my usual route, when a delivery guy in a parked van had opened his door without checking for traffic. I had no recollection of the actual moment, but I guess I ended up flying through the air and hitting my head against the sidewalk -- leaving me with half-a-dozen stitches at the back of my head and a concussion. Nothing too serious, luckily -- even if, for the coming week and to be on the safe side, I had to avoid any significant exercise, as well as avoid being alone in the event of possible dizziness.
    //             The timing couldn't have been worse: my friends and I were supposed to go the very next day for a whole week of canyon adventuring, something that was obviously very much out of question now. Tagging along was not even an option, so basically, my vacation was a no-go.`
    // );
  },
  async beforeDestroy() {},
  methods: {
    async selectstory(id) {
      await this.savestory(false, true);
      if (id == this.story.id) {
        this.stories.find(s => s.id == id).active = false;
        this.currstory = "";
        this.story = {};
        return this.savestory();
      }
      this.story.active = false;
      this.play(false);
      this.story = this.stories.find(s => s.id == id);
      this.story.active = true;
      this.savestory();
      this.currstory =
        window.localStorage.getItem("ttsstory_" + this.story.id) || "";
    },
    async savestory(stories = true, story = false) {
      await null;
      stories &&
        window.localStorage.setItem("ttsstories", JSON.stringify(this.stories));
      story &&
        this.story.id &&
        window.localStorage.setItem(
          "ttsstory_" + this.story.id,
          this.currstory
        );
      return;
    },
    play(onoff = null) {
      if (onoff !== null) this.playing = !onoff;
      if (this.playing) {
        this.speech.cancel();
        this.playing = !this.playing;
        return;
      }
      this.playing = true;
      this.playingfunc();
    },
    playingfunc() {
      if (!this.playing || this.speech.speaking) return;
      this.savestory();
      let ta = this.$refs.textarea;
      if (this.story.position >= ta.value.length) {
        this.playing = false;
        return (this.story.position = 0);
      }
      let msg = new window.SpeechSynthesisUtterance();
      if (!this.story.position) this.story.position = -1;
      let firstsentence = window.Math.min(
        ta.value.indexOf(".", this.story.position + 1),
        ta.value.indexOf("\n", this.story.position + 1)
      );
      while (firstsentence != -1 && firstsentence - this.story.position < 15) {
        firstsentence = window.Math.min(
          ta.value.indexOf(".", firstsentence + 1),
          ta.value.indexOf("\n", firstsentence + 1)
        );
      }
      if (firstsentence - this.story.position > 500) {
        firstsentence = ta.value.indexOf(" ", this.story.position + 500);
      }
      firstsentence = firstsentence == -1 ? ta.value.length : firstsentence + 1;

      if (this.pbsettings.follow) {
        ta.selectionStart = this.story.position + 1;
        ta.selectionEnd = firstsentence;
        ta.blur();
        ta.focus();
      }
      msg.text = ta.value.slice(this.story.position + 1, firstsentence);
      if (this.pbsettings.voice) msg.voice = this.pbsettings.voice;
      msg.rate = this.pbsettings.speed;
      msg.pitch = this.pbsettings.pitch;
      let _self = this;
      msg.onend = function() {
        if (_self.playing) _self.story.position = firstsentence;
        return _self.playingfunc();
      };
      this.currentspeechutterance = msg;

      window.speechSynthesis.speak(msg);
    },
    async newstory() {
      this.story.active = false;
      await this.savestory();
      this.currstory = "";
      this.story = {};
    },
    async removestory(s) {
      if (!confirm("are you sure to delete \n" + s.title)) return;
      this.stories = this.stories.filter(st => s.id != st.id);
      if (this.story.id == s.id) {
        this.story = {};
        this.currstory = "";
        console.log(this.currstory);
      }
      this.savestory(true, true);
    },
    async importstory() {},
    async savestorycontent() {
      let title = this.story.title || "";
      while (title === "") {
        title = window.prompt("Story title");
      }
      if (!title) return;
      this.story.title = title;
      if (!this.story.id) {
        this.story.id = !this.stories.length
          ? 1
          : this.stories.reduce((max, c) => (c.id > max ? c.id : max), 1) + 1;
        this.stories.unshift(this.story);
      }
      this.story.active = true;
      await this.savestory(true, true);
      window.alert("story saved");
    },
    next() {
      if (!this.story.id) return;
      this.play(false);
      let ta = this.$refs.textarea;
      if (!this.story.position) this.story.position = -1;
      let firstsentence = window.Math.min(
        ta.value.indexOf(".", this.story.position + 1),
        ta.value.indexOf("\n", this.story.position + 1)
      );
      while (firstsentence != -1 && firstsentence - this.story.position < 15) {
        firstsentence = window.Math.min(
          ta.value.indexOf(".", firstsentence + 1),
          ta.value.indexOf("\n", firstsentence + 1)
        );
      }
      if (firstsentence - this.story.position > 500) {
        firstsentence = ta.value.indexOf(" ", this.story.position + 500);
      }
      firstsentence = firstsentence == -1 ? ta.value.length : firstsentence + 1;
      if (this.story.position >= ta.value.length) return;
      this.story.position = firstsentence;
      this.play(true);
    },
    async prev() {
      if (!this.story.id) return;
      await new Promise(resolve => {
        if (this.speech.speaking) {
          window.a = this.currentspeechutterance;
          if (!this.currentspeechutterance) return resolve();
          this.currentspeechutterance.onend = () => {
            resolve();
          };
          this.play(false);
        }
      });
      let ta = this.$refs.textarea;
      if (!this.story.position || this.story.position <= 0) {
        this.story.position = 0;
        return;
      }

      let firstsentence = window.Math.max(
        ta.value.lastIndexOf(".", this.story.position),
        ta.value.lastIndexOf("\n", this.story.position)
      );

      if (firstsentence == -1) {
        this.story.position = 0;
        this.play(true);
        return;
      }
      while (firstsentence != -1 && this.story.position - firstsentence < 15) {
        firstsentence = window.Math.max(
          ta.value.lastIndexOf(".", firstsentence - 1),
          ta.value.lastIndexOf("\n", firstsentence - 1)
        );
      }
      if (this.story.position - firstsentence > 500) {
        firstsentence = ta.value.lastIndexOf(" ", this.story.position - 500);
      }
      if (firstsentence == -1 || this.story.position <= 0) {
        this.story.position = 0;
        this.play(true);
        return;
      }

      this.story.position = firstsentence;
      this.play(true);
    },
    goto() {
      if (!this.story.id) return;
      this.play(false);
      let ta = this.$refs.textarea;
      this.story.position = ta.selectionStart || 0;
      this.play(true);
    }
  },
  computed: {}
};
</script>
<style lang="scss" scoped>
.container {
  padding-right: 0;
  padding-left: 0;
  overflow: hidden;
}
#texteditor {
  display: block;
  width: 100%;
  resize: none;
  height: calc(100% - 50px);
  padding: 10px 10px 70px 10px;
  border: none;
  outline: none;
}
#controllers {
  position: relative;
  height: 50px;
  width: 100%;
  display: flex;
  box-shadow: 0 -2px 7px gray;
  z-index: 2;
  .palyback {
    display: flex;
    background-color: #9d9df1;
    .button {
      width: 40px;
      height: 40px;
      flex-shrink: 0;
      @extend .flexcenter;
      padding: 5px;
      &.reverse {
        &:active {
          .btnimg {
            transform: translateY(-2px);
          }
        }
        transform: rotateZ(180deg);
        .btnimg {
          filter: drop-shadow(0px -5px 2px black);
          // box-shadow: 0px -5px 10px #1f1f1f;
        }
      }
      .btnimg {
        // background-color: #b567b4;;
        // box-shadow: 0px 5px 10px #1f1f1f;
        filter: drop-shadow(0px 5px 2px black);
        border-radius: 50%;
      }
      &:active {
        .btnimg {
          filter: none;
          transform: translateY(2px);
        }
      }
    }
  }
  .title {
    flex-grow: 1;
    line-height: 13px;
    font-size: 12px;
    font-weight: bold;
    margin: 5px;
    text-align: left;
    height: calc(100% - 10px);
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 3;
    text-overflow: ellipsis;
  }
  .menues {
    display: flex;
    position: absolute;
    top: -30px;
    right: 0;
    height: 30px;
    background-color: #9d9df1;
    border-bottom: 1px solid gray;
    border-radius: 10px 0 0;
    box-shadow: -2px -2px 7px gray;
    .button {
      width: 30px;
      padding: 5px;
      .btnimg {
        border-radius: 50%;
        filter: drop-shadow(0px 5px 2px black);
        transform: translateY(-2px);
      }
      &:active .btnimg {
        filter: none;
        transform: translateY(0);
      }
      &.active .btnimg {
        filter: none;
        transform: translateY(0);
        background-color: #656363;
        box-shadow: 0 0 10px 2px #3e3e3e;
      }
    }
  }
}
.pbsettingspopup,
.bookmarkspopup,
.storylistpopup {
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 50px;
  z-index: 1;
  height: calc(100% - 200px);
  background: white;
  box-shadow: 0 -5px 15px gray;
  padding: 10px;
}
.pbsettingspopup {
  .inputs {
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    height: calc(100% - 32px);
    overflow: auto;
    padding-bottom: 20px;
    .numberinput {
      @extend .flexcenter;
      label {
        margin: 0;
        flex-grow: 1;
        text-align: left;
      }
      .ninput {
        width: 50px;
        padding: 1px;
      }
      .decrease,
      .increase {
        margin: 0 10px;
        &:active {
          .signimg {
            transform: translatey(2px);
            filter: none;
          }
        }
      }
      .signimg {
        width: 30px;
        height: 30px;
        filter: drop-shadow(0px 5px 2px gray);
      }
    }
  }
}
.storylistpopup {
  .heading {
    position: relative;
  }
  .listbtns {
    position: absolute;
    padding: 0 10px;
    top: 0;
    &.newbtn {
      left: 0;
    }
    &.importbtn {
      left: 65px;
    }
    &.savebtn {
      right: 0;
    }
  }
  .list-group {
    height: calc(100% - 32px);
    overflow: auto;
    padding-bottom: 20px;
    .list-group-item {
      @extend .flexcenter;
      margin-bottom: 10px;
      padding: 5px;
      .title {
        text-align: left;
        flex-grow: 1;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
      .close {
        color: red;
        cursor: pointer;
      }
    }
  }
}

.flexcenter {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
