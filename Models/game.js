'use strict';
const roundTypes = {
  DRAWING: "DRAWING",
  GUESSING: "GUESSING"
};

const EVERY_WORD = ["Banan", "Eple", "Agurk", "Melon", "Hest", "Hund", "Fotball", "Hus", "Sol", "Briller", "Fugl", "Klokke", "Ski", "Julenisse"];
var selectedWords;

const assert = require('assert');
const GameRepository = require('./../repository/gameRepository.js');
const DrawRepository = require('./../repository/drawRepository.js');

class Game {

  constructor(handler){
    this.createGame(handler);
    this.players = [0]
    this.roundType = roundTypes.DRAWING;
    this.round = 0;
    this.initialWords = [];
    /* guessBlock = { guesserId: 2, guess: "eple", drawerId: 3, drawingId: 321 } */
    this.guessesReceivedCurrentRound = 0;
    this.guessBlocks = [];
    this.isStarted = false;
    this.isFinished = false;
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

      selectedWords = EVERY_WORD;
      console.log("Selected words: ", selectedWords);

      var tempIndex = Math.floor(Math.random()*selectedWords.length);
      var word = selectedWords[tempIndex];
      selectedWords.splice(tempIndex, 1);
      this.initialWords.push(word);

      this.guessBlocks.push([{ guesserId: null, guess: null, drawerId: null, drawingId: null}]);

    });
  }

   startGame(){
      this.isStarted = true;
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
      const guessBlockIndex = (parseInt(playerId) + parseInt(this.round)) % this.players.length;
      this.guessesReceivedCurrentRound += 1;
      this.guessBlocks[guessBlockIndex][this.round] = {
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
    //console.log("DRAWING ARGS:", JSON.stringify(drawingData));
    return DrawRepository.createDrawing(drawingData)
      .then((id) => {
        const guessBlockIndex = (playerId + round) % this.players.length;
        console.log("playerId: ", playerId);
        console.log("round: ", round);
        console.log("players length: ", this.players.length);
        console.log("guessBlockIndex: ", guessBlockIndex);
        this.guessBlocks[guessBlockIndex][round] = {
          drawingId: id, drawerId: playerId
        };
        console.log("GuessBlocks: ", this.guessBlocks);
        this._updateIfAllGuessesReceived();
      });
        // TODO: Save game object to database
  }


  getDrawing({ playerId, round }){
    let guessBlockIndex = (parseInt(playerId, 10) + parseInt(round, 10)) % this.players.length
    if(round == 0){ guessBlockIndex -= 1 }
    const guessBlock = this.guessBlocks[guessBlockIndex][round];
    console.log("guessBlock: ", guessBlock);
    const drawingId = guessBlock.drawingId;
    return DrawRepository.getDrawing({ id: drawingId })
      .then( (drawing) => {
        return drawing.file;
      })
  }

  getGuess({ playerId, round }){
    let guessBlockIndex = (parseInt(playerId, 10) + parseInt(round, 10)) % this.players.length

    if(round == 0){
      guessBlockIndex -= 1
    }

    const guessBlock = this.guessBlocks[guessBlockIndex][round];
    return guessBlock.guess;
  }


  addPlayer(player, successHandler){
    this.players.push(player.playerId);
    this.scores.push(0);

    var tempIndex = Math.floor(Math.random()*selectedWords.length);
    var word = selectedWords[tempIndex];
    selectedWords.splice(tempIndex, 1);
    this.initialWords.push(word);

    this.guessBlocks.push([{ guesserId: null, guess: null, drawerId: null, drawingId: null}]);
    GameRepository.addPlayer({ gamePin: this.gamePin, players: this.players.join(",") }, successHandler);
  }


  addScore({ scores }){
    assert.ok(scores, 'Game.addScore: scores must be supplied');
    return new Promise( (resolve, reject) => {
      Object.keys(scores).forEach( (key) => {
        this.scores[key] += scores[key];
      });
      resolve(this.scores);
    })

  }


  removePlayer(player){
    var index = this.players.indexOf(player);
    if (index != -1){
      this.players.splice(index, 1);
    }
  }

}

module.exports = Game;
