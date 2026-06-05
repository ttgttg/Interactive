// calls for vid permissions and transform into recognition window

const startBtn = document.getElementById("startBtn");
const hud = document.getElementById("hud");
const video = document.getElementById("video");
const statusText = document.getElementById("statusText");
const mainContent = document.getElementById("mainContent");
const startScreen = document.getElementById("startScreen");
const music = document.getElementById("bg-music");
const bgGlitch = document.getElementById("bgGlitch");

window.addEventListener("DOMContentLoaded", () => {
  const music = document.getElementById("bg-music");
  const startBtn = document.getElementById("startBtn");
  const isVerified = localStorage.getItem("verified");

  if (isVerified === "true") {
    // skip scan completely if verified already
    if (startScreen) startScreen.style.display = "none";
    if (mainContent) mainContent.style.display = "block";
    document.body.style.overflow = "auto";
  }

  startBtn.addEventListener("click", () => {
    music.volume = 0.3;
    music
      .play()
      .then(() => console.log("Music playing"))
      .catch((err) => console.log(err));
  });
});

function startSubtleGlitch() {
  if (bgGlitch) {
    bgGlitch.classList.add("active");
    bgGlitch.classList.remove("heavy");
  }
}

function startHeavyGlitch() {
  if (bgGlitch) {
    bgGlitch.classList.add("active", "heavy");
  }
}

function stopGlitch() {
  if (bgGlitch) {
    bgGlitch.classList.remove("active", "heavy");
  }
}

setInterval(() => {
  if (!bgGlitch || startBtn.style.display === "none") return;

  bgGlitch.classList.add("active");
  setTimeout(() => {
    bgGlitch.classList.remove("active", "heavy");
  }, 120);
}, 1800);

let currentStream = null;

function stopCamera() {
  if (currentStream) {
    currentStream.getTracks().forEach((track) => track.stop());
    currentStream = null;
  }

  video.srcObject = null;
  hud.style.display = "none";
}

startBtn.addEventListener("click", async () => {
  try {
    statusText.textContent = "Requesting";
    startSubtleGlitch();

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
      audio: false,
    });

    currentStream = stream;
    video.srcObject = stream;
    hud.style.display = "block";
    startBtn.style.display = "none";

    statusText.textContent = "Scanning";
    startHeavyGlitch();

    setTimeout(() => {
      statusText.textContent = "Verified";

      setTimeout(() => {

        const name = prompt("IDENTIFY YOURSELF") || "unknown subject";
        localStorage.setItem("username", name);

        alert(
          `Access granted. You are now under surveillance ( -_•)▄︻テحكـ━一`,
        );

        document.querySelector("#mainContent h1").textContent =
          `Welcome back again, ${name}.`;


        stopCamera();
        stopGlitch();

        localStorage.setItem("verified", "true");

        if (startScreen) {
          startScreen.style.display = "none";
        }

        if (mainContent) {
          mainContent.style.display = "block";
        }

        document.body.style.overflow = "auto";
      }, 1000);
    }, 2500);
  } catch (err) {
    statusText.textContent = "Denied";
    alert("Camera access was denied or unavailable.");
    console.error(err);
  }
});

//GET USER'S NAME
const name = localStorage.getItem("username") || "unknown subject";
document.querySelector("#mainContent h1").textContent =
  `Welcome back again, ${name}.`;



//EYEBALL MOVEMENT
const cornerEyeImg = document.getElementById("cornerEyeImg");

let idleTime = null;
let isIdle = true;
let lastMouseAngle = 0;

document.addEventListener("mousemove", (e) => {
  isIdle = false;
  clearTimeout(idleTime);

  const r = cornerEyeImg.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  const angle = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI);
  lastMouseAngle = angle;
  cornerEyeImg.style.transform = `rotate(${angle}deg)`;

  idleTime = setTimeout(() => {
    isIdle = true;
  }, 1000);
});

//IDLE EYEBALL MOVEMENT
function idleDrift() {
  if (isIdle) {
    const drift =
      lastMouseAngle +
      Math.sin(Date.now() * 0.005) * 18 +
      Math.sin(Date.now() * 0.0071 + 2.7) * 7;
    cornerEyeImg.style.transform = `rotate(${drift}deg)`;
  }
  requestAnimationFrame(idleDrift);
}
idleDrift();