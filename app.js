#!/usr/bin/env node
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

let app = express();

// Define the port to run on
app.set('port', 3000);

app.use(express.static(path.join(__dirname, 'frontend')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


require( './backend/components/dbSchemas' );

require('./backend/routes')(app);

app.get('/*', function (req, res) {
    return res.sendFile(path.join(__dirname, 'frontend') + '/index.html');
});

// Listen for requests
var server = app.listen(app.get('port'), function () {
    var port = server.address().port;
    console.log('Magic happens on port ' + port);
});
