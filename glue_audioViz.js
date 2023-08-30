//////-------------------- REQUIRED LIBRARIES------------------///

const canvasSketch = require('canvas-sketch');
const math = require("canvas-sketch-util/math");
const Tweakpane = require('tweakpane'); //for slider
const color = require('tinycolor2');

//////-------------------- SKETCH SET UP------------------///

const settings = {
  dimensions: [1080, 1080], //instagram post size
  animate: true, //to allow Tweakpane to work + real time frequencies animation
};

//////-------------------- DATA VARIABLE INPUT------------------///
let audio;
let audioContext;
let analyser;
let dataArray;
let started = false;

// COLOR = EMOTION /source image recognition + transformation
const r = 204, g = 255, b = 0;
const lineColor = `rgb(${r},${g},${b})`; // Create the rgb string for paiting color

// NUMBERS OF LINES = NUMBER OF LABELS /source image recognition label detection
let Lines = 19 //min =5 max =20 (empiric)

// // NUMBERS OF SPREAD = NUMBER OF LABELS /source image recognition label detection
// const Spread = 19 //min =5 max =20 (empiric)

//Variable setting random start drawing point the canvas
const variable = Math.floor(Math.random() * 6000);

//////-------------------- DATA VARIABLE INPUT------------------///

// Function to load JSON data
async function loadJSON(url) {
  const response = await fetch(url);
  return response.json();
}

