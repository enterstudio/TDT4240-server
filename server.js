'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
app.use(bodyParser.json({ limit: '1mb' }));
// Repository for the application
var repository = require('./repository/repository.js');
// Routes for the application
app.use(require('./routes/routes'))

class Server {

  static startServer(){
    var server = app.listen(8000,"127.0.0.1", function() {
      var host = server.address().address
      var port = server.address().port
      console.log('running at http://' + host + ':' + port)
    })
  }

}



// Start the server
Server.startServer();

// Initialize the repository
repository.initalize();
