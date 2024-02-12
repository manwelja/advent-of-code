const { Console } = require('console');
const { readLine } = require('fs');

const fs = require('fs');

const fpath = './test_input.txt'
//const fpath = './input.txt'

const rocks = [
    {
        shape: [[1,1,1,1]],
        height: 1,
        width: 4
    },
    {
        shape: [['.',1,'.'],[1,1,1],['.',1,'.']],
        height: 3,
        width: 3
    },
    {
        shape: [['.','.',1],['.','.',1],[1,1,1]],
        height: 3,
        width: 3
    },
    {
        shape: [[1],[1],[1],[1]],
        height: 4,
        width: 1
    },
    {
        shape: [[1,1],[1,1]],
        height: 2,
        width: 2
    },
]
const GRID_WIDTH = 7;
const OFFSET = 2;
//const TOWER_HEIGHT = 3068;
const TUNNEL_WIDTH = 7;
const TOWER_FLOOR = 3;
const NUMBER_OF_ROCKS = 5;
let rockTower  = [];

let currentRock = {
    coordinates: [],
}

function syncReadFile(filename) {
    const text = fs.readFileSync(filename, "utf-8");
    return text.split("")
}

function dropARock(rock) {
    const tunnel = [];//Array(TUNNEL_WIDTH).fill("");
    //get max width of rock
    const max = Math.max(...rock.shape);
    const rowStart = Array(2).fill(".");
    const rowEnd = Array(TUNNEL_WIDTH - rock.width - rowStart.length).fill(".")

    rock.shape.forEach(row => {
        tunnel.push(rowStart.concat(row.concat(rowEnd)));
    })
    return tunnel;
}

function canMoveRight(tunnelTower) {
    return tunnelTower.filter(x => x[x.length - 1] != ".").length > 0 ? false : true;
}

function canMoveLeft(tunnelTower) {
    return tunnelTower.filter(x => x[0] != ".").length > 0 ? false : true;
}

function canWedgeIt(rockTower, tunnelTower) {
  let wedgeIt = true;
    for(i = 0; i < TUNNEL_WIDTH; i++) {
        if(tunnelTower[0][i] != "." && rockTower[rockTower.length-1][i] != ".") {
          //  console.log(tunnelTower[0][i], rockTower[rockTower.length-1][i])
            wedgeIt = false;
        }
    }
    return wedgeIt;
}

function howFarToDrop(rockTower, tunnelTower) {
    let dropIndex = 0;
 //   console.log("rockTower width", rockTower.length)
 //console.log(tunnelTower.length)
    for(j = 0; j < tunnelTower.length; j++ )
    {
        for(i = 0; i < TUNNEL_WIDTH; i++) {
          //  console.log(j,i)
            if(tunnelTower[j][i] != "." && rockTower[rockTower.length-(j+1)][i] != ".") {
             //   console.log(tunnelTower[j])
                return dropIndex;
            }
        }
        dropIndex++;
    }
      return dropIndex;
  }

//merge moveLeft and moveRight
function moveRight(tunnelTower){
  
    //Move the rock right, so long as it doesn't place it outside of the tunnel
    if(canMoveRight(tunnelTower)){
        return tunnelTower.map(row => {
            row.pop();
            row.unshift(".");
            return row;
        })
    }
    return tunnelTower;
}
function moveLeft(tunnelTower){
    if(canMoveLeft(tunnelTower)){
        //Move the rock right, so long as it doesn't place it outside of the tunnel
        return tunnelTower.map(row => {
            row.shift();
            row.push(".");
            return row;
        })
    }
    return tunnelTower
}

function processFirstThreeMoves(currentRockSegment, mutateJetStream) {
    let tunnelTower = currentRockSegment;
    for(let i = 0; i <= 3; i++) {
        const currStream = mutateJetStream.shift();
        switch(currStream){
            case ">":
                if(canMoveRight(tunnelTower)){
                    tunnelTower = tunnelTower.map(row => {
                        row.pop();
                        row.unshift(".");
                        return row;
                    })
                }
            break;
            case "<":
                if(canMoveLeft(tunnelTower)){
                    tunnelTower = tunnelTower.map(row => {
                        row.shift();
                        row.push(".");
                        return row;
                    })
                }
            break;
        }
    }
    return tunnelTower;
}

function canWedgeItIn(currentRock, layers) {
    // console.log("can we")
    // // currentRock.forEach(row => {
    // //     const formatRow = row.join("");
    // //     process.stdout.write(`${formatRow}\n`);
    // // })    
    // console.log("current rock", layers)
    // currentRock.forEach(row => {
    //     const formatRow = row.join("");
    //     process.stdout.write(`${formatRow}\n`);
    // })
    // console.log("rockTower", layers)
    // rockTower.forEach(row => {
    //     const formatRow = row.join("");
    //     process.stdout.write(`${formatRow}\n`);
    // })
  
    //       let query = require('cli-interact').getYesNo;
    //     query('step');
    let rowOffset = currentRock.length - 1;
    for(j = rockTower.length - layers; j < rockTower.length; j++ )
     {
         for(i = 0; i < TUNNEL_WIDTH; i++) {
             if(currentRock[rowOffset][i] != '.') {
               if(rockTower[j][i] != '.') {
                  return false;
               }
             }
        }
        rowOffset ++;
        if(rowOffset >= currentRock.length){
            return true;
        }
     }
       return true;
   }

