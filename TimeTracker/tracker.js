const hourlyRate = 470 / 8;
let seconds = 0;
let timerInterval;

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
    mode: "no-cors",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  })
  .then(() => console.log("Data sent to Google Sheets"))
  .catch(err => console.error(err));
}

window.onload = function() {
  const username = localStorage.getItem("username");
  const startTime = localStorage.getItem("startTime");

  if (!username || !startTime) {
    window.location.href = "login.html";
    return;
  }

  document.getElementById("displayName").textContent = username;
  seconds = Math.floor((Date.now() - parseInt(startTime)) / 1000);

  timerInterval = setInterval(() => {
    seconds++;
    updateTimer();
  }, 1000);

  updateTimer();
};

document.getElementById("logoutBtn").addEventListener("click", () => {
  clearInterval(timerInterval);

  const username = localStorage.getItem("username");
  const startTime = new Date(parseInt(localStorage.getItem("startTime")));
  const endTime = new Date();
  const totalHours = seconds / 3600;
  const totalSalary = totalHours * hourlyRate;

  const data = {
    name: username,
    loginTime: formatTime(startTime),
    logoutTime: formatTime(endTime),
    totalTime: document.getElementById("timer").textContent,
    totalSeconds: seconds,
    salary: totalSalary.toFixed(2)
  };

  sendToGoogleSheets(data);

  localStorage.removeItem("username");
  localStorage.removeItem("startTime");
  window.location.href = "login.html";
});
