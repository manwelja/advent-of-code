const { Console } = require('console');
const { readLine } = require('fs');

const fs = require('fs');

const fpath = './test_input.txt'
//const fpath = './input.txt'

const rocks = [
    {
        shape: [['@','@','@','@']],
        height: 1,
        width: 4
    },
    {
        shape: [['.','@','.'],['@','@','@'],['.','@','.']],
        height: 3,
        width: 3
    },
    {
        shape: [['.','.','@'],['.','.','@'],['@','@','@']],
        height: 3,
        width: 3
    },
    {
        shape: [['@'],['@'],['@'],['@']],
        height: 4,
        width: 1
    },
    {
        shape: [['@','@'],['@','@']],
        height: 2,
        width: 2
    },
]
const GRID_WIDTH = 7;
const OFFSET = 2;
//const TOWER_HEIGHT = 3068;
const TUNNEL_WIDTH = 7;
const TOWER_FLOOR = 3;
const NUMBER_OF_ROCKS = 2022;
let rockTower  = [];
const jetStream = syncReadFile(fpath);
const mutateJetStream = [...jetStream]


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
    //console.log("CAN MOVE LEFT")
        tunnelTower.forEach(row => {
        const formatRow = row.join("");
        process.stdout.write(`${formatRow}\n`);
    })
    return tunnelTower.filter(x => x[0] != ".").length > 0 ? false : true;
}


function processFirstThreeMoves(currentRockSegment) {
    let tunnelTower = [...currentRockSegment];
    let tempTower = [];
    for(let i = 0; i < 4; i++) {
        const currStream = mutateJetStream.shift();
        if(currStream !== "<" && currStream != ">"){
            let query = require('cli-interact').getYesNo;
            query('step');
            console.log("uh oh")
        }
        switch(currStream){
            case ">":
               // console.log("move right")
                if(canMoveRight(tunnelTower)){
                    tempTower = tunnelTower.map(r => {
                        const row = [...r];
                        row.pop();
                        row.unshift(".");
                        return row;
                    })
                } else{
                    tempTower = tunnelTower.map(x => x)
                }
            break;
            case "<":
            //    console.log("move left")
                if(canMoveLeft(tunnelTower)){
                    tempTower = tunnelTower.map(r => {
                        const row = [...r];
                        row.shift();
                        row.push(".");
                        return row;
                    })
                } else {
                    tempTower = tunnelTower.map(x => x)
                }
            break;
        }
        //if(rockTower.length > 1 && i === 1) break;
        tunnelTower.length = 0;
        tunnelTower = tempTower.map(x => x);
        tempTower.length = 0;
    }
   // console.log(tunnelTower.length)
    return tunnelTower;
}

function canWedgeItIn(currentRock, layers) {
    console.log("_____________________")
    console.log("can wedge it", layers)
    currentRock.forEach(row => {
        const formatRow = row.join("");
        process.stdout.write(`${formatRow}\n`);
    })
console.log("_____________________")
rockTower.reverse().forEach(row => {
    const formatRow = row.join("");
    process.stdout.write(`${formatRow}\n`);
})
rockTower.reverse()
       let query = require('cli-interact').getYesNo;
        query('step');
if(layers > 1) layers --;
// console.log("current length", currentRock.length, layers)
    let rowOffset = currentRock.length - 1;
    for(j = rockTower.length - layers; j < rockTower.length; j++ )
     {
         for(i = 0; i < TUNNEL_WIDTH; i++) {
            console.log(rockTower[j],rowOffset, i)
             if(currentRock[rowOffset][i] != '.') {
               if(rockTower[j][i] != '.') {
             //   console.log("false")
                  return false;
               }
             }
        }
        rowOffset --;
        if(rowOffset > currentRock.length || rowOffset < 0){
            console.log("safe guard")
            return true;
        }
     }
       return true;
   }

