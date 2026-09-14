/* ==========================================================
   CẤU HÌNH CỦA BẠN
========================================================== */

/*
   MẬT KHẨU
*/
const ACCESS_PASSWORD = "06092026";


/*
   GỢI Ý MẬT KHẨU
*/
const PASSWORD_HINT =
  "Gợi ý: mật khẩu là ngày đầu tiên:).";


/*
   DÒNG DỪNG
   line_index = 23:

   "Giờ đây mất đi hai trái tim lẻ loi"
*/
const STOP_LINE_INDEX = 23;


/*
   Tên sẽ hiện sau countdown
*/
const SPECIAL_TEXT = "Trân";


/*
   Countdown bắt đầu ngay khi timestamp
   của từ cuối cùng kết thúc.

   0 = dừng đúng timestamp
   0.03 = dừng sớm 30ms
   0.06 = dừng sớm 60ms
*/
const STOP_EARLY_SECONDS = 0.06;


/*
   Thời lượng countdown.

   Sẽ hiển thị:

   5
   4
   3
   2
   1
   0

   Sau đó mới hiện ♥ Trân.
*/
const COUNTDOWN_START = 5;


/* ==========================================================
   DOM
========================================================== */

const passwordScreen =
  document.getElementById("passwordScreen");

const passwordHint =
  document.getElementById("passwordHint");

const passwordInput =
  document.getElementById("passwordInput");

const passwordToggle =
  document.getElementById("passwordToggle");

const unlockButton =
  document.getElementById("unlockButton");

const passwordError =
  document.getElementById("passwordError");

const welcome =
  document.getElementById("welcome");

const startButton =
  document.getElementById("startButton");

const statusEl =
  document.getElementById("status");

const lyricStage =
  document.getElementById("lyricStage");

const lineText =
  document.getElementById("lineText");

const countdown =
  document.getElementById("countdown");

const countdownNumber =
  document.getElementById("countdownNumber");

const special =
  document.getElementById("special");

const restartButton =
  document.getElementById("restartButton");

const media =
  document.getElementById("media");

const heartParticles =
  document.getElementById("heartParticles");


/* ==========================================================
   STATE
========================================================== */

let words = [];
let lines = [];

let currentLineIndex = -1;

let started = false;
let finished = false;

let lastRenderedWord = -1;

let rafId = 0;

let countdownTimer = null;
let countdownInterval = null;


/* ==========================================================
   PASSWORD
========================================================== */

passwordHint.textContent =
  PASSWORD_HINT;


/*
   Hiện / ẩn mật khẩu
*/
passwordToggle.addEventListener(
  "click",
  () => {

    if (
      passwordInput.type === "password"
    ) {

      passwordInput.type = "text";

      passwordToggle.textContent =
        "🙈";

    } else {

      passwordInput.type =
        "password";

      passwordToggle.textContent =
        "👁";
    }
  }
);


/*
   Kiểm tra mật khẩu
*/
function unlock() {

  const value =
    passwordInput.value.trim();


  if (!value) {

    passwordError.textContent =
      "Bạn chưa nhập mật khẩu.";

    return;
  }


  if (
    value !== ACCESS_PASSWORD
  ) {

    passwordError.textContent =
      "Mật khẩu không đúng.";

    passwordInput.focus();

    passwordInput.select();

    return;
  }


  /*
     ĐÚNG MẬT KHẨU
  */

  passwordError.textContent =
    "";

  passwordScreen.classList.add(
    "hidden"
  );


  setTimeout(
    () => {

      welcome.classList.remove(
        "hidden-screen"
      );

    },
    350
  );
}


unlockButton.addEventListener(
  "click",
  unlock
);


/*
   Nhấn Enter
*/
passwordInput.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Enter"
    ) {

      unlock();
    }
  }
);


/* ==========================================================
   BACKGROUND STARS
========================================================== */

