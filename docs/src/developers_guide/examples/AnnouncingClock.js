document.addEventListener("DOMContentLoaded", start);

function start() {
    updateClock();
    setInterval(updateClock, 1000);
}

function updateClock() {
    // Format the time portion of the current date
    const timeString = new Date().toLocaleTimeString();

    // Update the time display
    document.getElementById("clock").firstChild.nodeValue = timeString;
}
