const { readLine } = require('fs');

const fs = require('fs')

const path = './input.txt'

function syncReadFile(filename) {
    var text = fs.readFileSync(filename, "utf-8");
    var textByLine = text.split("\n");
    return textByLine;
  }


try {
  if (fs.existsSync(path)) {
    const fileArray = syncReadFile(path);
    let someOverlap = 0;
    fileArray.forEach((x) =>
    {
      const workAssign = x.split(',');
      //workAssign[0] is elf 1, workAssign[1] is elf 2
      const workAssign1 = workAssign[0].split('-').map(Number);
      const workAssign2 = workAssign[1].split('-').map(Number);
      const firstElfOverlap = (workAssign1[0] >= workAssign2[0] && workAssign1[0] <= workAssign2[1]) || (workAssign1[1] >= workAssign2[0] && workAssign1[1] <= workAssign2[1]);
      const secondElfOverlap = (workAssign2[0] >= workAssign1[0] && workAssign2[0] <= workAssign1[1]) ||  (workAssign2[1] >= workAssign1[0] && workAssign2[1] <= workAssign1[1]);
      if(firstElfOverlap || secondElfOverlap) {
        someOverlap += 1;
      }
    })
    console.log(someOverlap)
  }
} catch(err) {
  console.error(err);
}



