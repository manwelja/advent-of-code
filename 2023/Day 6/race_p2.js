const fs = require('fs');

const path = './input.txt';

const raceList = [];

class Race {
    constructor(time, distance, wins = 0) {
      this.time = time;
      this.distance = distance;
      this.possibleWins = wins;
    };

    addWin() {
        this.possibleWins += 1;
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
      let time = parseInt(fileArray[0].substring(fileArray[0].indexOf(':') + 1).replace(/\s+/g, ''));
      let distance = parseInt(fileArray[1].substring(fileArray[1].indexOf(':') + 1).replace(/\s+/g, ''));
      raceList.push(new Race(time, distance, 0));

      raceList.forEach((race) => {
        startHold = Math.floor(race.distance / (race.time - 2));
        for (let holdTime = startHold; holdTime <= race.time; holdTime++) {
          finalDistance = (race.time - holdTime) * holdTime;
          if(finalDistance > race.distance) {
              race.addWin();
          }
        }
      })
      console.log(raceList[0]);
      console.log(raceList.reduce((prod, race) => prod * race.possibleWins, 1))
    }
  } catch(err) {
    console.error(err);
}