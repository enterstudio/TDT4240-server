'use strict'

const Game = require('../Models/game.js');

class GuessHandler {

  static _getGame(request){
    return Game.getGame(request.body.gamePin);
  }


  static get(req, res){
    if(!req.params.gamePin || !req.query.playerid || !req.query.round){
      res.status(404).send("Game not found");
      return;
    }

    GuessHandler._getGame()
    .then( (game) => {
      if(!game){
        res.status(404).send("Game does not exist");
        return;
      };

      game.getGuess({
        playerId: req.query.playerid,
        round: req.query.round
      });

    });
  }


  static post(req, res){
    if(!req.body.gamePin || !req.body.guess || (!req.body.playerId && req.body.playerId !== 0 ) ){
      console.log("Something is wrong with", req.body);
      res.status(400).send({ status: "Request missing body params" });
      return;
    }

    const game = GuessHandler._getGame(req);
    if(!game){
      res.status(404).send({ status: "Game does not exist" });
      return;
    }

    game.addGuess({ guessValue: req.body.guess, playerId: req.body.playerId  })
    .then(() => {
      res.send({ status: "success" });
    })
    .catch((err) => {
      console.log("ERROR: ", err);
      res.status(404).send({ status: err });
    })
  }

}

module.exports = GuessHandler;
