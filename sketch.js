// DATA variables : Co2 in g/km, Noise, people
const flight = [255, 130, 4083528000];
const car = [192, 100, 1500000000];
const public = [40, 100, 3683528000];
const bike = [0.2, 10, 1000000000];

// STANDARIZE data across indexes
function standardizeDataAcrossIndexes(data) {
  const numIndexes = data[0].length;

  // Calculate the mean and standard deviation for each index
  const meanValues = Array(numIndexes).fill(0);
  const stdDevValues = Array(numIndexes).fill(0);

  for (let i = 0; i < numIndexes; i++) {
    let sum = 0;
    for (let j = 0; j < data.length; j++) {
      sum += data[j][i];
    }
    meanValues[i] = sum / data.length;
  }

  for (let i = 0; i < numIndexes; i++) {
    let sum = 0;
    for (let j = 0; j < data.length; j++) {
      sum += (data[j][i] - meanValues[i]) ** 2;
    }
    stdDevValues[i] = Math.sqrt(sum / data.length);
  }

  // Standardize the data mapping original value and new Std value
  return data.map((row) =>
    row.map((value, i) => (value - meanValues[i]) / stdDevValues[i])
  );
}

//Return the Variables Standarized
const [flightStandard, carStandard, publicStandard, bikeStandard] = standardizeDataAcrossIndexes([flight, car, public, bike]);



// Variables for the oscillator, note duration, and playing state
let osc, noteDuration, playing;

function setup() {
  createCanvas(400, 200);
  background(255);

  // Initialize the oscillator, note duration, and playing state
  osc = new p5.Oscillator();
  noteDuration = 0.5;
  playing = false;

  // Create buttons for each data variable
  createButtons();

  // Add text title and list items
  drawText();
}

//BUTTONS creation
function createButtons() {
  const buttonFlight = createButton('Flight');
  buttonFlight.position(20, 150);
  buttonFlight.mousePressed(() => playSound(flight));

  const buttonCar = createButton('Car');
  buttonCar.position(100, 150);
  buttonCar.mousePressed(() => playSound(car));

  const buttonPublic = createButton('Public Transport');
  buttonPublic.position(150, 150);
  buttonPublic.mousePressed(() => playSound(public));

  const buttonBike = createButton('Bike');
  buttonBike.position(280, 150);
  buttonBike.mousePressed(() => playSound(bike));
}

//TO DO list in the center to track goals
function drawText() {
  textSize(20);
  textAlign(CENTER, CENTER);
  text('TO DO LIST', width / 2, 20);

  textSize(14);
  textAlign(LEFT, CENTER);

  text('☐ Map sound effect with variable simple', 20, 50);
  text('duration/volume/notes', 20, 70);
}

function draw() {}

//MAP FOUNCTION
function mapValue(value, start1, stop1, start2, stop2) {
  const range1 = stop1 - start1;
  const range2 = stop2 - start2;
  return ((value - start1) / range1) * range2 + start2;
}

// Apply sound attributes
function applySoundAttributes(data) {
  const modulator = new p5.Oscillator(); // create a new oscillator for the modulator
  const modFreq = mapValue(data[0], -1, 1, 50, 1000);// map the standardized reverb time to the modulator frequency range
  const modAmp = mapValue(data[0], -1, 1, 0, 1000); // map the standardized reverb decay to the modulator amplitude range
  const fmIndex = mapValue(data[1], -1, 1, 1, 10); // map the standardized volume to the FM index range
  const volume = mapValue(data[1], -1, 1, 0, 1); // Map standardized volume to a range (e.g., 0 to 1)


  modulator.setType('sine');
  modulator.freq(modFreq);
  modulator.amp(modAmp);
  modulator.start();

  return {
    modulator,
    fmIndex,
    volume
  };
}

const flightSoundAttributes = applySoundAttributes(flightStandard);
const carSoundAttributes = applySoundAttributes(carStandard);
const publicSoundAttributes = applySoundAttributes(publicStandard);
const bikeSoundAttributes = applySoundAttributes(bikeStandard);

console.log("flightSoundAttributes",flightSoundAttributes)
console.log("carSoundAttributes",carSoundAttributes)
console.log("bikeSoundAttributes",bikeSoundAttributes)

function playSound(data) {
  if (!playing) {
    // Get the sound attributes for the data
    const soundAttributes = applySoundAttributes(data);
    let volumeLevel = data[1];
    let bpm = data[2];

    // Map the data[0] value to a frequency between 220 Hz and 880 Hz
    let frequency = mapValue(data[0], 0, 255, 220, 880);

    osc.setType('sine');
    osc.freq(frequency);
    osc.amp(volumeLevel);
    osc.start();

    // apply frequency modulation to the oscillator
    const fmFreq = osc.freq() + soundAttributes.modulator.freq() * soundAttributes.fmIndex;
    osc.freq(fmFreq);

    // set the duration of the note based on the BPM value
    noteDuration = 6 / bpm;

    playing = true;
  } else {
    // stop the sound
    playing = false;
    osc.stop();
    soundAttributes().modulator.stop();
    // flightSoundAttributes.modulator.stop();
  }
}



