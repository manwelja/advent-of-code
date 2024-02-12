const fs = require('fs');
const { start } = require('repl');

const path = './input.txt';

const nodeList = [];
const MAX_STEPS = 3;

function syncReadFile(filename) {
  let text = fs.readFileSync(filename, "utf-8");
  let textByLine = text.split("\n");
  return textByLine;
}

class Node {
    constructor(yIndex, xIndex, heatLoss, startNode = false, endNode = false) {
        this.id = yIndex + '_' + xIndex;
        this.yIndex = yIndex;
        this.xIndex = xIndex;
        this.heatLoss = heatLoss;
        this.startNode = startNode;
        this.visited = false;
        this.endNode = endNode;
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

    addEdge(node1, d1, node2, d2, n1HeatLoss, n2HeatLoss) {
        // this.nodesNNeighbors[node1].push({nodeID: node2, direction: d2, heatLoss: n2HeatLoss});
        // this.nodesNNeighbors[node2].push({nodeID: node1, direction: d1, heatLoss: n1HeatLoss});
        if(!this.nodesNNeighbors[node1].find((n) => n.id === node2)) {
            this.nodesNNeighbors[node1].push({nodeID: node2, direction: d2, heatLoss: n2HeatLoss});
        }
        if(!this.nodesNNeighbors[node2].find((n) => n.id === node1)) {
            this.nodesNNeighbors[node2].push({nodeID: node1, direction: d1, heatLoss: n1HeatLoss});
        }
    }

    findPath(startNode, endNode) {
        let losses = {};
        let backTrace = {};
        let queue = new Queue();
        losses[startNode.id] = 0;

        this.nodes.forEach((node) => {
            if(startNode.id !== node) {
                losses[node] = Infinity;
            }
        })
        //change to class and add in path/direction
        queue.addElement({id: startNode.id, path: [{id: startNode.id, direction: 'N/A'}], heatLoss: startNode.heatLoss});

        while(!queue.isEmpty()) {
            let currentNode = queue.getFirst();
            currentNode.visited = true;
            let restrictedDirection = currentNode.path.slice(-3).map((item) => item.direction);
            if(restrictedDirection.length < 3) {
                restrictedDirection = [];
            } else {
                restrictedDirection = [...new Set(restrictedDirection)];
            }

            this.nodesNNeighbors[currentNode.id].forEach((neighbor) => {
                if(restrictedDirection.length === 1 && opposites[neighbor.direction] === restrictedDirection[0]) {
                    return;
                }
                let loss = losses[currentNode.id] + neighbor.heatLoss;
                if(loss < losses[neighbor.nodeID] && !queue.collection.find((n) => n.id === neighbor.id)) {
                    losses[neighbor.nodeID] = loss;
                    backTrace[neighbor.nodeID] = currentNode.id;
                    let path = currentNode.path.concat({id: neighbor.nodeID, direction: opposites[neighbor.direction]});
                    queue.addElement({id: neighbor.nodeID, path: path, heatLoss: loss});
                }
            })
        }

        if(Object.keys(backTrace).length === 0) return [0, 0];

        let path = [endNode.id];
        let lastStep = endNode.id;

        while(lastStep !== startNode.id) {
            path.unshift(backTrace[lastStep]);
            lastStep = backTrace[lastStep];
        }

        return [path, losses[endNode.id]];
    }
}

class Queue {
    constructor() {
        this.collection = [];
    }

    addElement(element) {
        if(this.isEmpty()) {
            this.collection.push(element);
            return;
        }
        let elementAdded = false;
        for(let i = 1; i <= this.collection.length; i++) {
            if (element[1] < this.collection[i-1][1]) {
                this.collection.splice(i-1, 0, element);
                elementAdded = true;
                break;
            }
        }
        if(!elementAdded) {
            this.collection.push(element);
        }
    }

    getFirst() {
        return this.collection.shift();
    }

    isEmpty() {
        return (this.collection.length === 0);
    }
}
const neighbors = {
    'U': [-1, 0],
    'D': [1, 0],
    'L': [0, -1],
    'R': [0, 1]
}

const opposites = {
    'U': 'D',
    'D': 'U',
    'L': 'R',
    'R': 'L'
}
try {
  if (fs.existsSync(path)) {

    let fileArray = syncReadFile(path);
    let tmpArr = [];

    fileArray.forEach((element, yIndex) => {
        tmpArr = element.split('');
        tmpArr.forEach((heatLoss, xIndex) => {
            nodeList.push(new Node(yIndex, xIndex, parseInt(heatLoss)));
        })
    })

    nodeList[0].startNode = true;
    nodeList[nodeList.length - 1].endNode = true;

    let gridMap = new Grid();
    nodeList.forEach((node) => {
        gridMap.addNode(node.id);
    })

    nodeList.forEach((node) => {
        //get only valid neighbors
        ['L', 'D', 'R', 'U'].forEach((direction) => {
            let neighborNodeID = (node.yIndex - neighbors[direction][0]) + '_' + (node.xIndex - neighbors[direction][1]);
            let neighborNode = nodeList.find((item) => item.id == neighborNodeID);
            if(neighborNode != undefined) {
                gridMap.addEdge(node.id, opposites[direction], neighborNodeID, direction, node.heatLoss, neighborNode.heatLoss);
            }
        })
    })

    //find paths
    startNode = nodeList.find((n) => n.startNode === true);
    endNode = nodeList.find((n) => n.endNode === true);
    result = gridMap.findPath(startNode, endNode);

    console.log(result[0], result[1]);
}

} catch(err) {
  console.error(err);
}

//not 724
//NOT 719 TOO HIGH