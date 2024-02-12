const { Console } = require('console');
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
    const dirObject = { };

    const currDir = [];
    fileArray.forEach(entry => {
      if(entry.includes("$ cd ..")){
        currDir.pop();
      }else if (entry.includes("$ cd")){
        currDir.push(entry.replace("$ cd ", ""));
      } else if(!entry.includes("$") && !entry.includes("dir ")) {
          //get size of all files each directory and add it to all the directories in the directory tree
          currDirTemp = [...currDir];
          currDir.forEach(x => {
            dirStruct = currDirTemp.join("/");
            Object.hasOwn(dirObject, dirStruct) ? dirObject[dirStruct] += parseInt(entry.split(" ")[0]) : dirObject[dirStruct] = parseInt(entry.split(' ')[0]);
            currDirTemp.pop();
          });
      }
    })
    const spaceNeeded = 30000000 - (70000000 - dirObject['/']);
    console.log("Space Needed: ", spaceNeeded);
    //get size of largest directory and work down from there
    let minNeeded = dirObject['/'];
    let minDir = '';
    for (const [key, value] of Object.entries(dirObject)) {
      if (value < minNeeded && value >= spaceNeeded) {
        minNeeded = value;
        minDir = key;
      }
    }
    console.log(minDir, minNeeded)
  }
} catch(err) {
  console.error(err);
}



