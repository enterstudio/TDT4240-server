'use strict';

var express = require('express')
var router = express.Router()
var Game = require('./../Models/Game')
var Player = require('./../Models/Player');
var games = {};

/*
  POST : http://localhost:8000/game       - Create game
  POST : http://localhost:8000/game/:id   - Join game
*/

// Create game
router.post('/game',  function (req, res) {
  var game = new Game(function(gamePin){
    res.end(JSON.stringify({ gamePin: gamePin }));
    games[gamePin] = game;
  });
})

// Join game
router.post('/game/:gamePin', function(req,res){

})


// Get specific game
router.get('/game/:gamePin', function(req, res){
  const game = games[req.params.gamePin];

  if(game){
    res.send(game);
  }
  else{
    res.status(404).send("Not found")
  }
})

router.post('/player', (req, res) => {
  const gamePin = req.body.gamePin;
  const game = games[gamePin]
  if(!game){
    res.status(404).send("Game does not exist");
  }

  game.addPlayer(new Player("Sig", 40));
  res.send(game);
});

module.exports = router
