// ==== CONFIG ====
// Replace with your actual Google Apps Script Web App URL
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwAWrZUPz0_EhpOoyCqLB2ncW4R6pGGjk5e0Resnj4AsdRt_BDxj0nc6ktZxy0JGwSG/exec";

// Track start time
let startTime;
let timerInterval;

window.onload = () => {
  const username = localStorage.getItem("username");
  if (!username) {
    window.location.href = "login.html";
    return;
  }
  document.getElementById("username").textContent = username;

  // Start the timer
  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 1000);

  // Logout button click
  document.getElementById("logoutBtn").addEventListener("click", logoutUser);
};

// Update timer display
function updateTimer() {
  const elapsedMs = Date.now() - startTime;
  const elapsedSec = Math.floor(elapsedMs / 1000);

  const hours = String(Math.floor(elapsedSec / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((elapsedSec % 3600) / 60)).padStart(2, "0");
  const seconds = String(elapsedSec % 60).padStart(2, "0");

  document.getElementById("timer").textContent = `${hours}:${minutes}:${seconds}`;
}

// Handle logout
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

  // Send data to Google Sheets
  fetch(SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).finally(() => {
    localStorage.removeItem("username");
    window.location.href = "login.html";
  });
}
