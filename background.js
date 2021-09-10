// Icon Clock

var color;
var hours;
var family;
var weight;

// Return font string, use a very large size since it will be scaled down
function font() { return weight + " 256px " + family; }

// Determine the exact bounding box for 2-bt-2 digits at 256px and set global
// variables. Invoked whenever weight or family changes.
var bleft, btop, bwidth, bheight, dsecond, dwidth, dheight;
function metrics()
{
    let can = document.createElement("canvas");
    let con = can.getContext("2d");
    con.font = font();
    con.textBaseline = "top";

    // Get worst case metrics for all digits.
    let mleft = 999, mright = 0, masc = 999, mdesc = 0;
    pairs = ["11", "22", "33", "44", "55", "66", "77", "88", "99", "00"];
    pairs.forEach((p) => {
        let m = con.measureText(p);
        // Some fonts return negative metrics? abs everything.
        mleft = Math.min(mleft, Math.abs(m.actualBoundingBoxLeft));    // Leftest,
        masc = Math.min(masc, Math.abs(m.actualBoundingBoxAscent));    // highest,
        mright = Math.max(mright, Math.abs(m.actualBoundingBoxRight)); // rightest,
        mdesc = Math.max(mdesc, Math.abs(m.actualBoundingBoxDescent)); // and lowest.
    });
    // console.log("mleft="+mleft, "mright="+mright, "masc="+masc, "mdesc="+mdesc);

    let gap = mdesc * 0.18;                         // gap between lines

    // set globals
    bleft = mleft;                                  // bounded left offset
    btop = masc;                                    // bounded top offset
    bwidth = mright - mleft;                        // bounded width
    bheight = (mdesc * 2) + gap - masc;             // bounded height
    // console.log("bleft="+bleft, "btop="+btop, "bwidth="+bwidth, "bheight"+bheight);

    dsecond = mdesc + gap;                          // draw offset to top of second line
    dwidth = mright + mleft;                        // draw width
    dheight = (mdesc * 2) + (masc * 2) + gap;       // draw height
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
    con.font = font();
    con.textBaseline = "top";
    con.fillStyle = color;                          // use specified color

    let date = new Date();

    let hh = date.getHours();
    if (hours == 12)
    {
        if (!hh) hh = 12;
        else if (hh > 12) hh -= 12;
    }

    // Put hours on top line, with leading "0"
    con.fillText(("0" + hh).slice(-2), 0, 0);

    // Put minutes on the bottom line, with leading "0"
    con.fillText(("0" + date.getMinutes()).slice(-2), 0, dsecond);

    // Update icon with bounded text (it will be scaled to fit)
    browser.browserAction.setIcon({imageData: con.getImageData(bleft, btop, bwidth, bheight)});

    // Also show date on hover
    browser.browserAction.setTitle({title: date.toDateString()});

    // Schedule another update 100mS after the next minute
    clearTimeout(timer);
    timer = setTimeout(update, 60100 - (Date.now() % 60000));
}

// Set hours and color from storage and do the first update
browser.storage.local.get().then((res)=>
{
    // console.log("Got local storage", res.hours, res.color);
    color = res.color || "#ffff00";
    hours = res.hours || 24;
    weight = res.weight || "normal";
    family = res.family || "sans-serif";
    metrics();
    update();
});

// Handle storage changes from options.js
browser.storage.onChanged.addListener((change, name)=>
{
    // console.log("Change %o %s", change, name);
    if (name == "local")
    {
        if (change.hours) hours = change.hours.newValue;
        if (change.color) color = change.color.newValue;
        if (change.weight || change.family)
        {
            if (change.weight) weight =  change.weight.newValue;
            if (change.family) family = change.family.newValue;
            metrics();
        }
        update();
    }
});

// Open options if the icon is clicked
browser.browserAction.onClicked.addListener(()=>browser.runtime.openOptionsPage());
