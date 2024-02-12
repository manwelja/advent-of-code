const { readLine } = require('fs');

const fs = require('fs');
const util = require('util');

const path = './input.txt';


class Part {
  constructor(num, startX, endX, y, isPart) {
    this.partNumber = num;
    this.startX = startX;
    this.endX = endX;
    this.y = y;
    this.isEnginePart = isPart;
    this.isGear = false;
    this.gearIndex = [];
  };

  addGearIndex(gearIndex) {
      this._gearIndex.push(gearIndex);
  }
}

function syncReadFile(filename) {
    let text = fs.readFileSync(filename, "utf-8");
    let textByLine = text.split("\n");
    return textByLine;
}

try {
  if (fs.existsSync(path)) {
    let fileArray = syncReadFile(path);

    let regExMatch = new RegExp("[0-9]+", 'g');
    let partsArray = [];
    partsArray = fileArray.map(function(value, key) {
        let result;
        let parts = [];

        while ((result = regExMatch.exec(value)) != null) {
          startX = result.index;
          endX = startX + result[0].length - 1;
          parts.push(new Part(result[0], startX, endX, key, false));
        }
        return parts;
    })
    let partNumbers = [];

    asteriskArray = fileArray.map(function(value, key) {
      let gearArray = [];
      let regExMatch = new RegExp("[\*]", 'g');
      while ((result = regExMatch.exec(value)) != null) {
        gearIndex = [result.index, key];
        gearArray.push(gearIndex);
      }
      return gearArray
    })

    partsArray.flat().map(function(part) {
      let lineBefore = part.y > 0 ? fileArray[part.y - 1].slice(Math.max(part.startX - 1, 0), Math.min(part.endX + 2, fileArray[part.y - 1].length)) : [];
      let lineCurrent = fileArray[part.y].slice(Math.max(part.startX - 1, 0), Math.min(part.endX + 2, fileArray[part.y].length ));
      let lineAfter =  part.y < fileArray.length - 1  ? fileArray[part.y + 1].slice(Math.max(part.startX - 1, 0), Math.min(part.endX + 2, fileArray[part.y + 1].length)) : []
      let gridToCheck = [lineBefore.concat(lineCurrent).concat(lineAfter)].flat().join('');

      if(gridToCheck.match(new RegExp("[^0-9.]", 'g')) != null) {
        partNumbers.push(part.partNumber);
        part.isEnginePart = true;
        if((index = gridToCheck.indexOf('\*')) >= 0) {
          part.isGear = true;
        }
      }
      return part;
    })

    let gears = partsArray.flat().filter((part) => part.isGear == true);
    let uniqueAsterisk = [...new Set(asteriskArray)].flat();

    gearsWithIndexes = gears.map((part) => {
      part.gearIndex = uniqueAsterisk.filter((gear) =>
        gear[0] >= Math.max(part.startX - 1, 0) &&
        gear[0] <= Math.min(part.endX + 1, fileArray[0].length) &&
        gear[1] >= Math.max(part.y - 1, 0) &&
        gear[1] <= Math.min(part.y + 1, fileArray.length)
      );
      return part;
  })

  let gearProduct = 0;
  uniqueAsterisk.map((entry) => {
    if ((gearParts = gears.filter((part) => part.gearIndex.indexOf(entry) >= 0)) && gearParts.length == 2) {
      gearProduct += gearParts.reduce((sum, part) => sum * parseInt(part.partNumber), 1);
    }
   })
  console.log("result: ", gearProduct)

}
} catch(err) {
  console.error(err);
}

