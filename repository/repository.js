"use strict";

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('repository/sqlite3/dbfile.db');

class Repository {

  static initalize(){

    db.serialize(function() {
      console.log('Creating database...');

      // Game table
      db.run("CREATE TABLE IF NOT EXISTS game (gamePin INTEGER PRIMARY KEY)");
      db.run("DELETE FROM game");
      db.run("INSERT INTO game (gamePin) VALUES (?)", 1);

      // Player
      db.run("CREATE TABLE IF NOT EXISTS player (id INTEGER PRIMARY KEY, name VARCHAR, score INTEGER, gamePin INTEGER)");
      db.run("DELETE FROM player");
      db.run("INSERT INTO player (id, name, score, gamePin) VALUES (?, ?, ?, ?)", 1, "thomas", 999, 1);

    });

  }

}

module.exports = Repository;
