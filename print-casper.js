var casper = require('casper').create({
    logLevel: "fatal"              // Only "info" level messages will be logged
});

var baseUrl = 'http://localhost:8000/#/';

function nextSlide(id) {
    casper.wait(1000, function () {
        this.capture('print/slide-' + ("0" + id).slice(-2) + '.png', undefined, {
            format: 'png',
            quality: 100
        });
        var hasNextSlide = this.evaluate(function revealNext() {
            if ($('.navigate-down').hasClass('enabled')) {
                Reveal.down();
            } else if ($('.navigate-right').hasClass('enabled')){
                Reveal.next();
            } else{
                return false;
            }
            while (Reveal.nextFragment()) {
            }
            return true;
        });
        if (hasNextSlide) {
            nextSlide(id + 1);
        }
    });
};

casper.start(baseUrl, function () {
    this.viewport(1280, 720);
    nextSlide(0);
});

casper.run();