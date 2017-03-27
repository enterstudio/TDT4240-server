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
const ScoreHandler = require('./ScoreHandler');
const GuessHandler = require('./GuessHandler');
const PlayerHandler = require('./PlayerHandler');
const games = {};

GameHandler._setGames(games);
GuessHandler._setGames(games);
DrawHandler._setGames(games);
ScoreHandler._setGames(games);

/*
  POST : http://localhost:8000/game       - Create game
  POST : http://localhost:8000/game/:id   - Join game
*/

const urls = {
  newGame: "/game",
  joinGame: "/game/:gamePin/join",
  game: "/game/:gamePin",
  guess: "/guess",
  drawing: "/drawing",
  getDrawing: "/drawing/:id",
  score: "/score"
}

router.get(urls.game, GameHandler.get);
router.post(urls.newGame, GameHandler.post);
router.post(urls.joinGame, GameHandler.joinGame);
router.get(urls.guess, GuessHandler.get);
router.post(urls.guess, GuessHandler.post);
router.get(urls.getDrawing, DrawHandler.get);
router.post(urls.drawing, DrawHandler.post);
router.post(urls.score, ScoreHandler.post);
/*
router.get(urls.player, PlayerHandler.get);
router.post(urls.player, PlayerHandler.post);
*/

/*
router.post(urls.drawing, upload.single('img') , (req, res) => {
  console.log("Saved file with name: ", req.filename);
  res.send("Ok");
});*/

module.exports = router;
