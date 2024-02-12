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
    'ax': 3,
    'ay': 4,
    'az': 8,
    'bx': 1,
    'by': 5,
    'bz': 9,
    'cx': 2,
    'cy': 6,
    'cz': 7
  }
  // console.log(pointKey[key.toLowerCase().replace(' ','')])
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



