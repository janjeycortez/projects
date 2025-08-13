const usernameEl = document.getElementById("username");
const timerEl = document.getElementById("timer");
const logoutBtn = document.getElementById("logoutBtn");

const username = localStorage.getItem("username");
let startTime = parseInt(localStorage.getItem("startTime"));

if (!username) {
    window.location.href = "login.html";
}

usernameEl.textContent = username;

// Timer update
function updateTimer() {
    const now = Date.now();
    const elapsed = now - startTime;
    const hours = String(Math.floor(elapsed / 3600000)).padStart(2, '0');
    const minutes = String(Math.floor((elapsed % 3600000) / 60000)).padStart(2, '0');
    const seconds = String(Math.floor((elapsed % 60000) / 1000)).padStart(2, '0');
    timerEl.textContent = `${hours}:${minutes}:${seconds}`;
}

setInterval(updateTimer, 1000);
updateTimer();

// Logout
logoutBtn.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "login.html";
});
