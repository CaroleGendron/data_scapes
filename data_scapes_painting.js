const canvasSketch = require('canvas-sketch');
const Tweakpane = require('tweakpane');
const math = require("canvas-sketch-util/math") //for mapRange

const settings = {
  dimensions: [ 1080, 1080 ], //2 times insta
  animate: true, //to allow Tweakpane to work
};

//Setting Title Name
const title_name = "My Autoportrait"


//Default values Tweakpane
const params= {
  Population: 1, //density lines
  Land: 1, //width
  Age: 1, //greyscale color
  Happy: 1, //neat-blur
  CO2_Impact: 1, //stain
  Color: '#ff5c00',
}

//Variable setting random starting point the canvas
const variable = Math.floor(Math.random() * 6000);

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = '#F6F3E1';
    context.fillRect(0, 0, width, height);

    const Population = params.Population;
    const Land = params.Land;
    const Age = params.Age;
    const Happy = params.Happy;
    const CO2_Impact = params.CO2_Impact;
    const Color = params.Color;

    // const Austria= {'Population' :  6, 'Land' :  6, 'Age' :  9, 'Happy' :  9, 'CO2_Impact' :  7}
    // const Belgium= {'Population' :  8, 'Land' :  2, 'Age' :  2, 'Happy' :  7, 'CO2_Impact' :  8}
    // const Bulgaria= {'Population' :  5, 'Land' :  7, 'Age' :  7, 'Happy' :  1, 'CO2_Impact' :  5}
    // const Croatia= {'Population' :  3, 'Land' :  4, 'Age' :  7, 'Happy' :  2, 'CO2_Impact' :  3}
    // const Cyprus= {'Population' :  1, 'Land' :  1, 'Age' :  1, 'Happy' :  3, 'CO2_Impact' :  9}
    // const Czechia= {'Population' :  7, 'Land' :  6, 'Age' :  6, 'Happy' :  7, 'CO2_Impact' :  10}
    // const Denmark= {'Population' :  5, 'Land' :  3, 'Age' :  4, 'Happy' :  10, 'CO2_Impact' :  6}
    // const Estonia= {'Population' :  2, 'Land' :  3, 'Age' :  7, 'Happy' :  4, 'CO2_Impact' :  7}
    // const FinLand= {'Population' :  4, 'Land' :  9, 'Age' :  5, 'Happy' :  10, 'CO2_Impact' :  7}
    // const France= {'Population' :  10, 'Land' :  10, 'Age' :  2, 'Happy' :  7, 'CO2_Impact' :  3}
    // const Germany= {'Population' :  10, 'Land' :  9, 'Age' :  10, 'Happy' :  8, 'CO2_Impact' :  8}
    // const Greece= {'Population' :  7, 'Land' :  7, 'Age' :  10, 'Happy' :  1, 'CO2_Impact' :  5}
    // const Hungary= {'Population' :  6, 'Land' :  6, 'Age' :  6, 'Happy' :  2, 'CO2_Impact' :  4}
    // const IreLand= {'Population' :  4, 'Land' :  5, 'Age' :  1, 'Happy' :  8, 'CO2_Impact' :  10}
    // const Italy= {'Population' :  10, 'Land' :  8, 'Age' :  10, 'Happy' :  5, 'CO2_Impact' :  4}
    // const Latvia= {'Population' :  2, 'Land' :  4, 'Age' :  8, 'Happy' :  3, 'CO2_Impact' :  1}
    // const Lithuania= {'Population' :  3, 'Land' :  5, 'Age' :  9, 'Happy' :  4, 'CO2_Impact' :  6}
    // const Luxembourg= {'Population' :  1, 'Land' :  1, 'Age' :  1, 'Happy' :  9, 'CO2_Impact' :  10}
    // const Malta= {'Population' :  1, 'Land' :  1, 'Age' :  4, 'Happy' :  5, 'CO2_Impact' :  1}
    // const NetherLands= {'Population' :  8, 'Land' :  2, 'Age' :  5, 'Happy' :  10, 'CO2_Impact' :  9}
    // const PoLand= {'Population' :  9, 'Land' :  9, 'Age' :  3, 'Happy' :  2, 'CO2_Impact' :  9}
    // const Portugal= {'Population' :  6, 'Land' :  7, 'Age' :  9, 'Happy' :  1, 'CO2_Impact' :  2}
    // const Romania= {'Population' :  9, 'Land' :  8, 'Age' :  4, 'Happy' :  6, 'CO2_Impact' :  2}
    // const Slovakia= {'Population' :  4, 'Land' :  4, 'Age' :  3, 'Happy' :  4, 'CO2_Impact' :  4}
    // const Slovenia= {'Population' :  2, 'Land' :  2, 'Age' :  9, 'Happy' :  6, 'CO2_Impact' :  6}
    // const Spain= {'Population' :  9, 'Land' :  10, 'Age' :  7, 'Happy' :  6, 'CO2_Impact' :  3}
    // const Sweden= {'Population' :  7, 'Land' :  10, 'Age' :  2, 'Happy' :  9, 'CO2_Impact' :  1}

