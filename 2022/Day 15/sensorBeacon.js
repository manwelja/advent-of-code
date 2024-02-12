const { Console } = require('console');
const { readLine } = require('fs');

const fs = require('fs');

const fpath = './test_input.txt'
//const fpath = './input.txt'

const sensorsOffset = [];
const beaconsOffset = [];
let offsetX = 0;
let offsetY = 0;

//Read the file into a matrix
function getSensorCoordinates(filename) {
  const text = fs.readFileSync(filename, "utf-8");
  const sensorMatrix = text.split("\n").map(x => x.replace(/[^-=0-9]/gi, "").split("=").filter((y, index) => index === 1 || index === 2 ).map(Number));
  return sensorMatrix;
}

function getBeaconCoordinates(filename) {
  const text = fs.readFileSync(filename, "utf-8");
  const beaconMatrix = text.split("\n").map(x => x.replace(/[^-=0-9]/gi, "").split("=").filter((y, index) => index === 3 || index === 4 ).map(Number));
  return beaconMatrix;
}

const adjustForOffset = ((sensors, beacons) => {
  //update all Y indices(rows) to start at 0
  const concatArrays = sensors.concat(beacons);
  const allX = concatArrays.map(x => x[0])
  const allY = concatArrays.map(y => y[1])
  offsetX = Math.min(Math.min(...allX), 0);
  offsetY = Math.min(Math.min(...allY), 0);

  sensorsOffset.push(...sensors.map(curr => {
    return [curr[0] + Math.abs(offsetX), curr[1] + Math.abs(offsetY)]
  }));

  beaconsOffset.push(...beacons.map(curr => {
    return [curr[0] + Math.abs(offsetX), curr[1] + Math.abs(offsetY)]
  }));

})
const getGridSize = ((sensorsOffset, beaconsOffset, width = true) => {
  const index = width ? 0 : 1;
  const maxSensor = sensors.reduce((prev, curr) => Math.max(prev, curr[index]), 0)
  const minSensor = sensors.reduce((prev, curr) => Math.min(prev, curr[index]), 0)
  const maxBeacon = beacons.reduce((prev, curr) => Math.max(prev, curr[index]), 0)
  const minBeacon = beacons.reduce((prev, curr) => Math.min(prev, curr[index]), 0)
  return Math.max(maxSensor, maxBeacon) - Math.min(minSensor, minBeacon)
})

//Get the sensor and beacon coordinates
const sensors = getSensorCoordinates(fpath);
const beacons = getBeaconCoordinates(fpath);

const gridLength = getGridSize(sensors, beacons, true);
const gridWidth = getGridSize(sensors, beacons, false);

//console.log(gridLength)
//map out their location
let grid = Array(30).fill("").map(y => Array(30).fill(""));

adjustForOffset(sensors, beacons);
sensorsOffset.forEach((coord, index) => {
  console.log(coord[1], coord[0])
  grid[coord[1]][coord[0]] = "S";
});

//console.log(beaconsOffset)
beaconsOffset.forEach((coord, index) => {
   grid[coord[1]][coord[0]] = "B";
 });
////console.log(grid)
 sensorsOffset.forEach((coord, index) => {
   const manhattanNum = Math.abs(coord[0] - beaconsOffset[index][0]) + Math.abs(coord[1] - beaconsOffset[index][1]);
   console.log(manhattanNum)
   //i rows
   for(i = 0; i < grid.length; i++) {
    //j cols
     for(j = 0; j < grid[0].length; j++) {
       if (Math.abs(coord[1] - i) + Math.abs(coord[0] - j) < manhattanNum && grid[j][i] === "") {
         grid[j][i] = "#";
       }  
     }
   }
//   //if blocked, insert #
  
//   console.log(grid)
 });
 console.log(grid)
//console.log(beaconsOffset)