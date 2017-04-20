class PlayerHandler {

  static _setGames(games){
    PlayerHandler.games = games;
  }


  static _getGame(request){
    return DrawHandler.games[request.body.gamePin];
  }


  static get(req, res){

  }


  static put(req, res){

    if(!req.body.gamePin){
      console.log("something was wrong with :", req.body);
      res.status(400).send({ status: "Request missing gamePin" });
      return;
    }

    const game = PlayerHandler._getGame(req)

    if(!game){
      res.status(404).send({ status: "Game does not exist" });
    }

    if(game.isStarted){
      res.statud(401).send({ status: "Game allready started" });
    }

    const nextPlayerId = game.players.length;
    game.addPlayer({ gamePin: game.gamePin, playerId: nextPlayerId }, () => {
      res.send({ myPlayerId: nextPlayerId });
    });
  }

}

module.exports = PlayerHandler
