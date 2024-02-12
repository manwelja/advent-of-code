const { readLine } = require('fs');

const fs = require('fs')

const path = './input.txt'

class Card {
    constructor(cardNumber, winningNumbers, yourNumbers, numCopies) {
      this.cardNumber = cardNumber;
      this.winningNumbers = winningNumbers;
      this.yourNumbers = yourNumbers;
      this.points = 0;
      this.numCopies = 0;
    };
  }

function syncReadFile(filename) {
    let text = fs.readFileSync(filename, "utf-8");
    let textByLine = text.split("\n");
    return textByLine;
}

try {
    if (fs.existsSync(path)) {
      let fileArray = syncReadFile(path);
      let cards = [];
      fileArray.forEach((element) => {
        let cardNum = element.substring(5, element.indexOf(':'));
        let cardResults = element.substring(element.indexOf(':') + 1).split('|');
        let card = new Card(
            cardNum,
            cardResults[0].split(' ').filter((num) => num != '').map((num) => num.trim()),
            cardResults[1].split(' ').filter((num) => num != '').map((num) => num.trim()));
        cards.push(card);
      })

      cards.forEach((card) => {
        let winning = card.winningNumbers.filter(element => card.yourNumbers.includes(element));
        if(winning.length == 1) {
            card.points = 1;
        } else if(winning.length > 1) {
            card.points = Math.pow(2, winning.length - 1)
        }
    })

    let result = cards.reduce((acc, curr) => acc + parseInt(curr.points), 0);
    console.log('result: ', result)
  }
  } catch(err) {
    console.error(err);
}