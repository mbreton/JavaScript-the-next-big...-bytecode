var page = require('webpage').create();
page.paperSize = {
    format: 'A4',
    orientation: 'landscape',
    border: '0px'
};
var idx=0;


page.open('http://localhost:8000/#/', function () {
    page.render('~/slide.pdf', {format: 'PDF', quality: '100'});
    phantom.exit();
});