function createStars() {

  const host =
    document.getElementById("stars");


  for (
    let i = 0;
    i < 180;
    i++
  ) {

    const el =
      document.createElement(
        "span"
      );

    el.className =
      "star";


    const size =
      Math.random() * 2.3 + 0.6;


    el.style.width =
      `${size}px`;

    el.style.height =
      `${size}px`;


    el.style.left =
      `${Math.random() * 100}%`;

    el.style.top =
      `${Math.random() * 100}%`;


    el.style.setProperty(
      "--dur",
      `${2 + Math.random() * 5}s`
    );


    el.style.animationDelay =
      `${-Math.random() * 6}s`;


    host.appendChild(el);
  }
}


/* ==========================================================
   BACKGROUND PARTICLES
========================================================== */

function createParticles() {

  const host =
    document.getElementById("particles");


  const hues = [
    190,
    220,
    250,
    280,
    310,
    335
  ];


  for (
    let i = 0;
    i < 45;
    i++
  ) {

    const el =
      document.createElement(
        "span"
      );

    el.className =
      "particle";


    const size =
      Math.random() * 4 + 1;


    el.style.width =
      `${size}px`;

    el.style.height =
      `${size}px`;


    el.style.left =
      `${Math.random() * 100}%`;

    el.style.top =
      `${85 + Math.random() * 20}%`;


    el.style.color =
      `hsla(
        ${hues[i % hues.length]},
        100%,
        74%,
        .9
      )`;


    el.style.background =
      "currentColor";


    el.style.setProperty(
      "--dx",
      `${(Math.random() - 0.5) * 30}vw`
    );


    el.style.setProperty(
      "--dur",
      `${10 + Math.random() * 18}s`
    );


    el.style.animationDelay =
      `${-Math.random() * 18}s`;


    host.appendChild(el);
  }
}


/* ==========================================================
   NORMALIZE
========================================================== */

function normalizeWord(value) {

  return String(
    value ?? ""
  ).trim();
}


/* ==========================================================
   GROUP LINES
========================================================== */

function groupLines(items) {

  const map =
    new Map();


  for (
    const item of items
  ) {

    const idx =
      Number(item.line_index);


    if (
      !Number.isFinite(idx)
    ) {

      continue;
    }


    if (
      !map.has(idx)
    ) {

      map.set(
        idx,
        []
      );
    }


    map
      .get(idx)
      .push(item);
  }


  return [
    ...map.entries()
  ]
    .sort(
      (a, b) =>
        a[0] - b[0]
    )
    .map(
      ([lineIndex, lineWords]) => ({

        lineIndex,

        words: lineWords,

        start:
          Math.min(
            ...lineWords.map(
              w =>
                Number(w.start)
            )
          ),

        end:
          Math.max(
            ...lineWords.map(
              w =>
                Number(w.end)
            )
          )
      })
    );
}


/* ==========================================================
   RENDER LINE
========================================================== */

function renderLine(line) {

  lineText.innerHTML =
    "";

  lastRenderedWord =
    -1;


  line.words.forEach(
    (word, index) => {

      /*
         WORD
      */

      const span =
        document.createElement(
          "span"
        );


      span.className =
        "word";


      span.dataset.index =
        index;


      span.textContent =
        normalizeWord(
          word.word
        );


      lineText.appendChild(
        span
      );


      /*
         SPACE
      */

      if (
        index <
        line.words.length - 1
      ) {

        const spacer =
          document.createElement(
            "span"
          );


        spacer.className =
          "space";


        spacer.dataset.index =
          index;


        spacer.textContent =
          " ";


        lineText.appendChild(
          spacer
        );
      }
    }
  );


  lyricStage.classList.add(
    "visible"
  );
}


/* ==========================================================
   UPDATE WORDS
========================================================== */