// creation indicator list to be able to loop
const indicator_list = ["Happy","Land", "Age", "Population",  "CO2_Impact"];
const indicator =  indicator_list[Math.floor(Math.random()*indicator_list.length)];//params.indic
console.log("indicator", indicator)

const degToRad = (degrees) => {
  return degrees / 180 * Math.PI; //f_pop 1 DEFINITION DENTELLE. 1 TO 360
};

let newIndic;

if (indicator== "Happy"){
  console.log("indic Happy* : ", Happy)
  newIndic = Happy ;
}
else if  (indicator== "Land"){
  console.log("indic Land*: ", Land)
  newIndic =Land;
}
else if  (indicator== "Age"){
  console.log("indic Age*: ", Age)
  newIndic =Age;
}
else if  (indicator== "Population"){
  console.log("indic Population*: ", Population)
  newIndic =Population;
}
else if  (indicator== "CO2_Impact"){
  console.log("indic CO2_Impact*: ",  CO2_Impact)
  newIndic = CO2_Impact;
}
else if  (indicator== "Color"){
  console.log("indic color*: ",  Color)
  newIndic = Color;
}

//scaling
const scaleAge=math.mapRange(Age, 1,10, 1, 150)
const scalePop=math.mapRange(Population, 1,10, 1, 600)
const happyInverse =math.mapRange(Happy, 1,10, 10, 1)
const scaleHappy=math.mapRange(happyInverse, 1,10, 0.10, 0.9)
const scaleCO2_Impact=math.mapRange(CO2_Impact, 1,10,  0.0003, 0.005)
const scaleLand=math.mapRange(Land, 1,10,  0.1, 0.6)
const colorVal = scaleAge
const colorRGB = `rgb(${colorVal},${colorVal},${colorVal})`

console.log("color::", colorVal)
console.log("colorRGB::", colorRGB)

//positioning
const cx = width /2;
const cy = height * 0.45;
const w = width * scaleCO2_Impact//0.0003; //0.01
const h = height * scaleLand //0.5; //0.1

let x,y;

const radius = width * scaleHappy/4 // from 0.1 to 1

for (let i =0; i <scalePop; i++){

  const slice = degToRad(360/scalePop);// 27 to 360 //work really well
  const angle = slice * i;

  x = cx + radius * Math.sin(angle * Math.PI + variable);
  y = cy + radius * Math.cos(angle * Math.PI);

  context.save();
  context.translate(x,y);
  context.rotate(-angle+ variable );
  context.shadowOffsetX = 10;
  context.shadowOffsetY = 10;
  context.shadowBlur =  CO2_Impact*10;//
  context.shadowColor = Color//"#211BBD";

  context.beginPath();
  context.rect(-w * 1 ,- h , w , h);
  context.fillStyle = colorRGB//colorRGB;
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
  const title = "Europe";
  context.fillStyle = '#313131';
  context.font = "70px futura";
  const titleCenter = centerX(title);
  context.fillText(title, titleCenter, 950);
  context.restore()

  //Title line2 and center
  const subtitle = " Designed by... me";
  context.fillStyle = '#313131';
  context.font = "italic 30px futura";
  const subtitleCenter = centerX(subtitle);
  context.fillText(subtitle, subtitleCenter, 1000);
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

  folder = pane.addFolder({ title : "Paint Europe. 1=low 10=high"});
  folder.addInput(params, 'Population', { min: 1, max: 10 });
  folder.addInput(params, 'Land', { min: 1, max: 10 });
  folder.addInput(params, 'Age', { min: 1, max: 10 });
  folder.addInput(params, 'Happy', { min: 1, max: 10 });
  folder.addInput(params, 'CO2_Impact', { min: 1, max: 10 });
  pane.addInput(params, 'Color');
};

createPane();
