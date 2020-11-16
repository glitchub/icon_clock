// Icon Clock, current hours and minutes in a toolbar icon

"use strict";

// Pad number n to two digits with leading zero
function nn(n) { return ("00" + n).slice(-2) }

// Convert any css color specification to "#RRGGBB" (without alpha).
// Hackish!
function normalize(color) {
    let can = document.createElement("canvas");
    let con = can.getContext("2d");
    con.fillStyle = color;
    con.fillRect(0,0,1,1);
    let rgba = con.getImageData(0,0,1,1);
    let r = nn(rgba.data[0].toString(16));
    let g = nn(rgba.data[1].toString(16));
    let b = nn(rgba.data[2].toString(16));
    const rgb = "#"+r+g+b;
    // console.log("Normalized " + color + " to " + rgb);
    return rgb
}

// Write current time to the toolicon using current hour24 and textcolor
function redraw() {
    // get current hour and minute with leading 0s
    let date = new Date();

    let hours = date.getHours();
    if (hour12)
    {
        if (!hours) hours = 12;
        else if (hours > 12) hours -= 12;
    }

    // create a canvas, write hour and minute to it
    let can = document.createElement("canvas");
    let con = can.getContext("2d");
    con.fillStyle = textcolor;

    // Blindly hope that sans-serif digits at 80px will only render 64
    // pixels? XXX use text metrics to determine the actual size.
    con.font = 'bold 80px sans-serif';
    con.direction = 'ltr';
    con.textAlign = 'center';

    // write hh across the top
    con.textBaseline = 'top';
    con.fillText(nn(hours), 64, 0);

    // write mm across the botton
    con.textBaseline = 'alphabetic';
    con.fillText(nn(date.getMinutes()), 64, 127);

    // update the button with the new canvas
    browser.browserAction.setIcon({imageData: con.getImageData(0, 0, 128, 128)});

    // show the date on hover
    browser.browserAction.setTitle({title: date.toDateString()});
}

// Redraw the clock every 100mS after the minute
function update()
{
    redraw();
    setTimeout(update, 60100 - (Date.now() % 60000));
}

// Do the first update
var textcolor = "#000000";  // start with black
var hour12 = false;         // and 24 hour
update();

// given theme colors, extract icon text color and redraw
function upcolor(colors)
{
    // console.log("Colors: %o", colors)
    let c = ""
    if (colors) c = colors.toolbar_field_text || colors.toolbar_text || color.icons;
    c = normalize(c || "black");
    if (textcolor != c)
    {
        // console.log("Changing color to " + c);
        textcolor = c;
        redraw();
    }
}

// update hour12 and redraw
function uphour12(value)
{
    if (value != hour12)
    {
        // console.log("Changing hour12 to " + value);
        hour12 = value;
        redraw();
    }
}

// get current theme
(async () => upcolor((await browser.theme.getCurrent()).colors))()

// handle global theme updates
browser.theme.onUpdated.addListener(({theme, windowId}) => { if (!windowId) upcolor(theme.colors); });

// get current storage
(async () => {
    let s = await browser.storage.local.get();
    // console.log("Storage %o", s);
    uphour12(s.hour12 || false)
})();

// handle storage updates
browser.storage.onChanged.addListener((change, name) => {
    // console.log("Change %o %s", change, name);
    if (name == "local" && change.hour12) uphour12(change.hour12.newValue)
});

// open options if the icon is clicked
browser.browserAction.onClicked.addListener(()=>browser.runtime.openOptionsPage());
