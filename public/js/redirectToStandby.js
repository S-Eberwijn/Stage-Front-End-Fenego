function redirectToStandby() { window.location.href = "/standby"; }
var idleTimer = setInterval(redirectToStandby, 120000);