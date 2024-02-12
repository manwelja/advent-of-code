const fs = require('fs');

const path = './input.txt';

const handList = [];

function syncReadFile(filename) {
  let text = fs.readFileSync(filename, "utf-8");
  let textByLine = text.split("\n");
  return textByLine;
}

class Hand {
    constructor(cards, bid, type = null, mapping = null, rank = 0) {
      this.cards = cards;
      this.bid = bid;
      this.type = type;
      this.mapping =  mapping;
      this.rank = rank;
    };

    getType() {
        return this._type;
    }

    setType(type) {
        this._type = type;
    }

    getRank() {
      return this.rank;
    }

    setRank(rank) {
      this.rank = rank;
    }

    createMap() {
        const uniqueCards = new Set(this.cards);
        const handGrouping = new Map();
        uniqueCards.forEach((card) => {
            handGrouping.set(card, this.cards.split('').filter((c) => c == card).length)
        });
        this.mapping = handGrouping;
    }

    calculateType () {
      let tmpCards = this.cards.replaceAll('J', '');
      const uniqueCards = new Set(tmpCards.split(''));
      const handGrouping = new Map();
      let updatedHandGrouping = new Map();
      uniqueCards.forEach((card) => {
        handGrouping.set(card, tmpCards.split('').filter((c) => c == card).length)
      });

      switch(tmpCards.length) {
        case 0:
          updatedHandGrouping = new Map([[cardList[0], 5]]);
          break;
        case 5:
          updatedHandGrouping = new Map([...handGrouping])
          break;
        default:
          updatedHandGrouping = new Map([...handGrouping.entries()].sort((a, b) => b[1] - a[1] || Math.min(Math.max(cardList.indexOf(String(a[0])) - cardList.indexOf(String(b[0])), -1))));
          let highCard = [...updatedHandGrouping.entries()][0][0];
          let highCardCount = [...updatedHandGrouping.entries()][0][1];
          updatedHandGrouping.set(highCard, highCardCount + (5 - tmpCards.length));
          break;
      }
      let strength = 0;
      updatedHandGrouping.forEach((value) =>
        strength += Math.pow(value, 2)
      );
      this.type = Object.keys(HandStrength).find(key => HandStrength[key] === strength);
    }

    static getSortValue(handA, handB) {
      let i = 0;
      let result = 0;
      do{
        result = Math.min(Math.max(cardList.indexOf(String(handB.cards[i])) - cardList.indexOf(String(handA.cards[i])), -1), 1);
        i++;
      } while(result == 0 && i < handA.cards.length);
      return result;
    }
}
const HandTypes = {
  fiveOfAKind: 'FIVE_OF_A_KIND',
  fourOfAKind: 'FOUR_OF_A_KIND',
  threeOfAKind: 'THREE_OF_A_KIND',
  fullHouse: 'FULL_HOUSE',
  twoPair: 'TWO_PAIR',
  onePair: 'ONE_PAIR',
  highCard: 'HIGH_CARD'
};

const HandStrength = {
  FIVE_OF_A_KIND: 25,
  FOUR_OF_A_KIND: 17,
  FULL_HOUSE: 13,
  THREE_OF_A_KIND: 11,
  TWO_PAIR: 9,
  ONE_PAIR: 7,
  HIGH_CARD: 5
}

const cardList = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J']

try {
  if (fs.existsSync(path)) {
    let fileArray = syncReadFile(path);
    fileArray.forEach((element) => {
      let [hand, bid] = element.split(' ');
      currHand = new Hand(hand, bid);
      currHand.createMap();
      currHand.calculateType();
      handList.push(currHand);
    })
  }
  handList.sort((prev, curr) => curr.type == prev.type ? prev.constructor.getSortValue(prev, curr) || HandStrength[prev.type] - HandStrength[curr.type] : HandStrength[prev.type] - HandStrength[curr.type]);
  handList.forEach((element, index) => element.rank = index + 1);
  console.log("result: ", handList.reduce((accum, curr) => accum + (curr.rank * curr.bid), 0))

} catch(err) {
  console.error(err);
}

//not 253240448, 252157923 (all too low)