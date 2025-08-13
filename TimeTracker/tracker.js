// ===== CONFIG =====
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwAWrZUPz0_EhpOoyCqLB2ncW4R6pGGjk5e0Resnj4AsdRt_BDxj0nc6ktZxy0JGwSG/exec"; // Replace with your actual URL
const HOURLY_RATE = 475 / 8; // 59.375 pesos/hour

// ===== STATE =====
let timerInterval;
let elapsedSeconds = 0;
let loginTime = null;
let username = localStorage.getItem("username");

// ===== FUNCTIONS =====
function formatTime(seconds) {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
}

function updateDisplay() {
    document.getElementById("timer").textContent = formatTime(elapsedSeconds);
    const salary = (elapsedSeconds / 3600 * HOURLY_RATE).toFixed(2);
    document.getElementById("salary").textContent = `₱${salary}`;
}

function startTimer() {
    updateDisplay(); // show immediately
    timerInterval = setInterval(() => {
        elapsedSeconds++;
        updateDisplay();
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function saveSessionToSheet(logoutTime) {
    const salary = (elapsedSeconds / 3600 * HOURLY_RATE).toFixed(2);
    return fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({
            name: username,
            loginTime: loginTime,
            logoutTime: logoutTime,
            totalTime: formatTime(elapsedSeconds),
            totalSeconds: elapsedSeconds,
            salary: salary
        }),
        headers: { "Content-Type": "application/json" }
    }).then(res => res.json());
}

// ===== PAGE LOAD =====
window.onload = () => {
    if (!username) {
        window.location.href = "login.html";
        return;
    }

    document.getElementById("displayName").textContent = username;

    // Restore login time or set new one
    loginTime = localStorage.getItem("loginTime");
    if (!loginTime) {
        loginTime = new Date().toISOString();
        localStorage.setItem("loginTime", loginTime);
    }

    // Restore elapsed seconds
    elapsedSeconds = parseInt(localStorage.getItem("elapsedSeconds") || "0", 10);

    // Start timer
    startTimer();

    // Logout button
    document.getElementById("logoutBtn").addEventListener("click", () => {
        stopTimer();
        const logoutTime = new Date().toISOString();

        saveSessionToSheet(logoutTime)
            .then(() => {
                // Clear session storage
                localStorage.removeItem("username");
                localStorage.removeItem("loginTime");
                localStorage.removeItem("elapsedSeconds");
                window.location.href = "login.html";
            })
            .catch(err => {
                console.error("Error saving data:", err);
                alert("Could not save session to sheet.");
            });
    });

    // Save elapsed time every second
    setInterval(() => {
        localStorage.setItem("elapsedSeconds", elapsedSeconds);
    }, 1000);
};
