        if (event.target.closest('.resizable-div')) {
            return;
        }

        const newDiv = document.createElement('div');
        newDiv.className = 'resizable-div';
        newDiv.innerHTML = container.childNodes.length;
        newDiv.id = container.childNodes.length;


        // Obtener las dimensiones del contenedor para el cálculo de porcentajes
        const containerRect = container.getBoundingClientRect();

        // Calcular la posición y el tamaño inicial en porcentaje
        const clickX = event.clientX - containerRect.left;
        const clickY = event.clientY - containerRect.top;
        const initialWidth = 0.15 * containerRect.width; // 15% del ancho del contenedor
        const initialHeight = 0.20 * containerRect.height; // 20% del alto del contenedor
        const leftPercentage = (clickX / containerRect.width) * 100;
        const topPercentage = (clickY / containerRect.height) * 100;
        const widthPercentage = (initialWidth / containerRect.width) * 100;
        const heightPercentage = (initialHeight / containerRect.height) * 100;

        // Establecer los estilos usando los valores en porcentaje
        newDiv.style.left = `${leftPercentage}%`;
        newDiv.style.top = `${topPercentage}%`;
        newDiv.style.width = `${widthPercentage}%`;
        newDiv.style.height = `${heightPercentage}%`;
        
        // Guardar los valores de porcentaje en el dataset para usarlos en el arrastre y redimensionamiento
        newDiv.dataset.left = leftPercentage;
        newDiv.dataset.top = topPercentage;
        newDiv.dataset.width = widthPercentage;
        newDiv.dataset.height = heightPercentage
        newDiv.style.background = getRandomColor();
        newDiv.style.backgroundSize = 'contain';
        newDiv.style.backgroundPosition = 'center';
        newDiv.style.backgroundRepeat = 'no-repeat';
      

        // Crear y añadir el "mango" de redimensionamiento
        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'resize-handle';
        newDiv.appendChild(resizeHandle);
            
        // Contenedor de controles
        /*
        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'controls';
        */

        // Botón de Borrar
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '❌'; // Usa un emoji para un mejor diseño
        deleteButton.className = 'delete-btn';
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            newDiv.remove();
        });

        const imageButton = document.createElement('button');
        imageButton.textContent = '🖼️';
        imageButton.className = 'image-btn';
        imageButton.addEventListener('click', (e) => {
            e.stopPropagation();
            Pos_Select_id=newDiv.id;
            console.log("creado por click")
            api.send("Select-Imagen-product");
        });

        // NUEVO BOTÓN PARA CAMBIAR EL COLOR
        // Botón de Color
        const colorButton = document.createElement('button');
        colorButton.textContent = '🎨';
        colorButton.className = 'color-btn';
        colorButton.addEventListener('click', (e) => {

            if(document.getElementById("containner_color_select").className=="Show_Color_select"){

                document.getElementById("containner_color_select").classList.replace("Show_Color_select","Hide_Color_select");       
            }
            else{

                 document.getElementById("containner_color_select").classList.replace("Hide_Color_select","Show_Color_select");
            }

        });
       
        controlsDiv.appendChild(imageButton);
        controlsDiv.appendChild(colorButton);
        controlsDiv.appendChild(deleteButton);
        //controlsDiv.appendChild(SelectColor);
        newDiv.appendChild(controlsDiv);
        container.appendChild(newDiv);

        makeResizableAndDraggable(newDiv);


        let hue = 180;
    let alpha = 1;
    let saturation = 100;
    let lightness = 50;

function Color(inputElement,element) {
  //console.log("El valor del input es: " + inputElement.value);
  // You can also access other attributes like the ID:
  //console.log("El ID del input es: " + inputElement.id);

  hue = parseInt(hueRange.value);
  UpdateColorSquare(element)
}


function Alfa(inputElement) {
 // console.log("El valor del input es: " + inputElement.value);
  // You can also access other attributes like the ID:
  //console.log("El ID del input es: " + inputElement.id);
 // alpha = parseFloat(inputElement.value);
  //UpdateColorSquare(element)

  console.log(inputElement)
}

function UpdateColorSquare(element){
  console.log(element)

  //console.log(document.getElementById(element))

    colorPlane.style.background = `
        linear-gradient(to right, white, transparent),
        linear-gradient(to top, black, transparent),
        hsl(${hue}, 100%, 50%)
      `;

/*
   const rgb = hslToRgb(hue, saturation, lightness);
        colorStr = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
        document.getElementById(element).style.backgroundColor = colorStr;
*/

}

  function hslToRgb(h, s, l) {
      s /= 100;
      l /= 100;
      const k = n => (n + h / 30) % 12;
      const a = s * Math.min(l, 1 - l);
      const f = n => {
        const color = l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
        return Math.round(255 * color);
      };
      return { r: f(0), g: f(8), b: f(4) };
    }



