'use strict';

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('repository/sqlite3/dbfile.db');

const CREATE_NEW_GAME = "INSERT INTO game DEFAULT VALUES";
const SET_PLAYERS = "UPDATE game SET players = ? WHERE gamepin = ?";
const GET_GAME = "SELECT * FROM game WHERE gamepin = ?";

class GameRepository {

  static createGame(handler){
    console.log('Creating game...');
    db.run(CREATE_NEW_GAME, function (err) {
      if (err){
        console.log(err);
        handler("Something went wrong...", null);
      }
      handler(null, this.lastID);
    });
  }

  static getGame(gamePin, handler){
    db.run(GET_GAME, [gamePin], handler);
  }

  static addPlayer({ gamePin, playerId }, successHandler){
    db.run(SET_PLAYERS, [gamePin, playerId], (err) => {
      if(err){
        console.log(err)
      }
      successHandler();
    })
  }

}

module.exports = GameRepository;
