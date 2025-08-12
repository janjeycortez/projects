function handleCredentialResponse(response) {
  const data = jwt_decode(response.credential);
  localStorage.setItem("username", data.name);
  localStorage.setItem("startTime", Date.now());
  window.location.href = "tracker.html"; // Go to tracker page
}
