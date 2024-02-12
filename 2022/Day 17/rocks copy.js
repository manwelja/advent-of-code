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
        shape: [['.',1,','],[1,1,1],['.',1,'.']],
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
const TOWER_WIDTH = 7;
const TOWER_FLOOR = 3;


function syncReadFile(filename) {
    const text = fs.readFileSync(filename, "utf-8");
    return text.split("")
}

function dropARock(rock) {
    const tunnel = [];//Array(TOWER_WIDTH).fill("");
    //get max width of rock
    const max = Math.max(...rock.shape);
    const rowStart = Array(2).fill(".");
    const rowEnd = Array(TOWER_WIDTH - rock.width - rowStart.length).fill(".")

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
    for(i = 0; i < TOWER_WIDTH; i++) {
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
        for(i = 0; i < TOWER_WIDTH; i++) {
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

  function wedgeItIn(rockTower, tunnelTower, dropIndex) {
   // console.log("wedging", tunnelTower.length)
    let rowOffset = 0;
    //may need to start at end...
    for(j = tunnelTower.length - 1; j >= 0; j-- )
    {
        for(i = 0; i < TOWER_WIDTH; i++) {
            if(tunnelTower[j][i] != '.') {
              //  console.log("index", rockTower.length -(dropIndex) + rowOffset, tunnelTower.length)
                if(rockTower.length -(dropIndex) + rowOffset >= rockTower.length){
                    rockTower.push(tunnelTower[j]);
                    i = TOWER_WIDTH;
                } else{
                    rockTower[rockTower.length-(dropIndex) + rowOffset][i] = tunnelTower[j][i];;
                }
            }
        }
        rowOffset ++;
    }
      return rockTower;
  }

function letsPlinko(rockTower, tunnelTower, mutateJetStream) {
    let rockBottom = false;
    let newTunnelTower = []
    let dropIndex = 0;
    do {
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
    
        //if we're not at the bottom yet, drop down one level
        if(tunnelTower[0].filter(x => x != ".").length === 0) {
            tunnelTower.shift()
        }else {
            //gotta see if we can wedge it in
            rockBottom = true;
            if(rockTower.length > 0) {
                dropIndex = howFarToDrop(rockTower,tunnelTower);
                for(let i = 0; i < dropIndex; i++){
                    mutateJetStream.shift();
                }
                //console.log("dropIndex", dropIndex)
                if(dropIndex > 0) {
                    //before
                    //console.log("b4")
                    // rockTower.forEach(row => {
                    //     const formatRow = row.join("");
                    //     process.stdout.write(`${formatRow}\n`);
                    // })
                    rockTower = wedgeItIn(rockTower,tunnelTower, dropIndex);
                    //after
                 //   console.log("after")
                    // rockTower.forEach(row => {
                    //     const formatRow = row.join("");
                    //     process.stdout.write(`${formatRow}\n`);
                    // })
                }else {
                    rockTower.push(...tunnelTower);
                }
            }else {
               rockTower.push(...tunnelTower);
            }

        }

    }while(!rockBottom)

    //will need to change this to take into account wedged rocks
   // rockTower.push(tunnelTower)
    return rockTower;

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
const emptySpace = Array(TOWER_FLOOR).fill(".").map(y => Array(TOWER_WIDTH).fill("."));
const tunnel = [];
let rockTower  = [];
let tempRockTower = [];
let numRocks = 0;
while(numRocks < 2022)
{
    for(const rock of rocks){
        mutateJetStream.push(...jetStream);
        numRocks ++;
        console.log(numRocks)
        if (numRocks >= 2022) break;
        // let query = require('cli-interact').getYesNo;
        // query('step');
        // Add 3 empty rows
        tunnel.push(...emptySpace)
        // drop a rock into the tunnel
        tunnel.push(...dropARock(rock));
        rockTower = letsPlinko(rockTower, tunnel, mutateJetStream);
        tunnel.length = 0;
    }
}
console.log(rockTower.length)
// rockTower.forEach(row => {
//     const formatRow = row.join("");
//     process.stdout.write(`${formatRow}\n`);
// })



