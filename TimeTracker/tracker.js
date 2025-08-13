// ==== CONFIG ====
// Replace with your deployed Google Apps Script Web App URL
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwAWrZUPz0_EhpOoyCqLB2ncW4R6pGGjk5e0Resnj4AsdRt_BDxj0nc6ktZxy0JGwSG/exec";

let startTime;
let timerInterval;

window.onload = () => {
  const username = localStorage.getItem("username");
  if (!username) {
    window.location.href = "login.html";
    return;
  }
  document.getElementById("username").textContent = username;

  // Retrieve saved start time
  const savedStartTime = localStorage.getItem("startTime");
  if (savedStartTime) {
    startTime = parseInt(savedStartTime, 10);
  } else {
    startTime = Date.now();
    localStorage.setItem("startTime", startTime);
  }

  timerInterval = setInterval(updateTimer, 1000);
  document.getElementById("logoutBtn").addEventListener("click", logoutUser);
};

// Update timer
function updateTimer() {
  const elapsedMs = Date.now() - startTime;
  const elapsedSec = Math.floor(elapsedMs / 1000);

  const hours = String(Math.floor(elapsedSec / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((elapsedSec % 3600) / 60)).padStart(2, "0");
  const seconds = String(elapsedSec % 60).padStart(2, "0");

  document.getElementById("timer").textContent = `${hours}:${minutes}:${seconds}`;
}

// Logout + send data
function logoutUser() {
  clearInterval(timerInterval);

  const username = localStorage.getItem("username");
  const elapsedMs = Date.now() - startTime;
  const elapsedSec = Math.floor(elapsedMs / 1000);

  const hours = String(Math.floor(elapsedSec / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((elapsedSec % 3600) / 60)).padStart(2, "0");
  const seconds = String(elapsedSec % 60).padStart(2, "0");

  const data = {
    name: username,
    loginTime: new Date(startTime).toLocaleString(),
    logoutTime: new Date().toLocaleString(),
    totalTime: `${hours}:${minutes}:${seconds}`,
    totalSeconds: elapsedSec
  };

  fetch(SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(res => {
      console.log("Response:", res);
    })
    .catch(err => console.error("Error:", err))
    .finally(() => {
      localStorage.removeItem("username");
      localStorage.removeItem("startTime");
      window.location.href = "login.html";
    });
}
