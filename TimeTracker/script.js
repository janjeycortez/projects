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
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
        mode: "no-cors"
    })
    .then(() => console.log("Data sent to Google Sheets"))
    .catch(err => console.error(err));
}

function startTimer(user) {
    username = user;
    startTime = new Date();
    seconds = 0;

    document.getElementById("displayName").textContent = username;
    timerInterval = setInterval(() => {
        seconds++;
        updateTimer();
    }, 1000);
}

// Google Sign-In callback
function handleCredentialResponse(response) {
    const data = jwt_decode(response.credential);

    // Save login state
    localStorage.setItem("username", data.name);

    // Show tracker, hide login
    document.getElementById("googleSignInSection").style.display = "none";
    document.getElementById("trackerSection").style.display = "block";

    startTimer(data.name);
}

// Auto-login if already signed in before
window.onload = function () {
    const savedUser = localStorage.getItem("username");
    if (savedUser) {
        document.getElementById("googleSignInSection").style.display = "none";
        document.getElementById("trackerSection").style.display = "block";
        startTimer(savedUser);
    }
};

// Logout button
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
        totalSeconds: seconds,
        salary: totalSalary.toFixed(2)
    };

    sendToGoogleSheets(data);

    // Clear login state
    localStorage.removeItem("username");

    // Reset UI
    document.getElementById("googleSignInSection").style.display = "block";
    document.getElementById("trackerSection").style.display = "none";
});
