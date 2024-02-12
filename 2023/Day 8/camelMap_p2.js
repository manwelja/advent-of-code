const fs = require('fs');

const path = './input.txt';

const mapList = [];
let sequence = [];

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

function syncReadFile(filename) {
  let text = fs.readFileSync(filename, "utf-8");
  let textByLine = text.split("\n");
  return textByLine;
}

function calculateGCD(num1, num2) {
  let a = Math.max(num1, num2);
  let b = Math.min(num1, num2);
  while (a > 0) {
    let remainder = b % a;
    b = a;
    a = remainder;
  }
  return b;
}

try {
  if (fs.existsSync(path)) {
    let fileArray = syncReadFile(path);
    fileArray.filter((e) => e != '').forEach((element) => {
        if (element.indexOf('=') < 0) {
            sequence = element.split('');
            return;
        }
        let [step, leftStep, rightStep] = element.replace(/[^a-z0-9\s]/gi, ' ').trim().replace(/\s+/g, ',').split(',');
        mapList.push(new Step(step, leftStep, rightStep))
    })
  }

  let pathStartList = mapList.filter((element) => element.step.slice(-1) == 'A');
  const completionSteps = [];
  pathStartList.forEach((pathStart) => {
    currentStep = pathStart;
    let count = 0;
    while(currentStep.step.slice(-1) != 'Z') {
      let nextStep =  currentStep.getNextStep(sequence[count % sequence.length]);
      currentStep = mapList.find((element) => element.step == nextStep);
      count++;
    }
    completionSteps.push(count);
  });

  let gdc = completionSteps.reduce((acc, curr) => calculateGCD(acc, curr), 0);
  firstStep = completionSteps.shift();
  result = completionSteps.reduce((acc, curr) => acc * (curr / gdc), firstStep);
  console.log('Result: ', result);

} catch(err) {
  console.error(err);
}

