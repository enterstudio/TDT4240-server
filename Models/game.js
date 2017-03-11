'use strict';

var gameRepository = require('./../repository/GameRepository.js');

class Game {

  constructor(cb){
    this.createGame(cb);
  }

  createGame(cb){
    gameRepository.createGame(function(err, gamePin) {
      if (err) return (err);
      console.log('Game created...');
      cb(gamePin);
      this.setGamePin(gamePin);
    }.bind(this));
  }

  getGamePin(){
    return this._gamePin;
  }

  setGamePin(gamePin){
    this._gamePin = gamePin;
  }

  addPlayer(player){
    this._players.push(player);
  }

  removePlayer(player){
    var index = this._players.indexOf(player);
    if (index != -1) this._players.splice(index, 1);
  }

}


module.exports = Game;

/*

var createGame = fucntion(cb){
  gameRepository.createGame(function(err, id) {
    if (err) return (err);
    console.log('Game created...');
    cb(id);
  });
}

module.exports = {
  createGame: createGame
}

*/
