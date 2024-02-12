const { Console } = require('console');
const { readLine } = require('fs');

const fs = require('fs')

// const path = './test_input.txt'
const path = './input.txt'

function syncReadFile(filename) {
    var text = fs.readFileSync(filename, "utf-8");
    var treeGrid = text.split("\n").map(x => x.split(""));
    return treeGrid;
}

function buildBinaryGrid(treeGrid) {
  return treeGrid.map((x, row_index, grid) => x.map((y, col_index, row) => (col_index === 0 || col_index === row.length - 1) || (row_index === 0 || row_index === grid.length - 1)? 1 : 0));
}

function reverseArray(treeGrid) {
  const newGrid = [];
  for(i = 0; i < treeGrid.length; i++) {
    newGrid.push(treeGrid.map((element) => element[i]));
  }
  return newGrid;
}

function processTreeGrid(treeGrid, binaryGrid, reversed = false) {
    //Check if tree visible from left or right
    let visible_left = visible_right = true;
    treeGrid.forEach((row, row_index) => {
      row.forEach((col, col_index) => {
        if(binaryGrid[reversed? col_index : row_index][reversed? row_index : col_index] === 0){
            visible_left = row.slice(0, col_index).filter(curr => parseInt(curr) >= parseInt(col)).length === 0;
            visible_right = row.slice(col_index + 1).filter(curr => parseInt(curr) >= parseInt(col)).length === 0;
            if (visible_left || visible_right) {
                binaryGrid[reversed? col_index : row_index][reversed? row_index : col_index] = 1;
            }
      }
      })
    })
    return binaryGrid;
}

try {
  if (fs.existsSync(path)) {
    const treeGrid = syncReadFile(path);
    const reversedTreeGrid = reverseArray(treeGrid);
    const binaryGrid = buildBinaryGrid(treeGrid);

    processTreeGrid(treeGrid, binaryGrid);
    processTreeGrid(reversedTreeGrid, binaryGrid, true);

    console.log(binaryGrid)
    //Flatten and Sum up grid
    const totalVisibleTrees = binaryGrid.reduce((a,b) => a.concat(b)).reduce((a,b)=>a + b);
    console.log(totalVisibleTrees);

  }
} catch(err) {
  console.error(err);
}



