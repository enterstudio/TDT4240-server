"use strict";

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('repository/sqlite3/dbfile.db');

class Repository {

  static initalize(){

    db.serialize(function() {
      console.log('Creating database...');

      // Game table
      db.run("CREATE TABLE IF NOT EXISTS game (gamePin INTEGER PRIMARY KEY, players TEXT, guesses TEXT)");
      db.run("DELETE FROM game");
      //db.run("INSERT INTO game (gamePin) VALUES (?)", 1);

      // Player
      db.run("CREATE TABLE IF NOT EXISTS player (id INTEGER PRIMARY KEY, name VARCHAR, score INTEGER, gamePin INTEGER)");
      db.run("DELETE FROM player");
      db.run("INSERT INTO player (id, name, score, gamePin) VALUES (?, ?, ?, ?)", 1, "thomas", 999, 1);

      // Drawing
      db.run("CREATE TABLE IF NOT EXISTS drawing (id INTERGER PRIMARY KEY, playerid INTERGER, gamepin INTERGER, file BLOB, CONSTRAINT fk FOREIGN KEY (playerid) REFERENCES player(id) )");

    });

  }

}

module.exports = Repository;
