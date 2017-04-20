'use strict';

class ScoreHandler {

  static _setGames(games){
    ScoreHandler.games = games;
  }

  static _getGame(request){
    return ScoreHandler.games[request.body.gamePin];
  }


  static post(req, res){
    if(!req.body.gamePin && !req.body.scores){
      res.status(400).send("Body must have gamePin and scores");
      return;
    }

    const game = ScoreHandler._getGame(req);
    if(!game){
      res.status(404).send("Game does not exist");
      return;
    }

    game.addScore({ scores: req.body.scores })
      .then( (scores) => {
        res.send({ status: "success", scores });
      });
  }

}

module.exports = ScoreHandler;
