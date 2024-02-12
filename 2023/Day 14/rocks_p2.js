const fs = require('fs');

const path = './input.txt';

function syncReadFile(filename) {
  let text = fs.readFileSync(filename, "utf-8");
  let textByLine = text.split("\n");
  return textByLine;
}

class Grid {
    constructor(grid) {
      this.grid = grid;
      this.modifiedGrid = [];
      this.load = 0;
    };

    setLoad() {
      let gridHeight = this.grid.length;
      let load = this.modifiedGrid.reduce((accum, curr, index) => {
        let numRounded = curr.split('').filter((element) => element == 'O').length;
        return accum + (numRounded * (gridHeight - index));
      }, 0)
      this.load = load;
    }
}


function transpose(grid) {
  let gridTransposed = [];
  for(let i = 0; i < grid[0].length; i++) {
    gridTransposed.push(grid.map((e) => e[i]).join(''));
  }
  return gridTransposed
}


function tilt(grid, direction) {
  let tmpGrid = [];
  let transposed = false;
  let look = '';
  let repl = '';
  switch (direction) {
    case 'N':
      tmpGrid = transpose(grid);
      look = '\.O';
      repl = 'O\.';
      transposed = true;
    break;
    case 'E':
      tmpGrid = grid;
      look = 'O\.';
      repl = '\.O';
      transposed = false;
    break;
    case 'W':
      tmpGrid = grid;
      look = '\.O';
      repl = 'O\.';
      transposed = false;
    break;
    case 'S':
      tmpGrid = transpose(grid);
      look = 'O\.';
      repl = '\.O';
      transposed = true;
    break;
  }

//change swap based on
  tmpGrid = tmpGrid.map((element) => {
    let newLine = element;
    while (newLine.indexOf(look) >= 0) {
      newLine = newLine.replaceAll(look, repl);
    }
    return newLine;
  })
  return transposed ? transpose(tmpGrid) : tmpGrid;
}

try {
  if (fs.existsSync(path)) {

    let fileArray = syncReadFile(path);
    let tmpArr = [];
    let pattern = null;

    fileArray.forEach((element, index) => {
        if(element.trim().length > 0) {
            tmpArr.push(element);
        }
        if(element.trim().length == 0 || index == fileArray.length - 1) {
            pattern = new Grid(tmpArr);
            tmpArr = [];
        }
    })
  let tmpGrid = pattern.grid;
  let count = 0;
  //pattern starts repeating after 121 cycles 
  //after that, each number repeats after 26 cycles
  while(count < (1000000000-121) % 26) {
    tmpGrid = tilt(tmpGrid, 'N');
    tmpGrid = tilt(tmpGrid, 'W');
    tmpGrid = tilt(tmpGrid, 'S');
    tmpGrid = tilt(tmpGrid, 'E');
    count++;
  }
  pattern.modifiedGrid = tmpGrid
  pattern.setLoad();
  console.log("Result: ", pattern.load);
}

} catch(err) {
  console.error(err);
}