function updateWords(
  now,
  line
) {

  let active =
    -1;


  /*
     Tìm từ cuối cùng
     đã tới timestamp.
  */

  for (
    let i = 0;
    i < line.words.length;
    i++
  ) {

    const word =
      line.words[i];


    const start =
      Number(word.start);


    if (
      now >= start
    ) {

      active =
        i;

    } else {

      break;
    }
  }


  /*
     Chưa tới từ đầu tiên
  */

  if (
    active < 0
  ) {

    return;
  }


  /*
     Chỉ xử lý các từ mới
  */

  if (
    active !==
    lastRenderedWord
  ) {

    /*
       Hiện toàn bộ từ
       từ đầu tới từ hiện tại.
    */

    for (
      let i = 0;
      i <= active;
      i++
    ) {

      const node =
        lineText.querySelector(
          `.word[data-index="${i}"]`
        );


      if (
        node
      ) {

        node.classList.add(
          "active"
        );
      }


      /*
         Hiện khoảng trắng
         sau từ vừa xuất hiện.
      */

      const spacer =
        lineText.querySelector(
          `.space[data-index="${i}"]`
        );


      if (
        spacer
      ) {

        spacer.classList.add(
          "active"
        );
      }
    }


    lastRenderedWord =
      active;
  }
}


/* ==========================================================
   ENTER LINE
========================================================== */

function enterLine(line) {

  currentLineIndex =
    line.lineIndex;


  renderLine(
    line
  );
}


/* ==========================================================
   HEART PARTICLES
========================================================== */

function createHeartParticles() {

  if (
    !heartParticles
  ) {

    return;
  }


  heartParticles.innerHTML =
    "";


  for (
    let i = 0;
    i < 24;
    i++
  ) {

    const el =
      document.createElement(
        "span"
      );


    el.className =
      "heart-particle";


    el.textContent =
      i % 3 === 0
        ? "♥"
        : "✦";


    const angle =
      Math.random() *
      Math.PI *
      2;


    const distance =
      100 +
      Math.random() *
      260;


    const tx =
      Math.cos(angle) *
      distance;


    const ty =
      Math.sin(angle) *
      distance;


    el.style.left =
      "50%";


    el.style.top =
      "43%";


    el.style.setProperty(
      "--tx",
      `${tx}px`
    );


    el.style.setProperty(
      "--ty",
      `${ty}px`
    );


    el.style.animationDelay =
      `${Math.random() * 0.9}s`;


    heartParticles.appendChild(
      el
    );
  }
}


/* ==========================================================
   HIDE COUNTDOWN
========================================================== */

function hideCountdown() {

  if (
    countdownTimer
  ) {

    clearTimeout(
      countdownTimer
    );

    countdownTimer =
      null;
  }


  if (
    countdownInterval
  ) {

    clearInterval(
      countdownInterval
    );

    countdownInterval =
      null;
  }


  if (
    countdown
  ) {

    countdown.classList.remove(
      "show"
    );


    countdown.setAttribute(
      "aria-hidden",
      "true"
    );
  }
}


/* ==========================================================
   SHOW SPECIAL
========================================================== */

function showSpecial() {

  finished =
    true;

  started =
    false;


  cancelAnimationFrame(
    rafId
  );


  /*
     DỪNG VIDEO
  */

  media.pause();


  /*
     GIẤU LYRIC
  */

  lyricStage.classList.remove(
    "visible"
  );


  lineText.innerHTML =
    "";


  /*
     HIDE COUNTDOWN
  */

  hideCountdown();


  /*
     HIỆN TIM
  */

  createHeartParticles();


  special.classList.add(
    "show"
  );


  special.setAttribute(
    "aria-hidden",
    "false"
  );


  /*
     Đổi tên nếu cần
  */

  const specialName =
    special.querySelector(
      ".special-name"
    );


  if (
    specialName
  ) {

    specialName.textContent =
      SPECIAL_TEXT;
  }


  restartButton.hidden =
    false;
}


/* ==========================================================
   START COUNTDOWN
========================================================== */

