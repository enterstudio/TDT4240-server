'use strict';
const Game = require('../Models/game');

class GameHandler {

  static _getGame(request){
    return Game.getGame(request.params.gamePin);
  }


  static get(req, res){
    if(!req.params.gamePin){
      res.send({ status: "Request does not have gamePin" });
      return;
    }

    GameHandler._getGame(req)
    .then( (game) => {
      if(!game){
        res.send({ status: "Game does not exist" });
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
            res.send({ status: err });
          });
        return;
      }

      res.send(game);
    });

  }


  static post(req, res){
    const game = new Game( (gamePin) => {
      console.log("GamePin:", gamePin);
      res.send({ gamePin });
    });

  }

  static put(req, res){
    if(!req.params.gamePin){
      res.send({ status: "Request does not have gamePin" });
      return;
    }

    const game = GameHandler._getGame(req);
    if(!game){
      res.status(404).send({ status: "Game does not exist" });
      return;
    }

    if(req.body.isStarted === true || req.body.isStarted === false){
      game.isStarted = req.body.isStarted;
      res.send({ status: "ok" });
      return;
    }

    res.send({ status: "nothing was changed" });
  }

  /* Deprecated */
  static startGame(req, res){
     const game = GameHandler._getGame(req);
     if(!game){
        res.status(404).send({ isStarted: false, status: "Game not found" } );
        return;
     }
     game.startGame();
     res.send({isStarted: true});
 }

  /* Deprecated */
  static joinGame(req, res){
      const game = GameHandler._getGame(req)
      .then( () => {

        if(!game){
          res.status(404).send("Game not found");
          return;
        }

        if(game.isStarted){
          res.status(404).send("Game already started");
          return;
        }

        const nextPlayerId = game.players.length;
        game.addPlayer({ gamePin: game.gamePin, playerId: nextPlayerId }, () => {
          res.send({ myPlayerId: nextPlayerId });
        });

      })

  }
}

module.exports = GameHandler
