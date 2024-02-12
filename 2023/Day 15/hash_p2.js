const fs = require('fs');

const path = './input.txt';

const lensList = [];
const boxList = [];

function syncReadFile(filename) {
  let text = fs.readFileSync(filename, "utf-8");
  let textByLine = text.split("\n");
  return textByLine;
}

class Box {
  constructor(num) {
    this.number = num;
    this.contents = [];
  };

  addLens(lens) {
    let labelIndex = this.contents.findIndex((element) => element.label == lens.label);
    if(labelIndex < 0) {
      this.contents.push(lens);
      return;
    }
    this.contents.splice(labelIndex, 1, lens);
  }

  removeLens(lens) {
    let labelIndex = this.contents.findIndex((element) => element.label == lens.label);
    if(labelIndex < 0) {
      return;
    }
    this.contents.splice(labelIndex, 1);
  }
}
class Lens {
    constructor(sequence) {
      this.sequence = sequence;
      this.operation = this.getOperation();
      this.value = this.calculateValue();
      this.label = this.getLabel();
      this.boxNumber = this.calculateBoxNumber();
      this.focalLength = this.getFocalLength();
      this.focusPower = 0;
    };

    calculateValue() {
        return this.sequence.split('').reduce((acc, item) => ((acc + item.charCodeAt(0)) * 17) % 256, 0);
    }

    calculateBoxNumber() {
      let regPattern = new RegExp('(\=|\-)');
      let labelDelim = this.sequence.search(regPattern);
      if(labelDelim == 0) {
        return null;
      }
      let label = this.sequence.slice(0, labelDelim);
      return label.split('').reduce((acc, item) => ((acc + item.charCodeAt(0)) * 17) % 256, 0);
    }

    getOperation() {
      let regPattern = new RegExp('(\=|\-)');
      let operation = this.sequence.match(regPattern);
      if(operation.length == 0) {
        return null;
      }
      return operation[0];
    }

    getFocalLength() {
      let operationIndex = this.sequence.indexOf(this.operation);
      if(operationIndex == 0) {
        return 0;
      }
      return this.sequence.slice(operationIndex + 1);
    }

    getLabel() {
      let operationIndex = this.sequence.indexOf(this.operation);
      if(operationIndex == 0) {
        return 0;
      }
      return this.sequence.slice(0, operationIndex);
    }

    setFocusPower() {
      let boxes = boxList.filter((box) => box.contents.includes(this));
      let focusPower = 0;
      boxes.forEach((box) => {
        let slotNum = box.contents.findIndex((e) => e == this) + 1;
        focusPower += (box.number + 1) * slotNum * this.focalLength;
      })
      this.focusPower = focusPower;
    }
}

try {
  if (fs.existsSync(path)) {

    let fileArray = syncReadFile(path);
    let tmpArr = [];

    fileArray.forEach((element) => {
        tmpArr = element.split(',');
        tmpArr.forEach((item) => {
            lensList.push(new Lens(item));
        })
    })
    for(i = 0; i < 256; i++) {
      boxList.push(new Box(i));
    }

    lensList.forEach((item) => {
      let box = boxList.find((box) => box.number == item.boxNumber);
      if(!box) {
        return;
      }
      switch(item.operation) {
        case '-':
          box.removeLens(item);
          break;
        case '=':
          box.addLens(item);
          break;
        default:
          break;
      }
    })

    lensList.forEach((item) => {
      item.setFocusPower();
    })

    console.log('result:', lensList.reduce((acc, curr) => acc + curr.focusPower, 0));
  }

} catch(err) {
  console.error(err);
}

//not 247124 (too low)
