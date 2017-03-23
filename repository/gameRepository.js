'use strict';

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('repository/sqlite3/dbfile.db');

const CREATE_NEW_GAME = "INSERT INTO game DEFAULT VALUES";

class GameRepository {

  static createGame(cb){
    console.log('Creating game...');
    db.run(CREATE_NEW_GAME, (err) => {
      if (err){
        console.log(err);
        cb("Something went wrong...", null);
      }
      cb(null, this.lastID);
    });
  }

}

module.exports = GameRepository;
