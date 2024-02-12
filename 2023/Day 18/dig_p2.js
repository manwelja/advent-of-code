const fs = require('fs');

const path = './input.txt';

const instructionList = [];
let nodeCount = 0;

function syncReadFile(filename) {
  let text = fs.readFileSync(filename, "utf-8");
  let textByLine = text.split("\n");
  return textByLine;
}

function calculateArea(nodes) {
    var total = 0;

    for (var i = 0, l = nodes.length; i < l; i++) {
      total += nodes[i].x * nodes[i == nodes.length - 1 ? 0 : i + 1].y * 0.5;
      total -= nodes[i == nodes.length - 1 ? 0 : i + 1].x * nodes[i].y * 0.5;
    }

    return Math.abs(total);
}
class Grid {
    constructor() {
      this.nodes = [];
      this.grid = [];
    };

    addNode(id, point) {
        this.nodes.push({id: id, point: point})
    }

    getLength() {
        return this.nodes.reduce((acc, curr) => curr.point[0] > acc ? curr.point[0] : acc, 0);
    }

    getWidth() {
        return this.nodes.reduce((acc, curr) => curr.point[1] > acc ? curr.point[1] : acc, 0);
    }

    fixOffsets() {
        let lowestX = this.nodes.reduce((acc, curr) => curr.point[1] < acc ? curr.point[1] : acc, 0) * -1;
        let lowestY = this.nodes.reduce((acc, curr) => curr.point[0] < acc ? curr.point[0] : acc, 0) * -1;

        for (const [key, node] of Object.entries(this.nodes)) {
            node.point[0] = node.point[0] + lowestY;
            node.point[1] = node.point[1] + lowestX;
        }
    }
 }

class Instruction  {
    constructor(id, direction, numSpaces) {
        this.id = id;
        this.direction = direction;
        this.numSpaces = numSpaces;
    };
}

const directionOffset = {
    'U': [-1, 0],
    'D': [1, 0],
    'L': [0, -1],
    'R': [0, 1]
}

const directionNumberMap = {
    '0': 'R',
    '1': 'D',
    '2': 'L',
    '3': 'U'
}
try {
  if (fs.existsSync(path)) {

    let fileArray = syncReadFile(path);

    fileArray.forEach((element, idx) => {
        let instructions = element.replace('(#', '').replace(')', '').split(' ')[2];
        let numSpaces = parseInt(instructions.slice(0, 5), 16);
        let direction = directionNumberMap[instructions.slice(5, 6)];
        instructionList.push(new Instruction(idx, direction, numSpaces));
    })

    let currPoint = [0, 0];
    const grid = new Grid();
    const nodes = [];
    instructionList.forEach((p, index) => {
        let y = currPoint[0] + directionOffset[p.direction][0] * p.numSpaces;
        let x = currPoint[1] + directionOffset[p.direction][1] * p.numSpaces;
        nodeCount += p.numSpaces;
        currPoint = [y, x]
        grid.addNode(p.id, currPoint);
        nodes.push({y: y, x: x});
    })

    console.log('Result: ', calculateArea(nodes) + (nodeCount / 2) + 1)

  }
} catch(err) {
  console.error(err);
}
