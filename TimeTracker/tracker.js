let startTime;
let timerInterval;
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
        headers: { "Content-Type": "application/json" },
        mode: "no-cors"
    });
}

// Auto start on page load
window.onload = function () {
    const username = localStorage.getItem("username");
    if (!username) {
        window.location.href = "login.html";
        return;
    }
    document.getElementById("displayName").textContent = username;
    startTime = new Date();
    seconds = 0;
    timerInterval = setInterval(() => {
        seconds++;
        updateTimer();
    }, 1000);
};

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
    clearInterval(timerInterval);
    let endTime = new Date();
    let totalHours = seconds / 3600;
    let totalSalary = totalHours * hourlyRate;

    let data = {
        name: localStorage.getItem("username"),
        loginTime: formatTime(startTime),
        logoutTime: formatTime(endTime),
        totalTime: document.getElementById("timer").textContent,
        totalSeconds: seconds,
        salary: totalSalary.toFixed(2)
    };

    sendToGoogleSheets(data);
    localStorage.removeItem("username");
    window.location.href = "login.html";
});