function moveIt(currentRockSegment, mutateJetStream) {
    const currStream = mutateJetStream.shift();
    const ret = currentRockSegment.map(x => x);
    switch(currStream){
        case ">":
            if(canMoveRight(currentRockSegment)){
                return ret.map(row => {
                    row.pop();
                    row.unshift(".");
                    return row;
                })
            }

        break;
        case "<":
            if(canMoveLeft(currentRockSegment)){
                return ret.map(row => {
                    row.shift();
                    row.push(".");
                    return row;
                })

            }
        break;
    }
    return ret;
}


function mergeRocks(currentRock, layers) {
    console.log("we are", layers)
    layers -= 1;
    //add extra space to top of rockTower, if required
    if(currentRock.length - layers > 0){
        const emptySpace = Array(currentRock.length - layers).fill(".").map(y => Array(TUNNEL_WIDTH).fill("."));
        layers = currentRock.length - layers;
        rockTower.push(...emptySpace);
    }
    console.log("current rock", layers)
    currentRock.forEach(row => {
        const formatRow = row.join("");
        process.stdout.write(`${formatRow}\n`);
    })
    console.log("rockTower", layers)
    rockTower.forEach(row => {
        const formatRow = row.join("");
        process.stdout.write(`${formatRow}\n`);
    })
       let query = require('cli-interact').getYesNo;
        query('step');
    let rowOffset = currentRock.length - 1;
    for(j = rockTower.length - layers; j < rockTower.length; j++ )
     {
         for(i = 0; i < TUNNEL_WIDTH; i++) {
            if(currentRock[rowOffset][i] != '.') {
                rockTower[j][i] = currentRock[rowOffset][i]
            }
        }
        rowOffset ++;
        console.log("**************************")
        console.log("rockTower", layers)
        rockTower.forEach(row => {
            const formatRow = row.join("");
            process.stdout.write(`${formatRow}\n`);
        })
        if(rowOffset === currentRock.length ) return
     }
}

function letsTetris(currentRockSegment, mutateJetStream) {
   let settled = false;
   let nextLayer = [];
   let layers = 1;
   let newRockSegment = [];
   let tempRockSegment = [];
   newRockSegment.push(...currentRockSegment.slice());
   tempRockSegment.push(...currentRockSegment.slice());

   while(!settled){
        if(layers > rockTower.length){
            break;
        }
        // nextLayer = rockTower[rockTower.length - layers];
       //get the potential next position of the rock
        if(canWedgeItIn(newRockSegment, layers)) {
            //do some stuff to move the current rock segment - check left/right against rockTower
            //test this
            tempRockSegment = newRockSegment.map(x => x);
            console.log("can wedge")
            tempRockSegment.forEach(row => {
                const formatRow = row.join("");
                process.stdout.write(`${formatRow}\n`);
            })
        }else {
           // console.log("we can't", layers)
            settled = true;
            //merge rocks
            if(layers > 1){
                console.log("merging")
                tempRockSegment.forEach(row => {
                    const formatRow = row.join("");
                    process.stdout.write(`${formatRow}\n`);
                })
                mergeRocks(tempRockSegment, layers)
                console.log("-----------------------------------")
            } else{
                //if we don't need to wedge it
                rockTower.push(...currentRockSegment)
            }    

        }

        //weird array mutation going on...  need to destructoure
        console.log("befre move it")
        tempRockSegment.forEach(row => {
            const formatRow = row.join("");
            process.stdout.write(`${formatRow}\n`);
        })
        const temp= [];
        temp.push(...newRockSegment.slice())
        newRockSegment.length = 0;
        newRockSegment.push(moveIt(tempRockSegment, mutateJetStream));
        
        console.log("after move it")
        temp.forEach(row => {
            const formatRow = row.join("");
            process.stdout.write(`${formatRow}\n`);
        })
        layers++;
   }
}
// function askQuestion(query) {
//     const rl = readline.createInterface({
//         input: process.stdin,
//         output: process.stdout,
//     });

//     return new Promise(resolve => rl.question(query, ans => {
//         rl.close();
//         resolve(ans);
//     }))
// }

async function breakPoint() {
    await process.stdin.read();
    return;
}
const jetStream = syncReadFile(fpath);
const mutateJetStream = [...jetStream]
const emptySpace = Array(TOWER_FLOOR).fill(".").map(y => Array(TUNNEL_WIDTH).fill("."));
const currentRockSegment = [];

let tempRockTower = [];
let startingPosition = [];
let numRocks = 0;
while(numRocks < NUMBER_OF_ROCKS)
{
    for(const rock of rocks){
        mutateJetStream.push(...jetStream);
        numRocks ++;
        if (numRocks >= 2022) break;
        // let query = require('cli-interact').getYesNo;
        // query('step');
        // Add 3 empty rows
        //tunnel.push(...emptySpace)
        // drop a rock into the tunnel
        currentRockSegment.push(...dropARock(rock));
        startingPosition = processFirstThreeMoves(currentRockSegment, mutateJetStream)
            //   let query = require('cli-interact').getYesNo;
            // query('step');
        if(rockTower.length === 0) {
            rockTower.push(...startingPosition);
        }else {
            //this is where it gets tedious
            letsTetris(startingPosition, mutateJetStream)
        }
        // rockTower = letsPlinko(rockTower, tunnel, mutateJetStream, rock);
        //  console.log("ROCK TOWER");

        //clear out the current rock info
        startingPosition.length = 0;
        currentRockSegment.length = 0;

    }
}
console.log(rockTower.length)
// console.log("final")
// rockTower.reverse().forEach(row => {
//     const formatRow = row.join("");
//     process.stdout.write(`${formatRow}\n`);
// })



