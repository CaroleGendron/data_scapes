//////-------------------- REQUIRED LIBRARIES------------------///

const canvasSketch = require('canvas-sketch');
const Tweakpane = require('tweakpane');
const math = require('canvas-sketch-util/math');
const color = require('tinycolor2');

//////-------------------- SKETCH SET UP------------------///

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

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
    Lines,
    Spread,
    Shape,
    Texture,
    Color,
  };

  //console log the value
  const keys = ["Lines", "Spread", "Shape", "Texture", "Color"];

  for(let key of keys) {
    console.log(`${key} = ${params[key]}`);
  }
    console.log (r)

    const createPane = () => {
      const pane = new Tweakpane.Pane();

      const folder = pane.addFolder({ title: '5 data-driven painting elements' });
      folder.addInput(params, 'Lines', { min: 1, max: 10 });
      folder.addInput(params, 'Spread', { min: 1, max: 10 });
      folder.addInput(params, 'Shape', { min: 1, max: 7.6 });
      folder.addInput(params, 'Texture', { min: 1, max: 10 });
      folder.addInput(params, 'Color');

      pane.on('change', () => {
        // Trigger sketch re-render on parameter change
        sketch();
      });
    };

    //////-------------------- MAKE THE PAINTING/DRAWING------------------///
    
    const sketch = () => {
      return ({ context, width, height }) => {
        context.fillStyle = '#F6F3E1';
        context.fillRect(0, 0, width, height);

        const scaleLine = math.mapRange(params.Lines, 1, 10, 1, 600);
        const scaleSpread = math.mapRange(params.Spread, 1, 10, 0.1, 0.6);
        const ShapeInverse = math.mapRange(params.Shape, 1, 10, 10, 1);
        const scaleShape = math.mapRange(ShapeInverse, 1, 10, 0.1, 0.9);
        const scaleTexture = math.mapRange(params.Texture, 1, 10, 0.0003, 0.006);

        const cx = width / 2;
        const cy = height * 0.45;
        const w = width * scaleTexture;
        const h = height * scaleSpread;

        let x, y;
        const radius = width * scaleShape / 4;

        for (let i = 0; i < scaleLine; i++) {
          const slice = degToRad(360 / scaleLine);
          const angle = slice * i;
          const randomShift = Math.random() * 0.2 - 0.1; // Random shift

          x = cx + radius * Math.sin((angle + randomShift) * Math.PI);
          y = cy + radius * Math.cos((angle + randomShift) * Math.PI);

          context.save();
          context.translate(x, y);
          context.rotate(-angle + randomShift);

          // Change shape based on Shape parameter
          if (ShapeInverse <= 3) {
            // Draw rectangle
            context.beginPath();
            context.rect(-w * (i/scaleLine) * 1, -h, w, h * (i/scaleLine)); // Change size based on i
          } else if (ShapeInverse <= 7) {
            // Draw circle
            context.beginPath();
            context.arc(0, 0, w * (i/scaleLine), 0, Math.PI * 2);
          } else {
            // Draw triangle
            context.beginPath();
            context.moveTo(-w * (i/scaleLine) / 2, h * (i/scaleLine) / 2);
            context.lineTo(w * (i/scaleLine) / 2, h * (i/scaleLine) / 2);
            context.lineTo(0, -h * (i/scaleLine) / 2);
            context.closePath();
          }

          context.fillStyle = params.Color;
          context.fill();
          context.restore();

          context.shadowOffsetX = 10;
          context.shadowOffsetY = 10;
          context.shadowBlur = params.Texture * 10;
          context.shadowColor = 'rgba(30, 30, 15, 0.7)';
        }



        //Function "centerX" to find center position x, automatically
        const centerX = (text) => {
          const metrics = context.measureText(text);
          const textWidth = metrics.width;
          return width / 2 - textWidth / 2;
        };

        //Title line1 and center
        const title = 'Me, my data and I';
        context.fillStyle = '#313131';
        context.font = '60px futura';
        const titleCenter = centerX(title);
        context.fillText(title, titleCenter, 950);
        context.restore();

        //Title line2 and center
        const subtitle = 'by Data-Scapes Atelier';
        context.fillStyle = '#313131';
        context.font = 'italic 30px futura';
        const subtitleCenter = centerX(subtitle);
        context.fillText(subtitle, subtitleCenter, 1010);
        context.restore();

        //Title serie name + font
        const serie = 'ⓒ HumAIn_Art';
        context.font = '10px futura';
        const serieCenter = centerX(serie);
        context.fillText(serie, serieCenter, 1050);
        context.restore();
      };
    };

    canvasSketch(sketch, settings);
    createPane();
  });

//////-------------------- HELPER FUNCTIONS------------------///

const degToRad = (degrees) => {
  return (degrees / 180) * Math.PI;
};


// //////-------------------- REQUIRED LIBRARIES------------------///

// const canvasSketch = require('canvas-sketch');
// const Tweakpane = require('tweakpane');
// const math = require('canvas-sketch-util/math');
// const color = require('tinycolor2');

