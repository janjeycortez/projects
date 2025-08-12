function handleCredentialResponse(response) {
  const data = jwt_decode(response.credential);
  const name = data.name;

  // Save name and reset any previous start time
  localStorage.setItem("username", name);
  localStorage.removeItem("startTime");

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
