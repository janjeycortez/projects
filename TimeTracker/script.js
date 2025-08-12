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
  fetch("https://script.google.com/macros/s/AKfycbzJOmqNiaXr73YUflShgIpgc6XSOanLM1Nb8WATMgUo9TQpcqnAylItAqLqVHRjYyQz/exec", {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  console.log("Data sent to Google Sheets (no-cors mode).");
}

function startTimerFromStoredData() {
  const stored = JSON.parse(localStorage.getItem("timeTrackerData"));
  if (stored && stored.username && stored.startTime) {
    username = stored.username;
    startTime = new Date(stored.startTime);
    seconds = Math.floor((Date.now() - startTime.getTime()) / 1000);
    document.getElementById("displayName").textContent = username;
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("trackerSection").style.display = "block";
    timerInterval = setInterval(() => {
      seconds++;
      updateTimer();
    }, 1000);
  }
}

// Login
document.getElementById("loginBtn").addEventListener("click", () => {
  username = document.getElementById("nameInput").value.trim();
  if (username === "") {
    alert("Please enter your name!");
    return;
  }
  
  startTime = new Date();
  localStorage.setItem("timeTrackerData", JSON.stringify({
    username: username,
    startTime: startTime
  }));

  document.getElementById("displayName").textContent = username;
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("trackerSection").style.display = "block";

  seconds = 0;
  timerInterval = setInterval(() => {
    seconds++;
    updateTimer();
  }, 1000);
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
    salary: totalSalary.toFixed(2)
  };

  sendToGoogleSheets(data);

  // Clear storage and reset UI
  localStorage.removeItem("timeTrackerData");
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("trackerSection").style.display = "none";
  document.getElementById("nameInput").value = "";
});

// Load existing session if available
startTimerFromStoredData();
