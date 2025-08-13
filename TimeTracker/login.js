function handleCredentialResponse(response) {
    // Decode JWT to get user info
    const data = parseJwt(response.credential);
    
    // Save user name in localStorage
    localStorage.setItem("username", data.name);
    
    // Redirect to tracker page
    window.location.href = "tracker.html";
}

function parseJwt(token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}