//----------------------------------------------------------//-----------


// // Data variables : Co2 in g/km, Noise, people
// const flight = [255, 130, 4083528000];
// const car = [192, 100, 1500000000];
// const public = [40, 100, 3683528000];
// const bike = [0.2, 10, 1000000000];

// // Standardize data across indexes
// function standardizeDataAcrossIndexes(data) {
//   const numIndexes = data[0].length;

//   // Calculate the mean and standard deviation for each index
//   const meanValues = Array(numIndexes).fill(0);
//   const stdDevValues = Array(numIndexes).fill(0);

//   for (let i = 0; i < numIndexes; i++) {
//     let sum = 0;
//     for (let j = 0; j < data.length; j++) {
//       sum += data[j][i];
//     }
//     meanValues[i] = sum / data.length;
//   }

//   for (let i = 0; i < numIndexes; i++) {
//     let sum = 0;
//     for (let j = 0; j < data.length; j++) {
//       sum += (data[j][i] - meanValues[i]) ** 2;
//     }
//     stdDevValues[i] = Math.sqrt(sum / data.length);
//   }

//   // Standardize the data
//   return data.map((row) =>
//     row.map((value, i) => (value - meanValues[i]) / stdDevValues[i])
//   );
// }

// const [flightStandard, carStandard, publicStandard, bikeStandard] = standardizeDataAcrossIndexes([flight, car, public, bike]);

// console.log("flightStandard values:", flightStandard);
// console.log("carStandard values:", carStandard);

// // Variables for the oscillator, note duration, and playing state
// let osc, noteDuration, playing;

// function setup() {
//   createCanvas(400, 200);
//   background(250);

//   // Initialize the oscillator, note duration, and playing state
//   osc = new p5.Oscillator();
//   noteDuration = 0.5;
//   playing = false;

//   // Create buttons for each data variable
//   createButtons();

//   // Add text title and list items
//   drawText();
// }

// function createButtons() {
//   const buttonFlight = createButton('Flightsss');
//   buttonFlight.position(20, 150);
//   buttonFlight.mousePressed(() => playSound(flightStandard));

//   const buttonCar = createButton('Car');
//   buttonCar.position(100, 150);
//   buttonCar.mousePressed(() => playSound(carStandard));

//   const buttonPublic = createButton('Public Transport');
//   buttonPublic.position(150, 150);
//   buttonPublic.mousePressed(() => playSound(publicStandard));

//   const buttonBike = createButton('Bike');
//   buttonBike.position(280, 150);
//   buttonBike.mousePressed(() => playSound(bikeStandard));
// }



// function draw() {}

// function playSound(data) {
//   if (!playing) {
//     let volumeLevel = data[1];
//     let bpm = data[2];

//     // Map the data[0] value to a frequency between 220 Hz and 880 Hz
//     let frequency = map(data[0], 0, 255, 220, 880);

//     osc.setType('sine');
//     osc.freq(frequency);
//     osc.amp(volumeLevel);
//     osc.start();

//     playing = true;
//     setTimeout(() => {
//       osc.stop();
//       playing = false;
//     }, noteDuration * 1000);
//   }
// }

// // Apply sound attributes
// function applySoundAttributes(data) {
//   const reverb = new p5.Reverb();
//   const reverbTime = map(data[0], -1, 1, 0.1, 5); // Map standardized reverb time to a range (e.g., 0.1 to 5 seconds)
//   const reverbDecay = map(data[0], -1, 1, 0.1, 5); // Map standardized reverb decay to a range (e.g., 0.1 to 5 seconds)

//   const volume = map(data[1], -1, 1, 0, 1); // Map standardized volume to a range (e.g., 0 to 1)

//   const bpm = map(data[2], -1, 1, 60, 180); // Map standardized BPM to a range (e.g., 60 to 180 BPM)

//   return {
//     reverb: { reverbTime, reverbDecay },
//     volume,
//     bpm
//   };
// }

// // Apply sound attributes
// function applySoundAttributes(data) {
//   const reverb = new p5.Reverb();
//   const reverbTime = map(data[0], -1, 1, 0.1, 5); // Map standardized reverb time to a range (e.g., 0.1 to 5 seconds)
//   const reverbDecay = map(data[0], -1, 1, 0.1, 5); // Map standardized reverb decay to a range (e.g., 0.1 to 5 seconds)

//   const volume = map(data[1], -1, 1, 0, 1); // Map standardized volume to a range (e.g., 0 to 1)

//   const bpm = map(data[2], -1, 1, 60, 180); // Map standardized BPM to a range (e.g., 60 to 180 BPM)

//   return {
//     reverb: { reverbTime, reverbDecay },
//     volume,
//     bpm
//   };
// }

// const flightSoundAttributes = applySoundAttributes(flightStandard);
// const carSoundAttributes = applySoundAttributes(carStandard);
// const publicSoundAttributes = applySoundAttributes(publicStandard);
// const bikeSoundAttributes = applySoundAttributes(bikeStandard);
