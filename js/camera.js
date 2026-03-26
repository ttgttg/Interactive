// calls for vid permissions and transform into recognition window

const startBtn = document.getElementById("startBtn");
const hud = document.getElementById("hud");
const video = document.getElementById("video");
const statusText = document.getElementById("statusText");

startBtn.addEventListener("click", async () => {
  try {
    statusText.textContent = "Requesting";
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
      audio: false,
    });

    video.srcObject = stream;
    hud.style.display = "block";
    statusText.textContent = "Scanning";
    startBtn.style.display = "none";

    setTimeout(() => {
      statusText.textContent = "Verified";
    }, 2500);
  } catch (err) {
    statusText.textContent = "Denied";
    alert("Camera access was denied or unavailable.");
    console.error(err);
  }
});
