// Icon Clock

// default params, overriden by storage
var color = "#808080";
var hours = 24;

// const font = "bold 256px sans-serif";
// XXX select font family and weight as an option
const font = "256px sans-serif"; // make it large since it will be scaled down

{
    // Determine the exact bounding box for 2x2 digits
    let can = document.createElement("canvas");
    let con = can.getContext("2d");
    con.font = font;
    con.textBaseline = "top";

    // look for worst case of each
    let mleft = 999, mright = 0, masc = 999, mdesc = 0;
    pairs = ["11", "22", "33", "44", "55", "66", "77", "88", "99", "00"];
    pairs.forEach((p) => {
        let m = con.measureText(p);
        if (m.actualBoundingBoxLeft < mleft) mleft = m.actualBoundingBoxLeft;
        if (m.actualBoundingBoxRight > mright) mright = m.actualBoundingBoxRight;
        if (-m.actualBoundingBoxAscent < masc) masc = -m.actualBoundingBoxAscent; // negative!
        if (m.actualBoundingBoxDescent > mdesc) mdesc = m.actualBoundingBoxDescent;
    });
    // console.log("mleft="+mleft, "mright="+mright, "masc="+masc, "mdesc="+mdesc);

    let gap = mdesc * .2;                           // gap between lines
    var bleft = mleft;                              // bounded left offset
    var btop = masc;                                // bounded top offset
    var bwidth = mright - mleft;                    // bounded width
    var bheight = (mdesc * 2) + gap - masc;         // bounded height
    // console.log("second="+bsecond, "bleft="+bleft, "btop="+btop, "bwidth="+bwidth, "bheight"+bheight);

    var dsecond = mdesc + gap;                      // draw offset to top of second line
    var dwidth = mright + mleft;                    // draw width
    var dheight = (mdesc * 2) + (masc * 2) + gap;   // draw height
    // console.log("dsecond="+dsecond, "dwidth="+dwidth, "dheight="+dheight);
}

var timer = null; // currently running timer

// Update the clock and schedule the next
function update()
{
    let can = document.createElement("canvas");     // canvas
    can.width = dwidth;                             // with enough room to draw
    can.height = dheight;
    let con = can.getContext("2d");
    con.font = font;
    con.textBaseline = "top";
    con.fillStyle = color;                          // use specified color

    let date = new Date();

    // maybe adjust  12h
    let hh = date.getHours();
    if (hours == 12)
    {
        if (!hh) hh = 12;
        else if (hh > 12) hh -= 12;
    }

    // hours on top line (with leading "0")
    con.fillText(("0" + hh).slice(-2), 0, 0);

    // minutes on the bottom line
    con.fillText(("0" + date.getMinutes()).slice(-2), 0, dsecond);

    // update icon with bounded text (it will be scaled to fit)
    browser.browserAction.setIcon({imageData: con.getImageData(bleft, btop, bwidth, bheight)});

    // also show date on hover
    browser.browserAction.setTitle({title: date.toDateString()});

    // schedule timer for another update 100mS after the next minute
    clearTimeout(timer);
    timer = setTimeout(update, 60100 - (Date.now() % 60000));
}

// Set hours and color from storage and do the first update
browser.storage.local.get().then((res) =>
{
    // console.log("Got local storage", res.hours, res.color);
    if (res.color) color = res.color;
    if (res.hours) hours = res.hours;
    update();
});

// Handle storage changes from options.js
browser.storage.onChanged.addListener((change, name) =>
{
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
