const fs = require('fs');

const path = './input.txt';


function syncReadFile(filename) {
  let text = fs.readFileSync(filename, "utf-8");
  let textByLine = text.split("\n");
  return textByLine;
}

class Node {
    constructor(node, directionBefore, directionAfter, isValid = true, distance = 1) {
      this.node = node;
      this.nodeDetail = pipeGrid[node[0]][node[1]];
      this.directionBefore = directionBefore;
      this.directionAfter = directionAfter;
      this.isValid = isValid;
      this.distance = distance;
    };
}
const pipes = {
    north: {
        '|': [-1, 0, 'north'],
        '7': [0, -1, 'west'],
        'F': [0, 1, 'east'],
    },
    east:{
        '-': [0, 1, 'east'],
        'J': [-1, 0, 'north'],
        '7': [1, 0, 'south'],
    },
    west:{
        '-': [0, -1, 'west'],
        'F': [1, 0, 'south'],
        'L': [-1, 0, 'north'], //huh
    },
    south:{
        '|': [1, 0, 'south'],
        'L': [0, 1, 'east'],
        'J': [0, -1, 'west']
    },
}

let currDirection = null;
let startNode = [];
const pathList = [];
let nodeList = [];
const pipeGrid = [];
let pipeDistances = [];
try {
  if (fs.existsSync(path)) {

    let fileArray = syncReadFile(path);
    fileArray.forEach((element) => {
        pipeGrid.push(element.split(''));
        if((x = pipeGrid[pipeGrid.length-1].indexOf('S')) >= 0) {
            startNode = [pipeGrid.length-1, x];
        }
    })
 
    pathList.push(new Node(startNode.map((element, index) => index == 0 ? element + 1: element), 'south'));
    pathList.push(new Node(startNode.map((element, index) => index == 0 ? element : element - 1), 'west'));
    pathList.push(new Node(startNode.map((element, index) => index == 0 ? element : element + 1), 'east'));
    pathList.push(new Node(startNode.map((element, index) => index == 0 ? element - 1 : element), 'north'));
    pathList.forEach((node) => {
       let instr = pipes[node.directionBefore][pipeGrid[node.node[0]][node.node[1]]];
       if(instr) {
            node.directionAfter =instr[2];
       }
    })
    pathList.forEach((path) => {
        let done = false;
        let nextNode = path.node;
        let distanceCount = 1;
        let tmpNodeList = [];
        tmpNodeList.push(path);
        let currNode = path;
        while(!done && nodeList.length == 0) {
            distanceCount++;
            if(typeof pipeGrid[currNode.node[0]][currNode.node[1]] === 'undefined' || pipeGrid[currNode.node[0]][currNode.node[1]] == '.') {
                path.isValid = false;
                done = true;
                continue;
            }
            if(currNode.nodeDetail == 'S') {
                path.isValid = true;
                done = true;
                nodeList = tmpNodeList;
                continue;
            }
            let instructions = pipes[currNode.directionBefore][pipeGrid[nextNode[0]][nextNode[1]]];
            nextNode = [nextNode[0] + instructions[0], nextNode[1] + instructions[1]];
            let dirAfter = null;
            if(instr = (pipes[currNode.directionAfter][pipeGrid[nextNode[0]][nextNode[1]]])) {
                dirAfter = instr[2];
            }
            currNode = new Node(nextNode, currNode.directionAfter, dirAfter, true, distanceCount);
            tmpNodeList.push(currNode);
       }
    })
 }
    console.log('result: ', nodeList[nodeList.length-1].distance/2);

} catch(err) {
  console.error(err);
}

