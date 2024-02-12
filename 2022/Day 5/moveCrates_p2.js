const { Console } = require('console');
const { readLine } = require('fs');

const fs = require('fs')

const path = './input.txt'

const stacks = {
  1: ['B','S','V','Z','G','P','W'],
  2: ['J','V','B','C','Z','F'],
  3: ['V','L','M','H','N','Z','D','C'],
  4: ['L','D','M','Z','P','F','J','B'],
  5: ['V','F','C','G','J','B','Q','H'],
  6: ['G','F','Q','T','S','L','B'],
  7: ['L','G','C','Z','V'],
  8: ['N','L','G'],
  9: ['J','F','H','C']
}
function syncReadFile(filename) {
    var text = fs.readFileSync(filename, "utf-8");
    var textByLine = text.split("\n");
    return textByLine;
  }


try {
  if (fs.existsSync(path)) {
    const fileArray = syncReadFile(path);
    const instructions = fileArray.map(x => {
      const regex = /[a-z]/ig;
      return x.replace(regex, '').trim().split('  ').map(Number);
    })

    instructions.forEach((instruction, index) =>{
      const piecesToMove = stacks[instruction[1]].splice(stacks[instruction[1]].length - instruction[0]);
      stacks[instruction[2]].push(...piecesToMove);
    })

    let topLayer = '';
    for (const key in stacks) {
      topLayer += stacks[key][stacks[key].length-1]
    }
    console.log(topLayer)
  }
} catch(err) {
  console.error(err);
}



