const { readLine } = require('fs');

const fs = require('fs')

const path = './input.txt'

class Game {
    constructor(game, red, green, blue) {
      this.gameNumber = game;
      this.red = red;
      this.green = green;
      this.blue = blue;
    };

    getGameNumber() {
        return this.gameNumber;
    }

    getRed() {
        return this.red;
    }

    getGreen() {
        return this.green;
    }

    getBlue(max) {
        return this.blue;
    }

    setRedToMax(max) {
        this.red = max;
    }

    setGreenToMax(max) {
        this.green = max;
    }

    setBlueToMax(max) {
        this.blue = max;
    }
  }

function syncReadFile(filename) {
    let text = fs.readFileSync(filename, "utf-8");
    let textByLine = text.split("\n");
    return textByLine;
}

try {
    if (fs.existsSync(path)) {
      let fileArray = syncReadFile(path);
      let games = [];
      fileArray.forEach((element) => {
        let gameNum = element.substring(5, element.indexOf(':'));
        let gameResults = element.substring(element.indexOf(':') + 1).split(';');
        let game = new Game(gameNum, 0, 0, 0);
        gameResults.forEach((gameSet) => {
           gameSet.split(',').forEach((cube) => {
            numRed = numBlue = numGreen = 0;
                if(cube.indexOf('red') >= 0) {
                    numRed = parseInt(cube.slice(0, cube.indexOf('red')).trim());
                    game.setRedToMax(game.getRed() < numRed ? numRed : game.getRed());
                }
                if(cube.indexOf('blue') >= 0) {
                    numBlue = parseInt(cube.slice(0, cube.indexOf('blue')).trim());
                    game.setBlueToMax(game.getBlue() < numBlue ? numBlue : game.getBlue());
                }
                if(cube.indexOf('green') >= 0) {
                    numGreen = parseInt(cube.slice(0, cube.indexOf('green')).trim());
                    game.setGreenToMax(game.getGreen() < numGreen ? numGreen : game.getGreen());
                }
           });

        })
        games.push(game);
    })
    //12 red cubes, 13 green cubes, and 14 blue cubes
    const result = games.filter((game) => game.getRed() <= 12 && game.getGreen() <= 13 && game.getBlue() <= 14).reduce((acc, curr) => acc + parseInt(curr.getGameNumber()), 0);
    console.log(result)
  }
  } catch(err) {
    console.error(err);
}
  

// let regExRed = new RegExp('[0-9]* (\bred\b)', 'i');
// let regExBlue = new RegExp('[0-9]* (\bblue\b)', 'i');
// let regExGreen = new RegExp('[0-9]* (\bblue\b)', 'i');