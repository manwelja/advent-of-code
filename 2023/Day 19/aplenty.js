const fs = require('fs');

const path = './input.txt';

const partList = [];
let workflowList = [];

function syncReadFile(filename) {
  let text = fs.readFileSync(filename, "utf-8");
  let textByLine = text.split("\n");
  return textByLine;
}

class Part {
    constructor(id, x, m, a, s) {
      this.id = id;
      this.x = x;
      this.m = m;
      this.a = a;
      this.s = s;
      this.workflow = null;
      this.status = 'IP';
    };
 }

class Workflow  {
    constructor(id, rules) {
        this.id = id;
        const tmpRule = [];
        rules.forEach((r, idx) => {
            r = r.split(':');
            tmpRule.push({
                sequence: idx,
                condition: r.length === 1 ? true : 'part.' + r[0],
                action: r.length === 1 ? r[0] : r[1]
            })
        })
        this.rules = tmpRule;
    }

    applyRules(part) {
        let result = false;
        let ruleCount = 0;
        while(result !== true) {
            result = eval(this.rules[ruleCount].condition);
            if(result === true) {
                switch(this.rules[ruleCount].action) {
                    case 'A':
                        part.status = 'A';
                        break;
                    case 'R':
                        part.status = 'R';
                        break;
                    default:
                        part.workflow = this.rules[ruleCount].action;
                        break;
                }
            }
            ruleCount++;
        }
    }
}

try {
  if (fs.existsSync(path)) {

    let fileArray = syncReadFile(path);

    let partNum = 0;
    fileArray.forEach((element, idx) => {
        if(element.trim().length === 0) {
            return;
        }

        if(element.charAt(0) !== '{') {
            //workflow
          let [wid, instructions] = [...element.replace('}', '').split('{')];
           workflowList.push(new Workflow(wid, instructions.split(',')));
        } else if(element.charAt(0) === '{') {
            //part
            element = element.replace('{', '').replace('}', '').split(',');
            numbers = element.map((item) => item.split('=')[1]).map(Number);
            partList.push(new Part(partNum, ...numbers));
            partNum++;
        }

    })
    partList.forEach((part) => {
        let currWorkflow = workflowList.find((w) => w.id == 'in');

        while(part.status === 'IP') {
            part.workflow = currWorkflow.id;
            currWorkflow.applyRules(part);
            currWorkflow = workflowList.find((wf) => wf.id == part.workflow);
        }

    })
    let result = partList.filter((p) => p.status == 'A').reduce((acc, curr) => acc + curr.x + curr.m + curr.a + curr.s, 0);
    console.log('Result:', result);
   // console.log(partList)
  }
} catch(err) {
  console.error(err);
}
