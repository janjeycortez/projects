let startTime;
let timerInterval;
let username = "";
let seconds = 0;
const hourlyRate = 470 / 8; // 58.75 PHP/hour

function updateTimer() {
  let hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
  let mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  let secs = String(seconds % 60).padStart(2, '0');
  document.getElementById("timer").textContent = `${hrs}:${mins}:${secs}`;
}

function formatTime(date) {
  return date.toLocaleTimeString("en-PH", { hour12: false });
}

function sendToGoogleSheets(data) {
  fetch("https://script.google.com/macros/s/AKfycbxEDTpaP66-iczAa9GhVRMX-8mrDfc9znAyHaUB26zuPXGWJY-orpN3V7ata2GqH9KA/exec", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
    mode: "no-cors"
  });
}

function startTimer(user) {
  username = user;
  startTime = new Date();
  seconds = 0;

  // Save to localStorage
  localStorage.setItem("username", username);
  localStorage.setItem("startTime", startTime.toISOString());
  localStorage.setItem("isTracking", "true");

  document.getElementById("displayName").textContent = username;
  document.getElementById("trackerSection").style.display = "block";

  timerInterval = setInterval(() => {
    seconds++;
    updateTimer();
  }, 1000);
}

function restoreTimer() {
  let savedName = localStorage.getItem("username");
  let savedStart = localStorage.getItem("startTime");
  let isTracking = localStorage.getItem("isTracking") === "true";

  if (isTracking && savedName && savedStart) {
    username = savedName;
    startTime = new Date(savedStart);
    let elapsed = Math.floor((new Date() - startTime) / 1000);
    seconds = elapsed;

    document.getElementById("displayName").textContent = username;
    document.getElementById("trackerSection").style.display = "block";

    timerInterval = setInterval(() => {
      seconds++;
      updateTimer();
    }, 1000);
    updateTimer();
  }
}

document.getElementById("logoutBtn").addEventListener("click", () => {
  clearInterval(timerInterval);
  let endTime = new Date();
  let totalHours = seconds / 3600;
  let totalSalary = totalHours * hourlyRate;

  let data = {
    name: username,
    loginTime: formatTime(startTime),
    logoutTime: formatTime(endTime),
    totalTime: document.getElementById("timer").textContent,
    salary: totalSalary.toFixed(2)
  };

  sendToGoogleSheets(data);

  // Clear localStorage
  localStorage.removeItem("username");
  localStorage.removeItem("startTime");
  localStorage.removeItem("isTracking");

  window.location.href = "login.html"; // go back to login
});

// Run restore on page load
window.onload = restoreTimer;
