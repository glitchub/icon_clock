// Icon Clock options

// Note inline scripts are disallowed, use event listeners.

var color;
var hours;

// Initialize on load.
document.addEventListener("DOMContentLoaded", ()=>{
    browser.storage.local.get().then((s)=>{
        color = s.color || "#ffff00";
        hours = s.hours || 24;
        document.getElementById("hours").value = hours;
    });
});

// Set 12 or 24 hours when the selection changes
document.getElementById("hours").addEventListener("change", ()=>{
    let h = document.getElementById("hours").value;
    if (hours != h) { hours = h; browser.storage.local.set({"hours" : hours}); }
});

// Popup the color input dialog when the color button is clicked (the real color
// button is hidden).
document.getElementById("popup").addEventListener("click", ()=>{
    let p = document.getElementById("color");
    p.focus();
    p.value = color;
    p.click();
});

// Update color in real time as it changes (background.js will receive the
// storage events and redraw the clock).
document.getElementById("color").addEventListener("input", ()=>{
    let c = document.getElementById("color").value;
    if (color != c) { color = c; browser.storage.local.set({"color" : color}); }
});
