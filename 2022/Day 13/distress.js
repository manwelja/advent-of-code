const { readLine } = require('fs');

const fs = require('fs');

//const fpath = './test_input.txt'
const fpath = './input.txt'

function syncReadFile(filename) {
    const text = fs.readFileSync(filename, "utf-8");
    return text.split("\n").filter(x => x != '');
}

const rightPacketOrder = function(arr1, arr2) {
    if (arr1.length > arr2.length) {
      return false;
    }

    if(arr1.length === 0) return true;
    if(arr2.length === 0) return false;

    for (let i = 0; i < arr1.length; i++) {
      console.log(arr1[i])
      console.log(arr2[i])
      //if the current array element is not an array, straight up comparison
      if (!Array.isArray(arr1[i]) && !Array.isArray(arr2[i])) {
        if (arr1[i] > arr2[i]) {
            //If both values are integers, the lower integer should come first
            return false;
        }
      } else if (Array.isArray(arr1[i]) && Array.isArray(arr2[i])){
        //If both values are lists, compare the first value of each list, then the second value, and so on.
            if(arr1.length > arr2.length) {
              return false;
            }
            return true && rightPacketOrder(arr1[i], arr2[i]);
      } else if (Array.isArray(arr1[i]) && !Array.isArray(arr2[i])){
            return true && rightPacketOrder(arr1[i], [arr2[i]]);
      }else if (!Array.isArray(arr1[i]) && Array.isArray(arr2[i])){
            return true && rightPacketOrder([arr1[i]], arr2[i]);
    }
  };
  return true;
}
const packets = syncReadFile(fpath);
const rightOrderIndex = [];
let index = 0;
let pairNum = 1;
while(index < packets.length) {
    var packet1 = JSON.parse("[" + packets[index] + "]").flat();
    var packet2 = JSON.parse("[" + packets[index+1] + "]").flat();
    //compare packets
    console.log("************************************");
    console.log("packet 1: ", packet1);
    console.log("packet 2: ", packet2)
    rightPacketOrder(packet1, packet2) ? rightOrderIndex.push(pairNum) : "";
    console.log(rightOrderIndex)
    index +=2;
    pairNum++;
}
//console.log(packets)
console.log("Right order indices sum: ", rightOrderIndex.reduce((a, b) => a + b, 0));
