'use strict';
const Game = require('../Models/game')

class GameHandler {

  static setGames(games){
    GameHandler.games = games;
  }


  static get(req, res){
    const game = GameHandler.games[req.params.gamePin];

    if(game){
      res.send(game);
    }
    else{
      res.status(404).send("Not found");
    }
  }

  static post(req, res){
      var game = new Game( function(gamePin)
      {
        res.send(JSON.stringify({ gamePin: gamePin
      }));
      GameHandler.games[gamePin] = game;
    });
  }

}

module.exports = GameHandler
