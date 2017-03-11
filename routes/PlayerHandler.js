class PlayerHandler {

  static setGames(games){
    PlayerHandler.games = games;
  }


  static get(req, res){

  }


  static post(req, res){
    const gamePin = req.body.gamePin;
    const game = games[gamePin]
    if(!game){
      res.status(404).send("Game does not exist");
    }

    game.addPlayer(new Player(req.body.playerName, 0));
    res.send(game);
  }
}

module.exports = PlayerHandler
