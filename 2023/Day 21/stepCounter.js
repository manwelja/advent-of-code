const fs = require('fs');
const { start } = require('repl');

const path = './input.txt';

let nodeList = [];
const resultList = [];
const MAX_STEPS = 64;

function syncReadFile(filename) {
  let text = fs.readFileSync(filename, "utf-8");
  let textByLine = text.split("\n");
  return textByLine;
}

class Node {
    constructor(yIndex, xIndex, type, startNode = false) {
        this.id = yIndex + '_' + xIndex;
        this.yIndex = yIndex;
        this.xIndex = xIndex;
        this.type = type;
        this.visited = false;
        this.startNode = startNode;
    };
}

class Grid {
    constructor() {
        this.nodes = [];
        this.nodesNNeighbors = {};
    }

    addNode(node) {
        this.nodes.push(node);
        this.nodesNNeighbors[node] = [];
    }

    addEdge(node1, node2) {
        this.nodesNNeighbors[node1].push({id: node2});
        this.nodesNNeighbors[node2].push({id: node1});
    }

    findPath(startNode) {
        let queue = new Queue();
        let stepCount = 0;
        queue.addElement({id: startNode.id, path: [startNode.id], steps: stepCount});

        while(!queue.isEmpty() && stepCount <= MAX_STEPS + 1) {
            let dequeued = queue.getFirst();
            let current = nodeList.find((n) => n.id === dequeued.id);
            if(!current) {
                continue;
            }
            current.visited = true;
            if(dequeued.path.length - 1 === MAX_STEPS) {
                resultList.push({id: current.id, path: dequeued.path, steps: dequeued.path.length - 1})
            }

            this.nodesNNeighbors[current.id].forEach((neighbor) => {
                let neighborNode = nodeList.find((n) => n.id === neighbor.id);

                if(neighborNode.type === 'garden' && !queue.collection.find((n) => n.id === neighbor.id)) {
                    let path = dequeued.path.concat(neighbor.id);
                    queue.addElement({id: neighbor.id, path: path, steps: dequeued.path.length - 1});
                }
            })
            stepCount = dequeued.path.length;
        }
        console.log('rl', resultList)

        const nodesInReach = [];
        resultList.forEach((n) => {
            n.path.forEach((p, idx) => {
                if(idx % 2 === 0) {
                    nodesInReach.push(p);
                }
            })
        })
    // nodeList = nodesInReach;
        const uniqueIDs = [...new Set(nodesInReach)];
        return uniqueIDs;
    }
}

class Queue {
    constructor() {
        this.collection = [];
    }

    addElement(element) {
        this.collection.push(element);
    }

    getFirst() {
        return this.collection.shift();
    }

    isEmpty() {
        return (this.collection.length === 0);
    }
}
const neighbors = {
    U: [-1, 0],
    D: [1, 0],
    L: [0, -1],
    R: [0, 1]
}

const opposites = {
    U: 'D',
    D: 'U',
    L: 'R',
    R: 'L'
}
const nodeTypes = {
    '.': 'garden',
    '#': 'rock',
    'S': 'garden'
}
try {
  if (fs.existsSync(path)) {

    let fileArray = syncReadFile(path);
    let tmpArr = [];
    let startNode = null;

    fileArray.forEach((element, yIndex) => {
        tmpArr = element.split('');
        tmpArr.forEach((nodeVal, xIndex) => {
            let sNode = nodeVal === 'S' ? true: false
            nodeList.push(new Node(yIndex, xIndex, nodeTypes[nodeVal], sNode));
        })
    })

    startNode = nodeList.find((n) => n.startNode === true);
    let gridMap = new Grid();

    nodeList.forEach((node) => {
        gridMap.addNode(node.id);
    })

    nodeList.forEach((node) => {
        //get only valid neighbors
        ['L', 'D', 'R', 'U'].forEach((direction) => {
            let neighborid = (node.yIndex - neighbors[direction][0]) + '_' + (node.xIndex - neighbors[direction][1]);
            let neighborNode = nodeList.find((item) => item.id === neighborid);
            if(neighborNode !== undefined && neighborNode.type !== 'rock') {
                gridMap.addEdge(node.id, neighborid);
            }
        })
    })

    result = gridMap.findPath(startNode);
    console.log(result)
    console.log(result.length);
}

} catch(err) {
  console.error(err);
}

