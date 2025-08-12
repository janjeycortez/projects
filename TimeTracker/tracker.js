let timerInterval;
const hourlyRate = 470 / 8; // 58.75 PHP/hour

// Check if user is logged in
const username = localStorage.getItem("username");
if (!username) {
  window.location.href = "login.html";
}

// Display username
document.getElementById("displayName").textContent = username;

// Restore or set start time
let startTime = localStorage.getItem("startTime");
if (!startTime) {
  startTime = Date.now();
  localStorage.setItem("startTime", startTime);
}

// Timer function
function updateTimer() {
  const elapsedMs = Date.now() - parseInt(localStorage.getItem("startTime"));
  const seconds = Math.floor(elapsedMs / 1000);
  const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  document.getElementById("timer").textContent = `${hrs}:${mins}:${secs}`;
}

timerInterval = setInterval(updateTimer, 1000);
updateTimer(); // run immediately

// Logout button
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("username");
  localStorage.removeItem("startTime");
  window.location.href = "login.html";
});
