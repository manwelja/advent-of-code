const fs = require('fs');

const path = './input.txt';
const beamList = [];

function syncReadFile(filename) {
  let text = fs.readFileSync(filename, "utf-8");
  let textByLine = text.split("\n");
  return textByLine;
}

class Contraption {
    constructor(grid) {
      this.grid = grid;
      this.energized = [];
    };

    addEnergized(index) {
        let tmp = this.energized.slice();
        if (tmp.filter((item) =>  item[0] == index[0] && item[1] == index[1]).length == 0) {
            tmp.push(index);
            this.energized = tmp;
        }
    }
}

class Beam {
    constructor(id, startIndex, startDir) {
      this.id = id;
      this.index = startIndex;
      this.direction = startDir;
      this.moves = 0;
      this.active = true;
      this.visited = [];
    };
}

 const directions = {
    'R': [0, 1],
    'L': [0, -1],
    'U': [-1, 0],
    'D': [1, 0]
 };

try {
  if (fs.existsSync(path)) {

    let fileArray = syncReadFile(path);
    let tmpGrid = [];

    fileArray.forEach((element) => {
        let tmpLine = element.split('');
        tmpGrid.push([...tmpLine]);
    })

    const contraption = new Contraption(tmpGrid);
    let beamID = 1;
    beamList.push(new Beam(beamID, [0,0], 'R'));
    while(beamList.length > 0) {
        currBeam = beamList.shift();

        while(currBeam && currBeam.active) {
            let mirror = contraption.grid[currBeam.index[0]][currBeam.index[1]];
            switch(mirror) {
                case '|':
                    if (currBeam.direction == 'R' || currBeam.direction == 'L') {
                        currBeam.direction = 'U';
                        beamID++;
                        //only split the beam if this cell hasn't yet been processed
                        if (contraption.energized.filter((item) =>  item[0] == currBeam.index[0] && item[1] == currBeam.index[1]).length == 0) {
                            beamList.push(new Beam(beamID, currBeam.index, 'D'));
                        }
                    }
                    break;
                case '-':
                    if (currBeam.direction == 'U' || currBeam.direction == 'D') {
                        currBeam.direction = 'R';
                        beamID++;
                        //only split the beam if this cell hasn't yet been processed
                        if (contraption.energized.filter((item) =>  item[0] == currBeam.index[0] && item[1] == currBeam.index[1]).length == 0) {
                            beamList.push(new Beam(beamID, currBeam.index, 'L'));
                        }
                    }
                    break;
                case '/':
                    if (currBeam.direction == 'R') {
                        currBeam.direction = 'U';
                    } else if(currBeam.direction == 'L') {
                        currBeam.direction = 'D';
                    } else if(currBeam.direction == 'U') {
                        currBeam.direction = 'R';
                    } else if(currBeam.direction == 'D') {
                        currBeam.direction = 'L';
                    }
                    break;
                case '\\':
                    if (currBeam.direction == 'R') {
                        currBeam.direction = 'D';
                    } else if(currBeam.direction == 'L') {
                        currBeam.direction = 'U';
                    } else if(currBeam.direction == 'U') {
                        currBeam.direction = 'L';
                    } else if(currBeam.direction == 'D') {
                        currBeam.direction = 'R';
                    }
                    break;
                case '.':
                    break;
        }

        contraption.addEnergized(currBeam.index);

        let alreadyVisited = currBeam.visited.includes(currBeam.direction + '_' + currBeam.index[0] + '_' + currBeam.index[1]);
        if(!alreadyVisited) {
            currBeam.visited.push(currBeam.direction + '_' + currBeam.index[0] + '_' + currBeam.index[1]);
        }

        currBeam.index = [currBeam.index[0] + directions[currBeam.direction][0], currBeam.index[1] + directions[currBeam.direction][1]];
        if(currBeam.index[0] < 0 || currBeam.index[1] < 0 || currBeam.index[0] >= contraption.grid.length || currBeam.index[1] >= contraption.grid[currBeam.index[0]].length || alreadyVisited) {
            currBeam.active = false;
        }
        currBeam.moves = currBeam.moves + 1;
    }
   }
    console.log(contraption.energized.length)
}
} catch(err) {
  console.error(err);
}

//not 197 (too low)
//not 3183 (too low)
//not 6613 (too low)