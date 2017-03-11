'use strict';

class GameHandler {

  static setGames(games){
    GameHandler.games = games;
  }

  static get(req, res){
    const game = games[req.params.gamePin];

    if(game){
      res.send(game);
    }
    else{
      res.status(404).send("Not found")
    }
  }


  static post(req, res){
    var game = new Game(function(gamePin){
      res.end(JSON.stringify({ gamePin: gamePin }));
      games[gamePin] = game;
    });
  }
}

module.exports = GameHandler
