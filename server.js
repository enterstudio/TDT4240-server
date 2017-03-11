'use strict';

var express = require('express');
var app = express();
// Repository for the application
var repository = require('./repository/repository.js');
// Routes for the application
app.use(require('./routes/gameRoute'))

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
