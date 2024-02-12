const { Console } = require('console');
const { readLine } = require('fs');

const fs = require('fs');
const { isGeneratorFunction } = require('util/types');

  class Tree {
    constructor(key, value = key, mazeLocation={x:0,y:0}) {
      this.root = new TreeNode(key, value, mazeLocation);
    }

    *preOrderTraversal(node = this.root) {
      yield node;
      if (node.children.length) {
        for (let child of node.children) {
          yield* this.preOrderTraversal(child);
        }
      }
    }

    *postOrderTraversal(node = this.root) {
      if (node.children.length) {
        for (let child of node.children) {
          yield* this.postOrderTraversal(child);
        }
      }
      yield node;
    }

    insert(parentNodeKey, key, value = key, mazeLocation, endLeaf) {
      for (let node of this.preOrderTraversal()) {
        if (node.key === parentNodeKey) {
          node.children.push(new TreeNode(key, value, mazeLocation, endLeaf, node));
          return true;
        }
      }
      return false;
    }

    remove(key) {
      for (let node of this.preOrderTraversal()) {
        const filtered = node.children.filter(c => c.key !== key);
        if (filtered.length !== node.children.length) {
          node.children = filtered;
          return true;
        }
      }
      return false;
    }

    find(key) {
      for (let node of this.preOrderTraversal()) {
        if (node.key === key) return node;
      }
      return undefined;
    }
  }

  class TreeNode {
    constructor(key, value = key, mazeLocation = {}, endLeaf = false, parent = null) {
      this.key = key;
      this.value = value;
      this.mazeLocation = mazeLocation;
      this.parent = parent;
      this.children = [];
      this.endLeaf = false;
    }

    get isLeaf() {
      return this.children.length === 0;
    }

    get hasChildren() {
      return !this.isLeaf;
    }
  }

  function syncReadFile(filename) {
    const text = fs.readFileSync(filename, "utf-8");
    const textMatrix = text.split("\n").map(x => x.replace("S", "a").replace("E", "z").split(""));
    return textMatrix.map(y => y.map(x => {
        //convert alphabet to numeric
        return x.charCodeAt(0) - 96;
    }))
}


//   const tree = new Tree(1, 'AB');

//   tree.insert(1, 11, 'AC');
//   tree.insert(1, 12, 'BC');
//   tree.insert(12, 121, 'BG');

//   [...tree.preOrderTraversal()].map(x => x.value);
//   // ['AB', 'AC', 'BC', 'BCG']

//   tree.root.value;              // 'AB'
//   tree.root.hasChildren;        // true

//   tree.find(12).isLeaf;         // false
//   tree.find(121).isLeaf;        // true
//   tree.find(121).parent.value;  // 'BC'

//   tree.remove(12);

//   const a = [...tree.postOrderTraversal()].map(x => x.key);
  // ['AC', 'AB']
 // console.log(a)

