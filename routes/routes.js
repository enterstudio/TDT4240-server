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

const urls = {
  newGame: "/game",
  joinGame: "/game/:gamePin/join",
  game: "/game/:gamePin",
  guess: "/guess",
  getGuess: "/guess/:gamePin",
  drawing: "/drawing",
  getDrawing: "/drawing/:id",
  score: "/score",
  startGame: "/game/:gamePin/start",
  player: "/player"
}

router.get(urls.game, GameHandler.get);
router.post(urls.newGame, GameHandler.post);
router.post(urls.joinGame, GameHandler.joinGame);
router.get(urls.getGuess, GuessHandler.get);
router.post(urls.guess, GuessHandler.post);
router.get(urls.getDrawing, DrawHandler.get);
router.post(urls.drawing, DrawHandler.post);
router.post(urls.score, ScoreHandler.post);
router.post(urls.startGame, GameHandler.startGame);
router.post(urls.player, PlayerHandler.post);

module.exports = router;
