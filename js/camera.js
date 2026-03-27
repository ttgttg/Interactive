// calls for vid permissions and transform into recognition window

const startBtn = document.getElementById("startBtn");
const hud = document.getElementById("hud");
const video = document.getElementById("video");
const statusText = document.getElementById("statusText");
const mainContent = document.getElementById("mainContent");
const startScreen = document.getElementById("startScreen");
const music = document.getElementById("bg-music");

window.addEventListener("DOMContentLoaded", () => {
  const music = document.getElementById("bg-music");
  const startBtn = document.getElementById("startBtn");

  startBtn.addEventListener("click", () => {
    music.volume = 0.3;
    music
      .play()
      .then(() => console.log("Music playing"))
      .catch((err) => console.log(err));
  });
});

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

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
      audio: false,
    });

    currentStream = stream;
    video.srcObject = stream;
    hud.style.display = "block";
    startBtn.style.display = "none";

    statusText.textContent = "Scanning";

    setTimeout(() => {
      statusText.textContent = "Verified";

      setTimeout(() => {
        alert(
          "Access granted. You are now under surveillance ( -_•)▄︻テحكـ━一",
        );

        stopCamera();

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
