const canvasSketch = require('canvas-sketch');
const Tweakpane = require('tweakpane');
const math = require("canvas-sketch-util/math"); //for mapRange
const rgbaToHex = require('canvas-sketch-util/lib/rgba-to-hex');

const settings = {
  dimensions: [ 1080, 1080 ], //2 times insta
  animate: true, //to allow Tweakpane to work
};


//Default values Tweakpane
const params= {
  Lines: 5, //density lines
  Spread: 5, //width
  Shape: 5, //neat-blur
  Shadow: 5, //
  //Color: "rgb(255,255,255)" //rgb(151,158,158)//'#ff5c00'
}
// Assuming you have r, g, b values defined
const r = 25, g = 200, b = 100;

// Create the rgba string for shadow color
const lineColor = `rgb(${r},${g},${b})`;

// Function to generate a random number between -50 and 50
const randomValue = () => Math.floor(Math.random() * 101) - 50;

// Generate random RGB values for the shadow
const rShadow = randomValue();
const gShadow = randomValue();
const bShadow = randomValue();

// Create the rgba string for shadow color
const shadowColor = `rgba(${rShadow},${gShadow},${bShadow},0.8)`;

//Variable setting random start drawing point the canvas
const variable = Math.floor(Math.random() * 6000);

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = '#F6F3E1'; //background canvas
    context.fillRect(0, 0, width, height);

    const Lines = params.Lines;
    const Spread = params.Spread;
    const Shape = params.Shape;
    const Shadow = params.Shadow;
    // const Color = params.Color;

// creation indicator list to be able to loop
const indicator_list = ["Shape","Spread", "Lines",  "Shadow"];
const indicator =  indicator_list[Math.floor(Math.random()*indicator_list.length)];//params.indic
// console.log("indicator", indicator)

const degToRad = (degrees) => {
  return degrees / 180 * Math.PI;
};

let newIndic;

if (indicator== "Shape"){
  console.log("indic Shape* : ", Shape)
  newIndic = Shape ;
}
else if  (indicator== "Spread"){
  console.log("indic Spread*: ", Spread)
  newIndic =Spread;
}

else if  (indicator== "Lines"){
  console.log("indic Lines*: ", Lines)
  newIndic =Lines;
}
else if  (indicator== "Shadow"){
  console.log("indic Shadow*: ",  Shadow)
  newIndic = Shadow;
}
else if  (indicator== "Color"){
  console.log("indic color*: ",  Color)
  newIndic = Color;
}

//scaling
const scaleLine=math.mapRange(Lines, 1,10, 1, 600)
const ShapeInverse =math.mapRange(Shape, 1,10, 10, 1)
const scaleShape=math.mapRange(ShapeInverse, 1,10, 0.10, 0.9)
const scaleShadow=math.mapRange(Shadow, 1,10,  0.0003, 0.006)
const scaleSpread=math.mapRange(Spread, 1,10,  0.1, 0.6)


//positioning
const cx = width /2;
const cy = height * 0.45;
const w = width * scaleShadow//0.0003; //0.01
const h = height * scaleSpread //0.5; //0.1

let x,y;

const radius = width * scaleShape/4 // from 0.1 to 1


for (let i =0; i <scaleLine; i++){

  const slice = degToRad(360/scaleLine);// 27 to 360 //work really well
  const angle = slice * i;

  x = cx + radius * Math.sin(angle * Math.PI + variable);
  y = cy + radius * Math.cos(angle * Math.PI);

  context.save();
  context.translate(x,y);
  context.rotate(-angle+ variable );
  context.shadowOffsetX = 10;
  context.shadowOffsetY = 10;
  context.shadowBlur =  Shadow*10;//
  context.shadowColor = shadowColor//'rgb(shadow_color.r,shadow_color.g,shadow_color.b)' //'#ff5c00' //orange //"#211BBD";

  context.beginPath();
  context.rect(-w * 1 ,- h , w , h);
  context.fillStyle = lineColor//"rgba(255, 255, 0, 0.8)" // yellow / "rgb(108,115,115)"//colorRGB; '#ff5c00'
  context.fill();
  context.restore();
}
  //Function "centerX" to find center position x, automatically
  const centerX = (text) => {
  const metrics = context.measureText(text);
  const textWidth =  metrics.width;
  return (width/2) - (textWidth/2)
  };

  //Title line1 and center
  const title = "Me, my face and I";
  context.fillStyle = '#313131';
  context.font = "70px futura";
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

const createPane = () => {
  const pane = new Tweakpane.Pane(); //create a new slider pane

  let folder;

  folder = pane.addFolder({ title : "4 paiting values. 1=low 10=high"});
  folder.addInput(params, 'Lines', { min: 1, max: 10 });
  folder.addInput(params, 'Spread', { min: 1, max: 10 });
  folder.addInput(params, 'Shape', { min: 1, max: 10 });
  folder.addInput(params, 'Shadow', { min: 1, max: 10 });
  pane.addInput(params, 'Color');
};

createPane();
