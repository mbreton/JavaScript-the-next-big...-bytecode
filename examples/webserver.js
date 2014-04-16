var express = require('express');
var app = express();
app.get('/', function (req, res) {
    res.send('Hello, DevoxxFR 2014');
});
app.listen(3000);