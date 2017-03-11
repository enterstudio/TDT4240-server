'use strict';

var express = require('express')
var router = express.Router()
var Game = require('./../Models/Game')

var games = {};

/*
  POST : http://localhost:8000/game       - Create game
  POST : http://localhost:8000/game/:id   - Join game
*/

// Create game
router.post('/game',  function (req, res) {
  var game = new Game(function(gamePin){
    res.end(JSON.stringify({gamepin: gamePin}));
    games[gamePin] = game;
  });
})

// Join game
router.post('/game/:gamePin', function(req,res){
  
})


// Get specific game
router.get('/game/:gamePin', function(req, res){
  res.send(games[gamePin]);
})

module.exports = router
