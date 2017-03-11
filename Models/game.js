'use strict';

var gameRepository = require('./../repository/GameRepository.js');

class Game {

  constructor(cb){
    this.createGame(cb);
    this.players = []
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
    return this.gamePin;
  }

  setGamePin(gamePin){
    this.gamePin = gamePin;
  }

  addPlayer(player){
    this.players.push(player);
    // Save to database
  }

  removePlayer(player){
    var index = this.players.indexOf(player);
    if (index != -1) this.players.splice(index, 1);
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
