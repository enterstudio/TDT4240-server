"use strict";

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('repository/sqlite3/dbfile.db');

class Repository {

  static initalize(){

    db.serialize(function() {
      console.log('Creating database...');

      // Game table
      db.run("CREATE TABLE IF NOT EXISTS game (gamePin INTEGER PRIMARY KEY NOT NULL, players TEXT, guesses TEXT, gamestate TEXT)");
      db.run("DELETE FROM game");
      //db.run("INSERT INTO game (gamePin) VALUES (?)", 1);

      // Player
      db.run("CREATE TABLE IF NOT EXISTS player (id INTEGER PRIMARY KEY NOT NULL, name VARCHAR, score INTEGER, gamePin INTEGER)");
      db.run("DELETE FROM player");
      db.run("INSERT INTO player (id, name, score, gamePin) VALUES (?, ?, ?, ?)", 1, "thomas", 999, 1);

      // Drawing
      db.run("CREATE TABLE IF NOT EXISTS drawing (id INTEGER PRIMARY KEY NOT NULL, playerid INTERGER, gamepin INTERGER, file BLOB, CONSTRAINT fk FOREIGN KEY (playerid) REFERENCES player(id) )");

      // Words
      db.run("CREATE TABLE IF NOT EXISTS words (value VARCHAR)");
      db.run("DELETE from words");
      const words = ['Banan', 'Hund', 'Agurk', 'Fotball', 'Hus', 'Briller', 'Fugl', 'Sol', 'Klokke', 'Ski', 'Julenisse', 'Hest', 'Melon', 'Eple', 'Mobillader'];
      words.forEach( (word) => {
        db.run('INSERT into words VALUES ( ? )', word);
      })

    });

  }

}

module.exports = Repository;
