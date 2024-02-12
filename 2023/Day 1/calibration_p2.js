const { readLine } = require('fs');

const fs = require('fs');
const util = require('util');

const path = './input.txt';

const replacements = {
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9
};

function syncReadFile(filename) {
    let text = fs.readFileSync(filename, "utf-8");
    let textByLine = text.split("\n");
    return textByLine;
}


try {
  if (fs.existsSync(path)) {
    let fileArray = syncReadFile(path);

    numericArray = fileArray.map(function(value) {
      firstIndex = -1;
      lastIndex = -1;
      firstNum = '';
      lastNum = '';

      for(searchVal of Object.keys(replacements)) {
          currIndex = value.indexOf(searchVal);
          if((currIndex >= 0 && currIndex < firstIndex) || (currIndex >= 0 && firstIndex == -1)) {
            firstIndex = currIndex;
            firstNum = replacements[searchVal];
          }
          currIndex = value.lastIndexOf(searchVal);
          if((currIndex >= 0 && currIndex > lastIndex) || (currIndex >= 0 && lastIndex == -1)) {
            lastIndex = currIndex;
            lastNum = replacements[searchVal];
          }
        }
        return firstNum.toString() + lastNum.toString();
      }

    )

    console.log("result: ", numericArray.map(Number).reduce((a, b) => a + b, 0));
    }
} catch(err) {
  console.error(err);
}


