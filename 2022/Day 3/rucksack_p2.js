const { readLine } = require('fs');

const fs = require('fs')

const path = './input.txt'

function syncReadFile(filename) {
    var text = fs.readFileSync(filename, "utf-8");
    var textByLine = text.split("\n");
    return textByLine;
  }


  const stringCompare = (str1, str2) => {
    const res = [];
    for(let i = 0; i < str1.length; i++){
       if(str2.includes(str1[i])){
          if(res.indexOf(str1[i]) < 0) {
            res.push(str1[i]);
          }
       };
    };
    return res;
 };

try {
  if (fs.existsSync(path)) {
    const fileArray = syncReadFile(path);
    const comp = [];

    for(let i=0; i<fileArray.length-2; i+=3) {
      comp.push(stringCompare(stringCompare(fileArray[i],fileArray[i+1]), fileArray[i+2]));
    }

    let sum = comp.map(a => a[0].charCodeAt(0) > 90 ? a[0].charCodeAt(0) - 96 : a[0].charCodeAt(0) - 38);
    console.log(sum.reduce((a,b) => a+b))
  }
} catch(err) {
  console.error(err);
}



