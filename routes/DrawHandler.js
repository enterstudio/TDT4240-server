const DrawRepository = require('./../repository/drawRepository.js');

class DrawHandler {

  static _setGames(games){
    DrawHandler.games = games;
  }


  static _getGame(request){
    //console.log("Getting game with gamePin :", request.body);
    return DrawHandler.games[request.body.gamePin];
  }


  static post(req, res){
    if(!req.body.gamePin || !req.body.playerId || !req.body.image || !req.body.round){
      res.status(400).send("Request missing gamePin, roun, playerId or image");
      return;
    }

    const game = DrawHandler._getGame(req);

    if(!game){
      res.send("Game does not exist");
      return;
    }

    game.addDrawing({
      playerId: req.body.playerId,
      round: req.body.round,
      imageString: req.body.image
    })
    .then( () => {
      res.send(JSON.stringify({ status: "success" }));
    })
    .catch( (err) => {
      res.status(500).send("Something went wrong");
    })

  }

  static get(req, res){
    DrawRepository.getDrawing({
      id: req.params.id
    })
    .then((image) => {
      res.send({ image });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).send(err);
    })
  }

}

module.exports = DrawHandler;
