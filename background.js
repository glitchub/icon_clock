// Icon Clock

var color = "#808080";
var hours = 24;

// Pad number n to two digits with leading zero
function nn(n) { return ("00" + n).slice(-2) }

// Write current time to the toolicon using current hours and color
function redraw()
{
    let date = new Date();
    let hh = date.getHours();

    if (hours == 12)
    {
        // 12 hour clock
        if (!hh) hh = 12;
        else if (hh > 12) hh -= 12;
    }

    // Create a canvas, write hour and minute to it
    let can = document.createElement("canvas");
    let con = can.getContext("2d");
    con.fillStyle = color;

    // Blindly hope that sans-serif digits at 80px will only render 64
    // pixels? XXX use text metrics to determine the actual size.
    con.font = 'bold 80px sans-serif';
    con.direction = 'ltr';
    con.textAlign = 'center';

    // Write hh across the top.
    con.textBaseline = 'top';
    con.fillText(nn(hh), 64, 0);

    // Write mm across the bottom.
    con.textBaseline = 'alphabetic';
    con.fillText(nn(date.getMinutes()), 64, 127);

    // Update the button with the new canvas. The icon flickers, no way around that AFAIK.
    browser.browserAction.setIcon({imageData: con.getImageData(0, 0, 128, 128)});

    // Also show the date on hover.
    browser.browserAction.setTitle({title: date.toDateString()});
}

var timer = null; // current running timer
// Redraw the clock and reschedule for 100mS after the minute.
function update()
{
    redraw();
    clearTimeout(timer);
    timer = setTimeout(update, 60100 - (Date.now() % 60000));
}

// Set hours and color from storage and do the first update
browser.storage.local.get().then((res) => {
    // console.log("Got local storage", res.hours, res.color);
    if (res.color) color = res.color;
    if (res.hours) hours = res.hours;
    update();
});

// Handle storage changes from options.js
browser.storage.onChanged.addListener((change, name) => {
    // console.log("Change %o %s", change, name);
    if (name == "local")
    {
        if (change.hours) hours = change.hours.newValue;
        if (change.color) color = change.color.newValue;
        update();
    }
});

// Open options if the icon is clicked
browser.browserAction.onClicked.addListener(() => browser.runtime.openOptionsPage());
