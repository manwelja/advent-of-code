const fs = require('fs');

const path = './input.txt';

const hailStoneList = [];

function syncReadFile(filename) {
  let text = fs.readFileSync(filename, "utf-8");
  let textByLine = text.split("\n");
  return textByLine;
}

class HailStone {
    constructor(px, py, pz, vx, vy, vz) {
      this.initialPos = {
        x: px,
        y: py,
        z: pz
      };
      this.velocity = {
        x: vx,
        y: vy,
        z: vz
      };
      this.finalPos = this.calculateFinalPosition();
    };

    calculateFinalPosition() {
        return {
            x: this.initialPos.x + this.velocity.x,
            y: this.initialPos.y + this.velocity.y,
            z: this.initialPos.z + this.velocity.z,
        }
    }

}


try {
  if (fs.existsSync(path)) {

    let fileArray = syncReadFile(path);

    fileArray.forEach((element) => {
        let [px, py, pz, vx, vy, vz] = element.replace('@', ',').split(',').map((e) => parseInt(e.trim()));
        hailStoneList.push(new HailStone(px, py, pz, vx, vy, vz))
       
    })
  }
  console.log(hailStoneList);

} catch(err) {
  console.error(err);
}

//not 27068 (too low)