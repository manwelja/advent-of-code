const { Console } = require('console');
const { readLine } = require('fs');

const fs = require('fs');

//const fpath = './test_input.txt'
const fpath = './input.txt'

//Read the file into a matrix
function syncReadFile(filename) {
  const text = fs.readFileSync(filename, "utf-8");
  const textMatrix = text.split("\n").map(x => x.replace("S", "a").replace("E", "z").split(""));
  return textMatrix.map(y => y.map(x => {
      //convert alphabet to numeric
      return x.charCodeAt(0) - 96;
  }))
}

// Set the corrdinates of the start and end of the maze - hard coding because I'm annoyed
const START_ROW = 20;
const START_COL = 0;
const END_ROW = 20;
const END_COL = 44;
// const START_ROW = 0;
// const START_COL = 0;
// const END_ROW = 2;
// const END_COL = 5;

const DIRECTIONS = ["UP", "DOWN", "LEFT", "RIGHT"];
let currSpaceVal = 1;

const findShortestPath = (grid) => {

  // Each square visited will have a corresponding node object
  let node = {
    rowNum: START_ROW,
    colNum: START_COL,
    path: [],
    type: 'MouseHole'
  };

  //Add the first node onto the queue
  let queue = [node];

  // Let's follow some paths!
  while (queue.length > 0) {
    // Take the first location off the queue
    let currentNode = queue.shift();
    let nextNode = null;

    for(i = 0; i < DIRECTIONS.length; i++) {
      nextNode = checkNextNode(currentNode, DIRECTIONS[i], grid);
      if (nextNode.type === 'Cheese') {
        //If we've hit paydirt, return the path
        return nextNode.path;
      } else if (nextNode.type === 'Open') {
        //If we've got more 'xplorin to do (the new node isn't a dead end), put it in the queue
        queue.push(nextNode);
      }
    };
  }
    // If we've exhausted the queue and haven't found the cheese, return null (no cheese for you)
    return null;

};

//Determine the type of node
const nodeType = (node, grid) => {
  let gridHeight = gridComp.length;
  let gridWidth = gridComp[0].length;
  let searchRow = node.rowNum;
  let searchCol = node.colNum;

  if (node.colNum < 0 || node.colNum >= gridWidth || node.rowNum < 0 || node.rowNum >= gridHeight) {
    //node is not valid grid coordinates
    return null;
  } else if ( gridComp[searchRow][searchCol] - currSpaceVal > 1 || grid[searchRow][searchCol] === "X" ) {
    //If we've already explored this space, or it is too high, it shouldn't be added to the search cue
    return null;
  } else {
     return grid[searchRow][searchCol] === "Cheese" ? "Cheese" : "Open";
  }
};


// Traverse the grid
const checkNextNode = (currentNode, dir, grid) => {

  let newPath = currentNode.path.slice();
  newPath.push(dir);

  let searchRow = currentNode.rowNum;
  let searchCol = currentNode.colNum;

  currSpaceVal = gridComp[searchRow][searchCol];

  switch(dir) {
    case "UP":
      searchRow -= 1;
      break;
    case "DOWN":
      searchRow += 1;
      break;
    case "LEFT":
      searchCol += 1;
      break;
    case "RIGHT":
      searchCol -= 1;
      break;
    default:
      console.log("ERROR - invalid direction: ", dir)
  }
  let nextNode = {
    rowNum: searchRow,
    colNum: searchCol,
    path: newPath,
    type: null
  };

  nextNode.type = nodeType(nextNode, grid);
  // If we've seen the node for the first time, mark it as 'X'
  if (nextNode.type === 'Open') {
    grid[nextNode.rowNum][nextNode.colNum] = 'X';
  }

  return nextNode;
};



//Create a 2 dimensional array from the input data
gridComp = syncReadFile(fpath);
//Create a second array to store the attempted path data
grid = Array(gridComp.length).fill("").map(y => Array( gridComp[0].length).fill(""));
//Set the start and end values in the array
grid[START_ROW][START_COL] = "MouseHole";
grid[END_ROW][END_COL] = "Cheese";

const bestPath = findShortestPath(grid);
console.log(grid)
console.log("Shortest path:", bestPath);
//Add 1 to account for starting node
console.log("Shortest path:",bestPath.length + 1);
