function handleCredentialResponse(response) {
    const data = jwt_decode(response.credential);
    localStorage.setItem("username", data.name);
    
    // If timer is not running, set start time
    if (!localStorage.getItem("startTime")) {
        localStorage.setItem("startTime", Date.now());
    }
    
    window.location.href = "tracker.html";
}
