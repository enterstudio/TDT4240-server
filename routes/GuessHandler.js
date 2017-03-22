'use strict';
class GuessHandler {

  static setGames(games){
    GuessHandler.games = games;
  }

  static get(req, res){
    const gamePin = req.body.gamePin
    const game = GuessHandler.games[gamePin]
    if(!game){
      res.status(404).send("Game does not exist");
    }

    res.send(game.guesses);
  }


  /*
  static post(req, res){
    const gamePin = req.body.gamePin
    const game = GuessHandler.games[gamePin]
    if(!game){
      res.status(404).send("Game does not exist");
    }

    game.addGuess(req.body.guess);
    res.send("Ok " + req.body.guess);
  }
  */
  static post(req, res){
    res.status(201);
    res.end(JSON.stringify({ status: "success" }));
    console.log(req.body.guess);

  }

}

module.exports = GuessHandler
