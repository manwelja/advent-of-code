const { readLine } = require('fs');

const fs = require('fs');

//const fpath = './test_input.txt'
const fpath = './input.txt'

function syncReadFile(filename) {
    const text = fs.readFileSync(filename, "utf-8");
    return text.split("\n").map(x => x.split(",").map(Number))
}

const inputGrid = syncReadFile(fpath);

function checkSurrounding(currentCube) {
    let emptySides = 0;
    [x, y, z] = [...currentCube]

    emptySides += inputGrid.find(element => JSON.stringify(element) === JSON.stringify([x - 1, y, z])) ? 1 : 0;
    emptySides += inputGrid.find(element => JSON.stringify(element) === JSON.stringify([x + 1, y, z])) ? 1 : 0;
    emptySides += inputGrid.find(element => JSON.stringify(element) === JSON.stringify([x, y - 1, z])) ? 1 : 0;
    emptySides += inputGrid.find(element => JSON.stringify(element) === JSON.stringify([x, y + 1, z])) ? 1 : 0;
    emptySides += inputGrid.find(element => JSON.stringify(element) === JSON.stringify([x, y, z - 1])) ? 1 : 0;
    emptySides += inputGrid.find(element => JSON.stringify(element) === JSON.stringify([x, y, z + 1])) ? 1 : 0;

    return emptySides;
}

let surfaceArea = 0;
let MIN = Infinity;
let MAX = -Infinity;

let queue = [[0, 0, 0]];
let processed = [];

for (let cube of inputGrid) {
    const [ x, y, z ] = [...cube];
    MIN = Math.min(MIN, x, y, z);
    MAX = Math.max(MAX, x, y, z);
}

while (queue.length > 0) {
    const cube = queue.shift();
    let [ x, y, z ] = [...cube];
    if (processed.find(element => JSON.stringify(element) === JSON.stringify([x, y, z]))) continue;
    if (inputGrid.find(element => JSON.stringify(element) === JSON.stringify([x, y, z]))) continue;
    if (x < MIN - 1 || y < MIN - 1 || z < MIN - 1) continue;
    if (x > MAX + 1 || y > MAX + 1 || z > MAX + 1) continue;
    processed.push([x,y,z])

    surfaceArea += checkSurrounding(cube);

    queue.push([ x + 1, y, z ]);
    queue.push([ x - 1, y, z ]);
    queue.push([ x, y + 1, z ]);
    queue.push([ x, y - 1, z ]);
    queue.push([ x, y, z + 1 ]);
    queue.push([ x, y, z - 1 ]);
  }

console.log(surfaceArea)