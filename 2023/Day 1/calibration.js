const { readLine } = require('fs');

const fs = require('fs')

const path = './input2.txt'

function syncReadFile(filename) {
    let text = fs.readFileSync(filename, "utf-8");
    let textByLine = text.split("\n");
    return textByLine;
  }

try {
  if (fs.existsSync(path)) {
    let fileArray = syncReadFile(path);
    numericArray = fileArray.map(function(value) {
      let numbers = value.match(/[0-9]/g);
      return numbers.at(0) + numbers.at(-1);
    })
    console.log(numericArray.map(Number).reduce((a, b) => a + b, 0));
}
} catch(err) {
  console.error(err);
}



