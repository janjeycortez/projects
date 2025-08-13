// ==== CONFIG ====
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx4qIwSgHGnwe2okDxOdWxm99njpVxK2o9WmwmygXyopiJl19LpfNzQyUfrrkk03Js9XQ/exec";

let startTime;
let timerInterval;

window.onload = () => {
  let username = localStorage.getItem("username");
  if (!username) {
    window.location.href = "login.html";
    return;
  }
  document.getElementById("username").textContent = username;

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

function updateTimer() {
  const elapsedMs = Date.now() - startTime;
  const elapsedSec = Math.floor(elapsedMs / 1000);

  const hours = String(Math.floor(elapsedSec / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((elapsedSec % 3600) / 60)).padStart(2, "0");
  const seconds = String(elapsedSec % 60).padStart(2, "0");

  document.getElementById("timer").textContent = `${hours}:${minutes}:${seconds}`;
}

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

  console.log("Sending data to spreadsheet:", data);

  fetch(SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(response => {
      console.log("Spreadsheet response:", response);
    })
    .catch(err => {
      console.error("Error sending data:", err);
    })
    .finally(() => {
      localStorage.removeItem("username");
      localStorage.removeItem("startTime");
      window.location.href = "login.html";
    });
}
