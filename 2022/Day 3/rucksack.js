const { readLine } = require('fs');

const fs = require('fs')

const path = './input.txt'

function syncReadFile(filename) {
    var text = fs.readFileSync(filename, "utf-8");
    var textByLine = text.split("\n");
    return textByLine;
  }


const getValOfMatch = (str1, str2) => {
  for(let i = 0; i < str1.length; i++){
     if(str2.includes(str1[i])){
        return str1[i].charCodeAt(0) > 90 ? str1[i].charCodeAt(0) - 96 : str1[i].charCodeAt(0) - 38;
     };
  };
};

try {
  if (fs.existsSync(path)) {
    const fileArray = syncReadFile(path);
    let sum = 0;

    const rucksack_comp1 = fileArray.map(x => x.slice(0, x.length/2));
    const rucksack_comp2 = fileArray.map(x => x.slice(x.length/2, x.length));

    for(let i=0; i<fileArray.length; i++) {
      sum += getValOfMatch(rucksack_comp1[i], rucksack_comp2[i])
    }
    console.log(sum)
  }
} catch(err) {
  console.error(err);
}



