const { Console } = require('console');
const { readLine } = require('fs');

const fs = require('fs');

const fpath = './test_input.txt'
//const fpath = './input.txt'

function syncReadFile(filename) {
    const text = fs.readFileSync(filename, "utf-8");
    const regexValve = /([A-Z]){2}/g;
    const regexNum = /\d/g
    return text.split("\n").map((line, index) => {
        const valves = line.match(regexValve);
        const flowRate = line.match(regexNum);
        return {
            name: valves[0],
            flowRate: parseInt(flowRate.join("")),
            branches: valves.slice(1)
        }
     });
}

const distanceMap = (startName, distances = {}) => {
    if (nodeByName[startName].distanceMap) return nodeByName[startName].distanceMap;
    const spread = (name, steps) => {
        if (distances[name] != undefined && distances[name] <= steps) return;
        distances[name] = steps;
        nodeByName[name].branches.forEach(n => spread(n, steps+1));
    }
    spread(startName, 0);
    nodeByName[startName].distanceMap = distances;
    return distances;
}

const computePaths = (timeLeft, nodeByName) => {
    console.log('compute paths for time', timeLeft)
    let paths = [{curr: 'AA', active: nodeByName, timeLeft: timeLeft, finished: false, steps: [], releasedPressure: 0}]
//create paths object

//loop through paths
//grab path at current index
//check if time left

//calculate distances (recursive function)
//loop through all nodes with flowrate 
  //if we're in one of them exit
  //path.timeLeft-distances[act] <= 1) exit
  //else move on
  //add current active node to path
  //if (!moved) path.finished = true;
  //      if (path.finished && path.releasedPressure > max) max = path.releasedPressure;
  //  }

   // return paths.filter(p => p.finished).sort((a, b) => b.releasedPressure-a.releasedPressure)
  //  let max = 0;
    
    for (let n = 0; n < paths.length; n++) {
        let path = paths[n];
        if (path.timeLeft <= 0) path.finished = true;
        if (path.finished) continue;
console.log(path.active)
        let distances = distanceMap(path.curr), moved = false;
        for(act in path.active) {
            if (act == path.curr) return true;
            if (path.timeLeft-distances[act] <= 1) return true;
            moved = true;
            paths.push({
                curr: act,
                active: path.active.filter(v => v != act),
                timeLeft: path.timeLeft-distances[act]-1,
                finished: false,
                steps: [...path.steps, act],
                releasedPressure: path.releasedPressure + (path.timeLeft-distances[act]-1)*nodeByName[act]["flowRate"]
            })
        }
        if (!moved) path.finished = true;
        if (path.finished && path.releasedPressure > max) max = path.releasedPressure;
    }

    return paths.filter(p => p.finished).sort((a, b) => b.releasedPressure-a.releasedPressure);
}


// const part2 = () => {
//     let paths = computePaths(26), max = 0;

//     // this needs some memoization / speed-up / rethinking. Runs approx for 2 minutes ;/
//     for (let i = 0; i < paths.length; i++)
//         for (let j = i+1; j < paths.length; j++)
//             if (paths[i].steps.every(s => !paths[j].steps.includes(s)))
//                 if (paths[i].releasedPressure+paths[j].releasedPressure > max) {
//                     console.log('we have a new p2 max', paths[i].releasedPressure+paths[j].releasedPressure );
//                     max = paths[i].releasedPressure+paths[j].releasedPressure;
//                  }
//  }
const nodes = syncReadFile(fpath);
const targetNodes = nodes.filter(x => x.flowRate > 0);
let nodeByName = {};

nodes.map((n, i) => nodeByName[n.name] = n);
console.log("BY NAME", nodeByName)
console.log(targetNodes)
console.log(computePaths(30, nodeByName)[0]) // p1
// part2();