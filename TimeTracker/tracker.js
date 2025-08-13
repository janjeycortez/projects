// ===== CONFIG =====
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxEDTpaP66-iczAa9GhVRMX-8mrDfc9znAyHaUB26zuPXGWJY-orpN3V7ata2GqH9KA/exec";

// ===== ELEMENTS =====
const displayName = document.getElementById("displayName");
const timerEl = document.getElementById("timer");
const logoutBtn = document.getElementById("logoutBtn");

let timerInterval;
let startTime;

// ===== FUNCTIONS =====
function formatTime(ms) {
    if (!ms || isNaN(ms)) return "00:00:00";

    let totalSeconds = Math.floor(ms / 1000);
    let hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    let minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    let seconds = String(totalSeconds % 60).padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
}

function startTimer() {
    timerInterval = setInterval(() => {
        let now = Date.now();
        let elapsed = now - parseInt(startTime, 10);
        timerEl.textContent = formatTime(elapsed);
    }, 1000);
}

// ===== ON PAGE LOAD =====
window.onload = () => {
    let username = localStorage.getItem("username");
    startTime = localStorage.getItem("startTime");

    if (displayName && username) {
        displayName.textContent = username;
    }

    if (startTime) {
        startTimer();
    }
};

// ===== LOGOUT =====
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        clearInterval(timerInterval);

        let endTime = Date.now();
        let elapsed = startTime ? endTime - parseInt(startTime, 10) : 0;
        let username = localStorage.getItem("username");

        // Send to Google Sheets
        fetch(SCRIPT_URL, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: username,
                time: formatTime(elapsed)
            })
        }).then(() => {
            localStorage.removeItem("startTime");
            localStorage.removeItem("username");
            window.location.href = "index.html";
        });
    });
}
