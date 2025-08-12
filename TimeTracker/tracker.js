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
    headers: { "Content-Type": "application/json" }
  })
  .then(res => res.text())
  .then(res => console.log("Saved:", res))
  .catch(err => console.error(err));
}

function startTracking(name, savedStartTime) {
  username = name;
  startTime = savedStartTime ? new Date(savedStartTime) : new Date();
  
  document.getElementById("displayName").textContent = username;
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("trackerSection").style.display = "block";

  // Calculate seconds if resumed
  if (savedStartTime) {
    seconds = Math.floor((Date.now() - startTime.getTime()) / 1000);
  } else {
    seconds = 0;
  }

  timerInterval = setInterval(() => {
    seconds++;
    updateTimer();
  }, 1000);

  // Save state to localStorage
  localStorage.setItem("trackerState", JSON.stringify({
    username,
    startTime: startTime.toISOString()
  }));
}

// Login
document.getElementById("loginBtn").addEventListener("click", () => {
  let nameInput = document.getElementById("nameInput").value.trim();
  if (!nameInput) {
    alert("Please enter your name!");
    return;
  }
  startTracking(nameInput);
});

// Logout
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
    totalSeconds: seconds,
    salary: totalSalary.toFixed(2)
  };

  sendToGoogleSheets(data);

  // Clear localStorage and reset UI
  localStorage.removeItem("trackerState");
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("trackerSection").style.display = "none";
  document.getElementById("nameInput").value = "";
});

// Check saved state on page load
window.addEventListener("load", () => {
  let savedState = localStorage.getItem("trackerState");
  if (savedState) {
    let { username, startTime } = JSON.parse(savedState);
    startTracking(username, startTime);
  }
});
