// Replace this with your Google Apps Script Web App URL
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwAWrZUPz0_EhpOoyCqLB2ncW4R6pGGjk5e0Resnj4AsdRt_BDxj0nc6ktZxy0JGwSG/exec";

const HOURLY_RATE = 475 / 8; // 59.375 pesos/hour

let timerInterval;
let elapsedSeconds = 0;
let loginTime = null;
let username = localStorage.getItem("username");

function formatTime(seconds) {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
}

function startTimer() {
    timerInterval = setInterval(() => {
        elapsedSeconds++;
        document.getElementById("timer").textContent = formatTime(elapsedSeconds);

        // Calculate salary per second
        const salary = (elapsedSeconds / 3600 * HOURLY_RATE).toFixed(2);
        document.getElementById("salary").textContent = `₱${salary}`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

window.onload = () => {
    if (!username) {
        window.location.href = "login.html";
        return;
    }

    document.getElementById("displayName").textContent = username;

    // Restore login time from local storage
    loginTime = localStorage.getItem("loginTime");
    if (!loginTime) {
        loginTime = new Date().toISOString();
        localStorage.setItem("loginTime", loginTime);
    }

    // Restore elapsed time
    const savedElapsed = localStorage.getItem("elapsedSeconds");
    if (savedElapsed) {
        elapsedSeconds = parseInt(savedElapsed, 10);
    }

    startTimer();

    document.getElementById("logoutBtn").addEventListener("click", () => {
        stopTimer();
        const logoutTime = new Date().toISOString();
        const salary = (elapsedSeconds / 3600 * HOURLY_RATE).toFixed(2);

        // Save data to Google Sheet
        fetch(SCRIPT_URL, {
            method: "POST",
            body: JSON.stringify({
                name: username,
                loginTime: loginTime,
                logoutTime: logoutTime,
                totalTime: formatTime(elapsedSeconds),
                totalSeconds: elapsedSeconds,
                salary: salary
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log("Data saved:", data);

            // Clear local storage and go back to login page
            localStorage.removeItem("username");
            localStorage.removeItem("loginTime");
            localStorage.removeItem("elapsedSeconds");
            window.location.href = "login.html";
        })
        .catch(err => console.error("Error saving data:", err));
    });
};

// Save elapsed time every second in local storage
setInterval(() => {
    localStorage.setItem("elapsedSeconds", elapsedSeconds);
}, 1000);
