// Just shows two buttons and set the "hour12" flag true or false when they are pressed

"use strict";

function clicked(event, flag)
{
    browser.storage.local.set({"hour12" : flag});
    event.preventDefault(); // don't submit
}

document.getElementById("hour12").addEventListener("click", (event)=>clicked(event, true) );
document.getElementById("hour24").addEventListener("click", (event)=>clicked(event, false) );
