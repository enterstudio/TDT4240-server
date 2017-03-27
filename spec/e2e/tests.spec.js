const fetch = require('node-fetch');

describe("End to end tests", () => {

  const baseUrl = "http://localhost:8000/";
  const game = baseUrl + "game/";

  it('Should create a game', (done) => {

    fetch(game, () => {

    })
    .then( (rawData) => {
      rawData.json()
        .then( (data) => {
          console.log(data);
          done();
        });
    })

  });

});
