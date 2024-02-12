const fs = require('fs');

const path = './input.txt';

function syncReadFile(filename) {
  let text = fs.readFileSync(filename, "utf-8");
  let textByLine = text.split("\n");
  return textByLine;
}

function isInLoop(loop, pointX, pointY) {
  let windingNum = 0;
  loop.forEach((node1, index) => {
    const node2 = loop[(index + 1) % loop.length];
    let intersect = (node2.node[1] - node1.node[1]) * (pointY - node1.node[0]) - (pointX - node1.node[1]) * (node2.node[0] - node1.node[0]);
    if (node1.node[0] <= pointY) {
      if (node2.node[0] > pointY && intersect > 0) {
        windingNum += 1;
      }
    } else if (node2.node[0] <= pointY && intersect < 0) {
      windingNum -= 1;
    }
  });

  return windingNum !== 0;
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
        'L': [-1, 0, 'north'],
    },
    south:{
        '|': [1, 0, 'south'],
        'L': [0, 1, 'east'],
        'J': [0, -1, 'west']
    },
}

let startNode = [];
const pathList = [];
let nodeList = [];
const pipeGrid = [];

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
    console.log('result: ', nodeList[nodeList.length-1].distance/2);

    let display = pipeGrid;

    nodeList.forEach((node) => {
        display[node.node[0]][node.node[1]] = '*';
    })

    display.forEach((yNode, yIndex) => {
        yNode.forEach((xNode, xIndex) => {
            if(xNode != '*') {
                display[yIndex][xIndex] = 0;
          }
      })
    })

    let sum = 0;
    for(let y = 0; y < display.length; y++) {
        for(let x = 0; x < display[y].length; x++) {
            if(display[y][x] == 0 && isInLoop(nodeList, x, y)) {
                sum++;
            }
        }
    }
    console.log('SUM ', sum) //291
  }

} catch(err) {
  console.error(err);
}
