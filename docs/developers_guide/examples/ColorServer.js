// tag::start[]
document.addEventListener("DOMContentLoaded", function() {
    OWF.ready(start);
});

function start() {
    OWF.RPC.registerFunctions([
        {
            name: "getColors",
            fn: getColors
        }, {
            name: "changeColor",
            fn: changeColor
        }]
    );
}
// end::start[]

// tag::functions[]
function getColors() {
    return ["Red", "Blue", "Yellow"];
}

function changeColor(color) {
    document.getElementById("body").style.backgroundColor = color;
    return true;
}
// end::functions[]
