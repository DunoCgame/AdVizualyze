/*-------------------COLOR RANDOM PARA CUADORS-------------------*/
function getRandomColor(){

    const letters = '0123456789ABCDEF';

    let color = '#';

    for (let i = 0; i < 6; i++) {

        color += letters[Math.floor(Math.random() * 16)];

    }

    return color;
}


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

function rgbaToHsl(colorStr) {
  // Extraer los valores numéricos
  const match = colorStr.match(/rgba?\(([^)]+)\)/);
  if (!match) return 'Formato inválido';

  const parts = match[1].split(',').map(p => parseFloat(p.trim()));
  const [r, g, b] = parts;
  const a = parts.length === 4 ? parts[3] : 1;

  // Normalizar valores RGB
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));

    switch (max) {
      case rNorm:
        h = ((gNorm - bNorm) / delta) % 6;
        break;
      case gNorm:
        h = (bNorm - rNorm) / delta + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / delta + 4;
        break;
    }

    h *= 60;
    if (h < 0) h += 360;
  }

  // Redondear valores
  h = Math.round(h);
  s = Math.round(s * 100);
  const lRounded = Math.round(l * 100);
  const aRounded = Math.round(a * 100) / 100;

  //return `hsla(${h}, ${s}%, ${lRounded}%, ${aRounded})`;

  return {h, s, lRounded, aRounded}
}

function updateColor(divId) {
  const targetDiv = document.getElementById(divId);
  const hueRange = document.getElementById(`hueRange-${divId}`);
  const alphaRange = document.getElementById(`alphaRange-${divId}`);
  const hueLabel = document.getElementById(`hueLabel-${divId}`);
  const alphaLabel = document.getElementById(`alphaLabel-${divId}`);
  const colorPlane = document.getElementById(`colorPlane-${divId}`);

  if (targetDiv && hueRange && alphaRange && hueLabel && alphaLabel){
          
          //const hue = parseInt(hueRange.value);
          hue = parseInt(hueRange.value);

          hueLabel.textContent = hue;
         
          colorPlane.style.background = `
                  linear-gradient(to right, white, transparent),
                  linear-gradient(to top, black, transparent),
                  hsl(${hue}, 100%, 50%)
                `;

          UpdateColorDiv(divId);      
  }
}


function updateAlpha(divId) {
  const targetDiv = document.getElementById(divId);
  const alphaRange = document.getElementById(`alphaRange-${divId}`);
  const alphaLabel = document.getElementById(`alphaLabel-${divId}`);

  if(targetDiv && alphaRange && alphaLabel){
    
      alpha = parseFloat(alphaRange.value);
      alphaLabel.textContent = alpha.toFixed(2);
      UpdateColorDiv(divId);
  }
}

function ColorPanel(event,divId){
      const colorPlane = document.getElementById(`colorPlane-${divId}`);
      const rect = colorPlane.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const width = rect.width;
      const height = rect.height;

      saturation = Math.round((x / width) * 100);
      lightness = 100 - Math.round((y / height) * 100);
      value = 100 - Math.round((y / height) * 100); // para HSV

      UpdateColorDiv(divId)
}

function UpdateColorDiv(divId){

  const targetDiv = document.getElementById(divId);
  targetDiv.style.background = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
  targetDiv.querySelector(".sub-div-containner").style.background = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;

}

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
/*---------------------COLOR RANDOM PARA CUADORS-----------------------*/

/**--------------------Systema de guardado-------------------------**/
api.receive("Imagen-select-product",(event,data)=>{

  //document.getElementById(Pos_Select_id_square).childNodes[2].src=data;
    document.getElementById(Pos_Select_id_square).querySelector(".imagen-square").src=data;

})
/**-------------------------funciones de imagen------------------------------**/

function capturarDatosDesdeDiv(divElement) {

    const textContentDiv = divElement.querySelector('.text-content');
    let titulo = '';
    let contenidoHTML = '';

    if (textContentDiv) {
        const h3 = textContentDiv.querySelector('h3');
        if (h3) {
            titulo = h3.textContent;
            // Clonamos el div de contenido para extraer el HTML sin el título
            const clone = textContentDiv.cloneNode(true);
            clone.querySelector('h3').remove();
            contenidoHTML = clone.innerHTML.trim();
        } else {
            // Si no hay título, todo es contenido
            contenidoHTML = textContentDiv.innerHTML.trim();
        }
    }

    const datosDelDiv = {
        // 1. Contenido
        contenidoHTML: contenidoHTML,

        // 2. Posicionamiento del Contenido (Flexbox)
        posicionVertical: divElement.dataset.vAlign || 'flex-start',
        posicionHorizontal: divElement.dataset.hAlign || 'flex-start',

        // 3. Estilos y Posición del Contenedor
        left: divElement.dataset.left,
        top: divElement.dataset.top,
        width: divElement.dataset.width,
        height: divElement.dataset.height,
        backgroundColor: divElement.style.background
    };

    return datosDelDiv;
}

function RenderTextenDiv(divElement, datosObjeto) {
          /*
            if (!divElement || !datosObjeto) {
                console.error("No se puede cargar: falta el elemento o los datos.");
                return;
            }
            */

            // 1. CONSTRUIR EL HTML INTERNO (.text-content)
            let finalHTML = '';
            if (datosObjeto.titulo) {
                finalHTML += `<h3>${datosObjeto.titulo}</h3>`;
            }
            if (datosObjeto.contenidoHTML) {
                 finalHTML += datosObjeto.contenidoHTML;
            }

            // Crear o encontrar el contenedor de contenido de texto
            let textContentDiv = divElement.querySelector('.text-content');
            if (!textContentDiv) {
                textContentDiv = document.createElement('div');
                textContentDiv.className = 'text-content';
                divElement.appendChild(textContentDiv);
            }
            textContentDiv.innerHTML = finalHTML;

            // 2. APLICAR POSICIONAMIENTO Y ESTILOS AL DIV PRINCIPAL
            
            // Posicionamiento Flexbox (Interno)
            divElement.style.alignItems = datosObjeto.posicionVertical || 'flex-start';
            divElement.style.justifyContent = datosObjeto.posicionHorizontal || 'flex-start';
            divElement.dataset.vAlign = datosObjeto.posicionVertical;
            divElement.dataset.hAlign = datosObjeto.posicionHorizontal;

            // Tamaño y Posición (Absoluta)
            divElement.style.left = `${datosObjeto.left}%`;
            divElement.style.top = `${datosObjeto.top}%`;
            divElement.style.width = `${datosObjeto.width}%`;
            divElement.style.height = `${datosObjeto.height}%`;
            divElement.dataset.left = datosObjeto.left;
            divElement.dataset.top = datosObjeto.top;
            divElement.dataset.width = datosObjeto.width;
            divElement.dataset.height = datosObjeto.height;

            // Color de Fondo
            divElement.style.backgroundColor = datosObjeto.background;
            
            //console.log(`Div ${datosObjeto.id} reconstruido visualmente.`);
}