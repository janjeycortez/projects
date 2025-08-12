let startTime;
let timerInterval;
let username = "";
let seconds = 0;
const hourlyRate = 470 / 8; // 58.75 PHP/hour
const STORAGE_KEY = "timeTrackerSessions"; // All active sessions stored here

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

function loadSession(user) {
  let allSessions = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  if (allSessions[user]) {
    startTime = new Date(allSessions[user].startTime);
    seconds = Math.floor((Date.now() - startTime.getTime()) / 1000);
    username = user;

    document.getElementById("displayName").textContent = username;
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("trackerSection").style.display = "block";

    timerInterval = setInterval(() => {
      seconds++;
      updateTimer();
    }, 1000);

    updateTimer();
    return true;
  }
  return false;
}

function saveSession(user, start) {
  let allSessions = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  allSessions[user] = { startTime: start };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allSessions));
}

function clearSession(user) {
  let allSessions = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  delete allSessions[user];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allSessions));
}

// Login
document.getElementById("loginBtn").addEventListener("click", () => {
  let enteredName = document.getElementById("nameInput").value.trim();
  if (enteredName === "") {
    alert("Please enter your name!");
    return;
  }

  if (!loadSession(enteredName)) {
    username = enteredName;
    startTime = new Date();
    seconds = 0;
    saveSession(username, startTime);

    document.getElementById("displayName").textContent = username;
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("trackerSection").style.display = "block";

    timerInterval = setInterval(() => {
      seconds++;
      updateTimer();
    }, 1000);
    updateTimer();
  }
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

  clearSession(username);

  document.getElementById("loginForm").style.display = "block";
  document.getElementById("trackerSection").style.display = "none";
  document.getElementById("nameInput").value = "";
});

// Auto-load session if name already entered before
window.addEventListener("load", () => {
  let nameInput = document.getElementById("nameInput").value.trim();
  if (nameInput && loadSession(nameInput)) {
    console.log("Resumed session for:", nameInput);
  }
});
