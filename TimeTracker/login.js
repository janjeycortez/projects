function handleCredentialResponse(response) {
  const data = jwt_decode(response.credential);
  localStorage.setItem("username", data.name);

  // Set start time if it doesn't exist yet
  if (!localStorage.getItem("startTime")) {
    localStorage.setItem("startTime", Date.now());
  }

  window.location.href = "tracker.html";
}
