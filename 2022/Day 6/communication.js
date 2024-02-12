const { Console } = require('console');
const { readLine } = require('fs');

const fs = require('fs')

const path = './input.txt'
const pathStack = './inputStack.txt'

function syncReadFile(filename) {
    var text = fs.readFileSync(filename, "utf-8");
    return text;
}

function buildUnique(str){
  return [...str].reduce((prev, curr)=>{
    return prev.includes(curr) ?  prev  :  prev + curr;
  }, "")
}

try {
  if (fs.existsSync(path)) {
    const fileString = syncReadFile(path);
    for(i = 0; i <= fileString.length; i++) {
        if (buildUnique(fileString.slice(i, i + 4)).length === 4) {
            console.log(fileString.slice(i, i + 4) + ":  " + (i + 4));
            return;
        }
    }
  }
} catch(err) {
  console.error(err);
}



