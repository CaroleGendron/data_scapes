let sample;
let playButton;
let reverbSlider;
let delayTimeSlider;
let delayFeedbackSlider;
let distortionSlider;

let reverb;
let delay;
let distortion;

function preload() {
  sample = loadSound('./Kyoto_bell.mp3');
}

function setup() {
  createCanvas(400, 400);

  // Create the play button
  playButton = createButton('Play');
  playButton.position(width / 2 - playButton.width / 2, height / 2 - playButton.height / 2);
  playButton.mousePressed(togglePlay);

  // Create the reverb slider
  reverbSlider = createSlider(0, 1, 0.5, 0.01);
  reverbSlider.position(20, 20);
  let reverbLabel = createP('Reverb Amount');
  reverbLabel.position(reverbSlider.x + reverbSlider.width + 10, reverbSlider.y);

  // Create the delay time slider
  delayTimeSlider = createSlider(0, 1, 0.5, 0.01);
  delayTimeSlider.position(20, 50);
  let delayTimeLabel = createP('Delay Time');
  delayTimeLabel.position(delayTimeSlider.x + delayTimeSlider.width + 10, delayTimeSlider.y);

  // Create the delay feedback slider
  delayFeedbackSlider = createSlider(0, 1, 0.5, 0.01);
  delayFeedbackSlider.position(20, 80);
  let delayFeedbackLabel = createP('Delay Feedback');
  delayFeedbackLabel.position(delayFeedbackSlider.x + delayFeedbackSlider.width + 10, delayFeedbackSlider.y);

  // Create the distortion slider
  distortionSlider = createSlider(0, 1, 0.5, 0.01);
  distortionSlider.position(20, 110);
  let distortionLabel = createP('Distortion Amount');
  distortionLabel.position(distortionSlider.x + distortionSlider.width + 10, distortionSlider.y);

  // Initialize audio effects
  reverb = new p5.Reverb();
  delay = new p5.Delay();
  distortion = new p5.Distortion();

  // Connect the effects in the desired order
  sample.disconnect();
  sample.connect(distortion);
  distortion.connect(delay);
  delay.connect(reverb);
  reverb.connect();

  // Add an input event listener to the sliders
  reverbSlider.input(applyEffects);
  delayTimeSlider.input(applyEffects);
  delayFeedbackSlider.input(applyEffects);
  distortionSlider.input(applyEffects);
}

function draw() {
  background(220);
  // Additional drawing code if needed
}

function togglePlay() {
  if (sample.isPlaying()) {
    sample.stop();
    playButton.html('Play');
  } else {
    sample.play();
    playButton.html('Stop');
  }
}

function applyEffects() {
  // Apply effects based on slider values
  reverb.drywet(reverbSlider.value());
  delay.delayTime(delayTimeSlider.value());
  delay.feedback(delayFeedbackSlider.value());
  distortion.amount(distortionSlider.value());
}


// -----------------------------------------------

// let sample;
// let playButton;

// function preload() {
//   sample = loadSound('./kyoto_Bell.mp3');
// }

// function setup() {
//   createCanvas(400, 400);

//   // Create the play button
//   playButton = createButton('Play');
//   playButton.position(width / 2 - playButton.width / 2, height / 2 - playButton.height / 2);
//   playButton.mousePressed(togglePlay);
// }

// function draw() {
//   background(220);
//   // Additional drawing code if needed
// }

// function togglePlay() {
//   if (sample.isPlaying()) {
//     sample.stop();
//     playButton.html('Play');
//   } else {
//     sample.play();
//     playButton.html('Stop');
//   }
// }
