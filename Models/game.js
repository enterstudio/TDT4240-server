'use strict';

const roundTypes = {
  DRAWING: "DRAWING",
  GUESSING: "GUESSING"
};

const GameRepository = require('./../repository/gameRepository.js');
const DrawRepository = require('./../repository/drawRepository.js');

class Game {

  constructor(handler){
    this.createGame(handler);
    this.players = [0]
    this.roundType = roundTypes.DRAWING;
    this.round = 0;
    /* guessBlock = { guesserId: 2, guess: "eple", drawerId: 3, drawingId: 321 } */
    this.guessesReceivedCurrentRound = 0;
    this.guessBlocks = [[],[],[],[]];
    this.isStarted = false;
    this.scores = [0];
  }

  createGame(successHandler){
    GameRepository.createGame( (err, gamePin) => {
      if(err){
        console.log("Error:", err);
        return err;
      };
      console.log('Game created...');
      successHandler(gamePin);
      this.gamePin = gamePin;
    });
  }


  _updateIfAllGuessesReceived(){
    if(this.guessesReceivedCurrentRound === this.players.length){
      this.guessesReceivedCurrentRound = 0;
      this.round += 1;
      return true;
    }
    return false;
  }


  addGuess({ guessValue, playerId }){
    return new Promise((resolve, reject) => {
      this.guessesReceivedCurrentRound += 1;
      this.guessBlocks[playerId][this.round] = {
        guessValue, guesserId: playerId
      }
      this._updateIfAllGuessesReceived();
      resolve();
    })
  }


  addDrawing({ playerId, imageString, round }){
    this.guessesReceivedCurrentRound += 1;

    const drawingData = {
      playerId,
      gamePin: this.gamePin,
      imageString: imageString
    };
    console.log("DRAWING ARGS:", JSON.stringify(drawingData));
    DrawRepository.createDrawing(drawingData)
      .then((id) => {
        const guessBlockIndex = (playerId + round) % this.players.length;
        this.guessBlocks[guessBlockIndex][round] = {
          drawingId: id, drawerId: playerId
        };
        this._updateIfAllGuessesReceived();
        // TODO: Save game object to database
      })
  }


  getDrawing({ playerId, round }){
    const guessBlockIndex = playerId + round % this.players.length;
    return game.guessBlocks[guessBlockIndex][round];
  }


  addPlayer(player, successHandler){
    this.players.push(player.playerId);
    this.scores.push(0);
    GameRepository.addPlayer({ gamePin: this.gamePin, players: this.players.join(",") }, successHandler);
  }


  removePlayer(player){
    var index = this.players.indexOf(player);
    if (index != -1){
      this.players.splice(index, 1);
    }
  }

}

module.exports = Game;
