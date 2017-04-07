'use strict';
const Game = require('../Models/game');

class GameHandler {

  static _setGames(games){
    GameHandler.games = games;
  }


  static _getGame(request){
    return GameHandler.games[request.params.gamePin];
  }


  static get(req, res){
    if(!req.params.gamePin){
      res.send("Request does not have gamePin");
      return;
    }

    const game = GameHandler._getGame(req);

    if(!game){
      res.send("Game does not exist");
      return;
    }

    if(req.query.playerid && req.query.round){
      console.log("Getting drawing");
      game.getDrawing({ playerId: req.query.playerid, round: req.query.round })
        .then( (drawing) => {
          res.send({ image: drawing });
        })
        .catch( (err) => {
          console.log("Error getting drawing:", err);
          res.send(err);
        });
      return;
    }

    res.send(game);
  }


  static post(req, res){
    const game = new Game( (gamePin) => {
      console.log("GamePin:", gamePin);
      res.send({ gamePin })
      GameHandler.games[gamePin] = game;
    });

  }

  static startGame(req, res){
     const game = GameHandler._getGame(req);
     if(!game){
        res.status(404).send("Game not found");
        return;
     }
     game.startGame();
     res.send({isStarted: true});
 }


  static joinGame(req, res){
      const game = GameHandler._getGame(req);
      if(!game){
        res.status(404).send("Game not found");
        return;
      }

      const nextPlayerId = game.players.length;
      game.addPlayer({ gamePin: game.gamePin, playerId: nextPlayerId }, () => {
        res.send({ myPlayerId: nextPlayerId });
      });
  }
}

module.exports = GameHandler
