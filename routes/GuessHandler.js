class GuessHandler {

  static setGames(games){
    GuessHandler.games = games;
  }


  get(req, res){
    const gamePin = req.body.gamePin
    const game = GuessHandler.games[gamePin]
    if(!game){
      res.status(404).send("Game does not exist");
    }

    res.send(game.guesses);
  }


  post(req, res){
    const gamePin = req.body.gamePin
    const game = GuessHandler.games[gamePin]
    if(!game){
      res.status(404).send("Game does not exist");
    }

    game.addGuess(req.body.guess);
    res.send("Ok");
  }

}
