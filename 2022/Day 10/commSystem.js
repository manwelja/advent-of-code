const { Console } = require('console');
const { readLine } = require('fs');

const fs = require('fs')

//const path = './test_input.txt'
const path = './input.txt'

//Globals
const commSystem = {
};

function syncReadFile(filename) {
    var text = fs.readFileSync(filename, "utf-8");
    return text.split("\n").map(x => x.split(" "));
}

function signalStrength(index) {
  return index * commSystem[index];
}

try {
  if (fs.existsSync(path)) {
    const directions = syncReadFile(path);
    console.log(directions)
    let currentCycle = 1;
    let register = 1;

    //initialize object
    for(i = 1; i < directions.length+1; i++){
      commSystem[i] = 0;
    } 
    commSystem[1] = 1;

    directions.forEach((step, i) => {
      switch(step[0].toLowerCase()) {
        case "noop":
          commSystem[currentCycle] = register;
          currentCycle++;
          break;
        case "addx":
          commSystem[currentCycle] = register;
          currentCycle++;
          commSystem[currentCycle] = register;
          currentCycle++;
          register += parseInt(step[1]);
          //currentCycle++;
          break;
        default:
          console.log("Error, Error, Uh Oh!: ", step[0].toUpperCase())
      }

    })
  }
  console.log(commSystem)
  console.log(signalStrength(20) + signalStrength(60) + signalStrength(100) + signalStrength(140) + signalStrength(180) + signalStrength(220))
} catch(err) {
  console.error(err);
}



