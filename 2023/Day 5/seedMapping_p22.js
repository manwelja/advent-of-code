const fs = require('fs');

const path = './input.txt';

const almanacList = [];
const rangeList = [];
let seedNumbers = [];
let fileArray = [];

class Almanac {
    constructor(seed, soil, fertilizer, water, light, temperature, humidity, location) {
      this.seed = seed;
      this.soil = soil;
      this.fertilizer = fertilizer;
      this.water = water;
      this.light = light;
      this.temperature = temperature;
      this.humidity = humidity;
      this.location = location;
    };
  }

class Range {
  constructor(start, end) {
    this.start = start,
    this.end = end
  }
}
function syncReadFile(filename) {
    let text = fs.readFileSync(filename, "utf-8");
    let textByLine = text.split("\n");
    return textByLine;
}

function isInRange(num) {
  let inRange = false;
  rangeList.forEach((seed) => {
    if(num >= seed.start && num <= seed.end) {
      inRange = true;
      return;
    }
  })
  return inRange;
}
function createRangeList() {
  fileArray.forEach((element) => {
    if(element.indexOf('seeds: ') >= 0) {
      seedNumbers = element.substring(element.indexOf(' ') + 1).split(' ').map(Number);
      while(seedNumbers.length > 0) {
        let seedNum = seedNumbers.shift();
        let range = seedNumbers.shift();
        rangeList.push(new Range(seedNum, seedNum + range - 1))
      }
    }
  })
}

function createAlmanacList() {
  let seedData = false;
  let tmpFileArray = syncReadFile(path);
  let currentData = null;
  // tmpFileArray.forEach((element) => {
  //   if(seedData == true && element.indexOf(':') >= 0) {
  //     return;
  //   }
  //   if(element == 'seed-to-soil map:') {
  //     seedData = true;
  //   }
  //   numberSets = element.split(' ').map(Number);
  //   let source = numberSets[1];
  //   if(seedData && isInRange(source)) {
  //     almanacList.push(new Almanac(source, 0, 0, 0, 0, 0, 0, 0));
  //   }
  // })
  tmpFileArray.forEach((element) => {
    prevData = currentData;
    currentData = processDataType(element, currentData);
    if(prevData != currentData) {
      return;
    }
    if(element.split('').length === 0) {
      return;
    }
   
    let [dest, source, iterator] = element.split(' ').map(Number);
    //Fill in missing seed numbers, if any
    switch(currentData) {
      case 'SOIL_TO_FERT':
        if(!isInRange(source) && !almanacList.find((element) => element.seed == source)) {
          console.log("SOURCE", source)
          almanacList.push(new Almanac(source, source, 0, 0, 0, 0, 0, 0));
        }
        break;
      case 'FERT_TO_WATER':
        if(isInRange(source) && !almanacList.find((element) => element.soil == source)) {
          almanacList.push(new Almanac(source, source, source, 0, 0, 0, 0, 0));
        }
        break;
      case 'WATER_TO_LIGHT':
        if(isInRange(source) && !almanacList.find((element) => element.fertilizer == source)) {
          almanacList.push(new Almanac(source, source, source, source, 0, 0, 0, 0));
        }
        break;
      case 'LIGHT_TO_TEMP':
        if(isInRange(source) && !almanacList.find((element) => element.water == source)) {
          almanacList.push(new Almanac(source, source, source, source, source, 0, 0, 0));
        }
        break;
      case 'TEMP_TO_HUMIDITY':
        if(isInRange(source) && !almanacList.find((element) => element.light == source)) {
          almanacList.push(new Almanac(source, source, source, source, source, 0, 0));
        }
        break;
      case 'HUMIDITY_TO_LOC':
        if(isInRange(source) && !almanacList.find((element) => element.humidity == source)) {
          almanacList.push(new Almanac(source, source, source, source, source, source, 0));
        }
        break;
      default:
        break;
    }
  })
}

function processDataType(element, currentType) {
  switch(element) {
    case 'seed-to-soil map:':
      almanacList.forEach((element) => {if(element.soil == 0) {element.soil = element.seed}});
      currentData = 'SEED_TO_SOIL';
      break;
    case 'soil-to-fertilizer map:':
      almanacList.forEach((element) => {if(element.fertilizer == 0) {element.fertilizer = element.soil}});
      currentData = 'SOIL_TO_FERT';
      break;
    case 'fertilizer-to-water map:':
      almanacList.forEach((element) => {if(element.water == 0) {element.water = element.fertilizer}});
      currentData = 'FERT_TO_WATER';
      break;
    case 'water-to-light map:':
      almanacList.forEach((element) => {if(element.light == 0) {element.light = element.water}});
      currentData = 'WATER_TO_LIGHT';
      break;
    case 'light-to-temperature map:':
      almanacList.forEach((element) => {if(element.temperature == 0) {element.temperature = element.light}});
      currentData = 'LIGHT_TO_TEMP';
      break;
    case 'temperature-to-humidity map:':
      almanacList.forEach((element) => {if(element.humidity == 0) {element.humidity = element.temperature}});
      currentData = 'TEMP_TO_HUMIDITY';
      break;
    case 'humidity-to-location map:':
      almanacList.forEach((element) => {if(element.location == 0) {element.location = element.humidity}});
      currentData = 'HUMIDITY_TO_LOC';
      break;
    default:
      currentData = currentType;
      break;
  }
  return currentData;
}

try {
    if (fs.existsSync(path)) {
      fileArray = syncReadFile(path);
      let currentData = null;

      createRangeList();
      createAlmanacList();

      fileArray.forEach((element) => {
        prevData = currentData;
        currentData = processDataType(element, currentData);
        if(prevData != currentData) {
          return;
        }

      let [dest, source, iterator]= element.split(' ').map(Number);

      almanacList.forEach((almanac) => {

        switch(currentData) {
            case 'SEED_TO_SOIL':
                  if(almanac.seed >= source && almanac.seed <= (source + iterator)) {
                    almanac.soil = (almanac.seed - source) + dest;
              }
              break;
            case 'SOIL_TO_FERT':
              if(almanac.soil >= source && almanac.soil <= (source + iterator)) {
                almanac.fertilizer = (almanac.soil - source) + dest;
              }
              break;
            case 'FERT_TO_WATER':
              if(almanac.fertilizer >= source && almanac.fertilizer <= (source + iterator)) {
                almanac.water = (almanac.fertilizer - source) + dest;
              }
              break;
            case 'WATER_TO_LIGHT':
              if(almanac.water >= source && almanac.water <= (source + iterator)) {
                almanac.light = (almanac.water - source) + dest;
              }
              break;
            case 'LIGHT_TO_TEMP':
              if(almanac.light >= source && almanac.light <= (source + iterator)) {
                almanac.temperature = (almanac.light - source) + dest;
              }
              break;
            case 'TEMP_TO_HUMIDITY':
              if(almanac.temperature >= source && almanac.temperature <= (source + iterator)) {
                almanac.humidity = (almanac.temperature - source) + dest;
              }
              break;
            case 'HUMIDITY_TO_LOC':
              if(almanac.humidity >= source && almanac.humidity <= (source + iterator)) {
                almanac.location = (almanac.humidity - source) + dest;
              }
              break;
            default:
              break;

          }
      })
    })
    console.log(almanacList.length)
    console.log(almanacList.sort((a, b) => a.location - b.location).shift())

  }
  } catch(err) {
    console.error(err);
}