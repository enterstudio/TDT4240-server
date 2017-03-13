'use strict';

const express = require('express')
const router = express.Router()
const upload = require('multer')({ dest:'../drawings/' })

const Game = require('./../Models/Game')
const Player = require('./../Models/Player');
const GameHandler = require('./GameHandler');
const DrawHandler = require('./DrawHandler');
const PlayerHandler = require('./PlayerHandler');
const GuessHandler = require('./GuessHandler');
const games = {};

GameHandler.setGames(games);
GuessHandler.setGames(games);
DrawHandler.setGames(games);
PlayerHandler.setGames(games);
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

router.post(urls.drawing, upload.single('img'), DrawHandler.post);

module.exports = router;
