'use strict';

cosnt roundTypes = {
  DRAWING: "DRAWING",
  GUESSING: "GUESSING"
};

const gameRepository = require('./../repository/GameRepository.js');

class Game {

  constructor(cb){
    this.createGame(cb);
    this.players = []
    this.roundType = roundTypes.DRAWING;
    this.round = 0;
    /* guessBlock = { guesserId: 2, guess: "eple", drawerId: 3, drawingId: 321 } */
    this.guessBlocks = []
    this.isStarted = false;
    /* guess { word, bitmapId } */
  }

  createGame(successHandler){
    gameRepository.createGame( (err, gamePin) => {
      if(err){
        console.log("Error:", err);
        return err;
      };
      console.log('Game created...');
      successHandler(gamePin);
      this.gamePin = gamePin;
    });
  }


  _allGuessesReceived(){
    if(this.roundType === roundTypes.DRAWING){
        this.guessBlocks.map( (guessBlock) => {
          const hasDrawing = !guessBlock[this.round].drawingId;
          if (!hasDrawing) return false;
        });
        return true;
    }
    else{
      this.guessBlocks.map( (guessBlock) => {
        const hasGuessValue = !guessBlock[this.round].guess;
        if (!hasGuessValue) return false;
      })
      return true;
    }

    return false;
  }

  addGuess({ guessValue, playerId }){
    // add guess blabla
    if(this._allGuessesReceived()){
      const currentRoundType = this.roundType;
      this.roundType = currentRoundType == roundTypes.DRAWING ? roundTypes.GUESSING : roundTypes.DRAWING;
      this.round += 1;
    }
  }


  addPlayer(player, successHandler){
    this.players.push(player);
    gameRepository.addPlayer({ gamePin: this.gamePin, players: this.players.join(",") }, successHandler);
  }


  removePlayer(player){
    var index = this.players.indexOf(player);
    if (index != -1){
      this.players.splice(index, 1);
    }
  }

}

module.exports = Game;