// Load the face_attributes_json file
loadJSON('output.json').then((faceAttributes) => {
  const {
    Age_Median,
    Smile,
    Gender,
    Age_Range,
    Average_Color,
  } = faceAttributes.Face_1;

  const randomAdjustment = () => Math.floor(Math.random() * 21) - 10; // random number between -10 and 10

  const r = math.clamp(Math.round(Average_Color[0]) + randomAdjustment(), 0, 255);
  const g = math.clamp(Math.round(Average_Color[1]) + randomAdjustment(), 0, 255);
  const b = math.clamp(Math.round(Average_Color[2]) + randomAdjustment(), 0, 255);


  //Mapping element with json values
  const Lines =  Age_Median;
  const Spread = Smile;
  const Shape = Gender;
  const Texture = Age_Range;
  const Color = `rgb(${r}, ${g}, ${b})`;

  const params = {
    Lines: Age_Median,
    Spread: Smile,
    Shape: Gender,
    Texture: Age_Range,
    Color: `rgb(${r}, ${g}, ${b})`
  };

    //console log the value
    const keys = ["Lines", "Spread", "Shape", "Texture", "Color"];

    for(let key of keys) {
      console.log(`${key} = ${params[key]}`);
    }
      console.log (r)


      const createPane = () => {
        const pane = new Tweakpane.Pane(); //create a new slider pane

        let folder;

        folder = pane.addFolder({ title : "5 data-driven painting elements"});
        folder.addInput(params, 'Lines', { min: 1, max: 10 });
        folder.addInput(params, 'Spread', { min: 1, max: 10 });
        folder.addInput(params, 'Shape', { min: -10, max: 10 });
        folder.addInput(params, 'Texture', { min: 1, max: 10 });
        pane.addInput(params, 'Color');
        pane.on('change', () => {
          // Trigger sketch re-render on parameter change
          sketch();
        });
      };

//////-------------------- START AUDIO------------------///
const setupAudio = () => {
  audio = document.createElement('audio');
  audio.src = "Keys.mp3"; // source audio file path

  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const source = audioContext.createMediaElementSource(audio);
  analyser = audioContext.createAnalyser();
  source.connect(analyser); //connect audio to analyser
  analyser.connect(audioContext.destination);  //connect audio to speakers
  analyser.fftSize = 256;
  const bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);
};

//////-------------------- EXTRACT FREQUENCY DATA------------------///
const getCurrentAmplitude = () => {
  analyser.getByteTimeDomainData(dataArray);
  let values = 0;
  let average;
  let length = dataArray.length;

  for (let i = 0; i < length; i++) {
    values += dataArray[i];
  }

  average = values / length;
  return average;
};

//////-------------------- MAKE THE PAINTING/DRAWING------------------///

const sketch = () => {
  return ({ context, width, height, time }) => {
    context.fillStyle = '#F6F3E1'; //background canvas
    context.fillRect(0, 0, width, height);

    if (started && !audio.paused) {
      const amplitude = getCurrentAmplitude();
      console.log(amplitude)
      params.Shape = math.mapRange(amplitude, 128, 150, 1, 10);
    }

    //make slider controling
     const Lines = params.Lines;
     const Spread = params.Spread;
     const Shape = params.Shape;
     const Texture = params.Texture;
     const Color = params.Color;

    //scaling
    const scaleLine=math.mapRange(Lines, 1,10, 1, 600)
    const scaleSpread=math.mapRange(Spread, 1,10,  0.1, 0.6)
    const ShapeInverse =math.mapRange(Shape, 1,10, 10, 1)
    const scaleShape=math.mapRange(ShapeInverse, 1,10, 0.10, 0.9)
    const scaleTexture=math.mapRange(Texture, 1,10,  0.0003, 0.006)

    // Inserting visualization from the 1st sketch here:
    const cx = width /2;
    const cy = height * 0.45;
    const w = width * scaleTexture//0.0003; //0.01
    const h = height * scaleSpread //0.5; //0.1

    let x,y;
    const radius = width * scaleShape / 4;




    // creation indicator list to be able to loop
    const indicator_list = ["Shape","Spread", "Lines",  "Texture", "Color"];
    const indicator =  indicator_list[Math.floor(Math.random()*indicator_list.length)];//params.indic

    const degToRad = (degrees) => {
      return degrees / 180 * Math.PI;
    };

    let newIndic;

    if (indicator== "Shape"){
      newIndic = Shape ;
    }
    else if  (indicator== "Spread"){
      newIndic =Spread;
    }
    else if  (indicator== "Lines"){
      newIndic =Lines;
    }
    else if  (indicator== "Texture"){
      newIndic = Texture;
    }

    else if  (indicator== "Color"){
      newIndic = Color;
    }



    for (let i = 0; i < scaleLine; i++) {
      const slice = degToRad(360/scaleLine);//const slice = (360 / params.Lines) * (Math.PI / 180);
      const angle = slice * i;

      x = cx + radius * Math.sin(angle * Math.PI + variable);// const x = cx + radius * Math.sin(angle);
      y = cy + radius * Math.cos(angle * Math.PI);//const y = cy + radius * Math.cos(angle);

      context.save();
      context.translate(x, y);
      context.rotate(-angle+ variable );//context.rotate(-angle);

      context.beginPath();
      context.rect(-w * 1 ,- h , w , h);// context.rect(-params.Spread / 4, -params.Spread / 4, params.Spread, params.Spread);
      context.fillStyle = params.Color;
      context.fill();
      context.restore();

      context.shadowOffsetX = 10;
      context.shadowOffsetY = 10;
      context.shadowBlur = params.Texture * 10;

      //////-------------------- TEXT FOOTER------------------///

  //Function "centerX" to find center position x, automatically
  const centerX = (text) => {
    const metrics = context.measureText(text);
    const textWidth =  metrics.width;
    return (width/2) - (textWidth/2)
  };

  //Title line1 and center
  const title = "Me, my data and I";
  context.fillStyle = '#313131';
  context.font = "60px futura";
  const titleCenter = centerX(title);
  context.fillText(title, titleCenter, 950);
  context.restore()

  //Title line2 and center
  const subtitle = "by Data-Scapes Atelier";
  context.fillStyle = '#313131';
  context.font = "italic 30px futura";
  const subtitleCenter = centerX(subtitle);
  context.fillText(subtitle, subtitleCenter, 1010);
  context.restore()

  //Title serie name + font
  const serie = "ⓒ HumAIn_Art" //"Variations of π (pi)"
  context.font = "10px futura";
  const serieCenter = centerX(serie)
  context.fillText(serie, serieCenter, 1050)
  context.restore()
    }
  };
};

const addListeners = () => {
  window.addEventListener('mouseup', () => {
    if (!started) {
      started = true;
      setupAudio();
    }

    if (audio.paused) audio.play();
    else audio.pause();

  });
};



addListeners();
canvasSketch(sketch, settings)



createPane();
});
