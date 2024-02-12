const { readLine } = require('fs');

const fs = require('fs')

const path = './input.txt'

class Game {
    constructor(game, red, green, blue) {
      this.gameNumber = game;
      this.red = red;
      this.green = green;
      this.blue = blue;
      this.power = 0;
    };

    get gameNumber() {
        return this._gameNumber;
    }

    get red() {
        return this._red;
    }

    get green() {
        return this._green;
    }

    get blue() {
        return this._blue;
    }

    get power() {
        return this._power;
    }

    set gameNumber(num) {
        this._gameNumber = num;
    }

    set red(num) {
        this._red = num;
    }

    set green(num) {
        this._green = num;
    }

    set blue(num) {
        this._blue = num;
    }

    set power(num) {
        this._power = num;
    }
    calculatePower() {
        this.power = this.red * this.blue * this.green;
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
                if(cube.indexOf('red') >= 0) {
                    game.red = Math.max(parseInt(cube.slice(0, cube.indexOf('red')).trim()), game.red);
                }
                else if(cube.indexOf('blue') >= 0) {
                    game.blue = Math.max(parseInt(cube.slice(0, cube.indexOf('blue')).trim()), game.blue);
                }
                else if(cube.indexOf('green') >= 0) {
                    game.green = Math.max(parseInt(cube.slice(0, cube.indexOf('green')).trim()), game.green);
                }
           });

        })
        game.calculatePower();
        games.push(game);
    })
    //12 red cubes, 13 green cubes, and 14 blue cubes
    const result = games.reduce((acc, curr) => acc + parseInt(curr.power), 0);
    console.log(result)
  }
  } catch(err) {
    console.error(err);
}