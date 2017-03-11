'use strict';

class Player {

  constructor(name, score){
    this.name = name;
    this.score = score;
    this.id = null;
  }

  getID(){
    return this.id;
  }

  setScore(score){
    this.score = score;
  }

  getScore(){
    return this.score;
  }

  setName(name){
    this.name = name;
  }

  getName(name){
    return this.name;
  }

}

module.exports = Player;
