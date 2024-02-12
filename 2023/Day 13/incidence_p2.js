const fs = require('fs');

const path = './input.txt';

const patternList = [];

function syncReadFile(filename) {
  let text = fs.readFileSync(filename, "utf-8");
  let textByLine = text.split("\n");
  return textByLine;
}

class Pattern {
    constructor(grid) {
      this.grid = grid;
      this.gridTransposed = [];
      let tmpArr = [];
      for(let i = 0; i < grid[0].length; i++) {
        tmpArr.push(grid.map((e) => e[i]).join(''));
      }
      this.gridTransposed = tmpArr.slice();
      this.mirrorAxis = null;
      this.mirrorPoints = null;
    };
}

function getMatch(grid, idx) {
    let tmpMirrorPoint = 0;
    for(let i = 0; i < grid.length - 1; i++) {
       let g1 = grid.slice(0, i + 1);
       let g2 = grid.slice(i + 1);
       g1 = g1.slice(Math.min(g1.length, g2.length) * -1);
       g2 = g2.slice(0, Math.min(g1.length, g2.length)).reverse();
       g1 = g1.join('');
       g2 = g2.join('');
       let numDiff = 0;
       for (let j = 0; j < JSON.stringify(g1).length; j++) {
         if(JSON.stringify(g1).charCodeAt(j) != JSON.stringify(g2).charCodeAt(j)) {
            numDiff++;
         }
       }
      if(numDiff == 1) {
        tmpMirrorPoint = i + 1;
      }
    }
    if(tmpMirrorPoint > 0) {
      return [tmpMirrorPoint, tmpMirrorPoint + 1];
    }
    return [];
}
try {
  if (fs.existsSync(path)) {

    let fileArray = syncReadFile(path);
    let tmpArr = [];

    fileArray.forEach((element, index) => {
        if(element.trim().length > 0) {
            tmpArr.push(element);
        }
        if(element.trim().length == 0 || index == fileArray.length - 1) {
            patternList.push(new Pattern(tmpArr));
            tmpArr = [];
        }
    })

    patternList.forEach((pattern, index) => {
       let result = getMatch(pattern.grid, index);
       if(result.length > 0) {
          pattern.mirrorAxis = 'x';
          pattern.mirrorPoints = result;
       } else {
          result = getMatch(pattern.gridTransposed, index);
          if(result.length > 0) {
            pattern.mirrorAxis = 'y';
            pattern.mirrorPoints = result;
          }
        }
    });

    result = patternList.reduce(function(accum, curr) {
      if(curr.mirrorAxis == 'x') {
        accum += curr.mirrorPoints[0] * 100;
      } else if(curr.mirrorAxis == 'y') {
        accum += curr.mirrorPoints[0];
      }
      return accum;
    }, 0);

    console.log(result);

  }

} catch(err) {
  console.error(err);
}

//not 27068 (too low)
//not 37376