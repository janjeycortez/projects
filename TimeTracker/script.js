let seconds = 0;
let timerInterval;
let username = "";

function updateTimer() {
  let hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
  let mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  let secs = String(seconds % 60).padStart(2, '0');
  document.getElementById("timer").textContent = `${hrs}:${mins}:${secs}`;
}

// Send data to Google Sheets
function sendToGoogleSheets(name, timeValue) {
  fetch("YOUR_GOOGLE_SCRIPT_WEBAPP_URL", {
    method: "POST",
    body: JSON.stringify({ name: name, time: timeValue }),
    headers: { "Content-Type": "application/json" }
  })
  .then(res => res.text())
  .then(res => console.log("Saved:", res))
  .catch(err => console.error(err));
}

// Login
document.getElementById("loginBtn").addEventListener("click", () => {
  username = document.getElementById("nameInput").value.trim();
  if (username === "") {
    alert("Please enter your name!");
    return;
  }
  document.getElementById("displayName").textContent = username;
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("trackerSection").style.display = "block";

  // Start Timer
  clearInterval(timerInterval);
  seconds = 0;
  timerInterval = setInterval(() => {
    seconds++;
    updateTimer();
  }, 1000);
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  clearInterval(timerInterval);
  let finalTime = document.getElementById("timer").textContent;

  // Send to Google Sheets
  sendToGoogleSheets(username, finalTime);

  // Reset UI
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("trackerSection").style.display = "none";
  document.getElementById("nameInput").value = "";
});