function startCountdown() {

  /*
     Dừng các timer cũ
  */

  hideCountdown();


  /*
     Ẩn lyric
  */

  lyricStage.classList.remove(
    "visible"
  );


  lineText.innerHTML =
    "";


  /*
     Hiện countdown
  */

  countdownNumber.textContent =
    COUNTDOWN_START;


  countdown.classList.add(
    "show"
  );


  countdown.setAttribute(
    "aria-hidden",
    "false"
  );


  /*
     Thời điểm bắt đầu
  */

  const countdownStartTime =
    performance.now();


  /*
     Hàm cập nhật countdown
  */

  function updateCountdown() {

    const elapsed =
      (
        performance.now() -
        countdownStartTime
      ) / 1000;


    /*
       5 → 4 → 3 → 2 → 1 → 0
    */

    const value =
      Math.max(
        0,
        COUNTDOWN_START -
        Math.floor(elapsed)
      );


    countdownNumber.textContent =
      String(value);


    /*
       Khi đã hiển thị 0
       đủ 1 giây thì hiện tim.
    */

    if (
      elapsed >=
      COUNTDOWN_START + 1
    ) {

      showSpecial();

      return;
    }


    countdownInterval =
      requestAnimationFrame(
        updateCountdown
      );
  }


  countdownInterval =
    requestAnimationFrame(
      updateCountdown
    );
}


/* ==========================================================
   RESET
========================================================== */

function resetPlayer() {

  cancelAnimationFrame(
    rafId
  );


  hideCountdown();


  media.pause();


  try {

    media.currentTime =
      0;

  } catch (error) {

    console.warn(error);
  }


  currentLineIndex =
    -1;


  lastRenderedWord =
    -1;


  started =
    false;


  finished =
    false;


  lyricStage.classList.remove(
    "visible"
  );


  lineText.innerHTML =
    "";


  special.classList.remove(
    "show"
  );


  special.setAttribute(
    "aria-hidden",
    "true"
  );


  restartButton.hidden =
    true;


  statusEl.textContent =
    "";


  startButton.disabled =
    false;


  welcome.classList.remove(
    "hidden-screen"
  );
}


/* ==========================================================
   SYNC
========================================================== */

function sync() {

  if (
    !started ||
    finished
  ) {

    return;
  }


  const now =
    media.currentTime;


  /*
     TÌM DÒNG CUỐI
  */

  const targetLine =
    lines.find(
      line =>
        line.lineIndex ===
        STOP_LINE_INDEX
    );


  /*
     QUAN TRỌNG:

     Chỉ bắt đầu countdown
     KHI DÒNG 23 THỰC SỰ KẾT THÚC.

     Không nhảy sang line 24.
  */

  if (
    targetLine &&
    now >=
    targetLine.end -
    STOP_EARLY_SECONDS
  ) {

    /*
       Dừng nhạc
    */

    media.pause();


    /*
       Đặt lại đúng cuối câu.
    */

    media.currentTime =
      Math.max(
        0,
        targetLine.end
      );


    /*
       Không chạy lyric nữa.
    */

    started =
      false;


    /*
       Bắt đầu countdown
    */

    startCountdown();

    return;
  }


  /*
     TÌM LINE HIỆN TẠI
  */

  let currentLine =
    null;


  for (
    const candidate of lines
  ) {

    /*
       Không bao giờ chạy
       qua line 23.
    */

    if (
      candidate.lineIndex >
      STOP_LINE_INDEX
    ) {

      break;
    }


    if (
      now >=
      candidate.start
    ) {

      currentLine =
        candidate;

    } else {

      break;
    }
  }


  /*
     Line mới
  */

  if (
    currentLine &&
    currentLine.lineIndex !==
    currentLineIndex
  ) {

    enterLine(
      currentLine
    );
  }


  /*
     Sync từng từ
  */

  if (
    currentLine
  ) {

    updateWords(
      now,
      currentLine
    );
  }


  /*
     Vòng lặp render
  */

  rafId =
    requestAnimationFrame(
      sync
    );
}


