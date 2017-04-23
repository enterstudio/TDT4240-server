const Game = require('../Models/game.js');

class PlayerHandler {

  static _getGame(request){
    return Game.getGame(request.body.gamePin);
  }


  static post(req, res){
    if(!req.body.gamePin){
      console.log("GameHndler: something was wrong with :", req.body);
      res.status(400).send({ status: "Request missing gamePin" });
      return;
    }

    PlayerHandler._getGame(req)
    .then( (game) => {

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

    })
    .catch( (err) => {
      console.log(err);
      res.status(500).send({ status: err });
    });
  }

}

module.exports = PlayerHandler
