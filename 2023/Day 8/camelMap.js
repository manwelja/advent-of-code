const fs = require('fs');

const path = './input.txt';

const mapList = [];
let sequence = [];

function syncReadFile(filename) {
  let text = fs.readFileSync(filename, "utf-8");
  let textByLine = text.split("\n");
  return textByLine;
}

class Step {
    constructor(step, leftStep, rightStep) {
      this.step = step;
      this.leftStep = leftStep;
      this.rightStep = rightStep;
    };

    getNextStep(direction) {
        let stepMap = new Map([['R', this.rightStep], ['L', this.leftStep]]);
        return stepMap.get(direction);

    }
}

try {
  if (fs.existsSync(path)) {
    let fileArray = syncReadFile(path);
    fileArray.filter((e) => e != '').forEach((element) => {
        if (element.indexOf('=') < 0) {
            sequence = element.split('');
            return;
        }
        let [step, leftStep, rightStep] = element.replace(/[^a-z\s]/gi, ' ').trim().replace(/\s+/g, ',').split(',');
        mapList.push(new Step(step, leftStep, rightStep))
    })
    console.log(mapList)
  }

  let count = 0;
  let currentStep = mapList.find((element) => element.step == 'AAA');

  while(currentStep.step != 'ZZZ') {
    let nextStep =  currentStep.getNextStep(sequence[count % sequence.length]);
    currentStep = mapList.find((element) => element.step == nextStep);
    count++;
  }
  console.log('result: ', count);
} catch(err) {
  console.error(err);
}

