const fs = require('fs');

const path = './input.txt';

const moduleList = [];
const priorityQueue = [];
let numLowPulses = 0;
let numHighPulses = 0;

function syncReadFile(filename) {
  let text = fs.readFileSync(filename, "utf-8");
  let textByLine = text.split("\n");
  return textByLine;
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

let moduleTypes = {
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

    for(i = 0; i < 1000; i++) {

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
   console.log("Result", numHighPulses * numLowPulses)
  }

} catch(err) {
  console.error(err);
}

//not 27068 (too low)