/*----------------------------------------------------*/

       controlsDiv.innerHTML = `<div class="Hide_Color_select" id="containner_color_select">
                                <div class="slider-group">
                                    <label for="hueRange">Matiz (Hue): <span id="hueLabel">180</span></label>
                                     <input type="range" id="hueRange" min="0" max="360" value="180" onclick="Color(this,'${newDiv.id}')">
                                </div>
                                <div class="slider-group">
                                    <label for="alphaRange">Alpha: <span id="alphaLabel">1</span></label>
                                    <input type="range" id="alphaRange" min="0" max="1" step="0.01" value="1" onclick="Alfa(this,'${newDiv.id}')">
                                </div>
                                <div class="color-plane" id="colorPlane" onclick="ColorPanel(this,event,'${newDiv.id}')"></div>
                            </div>`;


const SelectColor = document.createElement('div'); 
          SelectColor.innerHTML = `<div class="Hide_Color_select" id="containner_color_select">
                                <div class="slider-group">
                                    <label for="hueRange">Matiz (Hue): <span id="hueLabel">180</span></label>
                                     <input type="range" id="hueRange" min="0" max="360" value="180" onclick="Color(this,'${newDiv.id}')">
                                </div>
                                <div class="slider-group">
                                    <label for="alphaRange">Alpha: <span id="alphaLabel">1</span></label>
                                    <input type="range" id="alphaRange" min="0" max="1" step="0.01" value="1" onclick="Alfa(this,'${newDiv.id}')">
                                </div>
                                <div class="color-plane" id="colorPlane" onclick="ColorPanel(this,event,'${newDiv.id}')"></div>
                            </div>`;
                          

<div class="Color_select" id="containner_color_select">
<div class="slider-group">
    <label for="hueRange">Matiz (Hue): <span id="hueLabel">180</span></label>
    <input type="range" id="hueRange" min="0" max="360" value="180">
  </div>

  <div class="slider-group">
    <label for="alphaRange">Alpha: <span id="alphaLabel">1</span></label>
    <input type="range" id="alphaRange" min="0" max="1" step="0.01" value="1">
  </div>

  <div class="color-plane" id="colorPlane"></div>
</div>



function hexToHSL(hex) {
          // Remove '#' if it exists
          hex = hex.replace(/^#/, '');

          // Parse HEX to RGB
          const r = parseInt(hex.substring(0, 2), 16);
          const g = parseInt(hex.substring(2, 4), 16);
          const b = parseInt(hex.substring(4, 6), 16);

          // Normalize RGB values to the range [0, 1]
          const rNormalized = r / 255;
          const gNormalized = g / 255;
          const bNormalized = b / 255;

          // Find the maximum and minimum RGB values
          const max = Math.max(rNormalized, gNormalized, bNormalized);
          const min = Math.min(rNormalized, gNormalized, bNormalized);

          let h, s, l = (max + min) / 2;

          if (max === min) {
            // Achromatic (gray)
            h = 0;
            s = 0;
          } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
              case rNormalized:
                h = (gNormalized - bNormalized) / d + (gNormalized < bNormalized ? 6 : 0);
                break;
              case gNormalized:
                h = (bNormalized - rNormalized) / d + 2;
                break;
              case bNormalized:
                h = (rNormalized - gNormalized) / d + 4;
                break;
            }

            h /= 6;
          }

          // Convert HSL values to the desired ranges
          h = Math.round(h * 360); // Hue: 0-360
          s = Math.round(s * 100); // Saturation: 0-100%
          l = Math.round(l * 100); // Lightness: 0-100%

          return { h, s, l };
}

// Example usage:
const hexColor = '#3498db'; // A shade of blue
const hslColor = hexToHSL(hexColor);
console.log(`HEX: ${hexColor} -> HSL: H=${hslColor.h}, S=${hslColor.s}%, L=${hslColor.l}%`);
// Output: HEX: #3498db -> HSL: H=204, S=70%, L=53%

const anotherHex = '#e74c3c'; // A shade of red
const anotherHsl = hexToHSL(anotherHex);
console.log(`HEX: ${anotherHex} -> HSL: H=${anotherHsl.h}, S=${anotherHsl.s}%, L=${anotherHsl.l}%`);
// Output: HEX: #e74c3c -> HSL: H=7, S=80%, L=56%

function rgbToHls(r, g, b) {
  // Normalize R, G, B values to the range [0, 1]
  r /= 255;
  g /= 255;
  b /= 255;

  // Find the maximum and minimum values among R, G, B
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let h, s, l;

  // Calculate Lightness (L)
  l = (max + min) / 2;

  // Calculate Saturation (S) and Hue (H)
  if (max === min) {
    // Achromatic (gray)
    h = 0;
    s = 0;
  } else {
    const d = max - min;

    // Calculate Saturation (S)
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    // Calculate Hue (H)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6; // Normalize H to the range [0, 1]
  }

  // Convert H to degrees [0, 360]
  h *= 360;

  return { h, s, l };
}

// Example usage:
const rgbColor = { r: 255, g: 0, b: 128 }; // A reddish-pink
const hlsColor = rgbToHls(rgbColor.r, rgbColor.g, rgbColor.b);

console.log(`RGB: (${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`);
console.log(`HLS: H=${hlsColor.h.toFixed(2)}°, S=${(hlsColor.s * 100).toFixed(2)}%, L=${(hlsColor.l * 100).toFixed(2)}%`);

