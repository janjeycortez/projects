// === CONFIG ===
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwAWrZUPz0_EhpOoyCqLB2ncW4R6pGGjk5e0Resnj4AsdRt_BDxj0nc6ktZxy0JGwSG/exec"; // Replace with your actual Web App URL

let startTime;
let timerInterval;
let username;

// Load stored session if available
window.onload = function () {
    username = localStorage.getItem("username");
    startTime = localStorage.getItem("startTime");

    if (username && startTime) {
        document.getElementById("trackerSection").style.display = "block";
        document.getElementById("displayName").textContent = username;
        startTimer();
    } else {
        document.getElementById("loginForm").style.display = "block";
    }

    document.getElementById("loginBtn").addEventListener("click", login);
    document.getElementById("logoutBtn").addEventListener("click", logout);
};

function login() {
    const nameInput = document.getElementById("nameInput").value.trim();
    if (nameInput === "") {
        alert("Please enter your name");
        return;
    }

    username = nameInput;
    startTime = Date.now();

    localStorage.setItem("username", username);
    localStorage.setItem("startTime", startTime);

    document.getElementById("loginForm").style.display = "none";
    document.getElementById("trackerSection").style.display = "block";
    document.getElementById("displayName").textContent = username;

    startTimer();
}

function startTimer() {
    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const seconds = Math.floor(elapsed / 1000) % 60;
        const minutes = Math.floor(elapsed / (1000 * 60)) % 60;
        const hours = Math.floor(elapsed / (1000 * 60 * 60));

        document.getElementById("timer").textContent =
            String(hours).padStart(2, "0") + ":" +
            String(minutes).padStart(2, "0") + ":" +
            String(seconds).padStart(2, "0");
    }, 1000);
}

function logout() {
    clearInterval(timerInterval);

    const logoutTime = Date.now();
    const totalSeconds = Math.floor((logoutTime - startTime) / 1000);
    const totalTimeFormatted = document.getElementById("timer").textContent;

    // Send data to Google Sheets
    fetch(WEB_APP_URL, {
        method: "POST",
        mode: "no-cors", // Needed for Apps Script
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: username,
            loginTime: new Date(parseInt(startTime)).toLocaleString(),
            logoutTime: new Date(logoutTime).toLocaleString(),
            totalTime: totalTimeFormatted,
            totalSeconds: totalSeconds
        })
    }).catch(err => console.error("Error sending data:", err));

    // Clear local storage and go back to login
    localStorage.removeItem("username");
    localStorage.removeItem("startTime");
    window.location.href = "login.html";
}
