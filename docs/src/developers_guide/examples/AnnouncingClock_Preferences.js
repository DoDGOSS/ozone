// tag::start[]
let militaryTime = false;

document.addEventListener("DOMContentLoaded", function() {
    OWF.ready(start);
});

function start() {
    updateClock();
    setInterval(updateClock, 1000);

    const msg = "Running in OWF: " + (OWF.Util.isRunningInOWF() ? "Yes" : "No");
    document.getElementById("message-panel").innerHTML = msg;
    document.getElementById("message-panel").style.display = "block";

    document.getElementById("button-panel").style.display = "block";

    getPreference();
}
// end::start[]

// tag::display[]
function updateClock() {
    // Format the time portion of the current date
    const timeString = new Date().toLocaleTimeString(undefined, { hour12: !militaryTime });

    // Update the time display
    document.getElementById("clock").firstChild.nodeValue = timeString;
}
// end::display[]

// tag::fetch[]
function getPreference() {
    OWF.Preferences.getUserPreference({
        namespace: "com.mycompany.AnnouncingClock",
        name: "militaryTime",
        onSuccess: onGetPreferenceSuccess,
        onFailure: onGetPreferenceFailure
    });
}

function onGetPreferenceSuccess(pref) {
    militaryTime = pref.value === "true";

    document.getElementById("checkboxMilitaryTime").checked = militaryTime;
}

function onGetPreferenceFailure(error, status) {
    if (status !== 404) {
        OWF.Util.ErrorDlg.show("Got an error getting preferences! Status Code: " + status + " . Error message: " + error);
    }
}
// end::fetch[]

// tag::save[]
function setMilitaryTimePreference(checkedState) {
    militaryTime = checkedState;

    OWF.Preferences.setUserPreference({
        namespace: "com.mycompany.AnnouncingClock",
        name: "militaryTime",
        value: checkedState,
        onSuccess: function() {},
        onFailure: onSetPreferenceFailure
    });
}

function onSetPreferenceFailure(error, status) {
    OWF.Util.ErrorDlg.show("Got an error updating preferences! Status Code: " + status + " . Error message: " + error);
}
// end::save[]
