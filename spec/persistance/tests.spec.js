const Game = require('../../Models/game.js')

describe('Game persistance tests',  () => {

  let validGamePin = null

  it('Should create game without params nicely', () => {
    const game = new Game()
  })

  it('Should create game with params nicely', (done) => {
    const game = new Game((id) => {
      console.log("New game id", id)
      done()
    })
  })

  it('Should save game nicely', (done) => {
    const game = new Game((id) => {
      validGamePin = id
      game._save()
        .then( () => {
          done()
        })
        .catch( (err) => {
          console.log(err);
          fail()
          done()
        })
    })
  })

  it('Should get game nicely', (done) => {
    Game.getGame(validGamePin)
      .then( (game) => {
        done()
      })
      .catch( (err) => {
        console.log(err)
        fail()
        done()
      })
  })

  /* FLAKY TEST(?): but in game drawings are always added before guesses
  so if this test passes some of the runs it should be ok  */
  it('Should save the correct values', (done) => {
    let gameId = 0;
    new Promise( (resolve, reject) => {
      const game = new Game((gamePin) => {
        gameId = gamePin;
        /* Not all methods uses promises so this is kind of messy */
        game.addPlayer({ playerId: 1 } ,() => {
          game.addDrawing({ playerId: 0, imageString: "asdjfkadsfkh", round: 0 })
          .then( () => {
            game.addGuess({ guessValue: "fiskestang", playerId: 0 })
            .then( () => {
              resolve();
            })
            .catch( (err) => {
              console.log(err)
              fail()
              done()
            })
          })

        })

      })
    })
      .then( () => {
        Game.getGame(gameId)
          .then( (game) => {
            expect(game.players.length).toBe(2);
            expect(game.guessBlocks[0][0].guess).toBe("fiskestang");
            expect(game.guessBlocks[0][0].guesserId).toBe(0);
            done();
          })
      })
      .catch( (err) => {
        console.log(err);
        fail();
        done();
      })

  })

})