/* ==========================================================
   LOAD LYRICS
========================================================== */

async function loadLyrics() {

  const response =
    await fetch(
      "./lyrics.json",
      {
        cache: "no-store"
      }
    );


  if (
    !response.ok
  ) {

    throw new Error(
      `Không thể đọc lyrics.json (${response.status})`
    );
  }


  const parsed =
    await response.json();


  if (
    !Array.isArray(parsed) ||
    parsed.length === 0
  ) {

    throw new Error(
      "lyrics.json không hợp lệ."
    );
  }


  /*
     GIỮ NGUYÊN TIMESTAMP GỐC
  */

  words =
    parsed
      .filter(
        item =>
          Number.isFinite(
            Number(item.start)
          ) &&
          Number.isFinite(
            Number(item.end)
          ) &&
          Number.isFinite(
            Number(item.line_index)
          )
      )
      .map(
        item => ({

          ...item,

          word:
            normalizeWord(
              item.word
            ),

          start:
            Number(item.start),

          end:
            Number(item.end),

          line_index:
            Number(
              item.line_index
            )

        })
      );


  /*
     CHỈ LẤY ĐẾN LINE 23

     Line 24 sẽ không bao giờ
     xuất hiện.
  */

  lines =
    groupLines(
      words
    )
    .filter(
      line =>
        line.lineIndex <=
        STOP_LINE_INDEX
    );
}


/* ==========================================================
   START MUSIC
========================================================== */

async function start() {

  startButton.disabled =
    true;


  statusEl.textContent =
    "";


  hideCountdown();


  special.classList.remove(
    "show"
  );


  special.setAttribute(
    "aria-hidden",
    "true"
  );


  restartButton.hidden =
    true;


  try {

    await loadLyrics();


    media.currentTime =
      0;


    await media.play();


    started =
      true;


    finished =
      false;


    welcome.classList.add(
      "hidden-screen"
    );


    currentLineIndex =
      -1;


    lastRenderedWord =
      -1;


    lyricStage.classList.remove(
      "visible"
    );


    lineText.innerHTML =
      "";


    cancelAnimationFrame(
      rafId
    );


    rafId =
      requestAnimationFrame(
        sync
      );

  } catch (error) {

    console.error(
      error
    );


    startButton.disabled =
      false;


    statusEl.textContent =
      "Không thể phát bài hát. Hãy kiểm tra song.mp4 và lyrics.json.";
  }
}


/* ==========================================================
   EVENTS
========================================================== */

startButton.addEventListener(
  "click",
  start
);


/*
   NÚT PHÁT LẠI
*/

restartButton.addEventListener(
  "click",
  async () => {

    resetPlayer();

    startButton.disabled =
      false;

    await start();
  }
);


/*
   Nếu video tự kết thúc
*/

media.addEventListener(
  "ended",
  () => {

    if (
      !finished &&
      !countdown.classList.contains(
        "show"
      )
    ) {

      /*
         Trong trường hợp video
         kết thúc sớm hơn timestamp:
         vẫn chạy countdown.
      */

      started =
        false;

      startCountdown();
    }
  }
);


/*
   Lỗi file nhạc
*/

media.addEventListener(
  "error",
  () => {

    statusEl.textContent =
      "Không đọc được song.mp4.";

    startButton.disabled =
      false;
  }
);


/*
   SEEK

   Nếu trình duyệt thay đổi currentTime,
   sync lại lyric.
*/

media.addEventListener(
  "seeked",
  () => {

    if (
      started &&
      !finished
    ) {

      currentLineIndex =
        -1;

      lastRenderedWord =
        -1;

      lineText.innerHTML =
        "";

      cancelAnimationFrame(
        rafId
      );


      rafId =
        requestAnimationFrame(
          sync
        );
    }
  }
);


/* ==========================================================
   START BACKGROUND
========================================================== */

createStars();

createParticles();