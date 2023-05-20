//////-------------------- REQUIRED LIBRARIES------------------///

const canvasSketch = require('canvas-sketch'); //for creative coding
const Tweakpane = require('tweakpane'); //for slider
const math = require("canvas-sketch-util/math"); //for mapRange

//////-------------------- SKETCH SET UP------------------///

const settings = {
  dimensions: [ 1080, 1080 ], //instagram post size
  animate: true, //to allow Tweakpane to work
};

//////-------------------- DATA VARIABLE INPUT------------------///

// COLOR = EMOTION /source image recognition + transformation
const r = 204, g = 261, b = 0;
const lineColor = `rgb(${r},${g},${b})`; // Create the rgb string for paiting color

// NUMBERS OF LINES = NUMBER OF LABELS /source image recognition label detection
const Lines = 19 //min =5 max =20 (empiric)

// // NUMBERS OF SPREAD = NUMBER OF LABELS /source image recognition label detection
// const Spread = 19 //min =5 max =20 (empiric)

//Variable setting random start drawing point the canvas
const variable = Math.floor(Math.random() * 6000);

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = '#F6F3E1'; //background canvas
    context.fillRect(0, 0, width, height);

    //make slider controling
    const Lines = params.Lines;
    const Spread = params.Spread;
    const Shape = params.Shape;
    const Texture = params.Texture;
    const Color = params.Color;

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
// else if  (indicator== "Lines"){
//   newIndic =Lines;
// }
else if  (indicator== "Texture"){
  newIndic = Texture;
}

else if  (indicator== "Color"){
  newIndic = Color;
}

//scaling
const scaleLine=math.mapRange(Lines, 1,10, 1, 600)
const scaleSpread=math.mapRange(Spread, 1,10,  0.1, 0.6)
const ShapeInverse =math.mapRange(Shape, 1,10, 10, 1)
const scaleShape=math.mapRange(ShapeInverse, 1,10, 0.10, 0.9)
const scaleTexture=math.mapRange(Texture, 1,10,  0.0003, 0.006)

//positioning
const cx = width /2;
const cy = height * 0.45;
const w = width * scaleTexture//0.0003; //0.01
const h = height * scaleSpread //0.5; //0.1

let x,y;

const radius = width * scaleShape/4 // from 0.1 to 1 /4

for (let i =0; i <scaleLine; i++){

  const slice = degToRad(360/scaleLine);// from 100 (very linear) 360 as AVR to 2000 (very fragmented)
  const angle = slice * i;

  x = cx + radius * Math.sin(angle * Math.PI + variable);
  y = cy + radius * Math.cos(angle * Math.PI);

  context.save();
  context.translate(x,y);
  context.rotate(-angle+ variable );

  context.beginPath();
  context.rect(-w * 1 ,- h , w , h);
  context.fillStyle = Color
  context.fill();
  context.restore();

  context.shadowOffsetX = 10;
  context.shadowOffsetY = 10;
  context.shadowBlur =  Texture*10;//
  context.shadowColor = "rgba(30, 30, 15, 0.7)" //grey shadow

}

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
  const subtitle = "by Data-Scapes";
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
  };
};

canvasSketch(sketch, settings);

//////-------------------- SLIDER (import Tweakpane)------------------///

//Default values slider Tweakpane
const params= {
  Lines: 5, //density lines
  Spread: 5, //width
  Shape: 5, //round to square shape
  Texture: 5, //texture from transparent to plain
  Color: '#ff5c00', //color
}

const createPane = () => {
  const pane = new Tweakpane.Pane(); //create a new slider pane

  let folder;

  folder = pane.addFolder({ title : "4 paiting values. 1=low 10=high"});
  folder.addInput(params, 'Lines', { min: 1, max: 10 });
  folder.addInput(params, 'Spread', { min: 1, max: 10 });
  folder.addInput(params, 'Shape', { min: 1, max: 10 });
  folder.addInput(params, 'Texture', { min: 1, max: 10 });
  pane.addInput(params, 'Color');

};

createPane();
