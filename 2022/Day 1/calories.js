const { readLine } = require('fs');

const fs = require('fs')

const path = './input.txt'

function syncReadFile(filename) {
    var text = fs.readFileSync(filename, "utf-8");
    var textByLine = text.split("\n");
    return textByLine;
  }


function sumArray(arr) {
    return arr.map(Number).reduce((a, b) =>  a + b);
}

try {
  if (fs.existsSync(path)) {
    let fileArray = syncReadFile(path);
    let maxNum = arrBoundary = 0;
    const maxNumArray = [];

    while(fileArray.length > 0) {
        let arrBoundary = fileArray.indexOf('') > 0 ? fileArray.indexOf('') : fileArray.length;
      //  maxNum = Math.max(maxNum, sumArray(fileArray.splice(0, arrBoundary + 1)));
        maxNumArray.push(sumArray(fileArray.splice(0, arrBoundary + 1)))
    }
   let sortArray = maxNumArray.sort().reverse();
   console.log(sumArray(sortArray.splice(0,3)));
}
} catch(err) {
  console.error(err);
}



