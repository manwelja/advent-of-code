const { Console } = require('console');
const { readLine } = require('fs');

const fs = require('fs')


    const content = fs.readFileSync("./input.txt");
    let splitted = content.toString().split(/\r?\n/);
    let coordinates = [[0,0], [0,0], [0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],];
    let visited = [[],[],[],[],[],[],[],[],[],[],];

    saveVisited();

    splitted.forEach((command)=>{
        let direction = command.split(' ')[0];
        let amount = parseInt(command.split(' ')[1]);

        for (let i = 0; i < amount; i++){
            switch (direction){
                case 'L':
                    coordinates[0][0]--;
                    moveTails();
                    saveVisited();
                    break;
                case 'R':
                    coordinates[0][0] ++;
                    moveTails();
                    saveVisited();
                    break
                case 'U':
                    coordinates[0][1] --;
                    moveTails();
                    saveVisited();
                    break;
                case 'D':
                    coordinates[0][1] ++;
                    moveTails();
                    saveVisited();
                    break
            }
        }
    })
    function saveVisited(){
        coordinates.forEach((coordinates, index)=>{
            visited[index].push(coordinates[0].toString() + '-'+ coordinates[1].toString());
        })
    }
    function moveTails(){
        for (let i = 1; i < coordinates.length; i++){
            let headX = coordinates[i -1][0];
            let headY = coordinates[i-1][1];
            let tailX = coordinates[i][0];
            let tailY = coordinates[i][1];
            if (headX === tailX ||  headY === tailY){
                //in the same line
                if (Math.abs(headX - tailX) + Math.abs(headY - tailY)  < 2 ){
                    //they are still connected, do not move
                    return;
                }
                //in same line, but should move
                if (headX > tailX){
                    coordinates[i][0] ++
                }else if(headX < tailX) {
                    coordinates[i][0] --;
                } else if (headY > tailY){
                    coordinates[i][1] ++;
                } else if (headY < tailY){
                    coordinates[i][1] --;
                }

            } else {
                if (Math.abs(headX - tailX) + Math.abs(headY - tailY)  < 3 ){
                    //they are still connected
                    return;
                }
                //not in same line and should move diagonally.
                if (headX > tailX && headY > tailY){
                    coordinates[i][0] ++
                    coordinates[i][1] ++
                }else if(headX > tailX && headY < tailY) {
                    coordinates[i][0] ++;
                    coordinates[i][1] --;
                } else if (headX < tailX && headY > tailY){
                    coordinates[i][0] --;
                    coordinates[i][1] ++;
                } else if (headX < tailX && headY < tailY){
                    coordinates[i][0] --;
                    coordinates[i][1] --;
                }
            }
        }
    }
    console.log(`The number of location where tail 1 was at least once: ${visited[1].filter((item,index) => visited[1].indexOf(item) === index).length}`)
    console.log(`The number of location where tail 9 was at least once: ${visited[9].filter((item,index) => visited[9].indexOf(item) === index).length}`)
