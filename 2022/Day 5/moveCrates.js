const { Console } = require('console');
const { readLine } = require('fs');

const fs = require('fs')

const path = './input.txt'
const pathStack = './inputStack.txt'

//const stacks = {
  // 1: ['B','S','V','Z','G','P','W'],
  // 2: ['J','V','B','C','Z','F'],
  // 3: ['V','L','M','H','N','Z','D','C'],
  // 4: ['L','D','M','Z','P','F','J','B'],
  // 5: ['V','F','C','G','J','B','Q','H'],
  // 6: ['G','F','Q','T','S','L','B'],
  // 7: ['L','G','C','Z','V'],
  // 8: ['N','L','G'],
  // 9: ['J','F','H','C']
//}

function syncReadFile(filename) {
    var text = fs.readFileSync(filename, "utf-8");
    var textByLine = text.split("\n");
    return textByLine;
}

function createStack(filename) {
  var text = fs.readFileSync(filename, "utf-8");
  var textByLine = text.split("\n");
  const stacks = {};

  for(let i = 1; i < textByLine.length + 2; i++) {
    stacks[i] = [];
  }

  textByLine.reverse().map((x, index) =>
  {
      let y = 1;
      for(let i = 1; i < Object.keys(stacks).length + 1; i++) {
        y <= x.length && x[y] !== ' ' ? stacks[i].push(x[y]) : '';
        y += 4;
      }
  })
  return stacks;
}

try {
  if (fs.existsSync(path)) {
    const stacks = createStack(pathStack);
    console.log(stacks)
    const fileArray = syncReadFile(path);
    const instructions = fileArray.map(x => {
      const regex = /[a-z]/ig;
      const numOnly = x.replace(regex, '').trim()
      return numOnly.split('  ').map(Number)
    })
    instructions.forEach((instruction, index) =>{
      const numPieces = instruction[0];
      const source = instruction[1];
      const destination = instruction[2];
      const piecesToMove = stacks[source].splice(stacks[source].length - numPieces);
      stacks[destination].push(...piecesToMove.reverse());
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
createStack('./inputStack.txt')


