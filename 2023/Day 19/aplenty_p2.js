const fs = require('fs');

const path = './input.txt';

const pathList = [];
const acceptList = [];
const rejectList = [];
const combinationList = [];
const workflowList = [];
const MAX_NUM = 4000;

function syncReadFile(filename) {
  let text = fs.readFileSync(filename, "utf-8");
  let textByLine = text.split("\n");
  return textByLine;
}

class Workflow  {
  constructor(id, rules) {
      this.id = id;
      const tmpRule = [];
      rules.forEach((r, idx) => {
          r = r.split(':');
          //parse existing rules
          let orCondition = '';
          for(let i = 0; i < idx; i++) {
            if(i > 0) {
              orCondition += ' && ';
            }
            if(rules[i].includes('<')) {
              orCondition += rules[i].split(':')[0].replace('<', '>');
            } else if(rules[i].includes('>')) {
              orCondition += rules[i].split(':')[0].replace('>', '<');
            }
          }
          if(r.length === 2 && orCondition != '') {
            orCondition += ' && ';
          }
          tmpRule.push({
              source: id,
              sequence: idx,
              condition: r.length === 2 ? orCondition + r[0] : orCondition,
              action: r.length === 1 ? r[0] : r[1]
          })
      })
      this.rules = tmpRule;
      this.conditions = [];
  }
}
class Combination  {
  constructor(condition, x, m, a, s) {
    this.condition = condition;
    this.x = x;
    this.m = m;
    this.a = a;
    this.s = s;
  }
}

try {
  if (fs.existsSync(path)) {

    let fileArray = syncReadFile(path);
    fileArray.forEach((element, idx) => {
        if(element.trim().length === 0) {
            return;
        }

        if(element.charAt(0) !== '{') {
            //workflow
          let [wid, instructions] = [...element.replace('}', '').split('{')];
           workflowList.push(new Workflow(wid, instructions.split(',')));
        }
    })

    let currWorkflow = workflowList.find((w) => w.id == 'in');
    currWorkflow.rules.forEach((r) => pathList.push([r]));

    while(pathList.length > 0) {
      pathList.forEach((p, index) => {
        switch(p[p.length-1].action) {
          case 'A':
            acceptList.push(p);
            break;
          case 'R':
            rejectList.push(p);
            break;
          default:
            currWorkflow = workflowList.find((w) => w.id == p[p.length-1].action);
            currWorkflow.rules.forEach((r) => pathList.push(p.concat(r)));
            pathList.flat();
            break;
        }
        pathList.splice(index, 1);
      })
    }
  }
  const acceptanceCriteria = acceptList.map((item) =>
     item.reduce((acc, curr) => {
      if(curr.condition != true) acc.push(curr.condition);
      return acc;
     }, [])
  );

  const numArray = [];
  for (let i = 1; i <= 4000; i++) {
    numArray.push(i);
  }
  const xList = numArray.slice();
  const mList = numArray.slice();
  const aList = numArray.slice();
  const sList = numArray.slice();

  acceptanceCriteria.forEach((conditions) => {
    let combo = new Combination(conditions, xList, mList, aList, sList);
    conditions.forEach((condition) => {
      condition.split('&&').forEach((c) => {
        switch(c.charAt(0)) {
          case 'x':
            combo.x = xList.filter((x) => eval(c));
            break;
          case 'm':
            combo.m = mList.filter((m) => eval(c));
            break;
          case 'a':
            combo.a = aList.filter((a) => eval(c))
            break;
          case 's':
            combo.s = sList.filter((s) => eval(c))
            break;
          default:
            break;
        }
      })
    })
    combinationList.push(combo);
  })

  let prefixedCombinationList = combinationList.map((item) => {
    let x = item.x.map((x) => 'x_' + x);
    let m = item.m.map((m) => 'm_' + m);
    let a = item.a.map((a) => 'a_' + a);
    let s = item.s.map((s) => 's_' + s);
    return x.concat(m).concat(a).concat(s);
  })

  let tmp = combinationList.shift();
  let uniqueCombinationList = [];
  uniqueCombinationList.push(tmp);

  combinationList.forEach((combo) => {
   // console.log('TMP', tmpUCombo)
    for(let i = 0; i < uniqueCombinationList.length; i++) {
      if(uniqueCombinationList[i].x.includes(item.x) == tmpUCombo.x )
      tmpUCombo = tmpUCombo.x.filter((item) => !(uniqueCombinationList[i].x.includes(item.x) && uniqueCombinationList[i][m].includes(item.m) && uniqueCombinationList[i][a].includes(item.a) && uniqueCombinationList[i][s].includes(item.s)));
      tmpUCombo = tmpUCombo.m.filter((item) => !(uniqueCombinationList[i].x.includes(item.x) && uniqueCombinationList[i][m].includes(item.m) && uniqueCombinationList[i][a].includes(item.a) && uniqueCombinationList[i][s].includes(item.s)));
      tmpUCombo = tmpUCombo.a.filter((item) => !(uniqueCombinationList[i].x.includes(item.x) && uniqueCombinationList[i][m].includes(item.m) && uniqueCombinationList[i][a].includes(item.a) && uniqueCombinationList[i][s].includes(item.s)));
      tmpUCombo = tmpUCombo.s.filter((item) => !(uniqueCombinationList[i].x.includes(item.x) && uniqueCombinationList[i][m].includes(item.m) && uniqueCombinationList[i][a].includes(item.a) && uniqueCombinationList[i][s].includes(item.s)));
    }
    //get unique numbers for each letter type
    // for(let i = 0; i < uniqueCombinationList.length; i++) {
    //    tmp = tmpUCombo.filter((item) => !(uniqueCombinationList[i][x].includes(item.x) && uniqueCombinationList[i][m].includes(item.m) && uniqueCombinationList[i][a].includes(item.a) && uniqueCombinationList[i][s].includes(item.s)));
    //   if (tmp.length > 0) {
    //     tmpUCombo.push
    //   }
    // }

      // if(tmpUCombo.x.length > 0) {
      //   uniqueCombinationList.push({x: tmpUCombo.x, m: combo.m, a: combo.a, s: combo.s});
      // }
      // if(tmpUCombo.m.length > 0) {
      //   uniqueCombinationList.push({x: combo.x, m: tmpUCombo.m, a: combo.a, s: combo.s});
      // }
      // if(tmpUCombo.a.length > 0) {
      //   uniqueCombinationList.push({x: combo.x, m: combo.m, a: tmpUCombo.a, s: combo.s});
      // }
      // if(tmpUCombo.s.length > 0) {
      //   uniqueCombinationList.push({x: combo.x, m: combo.m, a: combo.a, s: tmpUCombo.s});
      // }

      uniqueCombinationList = uniqueCombinationList.flat();
  })
//  console.log(combinationList)
 // let result = uniqueCombinationList.reduce((acc, curr) => acc + (curr.x.length * curr.m.length * curr.a.length * curr.s.length), 0);
//  console.log('Result', result)
} catch(err) {
  console.error(err);
}

//not 301230480000000