function moveIt(currentRockSegment) {
    const currStream = mutateJetStream.shift();
    // let query = require('cli-interact').getYesNo;
    // query('step');
    const ret = currentRockSegment.map(x => x);
    switch(currStream){
        case ">":
            if(canMoveRight(currentRockSegment)){
                return ret.map(r => {
                    const row = [...r];
                    row.pop();
                    row.unshift(".");
                    return row;
                })
            }

        break;
        case "<":
            if(canMoveLeft(currentRockSegment)){
                return ret.map(r => {
                    const row = [...r];
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

    layers--;
    //add extra space to top of rockTower, if required
    if(currentRock.length - layers >= 0){
        const emptySpace = Array(currentRock.length - layers).fill(".").map(y => Array(TUNNEL_WIDTH).fill("."));
        layers = (currentRock.length - layers) + layers;
        rockTower.push(...emptySpace);
    }
    let rowOffset = currentRock.length - 1;//2
    for(j = rockTower.length - layers; j < rockTower.length; j++ )
     {
         for(i = 0; i < TUNNEL_WIDTH; i++) {
            if(currentRock[rowOffset][i] != '.') {
                rockTower[j][i] = '#';
            }
        }
        rowOffset --;
        if(rowOffset < 0 ) return
     }
}

function letsTetris(currentRockSegment) {
   let settled = false;
   let nextLayer = [];
   let layers = 1;
   let newRockSegment = [];
   newRockSegment = [...currentRockSegment];
  
   while(!settled){
        if(layers > rockTower.length){
            break;
        }

        if(canWedgeItIn(newRockSegment, layers)) {
            currentRockSegment = newRockSegment.map(x => x);

            newRockSegment.length = 0;
    //         console.log("move it again")
    //             console.log("after space added")
    // currentRockSegment.forEach(row => {
    //     const formatRow = row.join("");
    //     process.stdout.write(`${formatRow}\n`);
    // })
            //get preview
            newRockSegment = moveIt(currentRockSegment);
         //   console.log("wedge it")
            layers++;
        }else {
        //    console.log("can't wedge it", layers)
            settled = true;
            //merge rocks
            
            if(layers > 1){
                mergeRocks(currentRockSegment, layers)
            } else{
                rockTower.push(...currentRockSegment.map(x => x.map(y => y === '@'? '#' : '.')))
            }

        }
        //  if(!settled) {
    //         newRockSegment.length = 0;
    //         console.log("move it again")
    //         newRockSegment = moveIt(currentRockSegment);
    //         // currentRockSegment = newRockSegment.map(x => x);
    // newRockSegment.forEach(row => {
    //     const formatRow = row.join("");
    //     process.stdout.write(`${formatRow}\n`);
    // })


        //     layers++;
        // }
   }
}

const emptySpace = Array(TOWER_FLOOR).fill(".").map(y => Array(TUNNEL_WIDTH).fill("."));
const currentRockSegment = [];

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
        startingPosition = processFirstThreeMoves(currentRockSegment)
        // console.log("final")
        // console.log("final")
// startingPosition.forEach(row => {
//     const formatRow = row.join("");
//     process.stdout.write(`${formatRow}\n`);
// })

        // let query = require('cli-interact').getYesNo;
        // query('step');
        if(rockTower.length === 0) {
            rockTower.push(...startingPosition.map(x => x.map(y => y === '@'? '#' : '.')))
        }else {
          //  console.log("start tetris")
            //this is where it gets tedious
            letsTetris(startingPosition)
        }
        // console.log("_______________________________")
        // rockTower.reverse().forEach(row => {
        //     const formatRow = row.join("");
        //     process.stdout.write(`${formatRow}\n`);
        // })
        // rockTower.reverse()
        // console.log("_______________________________")
        // rockTower = letsPlinko(rockTower, tunnel, mutateJetStream, rock);
        //  console.log("ROCK TOWER");

        //clear out the current rock info
        startingPosition.length = 0;
        currentRockSegment.length = 0;

    }
}


rockTower.reverse().forEach(row => {
    const formatRow = row.join("");
    process.stdout.write(`${formatRow}\n`);
})
console.log("final", numRocks)
console.log(rockTower.length)



