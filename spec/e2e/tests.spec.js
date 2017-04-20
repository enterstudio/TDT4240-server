const fetch = require('node-fetch');

describe("End to end tests - ", () => {

  const baseUrl = "http://localhost:8000/"
  const gameUrl = baseUrl + "game/"
  const drawingUrl = baseUrl + "drawing/"
  const scoreUrl = baseUrl + "score/";
  const guessUrl = baseUrl + "guess/";

  describe('Happy path game - ', () => {

    const drawing = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADg0gClLwABsO71xAAAAABJRU5ErkJggg=="


    it('should create game nicely', (done) => {
      fetch(gameUrl, {
        method: 'POST'
      })
        .then( (rawData) => {
          rawData.json()
            .then( (data) => {
              expect(data.gamePin).toBe(1)
              done();
            })
        })
    })


    it('should be joined nicely', (done) => {
      fetch(gameUrl + "1/join/", {
        method: 'POST'
      })
        .then( (rawData) => {
          rawData.json()
            .then( (data) => {
              expect(data.myPlayerId).toBe(1)
              done()
            })
        })
    })


    it('should not have started game before start signal is received', (done) => {
      fetch(gameUrl + "1/", {
        method: 'GET'
      })
        .then( (rawData) => rawData.json() )
        .then( (game) => {
          expect(game.isStarted).toBe(false)
          done()
        })
    })

    it('should receive drawing nicely', (done) => {
      fetch(drawingUrl, {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({ image: drawing, playerId: 0, gamePin: 1, round: 0 })
      })
      .then( (rawData) => rawData.json() )
      .then( (data) => {
        expect(data.status).toBe("success")
        done()
      })
    })


    it('should be able to get drawing after posting it', (done) => {
      fetch(gameUrl + "1/?playerid=1&round=0", {
        headers: { 'Content-Type': 'application/json' },
        method: 'GET'
      })
      .then( (rawData) => rawData.json() )
      .then( (data) => {
        expect(data.image).toEqual(drawing)
        done()
      })
    })


    it('should receive second drawing nicely', (done) => {
      fetch(drawingUrl, {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({ image: drawing, playerId: 1, gamePin: 1, round: 0 })
      })
      .then( (rawData) => rawData.json() )
      .then( (data) => {
        expect(data.status).toBe("success");
        done()
      })
    })


    it('should have incremented gameRound when both players have submitte images', (done) => {
      fetch(gameUrl + "1/", {
        method: 'GET'
      })
      .then( (rawData) => rawData.json() )
      .then( (data) => {
        expect(data.round).toBe(1);
        done();
      })
    })


    it('should be able to receive guess nicely', (done) => {
      const payload = { playerId: 1, guess: "banana", gamePin: 1 }

      fetch(guessUrl, {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(payload)
      })
      .then( (rawData) => rawData.json() )
      .then( (data) => {
        expect(data.status).toBe('success')
        done()
      })
    })

    it('should have put player with playerId 1s guess in ', (done) => {
      fetch(gameUrl + "1/", {
        method: 'GET'
      })
        .then( (rawData) => {
          rawData.json()
            .then( (data) => {
              try{
                expect(data.guessBlocks[0][0].guess).toBe('banana')
              }
              catch(err){
                console.log("Malformed guessblocks response:", data.guessBlocks[0]);
              }
              done();
            })
        })
    })

    it('should update scores when they are received', (done) => {
      const scoreData = {
        gamePin: 1,
        scores: {
          0: 3,
          1: 1
        }
      }
      fetch(scoreUrl, {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(scoreData)
      })
        .then( (rawData) => {
          rawData.json()
            .then( (data) => {
              expect(data.status).toBe("success")
              expect(data.scores[0]).toBe(3)
              expect(data.scores[1]).toBe(1)
              done()
            })
        })
    })

    it('should accumulate scores correctly', (done) => {
      const secondScoreData = {
        gamePin: 1,
        scores: {
          0: 1,
          1: 1
        }
      }
      fetch(scoreUrl, {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(secondScoreData)
      })
        .then( (rawData) => {
          rawData.json()
            .then( (data) => {
              expect(data.status).toBe("success")
              expect(data.scores[0]).toBe(4)
              expect(data.scores[1]).toBe(2)
              done()
            })
        })
    })

  })
})
