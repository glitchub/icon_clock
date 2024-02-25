# icon_clock.xpi can be submitted to addons.mozilla.com developer hub for signing
icon_clock.xpi: manifest.json background.js options.html options.js; zip $@ $^
.PHONY: clean
clean:; rm -f icon_clock.xpi
