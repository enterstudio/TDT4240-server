'use strict';
const Game = require('../Models/game.js');

class ScoreHandler {

  static _getGame(request){
    return Game.getGame(request.body.gamePin);
  }


  static post(req, res){
    if(!req.body.gamePin && !req.body.scores){
      res.status(400).send("Body must have gamePin and scores");
      return;
    }

    ScoreHandler._getGame(req)
    .then( (game) => {
      if(!game){
        res.status(404).send("Game does not exist");
        return;
      }

      game.addScore({ scores: req.body.scores })
        .then( (scores) => {
          res.send({ status: "success", scores });
        });
    });

  }

}

module.exports = ScoreHandler;
