// Icon Clock options

// Note inline scripts are disallowed, use event listeners.

var color;
var hours;
var family;
var weight;

// Initialize on load.
document.addEventListener("DOMContentLoaded", ()=>{
    browser.storage.local.get().then((s)=>{
        color = s.color || "#ffff00";
        hours = s.hours || 24;
        document.getElementById("hours").value = hours;
        family = s.family || "sans-serif";
        document.getElementById("family").value = family;
        weight = s.weight || "normal";
        document.getElementById("weight").value = weight;
    });
});

// Popup the color input dialog when the "Color" is clicked (the real color
// button is hidden).
document.getElementById("popup").addEventListener("click", ()=>{
    let p = document.getElementById("color");
    p.focus();
    p.value = color;
    p.click();
});

// Update storage when associated selection changes
document.getElementById("color").addEventListener("input", () =>
{
    let v = document.getElementById("color").value;
    if (color != v) { color = v; browser.storage.local.set({"color" : color}); }
});

document.getElementById("hours").addEventListener("change", () =>
{
    let v = document.getElementById("hours").value;
    if (hours != v) { hours = v; browser.storage.local.set({"hours" : hours}); }
});

document.getElementById("family").addEventListener("change", () =>
{
    let v = document.getElementById("family").value;
    if (family != v) { family = v; browser.storage.local.set({"family" : family}); }
});

document.getElementById("weight").addEventListener("change", () =>
{
    let v = document.getElementById("weight").value;
    if (weight != v) { weight = v; browser.storage.local.set({"weight" : weight}); }
});
