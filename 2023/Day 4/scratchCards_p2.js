const { readLine } = require('fs');

const fs = require('fs')

const path = './input.txt'

class Card {
    constructor(cardNumber, winningNumbers, yourNumbers, points = 0, numCopies = 0) {
      this.cardNumber = parseInt(cardNumber);
      this.winningNumbers = winningNumbers;
      this.yourNumbers = yourNumbers;
      this.points = points;
      this.numCopies = numCopies;
    };

    get cardNumber() {
        return this._cardNumber;
    }

    get winningNumbers() {
        return this._winningNumbers;
    }

    get yourNumbers() {
        return this._yourNumbers;
    }

    get points() {
        return this._points;
    }

    get numCopies() {
        return this._numCopies;
    }

    set cardNumber(num) {
        this._cardNumber = num;
    }

    set winningNumbers(numArray) {
        this._winningNumbers = numArray;
    }

    set yourNumbers(numArray) {
        this._yourNumbers = numArray;
    }

    set points(num) {
        this._points = num;
    }

    set numCopies(num) {
        this._numCopies = num;
    }

    addNumCopies(num) {
        this._numCopies += num;
    }

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
        let numCopies = Array(cards.length).fill(1, 0, cards.length);
        cards.forEach((card) => {
            numMatchingNumbers = card.winningNumbers.filter(element => card.yourNumbers.includes(element)).length;
            let tmp = card.cardNumber + numMatchingNumbers;
            for (let i = card.cardNumber; i < tmp; i++) {
                numCopies[i] = numCopies[i] + numCopies[card.cardNumber - 1];
            }
        })
        cards.forEach((card) => {
            card.addNumCopies(numCopies[card.cardNumber - 1]);
        })
        let result = cards.reduce((acc, curr) => acc + parseInt(curr.numCopies), 0);
        console.log('result: ', result)
    }
  } catch(err) {
    console.error(err);
}