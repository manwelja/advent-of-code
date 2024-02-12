const { Console } = require('console');
const { readLine } = require('fs');

const fs = require('fs');
const input = './test_input.txt'

function syncReadFile(filename) {
    const text = fs.readFileSync(filename, "utf-8");
    const regexValve = /([A-Z]){2}/g;
    const regexNum = /\d/g
    return text.split("\n").map((line, index) => {
        const valves = line.match(regexValve);
        const flowRate = line.match(regexNum);
        return {
            
            id: index,
            name: valves[0],
            rate: parseInt(flowRate.join("")),
            connections: valves.slice(1)
        }
     });
}

let nodes = syncReadFile(input);
let nodeByName = {};
nodes.map((n, i) => nodeByName[n.name] = n);
const activeNodes = () => nodes.filter(n => n.rate > 0)

//recursively map out all the different path possibilities
const distanceMap = (startName, distances = {}) => {
    if (nodeByName[startName].distanceMap) return nodeByName[startName].distanceMap;
    const spread = (name, steps) => {
        if (distances[name] != undefined && distances[name] <= steps) return;
        distances[name] = steps;
        nodeByName[name].connections.forEach(n => spread(n, steps+1));
    }
    spread(startName, 0);
    nodeByName[startName].distanceMap = distances;
    console.log(distances)
    return distances;
}

const computePaths = timeLeft => {
    console.log('compute paths for time', timeLeft)
    let paths = [{curr: 'AA', active: activeNodes().map(n => n.name), timeLeft: timeLeft, finished: false, steps: [], releasedPressure: 0}]

    let max = 0;

    for (let n = 0; n < paths.length; n++) {
        let path = paths[n];
        if (path.timeLeft <= 0) path.finished = true;
        if (path.finished) continue;

        let distances = distanceMap(path.curr), moved = false;
        path.active.forEach(act => {
            if (act == path.curr) return true;
            if (path.timeLeft-distances[act] <= 1) return true;
            moved = true;
            paths.push({
                curr: act,
                active: path.active.filter(v => v != act),
                timeLeft: path.timeLeft-distances[act]-1,
                finished: false,
                steps: [...path.steps, act],
                releasedPressure: path.releasedPressure + (path.timeLeft-distances[act]-1)*nodeByName[act].rate
            })
            console.log(paths)
        })
        if (!moved) path.finished = true;
        if (path.finished && path.releasedPressure > max) max = path.releasedPressure;
    }

    return paths.filter(p => p.finished).sort((a, b) => b.releasedPressure-a.releasedPressure);
}

const part2 = () => {
    let paths = computePaths(26), max = 0;

    // this needs some memoization / speed-up / rethinking. Runs approx for 2 minutes ;/
    for (let i = 0; i < paths.length; i++)
        for (let j = i+1; j < paths.length; j++)
            if (paths[i].steps.every(s => !paths[j].steps.includes(s)))
                if (paths[i].releasedPressure+paths[j].releasedPressure > max
                    ) {
                    console.log('we have a new p2 max', paths[i].releasedPressure+paths[j].releasedPressure );
                    max = paths[i].releasedPressure+paths[j].releasedPressure;
                }
}

console.log(computePaths(30)[0].releasedPressure); // p1
//console.log(computePaths(30))
part2();