"use strict";
var exec = require('child_process').exec;
var express = require('express');
var app = express();
var fs = require('fs');

app.configure(function () {
    app.set('port', 8000);
    app.use(express.bodyParser());
    app.use(express.compress());
    app.use(express.logger('dev'));
    app.use(express.static(__dirname));
});

app.post('/dart', function (req, res) {
    console.dir('Try do compile : ');
    console.dir(req.body);
    fs.writeFile("current.dart", req.body.code, function(err) {
        if(err) {
            res.send(err);
            return;
        } else {
            var child = exec("dart2js current.dart", function (error, stdout, stderr) {
                if (error !== null) {
                    fs.unlinkSync('current.dart');
                    res.send(err);
                    return;
                }
                fs.readFile('out.js', 'utf8', function (err,outFile) {
                    if (err) {
                        res.send(err);
                        return;
                    }
                    fs.unlinkSync('out.js');
                    fs.unlinkSync('out.js.map');
                    fs.unlinkSync('out.js.deps');
                    fs.unlinkSync('out.precompiled.js');
                    fs.unlinkSync('current.dart');
                    res.send(outFile);
                    return;
                });

            });
        }
    });
});
app.listen(8000);