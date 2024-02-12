const fs = require('fs');

const path = './input.txt';
let partList = [];
const gridList = [];

function syncReadFile(filename) {
  let text = fs.readFileSync(filename, "utf-8");
  let textByLine = text.split("\n");
  return textByLine;
}

class Part {
    constructor(index, value) {
      this.index = index;
      this.value = value;
      this.gridRepresentation = '(' + '(\\?|#)'.repeat(value) + ')';
      this.indexesFound = [];
    };
}

try {
  if (fs.existsSync(path)) {

    let fileArray = syncReadFile(path);

    fileArray.forEach((element, index) => {
      let grid = [];
      let sizes = [];

      grid = element.split(' ')[0];
      sizes = element.split(' ')[1].split(',').map(Number);
      gridList.push(grid);
      sizes.forEach((size, sIndex) => {
        p = new Part([index, sIndex], size,);
        partList.push(p);
      })
      partList.flat();
     })

     let numMatches = 0;
     gridList.forEach((gLine, gLineIndex) => {
        gLine = gLine.split('');
        let parts = partList.filter((p) => p.index[0] == gLineIndex);

        parts.forEach((p, index) => {
            let partsBefore = parts.reduce((acc, curr, tmpIndex) => tmpIndex < index ? curr.value + acc : acc, 0);
            let partsAfter = parts.reduce((acc, curr, tmpIndex) => tmpIndex > index ? curr.value + acc : acc, 0);
            let indexes = [];
            tmpGLine = gLine.join('');
            //regPattern = new RegExp('(?=(' + p.gridRepresentation + '[^#]))', 'g');
            regPattern = new RegExp('(?=(' + p.gridRepresentation + '))', 'g');
            let matches = Array.from(tmpGLine.matchAll(regPattern));
            matches.forEach((match) => {
              if(match.index <= (tmpGLine.length - partsAfter - p.value) && match.index >= partsBefore) {
                indexes.push(match.index);
              }
            })
            p.indexesFound = indexes;
        })

        let indexArray = parts.map((element) => element.indexesFound);
           let result = indexArray.reduce((a, b) => a.reduce((r, v) => r.concat(b.map(w => [].concat(v, w))), []));

        //filter array
        let filtered = result.filter((element, index) => {
          //each element needs to be at least 2 indexes higher than the previous
          let spacingOk = true;
          for(let i = 0; i < element.length - 1; i ++) {
            if(element[i + 1] - element[i] <= parts[i].value) {
              spacingOk = false;
            }
          }
          let numElementsOk = true;
          if(spacingOk) {
            let tmpGLine = gLine.slice();
              element.forEach((item, index) => {
              tmpGLine.splice(item, parts[index].value, '#'.repeat(parts[index].value));
              tmpGLine = tmpGLine.join('').split('');
            })
            if(tmpGLine.filter((i) => i == '#').length > parts.reduce((acc, curr) => curr.value + acc, 0)) {
              numElementsOk = false;
            }
          }

          return spacingOk && numElementsOk;
        })
        numMatches += filtered.length;
        console.log('matches',filtered.length)
      })
      console.log('Result: ', numMatches)
  }

} catch(err) {
  console.error(err);
}

//not 481 - too low