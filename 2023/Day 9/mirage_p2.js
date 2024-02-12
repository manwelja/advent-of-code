const fs = require('fs');

const path = './input.txt';

const historyList = [];

function syncReadFile(filename) {
  let text = fs.readFileSync(filename, "utf-8");
  let textByLine = text.split("\n");
  return textByLine;
}

class HistoryItem {
    constructor(histValues, next = null) {
      this.history = histValues;
      this.nextInSequence = next;
    };
    setNextInSequence(elements, accum) {
        const newList = [];
        for(let x = 0; x < elements.length - 1; x++) {
            newList.push(parseInt(elements[x + 1] - elements[x]));
        }
        if(newList.filter((x) => x != 0).length == 0) {
            this.nextInSequence = accum;
            return accum;
        }
        this.setNextInSequence(newList, parseInt(newList.slice(-1)) + parseInt(accum));
    }
}

try {
  if (fs.existsSync(path)) {

    let fileArray = syncReadFile(path);
    fileArray.filter((e) => e != '').forEach((element) => {
        let histItem = new HistoryItem(element.split(' ').reverse().map(Number));
        histItem.setNextInSequence(histItem.history, histItem.history.slice(-1));
        historyList.push(histItem);
    })
    let result =  historyList.reduce((accum, curr) => accum + curr.nextInSequence, 0);
    console.log('result: ',result);
  }

} catch(err) {
  console.error(err);
}
//not  1972659282
//not  1992273653
