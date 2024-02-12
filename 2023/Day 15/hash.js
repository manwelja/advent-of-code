const fs = require('fs');

const path = './input.txt';

const stepList = [];

function syncReadFile(filename) {
  let text = fs.readFileSync(filename, "utf-8");
  let textByLine = text.split("\n");
  return textByLine;
}

class Step {
    constructor(sequence) {
      this.sequence = sequence;
      this.value = this.calculateValue();
    };

    calculateValue() {
        return this.sequence.split('').reduce((acc, item) => ((acc + item.charCodeAt(0)) * 17) % 256, 0);
    }
}

try {
  if (fs.existsSync(path)) {

    let fileArray = syncReadFile(path);
    let tmpArr = [];

    fileArray.forEach((element) => {
        tmpArr = element.split(',');
        tmpArr.forEach((item) => {
            stepList.push(new Step(item));
        })
    })
    let result = 0;
    stepList.forEach((i) => result += i.value);
    console.log('result:', result);
   // console.log('result:'. stepList.reduce((acc, curr) => acc + curr.value, 0));
  }

} catch(err) {
  console.error(err);
}

//not 27068 (too low)