// //////-------------------- SKETCH SET UP------------------///

// const settings = {
//   dimensions: [1080, 1080],
//   animate: true,
// };

// //////-------------------- DATA VARIABLE INPUT------------------///

// // Function to load JSON data
// async function loadJSON(url) {
//   const response = await fetch(url);
//   return response.json();
// }

// // Load the face_attributes_json file
// loadJSON('output.json').then((faceAttributes) => {
//   const {
//     Age_Median,
//     Smile,
//     Gender,
//     Age_Range,
//     Average_Color,
//   } = faceAttributes.Face_1;

//   const randomAdjustment = () => Math.floor(Math.random() * 21) - 10; // random number between -10 and 10

//   const r = math.clamp(Math.round(Average_Color[0]) + randomAdjustment(), 0, 255);
//   const g = math.clamp(Math.round(Average_Color[1]) + randomAdjustment(), 0, 255);
//   const b = math.clamp(Math.round(Average_Color[2]) + randomAdjustment(), 0, 255);


//   //Mapping element with json values
//   const Lines =  Age_Median;
//   const Spread = Smile;
//   const Shape = Gender;
//   const Texture = Age_Range;
//   const Color = `rgb(${r}, ${g}, ${b})`;

//   const params = {
//     Lines,
//     Spread,
//     Shape,
//     Texture,
//     Color,
//   };

//   //console log the value
//   const keys = ["Lines", "Spread", "Shape", "Texture", "Color"];

//   for(let key of keys) {
//     console.log(`${key} = ${params[key]}`);
//   }
//     console.log (r)

//     const createPane = () => {
//       const pane = new Tweakpane.Pane();

//       const folder = pane.addFolder({ title: '5 data-driven painting elements' });
//       folder.addInput(params, 'Lines', { min: 1, max: 10 });
//       folder.addInput(params, 'Spread', { min: 1, max: 10 });
//       folder.addInput(params, 'Shape', { min: 1, max: 10 });
//       folder.addInput(params, 'Texture', { min: 1, max: 10 });
//       folder.addInput(params, 'Color');

//       pane.on('change', () => {
//         // Trigger sketch re-render on parameter change
//         sketch();
//       });
//     };

//     const sketch = () => {
//       return ({ context, width, height }) => {
//         context.fillStyle = '#F6F3E1';
//         context.fillRect(0, 0, width, height);

//         const scaleLine = math.mapRange(params.Lines, 1, 10, 1, 600);
//         const scaleSpread = math.mapRange(params.Spread, 1, 10, 0.1, 0.6);
//         const ShapeInverse = math.mapRange(params.Shape, 1, 10, 10, 1);
//         const scaleShape = math.mapRange(ShapeInverse, 1, 10, 0.1, 0.9);
//         const scaleTexture = math.mapRange(params.Texture, 1, 10, 0.0003, 0.006);

//         const cx = width / 2;
//         const cy = height * 0.45;
//         const w = width * scaleTexture;
//         const h = height * scaleSpread;

//         let x, y;
//         const radius = width * scaleShape / 4;

//         for (let i = 0; i < scaleLine; i++) {
//           const slice = degToRad(360 / scaleLine);
//           const angle = slice * i;

//           x = cx + radius * Math.sin(angle * Math.PI);
//           y = cy + radius * Math.cos(angle * Math.PI);

//           context.save();
//           context.translate(x, y);
//           context.rotate(-angle);

//           context.beginPath();
//           context.rect(-w * 1, -h, w, h);
//           context.fillStyle = params.Color;
//           context.fill();
//           context.restore();

//           context.shadowOffsetX = 10;
//           context.shadowOffsetY = 10;
//           context.shadowBlur = params.Texture * 10;
//           context.shadowColor = 'rgba(30, 30, 15, 0.7)';
//         }

//         //Function "centerX" to find center position x, automatically
//         const centerX = (text) => {
//           const metrics = context.measureText(text);
//           const textWidth = metrics.width;
//           return width / 2 - textWidth / 2;
//         };

//         //Title line1 and center
//         const title = 'Me, my data and I';
//         context.fillStyle = '#313131';
//         context.font = '60px futura';
//         const titleCenter = centerX(title);
//         context.fillText(title, titleCenter, 950);
//         context.restore();

//         //Title line2 and center
//         const subtitle = 'by Data-Scapes Atelier';
//         context.fillStyle = '#313131';
//         context.font = 'italic 30px futura';
//         const subtitleCenter = centerX(subtitle);
//         context.fillText(subtitle, subtitleCenter, 1010);
//         context.restore();

//         //Title serie name + font
//         const serie = 'ⓒ HumAIn_Art';
//         context.font = '10px futura';
//         const serieCenter = centerX(serie);
//         context.fillText(serie, serieCenter, 1050);
//         context.restore();
//       };
//     };

//     canvasSketch(sketch, settings);
//     createPane();
//   });

// //////-------------------- HELPER FUNCTIONS------------------///

// const degToRad = (degrees) => {
//   return (degrees / 180) * Math.PI;
// };
