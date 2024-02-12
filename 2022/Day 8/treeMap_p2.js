const { Console } = require('console');
const { readLine } = require('fs');

const fs = require('fs')

//const path = './test_input.txt'
const path = './input.txt'

function syncReadFile(filename) {
    var text = fs.readFileSync(filename, "utf-8");
    var treeGrid = text.split("\n").map(x => x.split(""));
    return treeGrid;
}

function buildBinaryGrid(treeGrid) {
  return treeGrid.map(x => x.map(y => 1));
}

function reverseArray(treeGrid) {
  const newGrid = [];
  for(i = 0; i < treeGrid.length; i++) {
    newGrid.push(treeGrid.map((element) => element[i]));
  }
  return newGrid;
}

function calculateScenicScore(binaryGrid, scenicGrid, reversed = false) {
    //Check if tree visible from left or right
    let ended = false;
    let viewLeftNum = 0;
    let viewRightNum = 0;
    binaryGrid.forEach((row, row_index) => {
      row.forEach((col, col_index) => {

          const viewRight = row.slice(col_index + 1 ).map((x, index) => {
              if(parseInt(x) < parseInt(col) && !ended){
                return 1;
              } else {
                if(!ended) {
                  ended = true;
                  return 1;
                }
                return 0;
              }
            })
            //total up the number of visible trees to the right
            viewRightNum  = viewRight.reduce((a,b) => a+b, 0) || 1;
            ended = false;

            const viewLeft = [...row].slice(0, col_index ).reverse().map((x, index) => {
              if(parseInt(x) < parseInt(col) && !ended){
                return 1;
              } else {
                if(!ended) {
                  ended = true;
                  return 1;
                }return 0;
              }
            })
            //total up the number of visible trees to the left
            viewLeftNum  = viewLeft.reduce((a,b) => a+b, 0) || 1;
            //Perform the multiplication for left and right trees visible from the current index
            scenicGrid[reversed? col_index : row_index][reversed? row_index : col_index] *=  viewLeftNum * viewRightNum;
            ended = false;
      })
    })
}

try {
  if (fs.existsSync(path)) {
    const treeGrid = syncReadFile(path);
    const reversedTreeGrid = reverseArray(treeGrid);
    const scenicGrid = buildBinaryGrid(treeGrid);

    calculateScenicScore(treeGrid, scenicGrid);
    calculateScenicScore(reversedTreeGrid, scenicGrid, true);

    //get largest number of visible trees from any one spot
    console.log(Math.max(...scenicGrid.reduce((a,b) => a.concat(b))))

  }
} catch(err) {
  console.error(err);
}



