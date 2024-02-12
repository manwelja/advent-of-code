const { Console } = require('console');
const { readLine } = require('fs');

const fs = require('fs')

//const path = './test_input.txt'
const path = './input.txt'

//Globals
let headRow = 0;
let headCol = 0;
let tailRow = 0;
let tailCol = 0;
const tailCoordinates = [];

function syncReadFile(filename) {
    var text = fs.readFileSync(filename, "utf-8");
    return text.split("\n").map(x => x.split(" "));
}


function processMove() {
  if(headRow === tailRow) {
    if(headCol - tailCol === 2) {
      tailCol++;
    }else if (tailCol - headCol === 2) {
      tailCol --;
    }
  }else if (headCol === tailCol) {
    if(headRow - tailRow === 2) {
      tailRow++;
    }else if (tailRow - headRow === 2) {
      tailRow --;
    }
  }else {
    if(tailCol - headCol === 2) {
      tailRow = headRow;
      tailCol--;
    }else if(headCol - tailCol === 2){
      tailRow = headRow;
      tailCol++;
    }else if(tailRow - headRow === 2) {
      tailCol = headCol;
      tailRow--;
    }else if(headRow - tailRow === 2){
      tailCol = headCol;
      tailRow++;
    }
  }
  tailCoordinates.push(tailRow + "-" + tailCol)

}

try {
  if (fs.existsSync(path)) {
    const directions = syncReadFile(path);
    console.log(directions)

    directions.forEach(step => {
      switch(step[0].toUpperCase()) {
        case "R":
          for(let i = 1; i <= parseInt(step[1]); i++) {
            headCol++;
            processMove();
          }
          break;
        case "L":
          for(let i = 1; i <= parseInt(step[1]); i++) {
            headCol--;
            processMove();
          }

          break;
        case 'U':
          for(let i = 1; i <= parseInt(step[1]); i++) {
            headRow++;
            processMove();
          }

          break;
        case 'D':
          for(let i = 1; i <= parseInt(step[1]); i++) {
            headRow--;
            processMove();
          }
          break;
        default:
          console.log("Error Christopher Robin!: ", step[0].toUpperCase())

      }

    })
  }
  let unique = tailCoordinates.filter((item, i, ar) => ar.indexOf(item) === i);
  console.log("Moves: ", tailCoordinates);
  console.log("Unique stops: ", unique.length);

} catch(err) {
  console.error(err);
}



