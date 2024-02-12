const fs = require('fs');

const path = './input.txt';

const instructionList = [];

function syncReadFile(filename) {
  let text = fs.readFileSync(filename, "utf-8");
  let textByLine = text.split("\n");
  return textByLine;
}

function isInLoop(loop, pointX, pointY) {
    let windingNum = 0;

    loop.forEach((node1, index) => {
        const node2 = loop[(index + 1) % loop.length];
        let intersect = (node2.point[1] - node1.point[1]) * (pointY - node1.point[0]) - (pointX - node1.point[1]) * (node2.point[0] - node1.point[0]);
        if (node1.point[0] <= pointY) {
            if (node2.point[0] > pointY && intersect > 0) {
            windingNum += 1;
            }
        } else if (node2.point[0] <= pointY && intersect < 0) {
            windingNum -= 1;
        }
    });
    return windingNum !== 0;
}

class Grid {
    constructor() {
      this.nodes = [];
      this.grid = [];
    };

    addNode(id, point) {
        this.nodes.push({id: id, point: point})
    }

    createGrid() {
        this.fixOffsets();
        let emptyLine = '.'.repeat(this.getWidth() + 1).split('');
        for(let i = 0; i <= this.getLength(); i++) {
            this.grid.push(emptyLine.slice());
        }
        for (const [key, node] of Object.entries(this.nodes)) {
            this.grid[node.point[0]][node.point[1]] = '#';
        }
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
    constructor(id, direction, numSpaces, rgb) {
        this.id = id;
        this.direction = direction;
        this.numSpaces = numSpaces;
        this.rgb = rgb;
    };
}

const directionOffset = {
    'U': [-1, 0],
    'D': [1, 0],
    'L': [0, -1],
    'R': [0, 1]
}

try {
  if (fs.existsSync(path)) {

    let fileArray = syncReadFile(path);

    fileArray.forEach((element, idx) => {
        instructionList.push(new Instruction(idx, ...element.replace('(', '').replace(')', '').split(' ')));
    })
    let currPoint = [0, 0];
    const grid = new Grid();
    instructionList.forEach((p) => {
        for(let i = 0; i < p.numSpaces; i++) {
            let y = currPoint[0] + directionOffset[p.direction][0];
            let x = currPoint[1] + directionOffset[p.direction][1];
            currPoint = [y, x]
            grid.addNode(p.id, currPoint);
        }

    })

    grid.createGrid();

    let sum = grid.nodes.length;
    for(let y = 0; y < grid.getLength(); y++) {
        for(let x = 0; x < grid.getWidth(); x++) {
            if(grid.grid[y][x] == '.' && isInLoop(grid.nodes, x, y)) {
                sum++;
            }
        }
    }
    console.log(sum)
  }

} catch(err) {
  console.error(err);
}
