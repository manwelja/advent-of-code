const { Console } = require('console');
const { readLine } = require('fs');

const fs = require('fs')

const path = './input.txt'
const pathStack = './inputStack.txt'

function syncReadFile(filename) {
    var text = fs.readFileSync(filename, "utf-8");
    var textByLine = text.split("\n");
    return textByLine;
}

function findUnique(str){
  return [...str].reduce((prev, curr)=>{
    return prev.includes(curr) ?  prev  :  prev + curr;
  }, "")
}

try {
  if (fs.existsSync(path)) {
    const fileArray = syncReadFile(path);
    const fileString = fileArray.toString();
    for(i = 0; i <= fileString.length; i++) {
        const count = findUnique(fileString.slice(i, i + 14)).length;
        if (count === 14) {
          console.log(fileString.slice(i, i + 14));
          console.log(i+14);
          return;
        }
    }

  }
} catch(err) {
  console.error(err);
}



