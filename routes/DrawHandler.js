const DrawRepository = require('./../repository/drawRepository.js');

class DrawHandler {

  static _setGames(games){
    DrawHandler.games = games;
  }


  static _getGame(request){
    return DrawHandler.games[request.body.gamePin];
  }


  static post(req, res){
    const game = DrawHandler._getGame(req);

    game.addDrawing({
      playerId: req.body.playerId,
      round: req.body.round,
      imageString: req.body.image
    });

  	res.send(JSON.stringify({ status: "success" }));
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
