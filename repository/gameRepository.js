'use strict';

const assert = require('assert');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('repository/sqlite3/dbfile.db');

const CREATE_NEW_GAME = "INSERT INTO game DEFAULT VALUES";
const SET_PLAYERS = "UPDATE game SET players = ? WHERE gamepin = ?";
const GET_GAME = "SELECT * FROM game WHERE gamepin = ?";
const SAVE_GAME = "UPDATE game SET gamestate = ? WHERE gamepin = ?";

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

  static getGame(gamePin, game){
    assert.ok(gamePin, "Need gamepin to get game");
    assert.ok(game, "Need game reference to put game into");

    return new Promise( (resolve, reject) => {
      //console.log("\n\n Getting game with pin:", gamePin);
      db.get(GET_GAME, [gamePin], (err, row) => {
        if(err){
          reject(err);
        }

        if(!row){
          console.log("Could not find game with id:", gamePin);
          resolve(null);
          return;
        }

        const gameState = JSON.parse(row['gamestate']);
        Object.keys(gameState).forEach( (key) => {
          game[key] = gameState[key];
        });

        resolve(game);
      })

    });
  }

  static save(game){
    const gameState = {};

    Object.keys(game).forEach( (key) => {
      if(typeof(game[key]) !== 'function'){
            gameState[key] = game[key];
      }
    });

    return new Promise( (resolve, reject) => {
      db.run(SAVE_GAME, [JSON.stringify(gameState), game.gamePin], (err) => {
        if(err){
          reject(err);
        }
        resolve();
      });
    });
  }

}

module.exports = GameRepository;
