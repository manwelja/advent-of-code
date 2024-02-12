const { readLine } = require('fs');

const fs = require('fs');

const fpath = './test_input.txt'
//const fpath = './input.txt'

const monkey = {}

function syncReadFile(filename) {
const regex = /[a-z]/gi;
    const text = fs.readFileSync(filename, "utf-8");
    const nameProperty = text.split("\n").map(x => x.split(":"));
    nameProperty.forEach(loner => {
        monkey[loner[0]] = {}
        if(loner[1].search(regex) > 0) {
            monkey[loner[0]]["equation"] = loner[1];
            monkey[loner[0]]["number"] = null;
        } else {
            monkey[loner[0]]["equation"] = null;
            monkey[loner[0]]["number"] = loner[1];
        }
    })
    return monkey;
}

const monkeys = syncReadFile(fpath);

for (const [key, value] of Object.entries(monkey)) {
    //if monkey has equation, look up values and plug in numbers
    console.log(monkey[key]['equation']);
  }
  

