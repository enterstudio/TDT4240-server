'use strict';

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('repository/sqlite3/dbfile.db');
const assert = require('assert');

const INSERT = "INSERT INTO drawing (gamepin, playerid, file) VALUES(?, ?, ?);";
const GET_DRAWING = "SELECT * FROM drawing WHERE playerid = ? AND gamepin = ?;";

class DrawRepository {

  static createDrawing({ gamePin, playerId, imageString }, handler){
    assert.ok(gamePin, "createDrawing: no gamepin found");
    assert.ok(playerId, "createDrawing: no playid found");
    assert.ok(imageString, "createDrawing: no imageString found");

    console.log('Creating drawing...');

    db.run(INSERT, [gamePin, playerId, imageString], (err, id) => {
      if (err){
        console.log(err)
        handler("Something went wrong", null);
      }
      handler(null, this.lastID);
    });

  }


  static getDrawing({ gamepin, playerid }, callback){
    assert.ok(gamepin, "getDrawing: no gamepin found");
    assert.ok(playerid, "getDrawing: no playerid found");

    db.run(GET_DRAWING, [gamepin, playerid], () => {})

  }


  static logErrorAndPassOn(){

  }

}

module.exports = DrawRepository;
