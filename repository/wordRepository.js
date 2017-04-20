var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('repository/sqlite3/dbfile.db');

const GET_ALL_WORDS = "select value from words;";

class WordRepository {

  static getAllWords(){

    return new Promise( (resolve, reject) => {
      try{
        const something = db.all(GET_ALL_WORDS, function (err, rows) {
          resolve(rows);
        });
      }
      catch(err){
        reject(err);
      }
    });

  }

}

module.exports = WordRepository;
