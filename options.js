// Icon Clock options

// Note inline scripts are disallowed so we use event listeners.

var color = "#808080"
var hours = 0;

// Initialize on load.
function init()
{
    browser.storage.local.get().then((s)=>{
        if (s.color) color = s.color;
        if (s.hours) hours = s.hours;
    });
}
document.addEventListener("DOMContentLoaded", init);

// Set 12 or 24 hours when corresponding button is clicked.
function uphours(h)
{
    if (hours != h) { hours = h; browser.storage.local.set({"hours" : hours}); }
}
document.getElementById("hour12").addEventListener("click", () => { uphours(12); });
document.getElementById("hour24").addEventListener("click", () => { uphours(24); });

// Popup the color input dialog when the color button is clicked (the real color
// button is hidden).
function popup()
{
    let p = document.getElementById("popup");
    p.focus();
    p.value = color;
    p.click();
}
document.getElementById("color").addEventListener("click", popup);

// Update color in real time as it changes (background.js will receive the
// storage events and redraw the clock).
function upcolor()
{
    let v = document.getElementById("popup").value;
    if (color != v) { color = v; browser.storage.local.set({"color" : color}); }
}
document.getElementById("popup").addEventListener("input", upcolor);
