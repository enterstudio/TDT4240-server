'use strict';
const roundTypes = {
  DRAWING: "DRAWING",
  GUESSING: "GUESSING"
};

let EVERY_WORD = [];
var selectedWords;


const assert = require('assert');
const GameRepository = require('./../repository/gameRepository.js');
const DrawRepository = require('./../repository/drawRepository.js');
const WordRepository = require('./../repository/wordRepository.js');


WordRepository.getAllWords()
  .then( (rows) => {
    rows.forEach( (row) => {
      EVERY_WORD.push(row.value);
    });
  });


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
    this.guessBlocksDepth = 0;
    this.scoresReceived = 0;
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

      selectedWords = EVERY_WORD.slice(0);

      var tempIndex = Math.floor(Math.random()*selectedWords.length);
      var word = selectedWords[tempIndex];
      selectedWords.splice(tempIndex, 1);
      this.initialWords.push(word);

      this.guessBlocks.push([]);

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

  _updateIfAllScoresReceived(){
     console.log("scoresReceived: ", this.scoresReceived);
     if(this.scoresReceived === this.players.length){
        console.log("isFinished: ", this.isFinished);
        this.isFinished = true;
        return true;
     }
     return false;
 }

  _incrementGuessBlocksDepth(){
     if(this.guessesReceivedCurrentRound === this.players.length){
      this.guessBlocksDepth += 1;
      return true;
     }
     return false;
  }

  addGuess({ guessValue, playerId }){
    return new Promise((resolve, reject) => {
      const guessBlockIndex = (parseInt(playerId) + parseInt(this.round)) % this.players.length;
      this.guessesReceivedCurrentRound += 1;
      this.guessBlocks[guessBlockIndex][this.guessBlocksDepth].guess = guessValue;
      this.guessBlocks[guessBlockIndex][this.guessBlocksDepth].guesserId = playerId;
      this._incrementGuessBlocksDepth();
      this._updateIfAllGuessesReceived();
      resolve();
    })
  }


  addDrawing({ playerId, imageString, round }){
    this.guessesReceivedCurrentRound += 1;
    const drawingData = {
      playerId: playerId,
      gamePin: this.gamePin,
      imageString: imageString
    };

    //console.log("DRAWING ARGS:", JSON.stringify(drawingData));
    return DrawRepository.createDrawing(drawingData)
      .then((id) => {
         const guessBlockIndex = (parseInt(playerId) + parseInt(round)) % this.players.length;
         if (this.guessBlocks[guessBlockIndex][this.guessBlocksDepth] == null){
            this.guessBlocks[guessBlockIndex].push({ guesserId: null, guess: null, drawerId: null, drawingId: null})
         }
         this.guessBlocks[guessBlockIndex][this.guessBlocksDepth].drawingId = id;
         this.guessBlocks[guessBlockIndex][this.guessBlocksDepth].drawerId = playerId;
         this._updateIfAllGuessesReceived();
      });
        // TODO: Save game object to database
  }


  getDrawing({ playerId, round }){
    let guessBlockIndex = (parseInt(playerId, 10) + parseInt(round, 10)) % this.players.length
    if(round == 0){ guessBlockIndex -= 1 }
    const guessBlock = this.guessBlocks[guessBlockIndex][round];
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

    //this.guessBlocks.push([{ guesserId: null, guess: null, drawerId: null, drawingId: null}]);
    this.guessBlocks.push([]);

    GameRepository.addPlayer({ gamePin: this.gamePin, players: this.players.join(",") }, successHandler);
  }


   addScore({ scores }){
      assert.ok(scores, 'Game.addScore: scores must be supplied');
      return new Promise( (resolve, reject) => {
         Object.keys(scores).forEach( (key) => {
           this.scores[key] += scores[key];
         });
         console.log("scores: ", scores);
         this.scoresReceived += 1;
         this._updateIfAllScoresReceived();
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
