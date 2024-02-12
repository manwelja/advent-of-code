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
      this.gridRepresentation = '[\\?#]'.repeat(value) + '[^#]';
      this.indexesFound = [];
    };
}
//(?=([\?|#][\?|#][\?|#]))(?=([\?|#][\?|#]))(?=([\?|#]))

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
     let parts = partList.filter((p) => p.index[0] == gLineIndex);

    let regPattern = '';
    parts.forEach((p, index) => {
      console.log(p)
    //  regPattern = regPattern + p.gridRepresentation;
      if(index < parts.length - 1) {
        regPattern += '(?=(' + p.gridRepresentation + '.+))';
      } else {
        regPattern += '(?=(' + p.gridRepresentation + '*))';
      }
    })
    regPattern = '(?=(' + regPattern + '))';
      regPattern = new RegExp(regPattern, 'g');
      let matches = Array.from(gLine.matchAll(regPattern));
      console.log(matches.length)
      console.log(regPattern)
      matches.forEach((match) => {
     //   console.log(match, match[1]);
        numMatches++;
     })

      })
      console.log('Result: ', numMatches)
  }

} catch(err) {
  console.error(err);
}

//not 481 - too low


/*
(?=((\?|#)(\?|#)(\?|#))(\.|\?|#))+(?=((\?|#)(\?|#)))(\.|\?|#)+(?=(\?|#))

(?=(?=((\?|#)(\?|#)(\?|#))(\.|\?|#))+(?=((\?|#)(\?|#)))(\.|\?|#)+(?=(\?|#)))

(?=(?=((\?|#)(\?|#)(\?|#)(\.|\?|#))+)(?=((\?|#)(\?|#))(\.|\?|#)+)(?=(\?|#)))

(?=(?=([\?|#][\?|#][\?|#][\.|\?|#])+)(?=([\?|#][\?|#])[\.|\?|#]+)(?=[\?|#]))

(?=((?:([\?#])).*(?:([\?#][\?#][\?#][\?#][\?#][\?#])).*(?:([\?#][\?#][\?#][\?#][\?#]))))
*/

/*

first: ([\?#][^#])([\?#][^#])([\?#][\?#][^=]*)

second: (?=(([\?#][^#]*)([\?#][^#]*)([\?#][\?#][^=]*)))


*/

/*
tmpGLine = tmpGLine + '?' + tmpGLine + '?' + tmpGLine + '?' + tmpGLine + '?' + tmpGLine;
*/