'use strict';
const Game = require('../Models/game')

class GameHandler {

  static _setGames(games){
    GameHandler.games = games;
  }


  static _getGame(request){
    return GameHandler.games[request.params.gamePin];
  }


  static get(req, res){
    const game = GameHandler._getGame(req);
    if(game){
      res.send(game);
    }
    else{
      res.status(404).send("Not found");
    }
  }


  static post(req, res){
    const game = new Game( (gamePin) => {
      console.log("GamePin:", gamePin);
      res.send({ gamePin })
      GameHandler.games[gamePin] = game;
    });

  }


  static joinGame(req, res){
      const game = GameHandler._getGame(req);
      if(!game){
        res.statud(404).send("Game not found");
        return;
      }

      const nextPlayerId = game.players.length;
      game.addPlayer({ gamePin: game.gamePin, playerId: nextPlayerId }, () => {
        res.send({ myPlayerId: nextPlayerId });
      });
  }
}

module.exports = GameHandler
