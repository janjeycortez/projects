// =======================
// CONFIGURATION
// =======================
const SHEET_URL = "https://script.google.com/macros/s/AKfycbxEDTpaP66-iczAa9GhVRMX-8mrDfc9znAyHaUB26zuPXGWJY-orpN3V7ata2GqH9KA/exec"; // Google Apps Script Web App URL
const HOURLY_RATE = 470 / 8; // PHP/hour

// =======================
// VARIABLES
// =======================
let startTime;
let timerInterval;
let username = localStorage.getItem("username") || "";
let seconds = 0;

// =======================
// INIT ON PAGE LOAD
// =======================
window.addEventListener("load", () => {
  if (username) {
    document.getElementById("displayName").textContent = username;
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("trackerSection").style.display = "block";

    // Restore start time if it exists
    const savedStartTime = localStorage.getItem("startTime");
    if (savedStartTime) {
      startTime = new Date(savedStartTime);
      seconds = Math.floor((Date.now() - startTime.getTime()) / 1000);
      startTimer();
    }
  }
});

// =======================
// TIMER FUNCTIONS
// =======================
function updateTimer() {
  let hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
  let mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  let secs = String(seconds % 60).padStart(2, '0');
  document.getElementById("timer").textContent = `${hrs}:${mins}:${secs}`;
}

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    seconds++;
    updateTimer();
  }, 1000);
}

function formatTime(date) {
  return date.toLocaleTimeString("en-PH", { hour12: false });
}

// =======================
// SEND TO GOOGLE SHEETS
// =======================
function sendToGoogleSheets(data) {
  fetch(SHEET_URL, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
    mode: "no-cors"
  })
  .then(() => console.log("Data sent to Google Sheets"))
  .catch(err => console.error("Error sending to Sheets:", err));
}

// =======================
// LOGIN BUTTON
// =======================
document.getElementById("loginBtn").addEventListener("click", () => {
  username = document.getElementById("nameInput").value.trim();
  if (username === "") {
    alert("Please enter your name!");
    return;
  }

  localStorage.setItem("username", username);

  startTime = new Date();
  localStorage.setItem("startTime", startTime.toISOString());

  document.getElementById("displayName").textContent = username;
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("trackerSection").style.display = "block";

  seconds = 0;
  startTimer();
});

// =======================
// LOGOUT BUTTON
// =======================
document.getElementById("logoutBtn").addEventListener("click", () => {
  clearInterval(timerInterval);

  let endTime = new Date();
  let totalHours = seconds / 3600;
  let totalSalary = totalHours * HOURLY_RATE;

  let data = {
    name: username,
    loginTime: formatTime(startTime),
    logoutTime: formatTime(endTime),
    totalTime: document.getElementById("timer").textContent,
    salary: totalSalary.toFixed(2)
  };

  sendToGoogleSheets(data);

  // Clear stored data
  localStorage.removeItem("startTime");
  localStorage.removeItem("username");

  // Reset UI
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("trackerSection").style.display = "none";
  document.getElementById("nameInput").value = "";
  document.getElementById("timer").textContent = "00:00:00";
});
