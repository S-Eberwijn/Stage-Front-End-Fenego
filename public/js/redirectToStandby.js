function redirectToStandby() { window.location.href = "/standby"; }
let idleTimer = setInterval(redirectToStandby, 120000);