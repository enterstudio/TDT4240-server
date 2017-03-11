'use strict';

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('repository/sqlite3/dbfile.db');

class GameRepository {

  static createGame(cb){
    console.log('Creating game...');
    db.run("INSERT INTO game DEFAULT VALUES", function (err){
      if (err){
        console.log(err);
        cb("Something went wrong...", null);
      }
      cb(null, this.lastID);
    });
  }

}

module.exports = GameRepository;
