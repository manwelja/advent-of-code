const { Console } = require('console');
const { readLine } = require('fs');

const fs = require('fs');

//const path = './test_input1.txt'
const path = './input.txt'

const sprite = {
  start: -1,
  mid: 0,
  end: 1
}

const crtPointer = {
  posX: 0,
  posY: 0,
}

//initialize crt
let crt = Array(6).fill(".").map(y => Array(40).fill("."));

function syncReadFile(filename) {
    var text = fs.readFileSync(filename, "utf-8");
    return text.split("\n").map(x => x.split(" "));
}

function moveSprite(register) {
  sprite.start = register - 1;
  sprite.mid = register ;
  sprite.end = register + 1;
}

function movePointer(currentCycle) {
  crtPointer.posX = Math.floor(currentCycle / 40);
  crtPointer.posY = (currentCycle % 40) - 1;
}

function draw() {
  if(sprite.start === crtPointer.posY || sprite.mid === crtPointer.posY || sprite.end === crtPointer.posY) {
    crt[crtPointer.posX][crtPointer.posY] = "#"
  }
}

try {
  if (fs.existsSync(path)) {
    const directions = syncReadFile(path);
    let currentCycle = 1;
    let register = 1;

    draw();
    directions.forEach((step) => {
      switch(step[0].toLowerCase()) {
        case "noop":
          currentCycle++;
          movePointer(currentCycle);
          draw();
          break;
        case "addx":
          currentCycle++;
          movePointer(currentCycle);
          draw();
          currentCycle++;
          movePointer(currentCycle);
          register += parseInt(step[1]);
          moveSprite(register);
          draw()
          break;
        default:
          console.log("Error, Error, Uh Oh!: ", step[0].toUpperCase())
      }
    })
  }
  console.log(crt)
} catch(err) {
  console.error(err);
}



