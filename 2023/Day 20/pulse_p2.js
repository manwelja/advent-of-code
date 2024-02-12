const fs = require('fs');

const path = './input.txt';

const moduleList = [];
const priorityQueue = [];
let numLowPulses = 0;
let numHighPulses = 0;
const rxButtonPresses = [];

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

class Module {
    constructor(id, type, receivers) {
      this.id = id;
      this.type = type;
      this.receivers = receivers;
      this.open = type === 'flip-flop' ? false : true;
      this.pulses = {};
    };

    updatePulse(id, pulse) {
      this.pulses[id] = pulse;
    }

}

const moduleTypes = {
    'b': 'broadcaster',
    '%': 'flip-flop',
    '&': 'conjunction'
}

try {
  if (fs.existsSync(path)) {

    let fileArray = syncReadFile(path);

    fileArray.forEach((element) => {
        let [part1, part2] = element.split(' -> ');
        let type = moduleTypes[part1.charAt(0)];
        let receivers = part2.split(', ');
        let id = part1.replace('%', '').replace('&', '').trim()
        moduleList.push(new Module(id, type, receivers));
    })

    moduleList.forEach((module) => {
      module.receivers.forEach((r) => {
        //is receiver is conjunction, add a low pulse from this module
        let tmpMod = moduleList.find((module) => module.id === r);

        if(tmpMod && tmpMod.type === 'conjunction') {
          tmpMod.updatePulse(module.id, 'low');
        }
      })
    })

    for(i = 1; i <= 5000; i++) {

      /*START INITIAL PULSE*********************************************************************** */
      let currModule = moduleList.find((module) => module.type === 'broadcaster');
      let pulse = 'low';
      numLowPulses++;
      currModule.receivers.forEach((r) => {
        numLowPulses++;
        priorityQueue.unshift({
            source: currModule.id,
            destination: r,
            pulse: 'low'
        })
      })
      /*END INITIAL PULSE*********************************************************************** */

      /*PROCESS SUBSEQUENT PULSES*************************************************************** */
      do {
          let nextStep = priorityQueue.pop();
          if(['ll'].includes(nextStep.destination) && nextStep.pulse == 'high' && rxButtonPresses.length < 4) {
            rxButtonPresses.push(i);
            console.log('Button Presses: ', nextStep, i)
          }
          currModule = moduleList.find((module) => module.id === nextStep.destination);
          if(!currModule) continue;
          currModule.updatePulse(nextStep.source, nextStep.pulse);
          switch(currModule.type) {
              case'flip-flop':
                  if(nextStep.pulse === 'high') {
                     continue;
                  }
                  if(currModule.open === true) {
                    pulse = 'low';
                  } else {
                    pulse = 'high';
                  }
                  currModule.open = !currModule.open;
                  break;
              case 'conjunction':
                  if(Object.values(currModule.pulses).filter((p) => p === 'high').length === Object.values(currModule.pulses).length){
                    pulse = 'low';
                  }else {
                    pulse = 'high'
                  }
                  break;
              default:
                break;
          }
          currModule.receivers.forEach((r) => {
            if(pulse === 'high') {
              numHighPulses++
            } else {
              numLowPulses++;
            }
            priorityQueue.unshift({
                source: currModule.id,
                destination: r,
                pulse: pulse
            })
          })
      } while (priorityQueue.length > 0)
      /*END SUBSEQUENT PULSES*************************************************************** */
    }
    let tmp = rxButtonPresses.slice(-4);
    console.log(tmp)
    let gdc = tmp.reduce((acc, curr) => calculateGCD(acc, curr), 0);
    let lcm = 0;
    for(let i = 0; i < tmp.length - 1; i++) {
        lcm = (lcm === 0 ? tmp[i] : lcm) * (tmp[i + 1] / gdc);
    }
    console.log("Result", lcm)
  }

} catch(err) {
  console.error(err);
}
