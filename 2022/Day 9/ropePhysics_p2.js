const { Console } = require('console');
const { readLine } = require('fs');

const fs = require('fs')

//const path = './test_input.txt'
const path = './input.txt'

const knotsRow = {
  0: 0,
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 0,
  7: 0,
  8: 0,
  9: 0,
};
const knotsCol ={
  0: 0,
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 0,
  7: 0,
  8: 0,
  9: 0
};

const tailCoordinates = [];

function syncReadFile(filename) {
    var text = fs.readFileSync(filename, "utf-8");
    return text.split("\n").map(x => x.split(" "));
}

function processMove(currHead, currTail) {

  if(knotsRow[currHead] === knotsRow[currTail]) {
    if(knotsCol[currHead] - knotsCol[currTail] === 2) {
      knotsCol[currTail]++;
    }else if (knotsCol[currTail] - knotsCol[currHead] === 2) {
      knotsCol[currTail] --;
    }
  }else if (knotsCol[currHead] === knotsCol[currTail]) {
    if(knotsRow[currHead] - knotsRow[currTail] === 2) {
      knotsRow[currTail]++;
    }else if (knotsRow[currTail] - knotsRow[currHead] === 2) {
      knotsRow[currTail] --;
    }
  }else {
    //diagonal
    if(knotsCol[currTail] - knotsCol[currHead] === 2) {
      knotsRow[currTail] = knotsRow[currHead];
      knotsCol[currTail]--;
    }
    else if(knotsCol[currHead] - knotsCol[currTail] === 2){
      knotsRow[currTail] = knotsRow[currHead];
      knotsCol[currTail]++;
    }
    else if(knotsRow[currTail] - knotsRow[currHead] === 2) {
      knotsCol[currTail] = knotsCol[currHead];
      knotsRow[currTail]--;
    }
    else if(knotsRow[currHead] - knotsRow[currTail] === 2){
      knotsCol[currTail] = knotsCol[currHead];
      knotsRow[currTail]++;
    }
  }
  currTail === 9? tailCoordinates.push(knotsRow[currTail] +"-"+ knotsCol[currTail]): '';
 
}

try {
  if (fs.existsSync(path)) {
    const directions = syncReadFile(path);
    //console.log(directions)

    directions.forEach(step => {
   //   console.log(knotsRow[0] + " - " + knotsCol[0])
   //   console.log("step: " , step)
     

        switch(step[0].toUpperCase()) {
          case "R":
            for(let i = 0; i < parseInt(step[1]); i++) {
                knotsCol[0]++;
                for(j = 0; j < 9; j++) {
                  processMove(j, j+1);
                }
            }
            break;
          case "L":
            for(let i = 0; i < parseInt(step[1]); i++) {
              knotsCol[0]--;
              for(j = 0; j < 9; j++) {
                processMove(j, j+1);
             }
            }

            break;
          case 'U':
            for(let i = 0; i < parseInt(step[1]); i++) {
              knotsRow[0]++;
              for(j = 0; j < 9; j++) {
                processMove(j, j+1);
             }
            }
            break;
          case 'D':
            for(let i = 0; i < parseInt(step[1]); i++) {
              knotsRow[0]--;
              for(j = 0; j < 9; j++) {
                processMove(j, j+1);
             }
            }
            break;
          default:
            console.log("Error Christopher Robin!: ", step[0].toUpperCase)
            break;
        }
        
    })
  }
  let unique = tailCoordinates.filter((item, i, ar) => ar.indexOf(item) === i);
  console.log("Moves: ", unique);
  console.log("Unique stops: ", unique.length);

} catch(err) {
  console.error(err);
}



