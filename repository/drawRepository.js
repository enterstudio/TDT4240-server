'use strict';

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('repository/sqlite3/dbfile.db');
const assert = require('assert');

const INSERT = "INSERT INTO drawing (id, gamepin, playerid, file) VALUES(?, ?, ?, ?);";
const GET_DRAWING = "SELECT * FROM drawing WHERE id = ?";

class DrawRepository {

  static createDrawing({ gamePin, playerId, imageString }){
    assert.ok(gamePin, "createDrawing: no gamePin found");
    if(playerId !== 0){
      assert.ok(playerId, "createDrawing: no playerId found");
    }
    assert.ok(imageString, "createDrawing: no imageString found");

    console.log('Creating drawing...');
    return new Promise( (resolve, reject) => {
      db.run(INSERT, [null, gamePin, playerId, imageString], function (err, id) {
        if (err){
          console.log(err)
          reject("Something went wrong");
        }
        resolve(this.lastID);
      });
    });
  }


  static getDrawing({ id }){
    assert.ok(id, "DrawRepository.getDrawing: no id found");
    console.log("Getting drawing with id:", id);
    return new Promise((resolve, reject) => {
      db.all(GET_DRAWING, [id], (err, rows) => {
        //console.log("Drawing err:", err);
        //console.log("Drawing data:", rows);
        if(err){
          reject(err);
        }
        resolve(rows[0]);
      })
    })

  }


  static logErrorAndPassOn(){

  }

}

module.exports = DrawRepository;