const path = './test_input.txt'
//const path = './input.txt'
const START_NODE = [0][0];
const END_NODE =  {x: 3, y: 5};
const currRow = [];
const newRow = [];

  try {
    if (fs.existsSync(path)) {
      const maze = syncReadFile(path);
      console.log(maze)
      const tree = new Tree(1, 'S');
      console.log(maze[0][0])
      if(maze[0][0] >= maze[0][1]  || Math.abs(maze[0][0] - maze[0][1]) < 1) {
        //add child
        tree.insert(1, 11, maze[0][1], {x: 0, y: 1});
        currRow.push(11);
      }
      if(maze[0][0] >= maze[1][0]  || Math.abs(maze[0][0] - maze[1][0]) < 1) {
        //add child
        tree.insert(1, 12, maze[1][0], {x: 0, y: 1});
        currRow.push(12);
      }
      let emergStop = 0;
      while(currRow.length > 0 && emergStop < 20) {
        emergStop++;
       // console.log("currRow", currRow)
        currRow.forEach(node => {
            let curr = tree.find(node);
            let children = 0;
            let breakFlag = false;
            let parent = tree.find(node).parent;

            // while(parent !== tree.root && breakFlag === false) {
            //   if((curr.mazeLocation.x === parent.mazeLocation.x) && (curr.mazeLocation.y === parent.mazeLocation.y)) {
            //     breakFlag === true
            //   }
            //   parent = parent.parent;
            // }

            for(let i = -1; i <= 1; i+=2) {
                //NEED TO FILTER OUT DUPLICATES (DON'T VISIT SAME PLACE TWICE) - check mazeloacations of all in tree branch
                //const visitedNodes = [...tree.postOrderTraversal()].map(x => x.mazeLocation);
                if(maze.length >= curr.mazeLocation.x + i && curr.mazeLocation.x + i >= 0) {
                  if(curr.value >= maze[curr.mazeLocation.x + i][curr.mazeLocation.y]  || Math.abs(curr.value - maze[curr.mazeLocation.x + i][curr.mazeLocation.y]) < 1) {
                    breakFlag = false;
                    while(parent !== tree.root && breakFlag === false) {
                         if((curr.mazeLocation.x === parent.mazeLocation.x) && (curr.mazeLocation.y === parent.mazeLocation.y)) {
                           breakFlag === true
                         }
                         parent = parent.parent;
                    }
                    if(!breakFlag) {
                      children ++;
                      let newKey = (Math.ceil(curr.key / 10) * 10) + children
                      newRow.push(newKey)
                      curr.mazeLocation.x + i === END_NODE.x && curr.mazeLocation.y === END_NODE.y ?
                        tree.insert(curr.key, newKey, maze[curr.mazeLocation.x + i][curr.mazeLocation.y], {x: curr.mazeLocation.x + i, y: curr.mazeLocation.y}, true) :
                        tree.insert(curr.key, newKey, maze[curr.mazeLocation.x + i][curr.mazeLocation.y], {x: curr.mazeLocation.x + i, y: curr.mazeLocation.y});
                    }
                  }  
                }
            }
            
              for(let i = -1; i <= 1; i+=2) {
                if(maze.length >= curr.mazeLocation.y + i && curr.mazeLocation.y + i >= 0) {
                    if(curr.value >= maze[curr.mazeLocation.x][curr.mazeLocation.y + i]  || Math.abs(curr.value - maze[curr.mazeLocation.x][curr.mazeLocation.y + i]) < 1) {
                      breakFlag = false;
                      while(parent !== tree.root && breakFlag === false) {
                        if((curr.mazeLocation.x === parent.mazeLocation.x) && (curr.mazeLocation.y === parent.mazeLocation.y)) {
                          breakFlag === true
                        }
                        parent = parent.parent;
                   }
                   if(!breakFlag) {
                        children ++;
                        let newKey = (Math.ceil(curr.key / 10) * 10) + children
                        newRow.push(newKey)
                        tree.insert(curr.key, newKey, maze[curr.mazeLocation.x][curr.mazeLocation.y + i], {x: curr.mazeLocation.x, y: curr.mazeLocation.y + i});
                        curr.mazeLocation.x == END_NODE.x && curr.mazeLocation.y === END_NODE.y ?
                            tree.insert(curr.key, newKey, maze[curr.mazeLocation.x][curr.mazeLocation.y + i], {x: curr.mazeLocation.x, y: curr.mazeLocation.y + i}, true) :
                            tree.insert(curr.key, newKey, maze[curr.mazeLocation.x][curr.mazeLocation.y + i], {x: curr.mazeLocation.x, y: curr.mazeLocation.y + i});
                   }        
                    }
                }
            }
          
        })
       
        currRow.length = 0;
      //  console.log("New", newRow)
        currRow.push(...newRow);
        newRow.length = 0;
     //   console.log(emergStop)
      }  
    //    for(let x = 0; x < maze.length; x++) {
    //      for(let y = 0; y < maze[x].length; y++) {
    //         //compare node with all around it and create child if it can move that way
    //         for(i = -1; i < 1; i++) {
    //             for(j = -1; j < 1; j++) {

    //             }
    //         }
    //      }
    //    }
    const a = [...tree.postOrderTraversal()].map(x => x.key);
    const b = [...tree.preOrderTraversal()].map(x => x.value);
      console.log(a, b)
    }
  } catch(err) {
    console.error(err);
  }
  
