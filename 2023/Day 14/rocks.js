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
    let gridTransposed = transpose(pattern.grid);
    gridTransposed = gridTransposed.map((element) => {
    let newLine = element;
      while (newLine.indexOf('\.O') >= 0) {
        newLine = newLine.replaceAll('\.O', 'O\.');
      }
    return newLine;
  })
  pattern.modifiedGrid = transpose(gridTransposed);
  pattern.setLoad();

  console.log("Result: ", pattern.load);
}

} catch(err) {
  console.error(err);
}

