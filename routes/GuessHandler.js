'use strict'

class GuessHandler {

  static _setGames(games){
    GuessHandler.games = games;
  }


  static _getGame(request){
    return GuessHandler.games[request.params.id];
  }


  static get(req, res){
    const game = GuessHandler._getGame(req)
    if(!game){
      res.status(404).send("Game does not exist");
    }

    res.send(game.guesses);
  }


  static post(req, res){
    const game = GuessHandler._getGame(req);
    if(!game){
      res.status(404).send("Game does not exist");
    }

    game.addGuess(req.body.guess, (err) => {
      if(err){
        res.send(err);
        return;
      }
      res.send("Ok " + req.body.guess);
    });
  }

}

module.exports = GuessHandler;
