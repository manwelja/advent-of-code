const { Console } = require('console');
const { readLine } = require('fs');

const fs = require('fs');
const { isGeneratorFunction } = require('util/types');

const path = './test_input.txt'
//const path = './input.txt'

const BORED_DIV = 1;
const NUM_DIR_IN_SET = 7;
const NUM_ROUNDS = 20;

//Globals
const monkeys = {
};

function syncReadFile(filename) {
    var text = fs.readFileSync(filename, "utf-8");
    return text.replace(/[,:]+/g,"").split("\n").map(x => x.trim().replace(",", "").split(" "));
}

function initializeMonkeys(dirs) {
  let currMonkey = 0;
  dirs.forEach((step) => {
    switch(step[0].toLowerCase()) {
      case  "monkey":
        currMonkey = step[1];
        monkeys[currMonkey] = {};
        monkeys[currMonkey].inspections = 0;
        break;
      case "starting":
        monkeys[currMonkey].stack = step.slice(2).map(Number);
        break;
      case "operation":
        monkeys[currMonkey].operation = step.slice(-3);
        break;
      case "test":
        monkeys[currMonkey].testDiv = step.slice(-1).join();
        break;
      case "if":
        if(step[1].toLowerCase() === "true") { monkeys[currMonkey].passPass = step.slice(-1).join() };
        if(step[1].toLowerCase() === "false") { monkeys[currMonkey].failPass = step.slice(-1).join() };
        break;
      default:
        break;
    }
  })
}

try {
  if (fs.existsSync(path)) {
    const directions = syncReadFile(path);
    let currMonkey = null;
    let newWorryLevel = 0;
    let currDirections = [];
    let offset = 0;
    initializeMonkeys(directions);
let calc = null;
    let round = 1
    do {
      //if we get to the end of the directions, start a new round
      if(offset > directions.length) {
        round++;
        offset = 0;
      }

      if(round > NUM_ROUNDS) { break; }

      //get the current set of directions (don't iterate to the next set until the current monkey's stack is 0)
      if(currMonkey === null) {
        currDirections = directions.slice(offset, NUM_DIR_IN_SET + offset);
        offset += NUM_DIR_IN_SET;
      }

      for(let j = 0; j < currDirections.length; j++){
        step = currDirections[j];
        switch(step[0].toLowerCase()) {
          case "monkey":
            currMonkey = step[1];
            break;
          case "starting":
            //if there aren't any items in the stack, jump to the end of the directions
            if(monkeys[currMonkey].stack.length === 0) { j = currDirections.length; }
            break;
          case "operation":
            //calcuate new worry level
            let newOp = monkeys[currMonkey].operation.map(x => x === "old" ? monkeys[currMonkey].stack[0] : x);
            newWorryLevel = eval(newOp.join(""));//Math.floor(eval(newOp.join("")) / BORED_DIV);
            //  newWorryLevel = Math.floor(eval(newOp.join("")) / BORED_DIV);
            break;
          case "test":
            //Remove first element of current monkeys stack
            monkeys[currMonkey].stack.shift();
            monkeys[currMonkey].inspections++;

            //check divisibility and add element (with new worry level) to recipient monkey's stack
             newWorryLevel % step.slice(-1) ? //9699690 ? //96577
              monkeys[monkeys[currMonkey].passPass].stack.push(newWorryLevel) :
              monkeys[monkeys[currMonkey].failPass].stack.push(newWorryLevel);
            break;
          default:
            break;
        }
      }
      //if the current monkeys stack is empty, it's time to move on...
      if(currMonkey) {
        if(monkeys[currMonkey].stack.length === 0)  {currMonkey = null;};
      }
    }while(round <= NUM_ROUNDS);
  }
  const numInspections = [];
  Object.keys(monkeys).forEach(monkey => { numInspections.push(monkeys[monkey].inspections)});
  const sortedInspections = numInspections.sort(function(a, b) { return b - a; });
  //console.log(monkeys)
  console.log("Answer: ", sortedInspections, sortedInspections[0] * sortedInspections[1]);

} catch(err) {
  console.error(err);
}



