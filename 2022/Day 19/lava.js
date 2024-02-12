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
    let emptySides = 6;
    [x, y, z] = [...currentCube]

    emptySides -= inputGrid.find(element => JSON.stringify(element) === JSON.stringify([x - 1, y, z])) ? 1 : 0;
    emptySides -= inputGrid.find(element => JSON.stringify(element) === JSON.stringify([x + 1, y, z])) ? 1 : 0;
    emptySides -= inputGrid.find(element => JSON.stringify(element) === JSON.stringify([x, y - 1, z])) ? 1 : 0;
    emptySides -= inputGrid.find(element => JSON.stringify(element) === JSON.stringify([x, y + 1, z])) ? 1 : 0;
    emptySides -= inputGrid.find(element => JSON.stringify(element) === JSON.stringify([x, y, z - 1])) ? 1 : 0;
    emptySides -= inputGrid.find(element => JSON.stringify(element) === JSON.stringify([x, y, z + 1])) ? 1 : 0;

    return emptySides;
}

let surfaceArea = 0;
inputGrid.forEach(cube => {
    surfaceArea += checkSurrounding(cube);
})
console.log(surfaceArea)