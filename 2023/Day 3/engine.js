const fs = require('fs');
const path = './input.txt';

class Part {
  constructor(num, startX, endX, y, isPart) {
    this.partNumber = num;
    this.startX = startX;
    this.endX = endX;
    this.y = y;
    this.isEnginePart = isPart;
  };
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

    partsArray.flat().map(function(part) {
      let lineBefore = part.y > 0 ? fileArray[part.y - 1].slice(Math.max(part.startX - 1, 0), Math.min(part.endX + 2, fileArray[part.y - 1].length)) : [];
      let lineCurrent = fileArray[part.y].slice(Math.max(part.startX - 1, 0), Math.min(part.endX + 2, fileArray[part.y].length ));
      let lineAfter =  part.y < fileArray.length - 1  ? fileArray[part.y + 1].slice(Math.max(part.startX - 1, 0), Math.min(part.endX + 2, fileArray[part.y + 1].length)) : []
      let gridToCheck = [lineBefore.concat(lineCurrent).concat(lineAfter)].flat().join('');

      if(gridToCheck.match(new RegExp("[^0-9.]", 'g')) != null) {
        partNumbers.push(part.partNumber);
        part.isEnginePart = true;
      }
      return part;
    })

    console.log("result: ", partNumbers.map(Number).reduce((sum, part) => sum + part, 0));

  }
} catch(err) {
  console.error(err);
}