const black = { r: 0, g: 0, b: 0 };
const hlsBlack = rgbToHls(black.r, black.g, black.b);
console.log(`RGB: (${black.r}, ${black.g}, ${black.b})`);
console.log(`HLS: H=${hlsBlack.h.toFixed(2)}°, S=${(hlsBlack.s * 100).toFixed(2)}%, L=${(hlsBlack.l * 100).toFixed(2)}%`);

const white = { r: 255, g: 255, b: 255 };
const hlsWhite = rgbToHls(white.r, white.g, white.b);
console.log(`RGB: (${white.r}, ${white.g}, ${white.b})`);
console.log(`HLS: H=${hlsWhite.h.toFixed(2)}°, S=${(hlsWhite.s * 100).toFixed(2)}%, L=${(hlsWhite.l * 100).toFixed(2)}%`);



function convertDivBackgroundToHls(divId) {
          const divElement = document.getElementById(divId);

          console.log(divId) 

          if (!divElement) {
            console.error(`Element with ID "${divId}" not found.`);
            return null;
          }

          const backgroundColor = window.getComputedStyle(divElement).background;

          // Extraer los valores R, G, B de la cadena
          // El formato puede ser rgb(r, g, b) o rgba(r, g, b, a)
          const rgbMatch = backgroundColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
          const rgbaMatch = backgroundColor.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d\.]+)\)$/);

          let r, g, b;

          if (rgbMatch) {
            r = parseInt(rgbMatch[1], 10);
            g = parseInt(rgbMatch[2], 10);
            b = parseInt(rgbMatch[3], 10);
          } else if (rgbaMatch) {
            r = parseInt(rgbaMatch[1], 10);
            g = parseInt(rgbaMatch[2], 10);
            b = parseInt(rgbaMatch[3], 10);
            // Nota: El canal alfa (transparencia) no se utiliza directamente en HLS
          } else {
            console.error(`Could not parse background color: ${backgroundColor}`);
            return null;
          }

          return rgbToHls(r, g, b);
}


const divIdToConvert = 'myDiv';
const hlsColor = convertDivBackgroundToHls(divIdToConvert);

if (hlsColor) {
  console.log(`El color HLS para el div "${divIdToConvert}" es:`);
  console.log(`Hue (H): ${(hlsColor.h * 360).toFixed(2)}°`); // Convertir a grados (0-360)
  console.log(`Lightness (L): ${(hlsColor.l * 100).toFixed(2)}%`);
  console.log(`Saturation (S): ${(hlsColor.s * 100).toFixed(2)}%`);
}



    <div class="color-plane" id="colorPlane-${uniqueId}" onclick="ColorPanel(event,'${uniqueId}')" style="background:linear-gradient(to right, white, transparent), linear-gradient(to top, black, transparent), hsl(${hexToHSL(ColorAleatorio).h}, 100%, 50%)"></div>`;
style="background:linear-gradient(to right, white, transparent), linear-gradient(to top, black, transparent), hsl(${hexToHSL(ColorAleatorio).h}, 100%, 50%)"


    background: linear-gradient(rgb(0, 51, 153), rgb(102, 0, 102));

*/
function extraerColoresDeGradiente(idElemento) {
  const elemento = document.getElementById(idElemento);
  if (!elemento) {
    console.warn("Elemento no encontrado");
    return [];
  }

  const estilo = window.getComputedStyle(elemento).backgroundImage;

  // Expresión regular para capturar todos los colores rgb o rgba
  const regex = /rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})(?:,\s*[\d.]+)?\)/g;

  const colores = [];
  let match;
  while ((match = regex.exec(estilo)) !== null) {
    colores.push(match[0]); // match[0] contiene el string completo: rgb(...) o rgba(...)
  }

  return colores;
}

function extraerColoresDeGradiente(style){
 
  const estilo = style;

  // Expresión regular para capturar todos los colores rgb o rgba
  const regex = /rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})(?:,\s*[\d.]+)?\)/g;

  const colores = [];
  let match;
  while ((match = regex.exec(estilo)) !== null) {
    colores.push(match[0]); // match[0] contiene el string completo: rgb(...) o rgba(...)
  }

  return colores;
}


/*----------------------------------------------------------------*/

function rgbToHex(rgbString) {
  // 1. Extraer los valores R, G, B
  const match = rgbString.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

  if (!match) {
    return null; // Retorna null si el formato no es el esperado
  }

  const r = parseInt(match[1], 10);
  const g = parseInt(match[2], 10);
  const b = parseInt(match[3], 10);

  // 2. Convertir cada valor a hexadecimal
  const toHex = (c) => {
    const hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  const hexR = toHex(r);
  const hexG = toHex(g);
  const hexB = toHex(b);

  // 3. Concatenar los valores hexadecimales
  return `#${hexR}${hexG}${hexB}`;
}

const rgbColor = "rgb(33, 150, 243)";
const hexColor = rgbToHex(rgbColor);

console.log(`El color RGB ${rgbColor} en hexadecimal es: ${hexColor}`); // Salida: #2196f3