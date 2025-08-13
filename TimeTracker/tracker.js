let timerInterval;
let startTime = null;
let elapsedSeconds = 0;

const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const logoutBtn = document.getElementById("logoutBtn");

// Load previous session if available
if (localStorage.getItem("startTime")) {
    startTime = new Date(parseInt(localStorage.getItem("startTime"), 10));
    startTimer();
}

// Start Timer
startBtn.addEventListener("click", () => {
    if (!startTime) {
        startTime = new Date();
        localStorage.setItem("startTime", startTime.getTime());
    }
    startTimer();
});

// Stop Timer
stopBtn.addEventListener("click", () => {
    clearInterval(timerInterval);
    const now = new Date();
    elapsedSeconds = Math.floor((now - startTime) / 1000);

    // Save to Google Sheets
    sendDataToSheets(elapsedSeconds);

    // Reset local storage
    localStorage.removeItem("startTime");
    startTime = null;
    elapsedSeconds = 0;
    timerDisplay.textContent = "00:00:00";
});

// Logout
logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("startTime");
    window.location.href = "login.html";
});

// Update Timer Function
function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        const now = new Date();
        elapsedSeconds = Math.floor((now - startTime) / 1000);
        timerDisplay.textContent = formatTime(elapsedSeconds);
    }, 1000);
}

// Format Seconds → HH:MM:SS
function formatTime(seconds) {
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
}

// Send Data to Google Sheets
function sendDataToSheets(totalSeconds) {
    fetch("https://script.google.com/macros/s/AKfycbwAWrZUPz0_EhpOoyCqLB2ncW4R6pGGjk5e0Resnj4AsdRt_BDxj0nc6ktZxy0JGwSG/exec", {
        method: "POST",
        body: JSON.stringify({
            name: localStorage.getItem("username") || "Unknown",
            loginTime: startTime.toLocaleString(),
            logoutTime: new Date().toLocaleString(),
            totalTime: formatTime(totalSeconds),
            totalSeconds: totalSeconds
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(res => res.json())
    .then(data => console.log("Success:", data))
    .catch(err => console.error("Error:", err));
}
