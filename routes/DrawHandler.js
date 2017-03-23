const DrawRepository = require('../repository/drawRepository');

class DrawHandler {

  static _setGames(games){
    DrawHandler.games = games;
  }

  static post(req, res){
  	res.status(201);
    DrawRepository.createDrawing({
      gamePin: 1,
      playerId: 1,
      imageString: req.body.image
    }, (err, id) => {
      console.log("Image id: ", id);
    });

  	res.send(JSON.stringify({ status: "success" }));
  }

  static get(req, res){
    
  }

}

module.exports = DrawHandler;
