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
          tmpRule.push({
              source: id,
              sequence: idx,
              condition: r.length === 1 ? true : r[0],
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
  //console.log(acceptList)
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

  acceptanceCriteria.forEach((conditions) => {
    let combo = new Combination(conditions, [], [], [], []);
    conditions.forEach((condition) => {
      switch(condition.charAt(0)) {
        case 'x':
          let tmpX = numArray.filter((x) => eval(condition));
          combo.x.push({min: tmpX[0], max: tmpX[tmpX.length-1]});
          break;
        case 'm':
          let tmpM = numArray.filter((m) => eval(condition));
          combo.m.push({min: tmpM[0], max: tmpM[tmpM.length-1]});
          break;
        case 'a':
          let tmpA = numArray.filter((a) => eval(condition));
          combo.a.push({min: tmpA[0], max: tmpA[tmpA.length-1]});
          break;
        case 's':
          let tmpS = numArray.filter((s) => eval(condition));
          combo.s.push({min: tmpS[0], max: tmpS[tmpS.length-1]});
          break;
        default:
          break;
      }
    })
    if(combo.x.length == 0) combo.x.push({min: 1, max: MAX_NUM});
    if(combo.m.length == 0) combo.m.push({min: 1, max: MAX_NUM});
    if(combo.a.length == 0) combo.a.push({min: 1, max: MAX_NUM});
    if(combo.s.length == 0) combo.s.push({min: 1, max: MAX_NUM});
    console.log(combo);
    combinationList.push(combo);
  })
  let res = 0;
  combinationList.forEach((combo) => {
    let tmpX = 0;
    let tmpM = 0;
    let tmpA = 0;
    let tmpS = 0;
    console.log(tmpX)
    combo.x.forEach((x) => tmpX += x.max - x.min + 1);
    combo.m.forEach((m) => tmpM += m.max - m.min + 1);
    combo.a.forEach((a) => tmpA += a.max - a.min + 1);
    combo.s.forEach((s) => tmpS += s.max - s.min + 1);

    res += tmpX * tmpM * tmpA * tmpS;
  console.log(res)
})
 console.log(res)

} catch(err) {
  console.error(err);
}