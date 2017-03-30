'use strict'

class GuessHandler {

  static _setGames(games){
    GuessHandler.games = games;
  }


  static _getGame(request){
    return GuessHandler.games[request.body.gamePin];
  }


  static get(req, res){
    if(!req.body.gamePin){
      res.status(404).send("Game not found");
      return;
    }

    const game = GuessHandler._getGame(req)
    if(!game){
      res.status(404).send("Game does not exist");
    }

    res.send(game.getDrawing({
      playerId: req.body.playerId,
      round: req.body.round
    }));
  }


  static post(req, res){
    if(!req.body.gamePin || !req.body.guess || !req.body.playerId ){
      res.status(400).send("Request missing body params");
    }

    const game = GuessHandler._getGame(req);
    if(!game){
      res.status(404).send("Game does not exist");
      return;
    }

    game.addGuess({ guessValue: req.body.guess, playerId: req.body.playerId  })
    .then(() => {
      res.send("Success");
    })
    .catch((err) => {
      res.status(404).send(err);
    })
  }

}

module.exports = GuessHandler;
