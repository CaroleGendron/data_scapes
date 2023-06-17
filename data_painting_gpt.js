const Tweakpane = require('tweakpane');
const math = require("canvas-sketch-util/math");

const r = 204, g = 261, b = 0;
const lineColor = `rgb(${r},${g},${b})`;

const numOfLines = 19;
const variable = Math.floor(Math.random() * 6000);

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const params = {
  Lines: 5,
  Spread: 5,
  Shape: 5,
  Texture: 5,
  Color: '#ff5c00',
}

function draw() {
  const { Lines, Spread, Shape, Texture, Color } = params;

  const indicators = ["Shape","Spread", "Lines", "Texture", "Color"];
  const selectedIndicator = indicators[Math.floor(Math.random() * indicators.length)];

  let newIndicator;
  switch(selectedIndicator) {
    case 'Shape':
      newIndicator = Shape;
      break;
    case 'Spread':
      newIndicator = Spread;
      break;
    case 'Texture':
      newIndicator = Texture;
      break;
    case 'Color':
      newIndicator = Color;
      break;
  }

  const scaleLine = math.mapRange(Lines, 1, 10, 1, 600);
  const scaleSpread = math.mapRange(Spread, 1, 10,  0.1, 0.6);
  const scaleShape = math.mapRange(Shape, 1, 10, 0.1, 0.9);
  const scaleTexture = math.mapRange(Texture, 1, 10,  0.0003, 0.006);

  const cx = canvas.width / 2;
  const cy = canvas.height * 0.45;
  const w = canvas.width * scaleTexture;
  const h = canvas.height * scaleSpread;

  let x, y;

  const radius = canvas.width * scaleShape / 4;

  for (let i = 0; i < scaleLine; i++) {
    const slice = Math.PI * 2 / scaleLine;
    const angle = slice * i;

    x = cx + radius * Math.sin(angle * Math.PI + variable);
    y = cy + radius * Math.cos(angle * Math.PI);

    context.save();
    context.translate(x,y);
    context.rotate(-angle + variable);

    context.beginPath();
    context.rect(-w, -h, w, h);
    context.fillStyle = Color;
    context.fill();
    context.restore();

    context.shadowOffsetX = 10;
    context.shadowOffsetY = 10;
    context.shadowBlur = Texture * 10;
    context.shadowColor = "rgba(30, 30, 15, 0.7)";
  }

  const centerX = (text) => {
    const metrics = context.measureText(text);
    const textWidth = metrics.width;
    return (canvas.width / 2) - (textWidth / 2);
  };

  const drawFooterText = (text, fontSize, fontStyle, yPosition) => {
    context.fillStyle = '#313131';
    context.font = `${fontStyle} ${fontSize}px futura`;
    const textCenter = centerX(text);
    context.fillText(text, textCenter, yPosition);
  };

  drawFooterText("Me, my data and I", 60, "", 950);
  drawFooterText("by Data-Scapes", 30, "italic", 1010);
  drawFooterText("ⓒ HumAIn_Art", 10, "", 1050);
}

const createPane = () => {
  const pane = new Tweakpane.Pane();

  const folder = pane.addFolder({ title : "4 painting values. 1=low 10=high"});
  folder.addInput(params, 'Lines', { min: 1, max: 10 });
  folder.addInput(params, 'Spread', { min: 1, max: 10 });
  folder.addInput(params, 'Shape', { min: 1, max: 10 });
  folder.addInput(params, 'Texture', { min: 1, max: 10 });
  pane.addInput(params, 'Color');

  pane.on('change', () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    draw();
  });
};

createPane();
draw();

