const Game = require('../Models/game.js');
const DrawRepository = require('../repository/drawRepository.js');

class DrawHandler {

  static _getGame(request){
    return Game.getGame(request.body.gamePin);
  }


  static post(req, res){

    if(!req.body.gamePin || (!req.body.playerId && req.body.playerId !== 0)  || !req.body.image || (!req.body.round && req.body.round !== 0 )){
      console.log("something was wrong with :", req.body);
      res.status(400).send({ status: "Request missing gamePin, round, playerId or image" });
      return;
    }

    DrawHandler._getGame(req)
    .then( (game) => {
      if(!game){
        res.send({ status: "Game does not exist" });
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
        res.status(500).send({ status: "Something went wrong" });
      })
    });

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
      res.status(404).send({ status: err });
    })
  }

}

module.exports = DrawHandler;
