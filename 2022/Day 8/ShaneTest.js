const fs = require('fs');

//let data = fs.readFileSync('./dataexample.txt', 'utf8').split("\n");
let data = fs.readFileSync('./input.txt', 'utf8').split("\n");

let numberTreeVisible = 0;

// Initialize the forest
let forest = Array(data[0].length).fill(0).map(y => Array(data.length).fill(0));

for(let y=0; y < data.length; y++) {
    for(let x=0; x < data[0].length; x++) {
        forest[y][x] = data[y][x];
    }
}

// Check for visible locations
for(let y=1; y < forest.length - 1; y++) {
    for(let x=1; x < forest[0].length - 1; x++) {
        if(getNumberVisibleLocations(forest, x, y) > 0) {
            numberTreeVisible++;
        }
    }
}

// Add in all the trees around the perimeter
numberTreeVisible += forest.length * 2;
numberTreeVisible += forest[0].length * 2 - 4; // need to subtract 4 as the corners are already counted in y
console.log(forest)
console.log(numberTreeVisible);


/////////////////////
// Helper Functions
/////////////////////
function getNumberVisibleLocations(forest, x, y) {
    let visibleLocations = 4;
    const treeHeight = forest[y][x];

    //check top
    for(let ty=y-1; ty >= 0; ty--) {
        if(forest[ty][x] >= treeHeight) {
            visibleLocations--;
            break;
        }
    }

    //check bottom
    for(let ty=y+1; ty < forest.length; ty++) {
         if(forest[ty][x] >= treeHeight) {
            visibleLocations--;
            break;
        }
    }

    //check right
    for(let tx=x+1; tx < forest[0].length; tx++) {
        if(forest[y][tx] >= treeHeight) {
            visibleLocations--;
            break;
        }
    }

    //check left
    for(let tx=x-1; tx >= 0; tx--) {
        if(forest[y][tx] >= treeHeight) {
            visibleLocations--;
            break;
        }
    }

    return visibleLocations;
}