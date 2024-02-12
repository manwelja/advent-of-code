const { readLine } = require('fs');

const fs = require('fs')

const path = './input.txt'

function syncReadFile(filename) {
    var text = fs.readFileSync(filename, "utf-8");
    var textByLine = text.split("\n");
    return textByLine;
  }


function compArray(key) {
  const pointKey = {
    'cx': 7,
    'ay': 8,
    'bz': 9,
    'ax': 4,
    'by': 5,
    'cz': 6,
    'bx': 1,
    'cy': 2,
    'az': 3
  }
  console.log(key.toLowerCase())
  return pointKey[key.toLowerCase().replace(' ','')];
}

try {
  if (fs.existsSync(path)) {
    const fileArray = syncReadFile(path);

    let totPoints = 0;
    for(let i = 0; i < fileArray.length; i++) {
      totPoints += compArray(fileArray[i]);
    }
   console.log(totPoints)
}
} catch(err) {
  console.error(err);
}



