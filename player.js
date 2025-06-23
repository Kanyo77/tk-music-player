const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const playBtn = $(".btn-toggle-play");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const ramBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const play = $(".player");
const progress = $("#progress");
const myAudio = document.getElementById("audio");
const cd = $(".cd-thumb");
const isPlaying = false;
let isRandom = false;
let isRepeat = false;
const playlist = $(".playlist");

const app = {
  currentIndex: 0,

  song: [
    {
      name: "Hard Out Here",
      singer: "Lily Allen",
      path: "./audio/HardOutHere.mp3",
      image: "./image/image2.jpg",
    },
    {
      name: "Mad Tsai",
      singer: "Mad Tsai",
      path: "./audio/Boys Beware - Mad Tsai (Lyrics).mp3",
      image: "./image/image1.jpg",
    },
    {
      name: "Sad Boy",
      singer: "R3HAB & Jonas Blue",
      path: "./audio/R3HAB & Jonas Blue - Sad Boy (feat. Ava Max, Kylie Cantrall) (Visualizer).mp3",
      image: "./image/image3.jpg",
    },
    {
      name: "Alien",
      singer: "Galantis x Lucas & Steve x Ilira",
      path: "./audio/Galantis x Lucas & Steve x Ilira - Alien (Official Music Video).mp3",
      image: "./image/image4.jpg",
    },
    {
      name: "Whistle",
      singer: "Jax Jones & Calum Scott",
      path: "./audio/Jax Jones & Calum Scott - Whistle (Official Lyric Video).mp3",
      image: "./image/image5.jpg",
    },
  ],

  setConfig: function (key, value) {
    this.config[key] = value;
  },
  render: function () {
    const html = this.song.map((song, index) => {
      return `

    
      <div class="song ${
        index === this.currentIndex ? "active" : ""
      }" data-index="${index}">
          <div class="thumb" style="background-image: url('${song.image}')">
          </div>
          <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
          </div>
          <div class="option">
            <i class="fas fa-ellipsis-h"></i>
          </div>
       </div>
`;
    });
    playlist.innerHTML = html.join(" ");
  },
  handleEvents: function () {
    const cd = $(".cd");

    const _this = this;

    const cdWith = cd.offsetWidth;

    // Xử lý phóng to / thu nhỏ CD
    document.onscroll = function () {
      const scrollY = window.scrollY;
      const newcdWith = cdWith - scrollY;

      if (newcdWith > 0) {
        cd.style.width = newcdWith + "px";
      } else {
        cd.style.width = 0;
      }
    };
  },

  GetcurrentSong: function () {
    return this.song[this.currentIndex];
  },

  // Xử lý CD quay / dừng
  PlayMusic: function () {
    const cdamation = cd.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000,
      iterations: Infinity,
    });
    cdamation.pause();

    // Xử lý khi click play
    playBtn.onclick = function () {
      if (myAudio.paused) {
        myAudio.play();
        play.classList.add("playing");
        cdamation.play();
      } else {
        myAudio.pause();
        play.classList.remove("playing");
        cdamation.pause();
      }
    };

    // Khi tiến độ bài hát thay đổi
    myAudio.ontimeupdate = function () {
      const prosses = Math.floor(
        (myAudio.currentTime / myAudio.duration) * 100
      );
      progress.value = prosses;
    };

    progress.onchange = function (e) {
      const seekTime = (myAudio.duration / 100) * e.target.value;
      myAudio.currentTime = seekTime;
    };

    // Khi next song
    nextBtn.onclick = function () {
      if (isRandom) {
        app.RandomMusic();
      } else if (isRepeat) {
        app.Eepea();
      } else {
        app.NextMusic();
      }

      myAudio.play();
      app.render();
      app.scrollToActiveSong();
    };

    // Khi prev song
    prevBtn.onclick = function () {
      if (isRandom) {
        app.RandomMusic();
      } else if (isRepeat) {
        app.Eepea();
      } else {
        app.PrevMusic();
      }
      myAudio.play();
      app.render();
      app.scrollToActiveSong();
    };

    // Xử lý bật / tắt random song
    ramBtn.onclick = function (e) {
      isRandom = !isRandom;
      if (isRandom) {
        ramBtn.classList.add("active");
      } else {
        ramBtn.classList.remove("active");
      }
    };

    // Xử lý next song khi audio ended
    myAudio.onended = function () {
      if (isRandom) {
        app.RandomMusic();
      } else if (isRepeat) {
        // app.RandomMusic()
        app.Eepea();
      } else {
        app.NextMusic();
      }
      myAudio.play();
      app.render();
      app.scrollToActiveSong();
    };

    // Xử lý lặp lại một song
    repeatBtn.onclick = function () {
      isRepeat = !isRepeat;
      if (isRepeat) {
        repeatBtn.classList.add("active");
      } else {
        repeatBtn.classList.remove("active");
      }
    };

    // Listen to playlist clicks
    playlist.onclick = function (e) {
      const songElement = e.target.closest(".song:not(.active)");

      if (songElement || e.target.closest(".option")) {
        if (songElement) {
          console.log(songElement.getAttribute("data-index"));
        }
        if (e.target.closest(".option")) {
        }
      }

      app.currentIndex = Number(songElement.dataset.index);
      app.LoadcurrentSong();
      app.render();
      myAudio.play();
    };
  },
  LoadcurrentSong: function () {
    const heading = $("h2");
    const cd = $(".cd-thumb");
    const audio = $("audio");
    const current = this.GetcurrentSong();

    heading.textContent = current.name;
    cd.style.backgroundImage = `url('${current.image}')`;
    audio.src = current.path;
    console.log(heading, cd, audio);
  },
  NextMusic: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.song.length) {
      this.currentIndex = 0;
    }
    this.LoadcurrentSong();
  },
  PrevMusic: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.song.length - 1;
    }
    this.LoadcurrentSong();
  },
  RandomMusic: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.song.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.LoadcurrentSong();

    myAudio.play();
    console.log(newIndex);
  },
  Eepea: function () {
    myAudio.currentTime = 0;
  },
  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 300);
  },

  start: function () {
    this.handleEvents();
    this.render();
    this.GetcurrentSong();
    this.LoadcurrentSong();
    this.scrollToActiveSong();
    this.PlayMusic();
  },
};
app.start();
