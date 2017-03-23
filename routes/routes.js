'use strict';

const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'drawings/')
  },
  filename: (req, file, callback) => {
    const newFileName = req.body.gamePin + "." + req.body.player;
    callback(null, newFileName);
  }
})
const upload = multer({ storage })

const Game = require('./../Models/Game');
const Player = require('./../Models/Player');
const GameHandler = require('./GameHandler');
const DrawHandler = require('./DrawHandler');
const GuessHandler = require('./GuessHandler');
const PlayerHandler = require('./PlayerHandler');
const games = {};

GameHandler.setGames(games);
PlayerHandler.setGames(games);
GuessHandler.setGames(games);
DrawHandler.setGames(games);

/*
  POST : http://localhost:8000/game       - Create game
  POST : http://localhost:8000/game/:id   - Join game
*/


const urls = {
  newGame: "/game",
  game: "/game/:gamePin",
  player: "/player",
  guess: "/guess",
  drawing: "/drawing"
}

router.get(urls.game, GameHandler.get);
router.post(urls.newGame, GameHandler.post);
router.get(urls.player, PlayerHandler.get);
router.post(urls.player, PlayerHandler.post);
router.get(urls.guess, GuessHandler.get);
router.post(urls.guess, GuessHandler.post);
router.post(urls.drawing, DrawHandler.post);
/*
router.post(urls.drawing, upload.single('img') , (req, res) => {
  console.log("Saved file with name: ", req.filename);
  res.send("Ok");
});*/

module.exports = router;
