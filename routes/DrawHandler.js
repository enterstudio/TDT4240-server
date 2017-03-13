class DrawHandler {

  static setGames(games){
    DrawHandler.games = games;
  }

  static post(req, res){
  	res.status(201);
  	res.end(JSON.stringify({ status: "success" }));
  	console.log(req.body.image);

  }

}

module.exports = DrawHandler;
