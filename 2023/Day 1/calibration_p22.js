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
        let searchString = '(' + Object.keys(replacements).join('|') + ')';
        let regExFirst = new RegExp('(?<=)' + searchString, 'i');
        let regExLast = new RegExp(searchString + '(?=.*' + searchString + ')', 'i');
        let firstNum = value.match(regExFirst).shift();
        let lastNum = (val = value.match(regExLast)) ? val.pop() : firstNum;
        return replacements[firstNum.toLowerCase()].toString() + replacements[lastNum.toLowerCase()].toString();
    })
    console.log("result: ", numericArray.map(Number).reduce((a, b) => a + b, 0));

}
} catch(err) {
  console.error(err);
}
//54719
