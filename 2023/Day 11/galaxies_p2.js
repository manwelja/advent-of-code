const fs = require('fs');

const path = './input.txt';

const galaxyList = [];
const galaxyMultiplier = 999999;

function syncReadFile(filename) {
  let text = fs.readFileSync(filename, "utf-8");
  let textByLine = text.split("\n");
  return textByLine;
}

class GalaxyItem {
    constructor(xCoord, yCoord) {
      this.xCoord = xCoord;
      this.yCoord = yCoord;
    };
}
class GalaxyPairItem {
    constructor(galaxy1, galaxy2, numSteps = 0) {
      this.galaxy1 = galaxy1;
      this.galaxy2 = galaxy2;
      this.numSteps = numSteps;
    };
}

try {
  if (fs.existsSync(path)) {

    let fileArray = syncReadFile(path);
    let emptyRows = [];
    let emptyCols = [];
    const galaxyCoordinates = [];

    fileArray.forEach((yElement, yIndex) => {
        if(!yElement.includes('#')) {
            emptyRows.push(yIndex);
        }
    })
    for(x = 0; x < fileArray[0].length; x++) {
        if(!fileArray.map((value) => value[x]).includes('#')) {
            emptyCols.push(x);
        }
    }

    fileArray.forEach((yElement, yIndex) => {
        yElement.split('').forEach((xElement, xIndex) => {
            if(xElement === '#') {
                galaxyCoordinates.push([
                    (yIndex + (emptyRows.filter((element) => element < yIndex).length * galaxyMultiplier)),
                    (xIndex + (emptyCols.filter((element) => element < xIndex).length * galaxyMultiplier))
                ]);
                galaxyList.push(new GalaxyItem(
                    ((yIndex + emptyRows.filter((element) => element < yIndex).length * galaxyMultiplier)),
                    ((xIndex + emptyCols.filter((element) => element < xIndex).length * galaxyMultiplier))
                ))
            }
        })
    })

   const galaxyPairList = galaxyList.flatMap((g1, index) =>
            galaxyList.slice(index + 1).flatMap((g2) => new GalaxyPairItem(g1, g2)));

    galaxyPairList.forEach((item) => item.numSteps = (Math.abs(item.galaxy1.xCoord - item.galaxy2.xCoord) + Math.abs(item.galaxy1.yCoord - item.galaxy2.yCoord)));
    console.log('result: ',galaxyPairList.reduce((acc, curr) => acc + curr.numSteps, 0));
  }

} catch(err) {
  console.error(err);
}
