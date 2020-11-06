'use strict';

(function() {

    var color = "black"; // default icon color

    function redraw() {

        // get current hour and minute with leading 0s
        var date = new Date();
        var mm = ("0"+date.getMinutes()).slice(-2);
        var hh = ("0"+date.getHours()).slice(-2);

        // create a canvas, write hour and minute to it
        var can = document.createElement("canvas");
        var con = can.getContext("2d");
        con.fillStyle = color;
        // Hackishly strip alpha component from color
        // con.fillRect(0,0,1,1);
        // var rgba = con.getImageData(0,0,1,1);
        // con = can.getContext("2d");
        // con.fillStyle = "rgb("+rgba[0]+","+rgba[1]+","+rgba[2]+")";
        con.font = 'bold 80px sans-serif';
        con.direction = 'ltr';
        con.textAlign = 'center';

        // write hh across the top
        con.textBaseline = 'top';
        con.fillText(hh, 64, 0);

        // write mm across the botton
        con.textBaseline = 'alphabetic';
        con.fillText(mm, 64, 127);

        // update the button with the new canvas
        browser.browserAction.setIcon({imageData: con.getImageData(0, 0, 128, 128)});

        // show the date on hover
        browser.browserAction.setTitle({title: date.toDateString()});

        // schedule next update 500 mS after the minute
        setTimeout(update, 60500 - (Date.now() % 60000));
    }

    // extract icon foreground color from theme, or default to "white"
    function setcolor(theme)
    {
        var t = theme.colors;
        color = t.icons || t.toolbar_field_text || t.toolbar_text || t.tab_background_text || t.tab_text || t.popup_text || t.bookmark_text || t.ntp_text || "white";
        redraw();
    }

    // redraw the clock every minute + 500mS
    function update()
    {
        redraw();
        setTimeout(update, 60500 - (Date.now() % 60000));
    }

    // set color from the current theme or whenever the theme changes
    (async function() { return browser.theme.getCurrent(); })().then(theme => { setcolor(theme); });
    browser.theme.onUpdated.addListener(async ({theme, windowId}) => { setcolor(theme); });

    // start clock updates
    update();

})();
