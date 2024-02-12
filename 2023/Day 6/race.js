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
      let times = fileArray[0].substring(fileArray[0].indexOf(':') + 1).replace(/\s+/g, ' ').trim().split(' ');
      let distances = fileArray[1].substring(fileArray[1].indexOf(':') + 1).replace(/\s+/g, ' ').trim().split(' ');
      for(let i = 0; i < times.length; i++) {
        raceList.push(new Race(times[i], distances[i], 0));
      }
      raceList.forEach((race) => {
        for (let holdTime = 0; holdTime <= race.time; holdTime++) {
            finalDistance = (race.time - holdTime) * holdTime;
            if(finalDistance > race.distance) {
                race.addWin();
            }

        }

      })
      console.log(raceList.reduce((prod, race) => prod * race.possibleWins, 1))
  }
  } catch(err) {
    console.error(err);
}