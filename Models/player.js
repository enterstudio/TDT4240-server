'use strict';

class Player {

  constructor(name, score){
    this._name = name;
    this._score = score;
    this._id = id;
  }

  getID(){
    return this._id;
  }

  setScore(score){
    this._score = score;
  }

  getScore(){
    return this._score;
  }

  setName(name){
    this._name = name;
  }

  getName(name){
    return this._name;
  }

}

module.exports = Player;
