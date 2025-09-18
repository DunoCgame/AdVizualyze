let Pos_Select_id_square;
let Pos_Select_id_area;
let Estado_action;
let pos_array=0;

console.clear();

api.send('Data-System') /**solicita la informacion al cargar la aplicacion**/
api.send('app_version');


   const version = document.getElementById('version');


        api.receive('app_version', (event, arg) => {

                version.title = arg.name +" "+ arg.version;
                version.innerHTML = arg.name +" "+ arg.version;

        });


api.receive("Send-data-server",(event,server)=>{

  document.getElementById("servidor").innerHTML=server;
  
})

api.receive("Send-data-default",(event,data)=>{

    /*esta funcion se encarga de carga la informacion al cargar la aplicacion*/
    console.log("Send-data-default",data);

    Render_data_app(data, pos_array);
    
    document.getElementById("SectionControl_Select_Section").innerHTML=""
     
    data.forEach((element,index)=>{

        document.getElementById("SectionControl_Select_Section").innerHTML+=`<option value="${element.id}">${element.name_area}</option>`;

    })
 
})

api.receive("Render_Data_search",(event,data)=>{

    console.log("Render_Data_search");
   
   Render_data_app(data, pos_array);

})

/**la funcion obtiene la informacion nueva al guardar o agregar nueva data***/
api.receive("Render-Data-reload-change",(event,data)=>{

      console.log("Render-Data-reload-change" , Estado_action)

         if(Estado_action=="nuevo"){

            pos_array=data.length-1;
            Render_data_app(data, pos_array);
            Render_data_select(data, pos_array);
            pos_array=0;

         }

         if(Estado_action=="Borrar"){

           pos_array=data.length-1;
           Render_data_app(data, pos_array);
           Render_data_select(data, pos_array);
           pos_array=0;
                 
         }
});

/**la funcion obtiene la informacion nueva al guardar o agregar nueva data***/

function Render_data_app(Data_area_render_info,pos_array){
      
    /*************************AREA 1 SELECTRO CUADRICULA*****************************************/
    document.getElementById("container_area").innerHTML="";

    document.getElementById("container_area").innerHTML=`<div class="Containner-Área-de-imágenes"> 
            <div class="Containner-Área-de-imágenes-btn"> 
                  <button id="btn_add_image_section" class="icon-image  btnEfect" onclick="Open_Image_Select_area()" >Agregar Imagen</button> 
                  <span class="NameAreacontainner">Nombre del Area: <input type="text" id="SectionControl_TitleArea" class="nombre-area" value='${Data_area_render_info[pos_array].name_area}'>
                  </span> 
                  <button id="update_area" class="update_area btnEfect" onclick="Guardar('${Data_area_render_info[pos_array].id}')">Guardar</button>
                  <button id="delet_area" class="delet_area btnEfect" onclick="Borrar_area('${Data_area_render_info[pos_array].id}')">Borrar</button>
                    <!----------------------------------------->
                      <div class="gradiente-btn-container">
                          <button class="gradiente-btn" onclick="showSystemColor('controles-gradiente','${Data_area_render_info[pos_array].id}')">Opciones de Degradado</button>
                          <div class="controles-gradiente" style="display:none;">
                                  <!--------------------------------------->
                                        <span>Tipo:</span>
                                        <select id="gradientType">
                                            <option value="linear">Lineal</option>
                                            <option value="radial">Radial</option>
                                        </select>
                                        <span id="angleLabel">Ángulo: 0°</span>
                                        <input type="range" id="gradientAngle" min="0" max="360" value="180">
                                        <span>Colores:</span>
                                        <input type="color" id="gradientColor1" value="#003399">
                                        <input type="color" id="gradientColor2" value="#660066">
                                  <!----------------------------------------->
                          </div>
                      </div>
                    <!----------------------------------------->
            </div> 
            <div class="Containner-work-area" id="${Data_area_render_info[pos_array].id}"> </div>
          </div>`;
    let IDContainner = document.getElementById(`${Data_area_render_info[pos_array].id}`);
  
  //  console.log(IDContainner)

        IDContainner.style.background = Data_area_render_info[pos_array].background;
        IDContainner.style.backgroundSize = 'cover';
        IDContainner.style.backgroundPosition = 'center';
        IDContainner.style.backgroundRepeat = 'no-repeat';

        //console.log(IDContainner.style.background)
    /*----------------------------------------------------------------------*/
if (tieneImagenDeFondo(IDContainner)) {
  
 // console.log('El elemento tiene una imagen de fondo.');

} else {
  
  //console.log('El elemento NO tiene una imagen de fondo.');

    let ColorExtraido = extraerColoresDeGradiente(IDContainner.style.background);
  
    const hexColor1 = rgbToHex(ColorExtraido[0]);
    const hexColor2 = rgbToHex(ColorExtraido[1]);

    document.getElementById("gradientColor1").value = hexColor2;
    document.getElementById("gradientColor2").value = hexColor1;



}


    /*---------------------------------------------------------------------*/

    /*-----------------------------------------*/
    if(Data_area_render_info[pos_array].product.length>0){
      
        Data_area_render_info[pos_array].product.forEach((element,index)=>{
         
                    const newDiv = document.createElement('div');
                    newDiv.className = 'resizable-div';
                    newDiv.innerHTML = IDContainner.childNodes.length;
                    /*newDiv.id = index;*/
                    newDiv.id = element.id;
                    newDiv.style.left = element.left;
                    newDiv.style.top = element.top;
                    newDiv.style.width = element.width; // Tamaño inicial un poco más grande
                    newDiv.style.height = element.height;
                    newDiv.style.background = element.background;
                    newDiv.style.backgroundSize = 'cover';
                    newDiv.style.backgroundPosition = 'center';
                    newDiv.style.backgroundRepeat = 'no-repeat';
                    newDiv.addEventListener('click', (e) => {
                      /*------------------------------------------------------*/
                          // Asegurarse de que el div inicialice correctamente
                          initializeDiv(newDiv);

                          // Aplicar la funcionalidad al div inicial
                          makeDraggableAndResizable(newDiv);
                      /*------------------------------------------------------*/
                    })


                    // Controles: Botones de Borrar y Añadir Imagen
                    const controlsDiv = document.createElement('div');
                    controlsDiv.className = 'controls';

                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = '❌'; // Usa un emoji para un mejor diseño
                    deleteButton.className = 'delete-btn ';
                    deleteButton.addEventListener('click', (e) => {
                        e.stopPropagation(); // Evita que el click en el botón afecte al padre
                        newDiv.remove();
                    });

                    const imageButton = document.createElement('button');
                   /* imageButton.textContent = '🖼️';*/
                    imageButton.className = 'image-btn icon-images';
                    imageButton.addEventListener('click', (e) => {
                        e.stopPropagation(); // Evita que el click en el botón afecte al padre
                       
                        Pos_Select_id_square = newDiv.id;
                       
                        console.log("creado por render ",Pos_Select_id_square)
                       
                        api.send("Select-Imagen-product");

                    });

                    const colorButton = document.createElement('button');
                    colorButton.textContent = '🎨';
                    colorButton.className = 'color-btn';
                    colorButton.addEventListener('click', (e) => {
                      e.stopPropagation();
                      const colorPicker = document.createElement('input');
                      colorPicker.type = 'color';
                      colorPicker.addEventListener('input', (event) => {
                          newDiv.style.backgroundColor = event.target.value;
                      });
                      colorPicker.click(); // Simula un clic en el selector de color
                    });

                    
                    controlsDiv.appendChild(imageButton);
                    controlsDiv.appendChild(colorButton); // Añade el nuevo botón de color
                    controlsDiv.appendChild(deleteButton);
                    newDiv.appendChild(controlsDiv);
                    IDContainner.appendChild(newDiv);

        })

    }

    /*-----------------------------------------------------------------------*/
    /*******Efecto de tamaño par cuador creados por render***********/
    function makeDraggableAndResizable(element) {

      console.log("makeDraggableAndResizable  ",element)

        let isResizing = false;
        let isDragging = false;
        let startX, startY;
        let startLeft, startTop, startWidth, startHeight;

        // Crear el "mango" de redimensionamiento
        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'resize-handle';
        element.appendChild(resizeHandle);

        // Evento mousedown para arrastrar
        element.addEventListener('mousedown', (e) => {
            if (e.target.className === 'resize-handle') {
                isResizing = true;
            } else {
                isDragging = true;
            }
            e.stopPropagation();
            startX = e.clientX;
            startY = e.clientY;

            // Obtener dimensiones y posición iniciales en porcentajes
            startLeft = parseFloat(element.style.left);
            startTop = parseFloat(element.style.top);
            startWidth = parseFloat(element.style.width);
            startHeight = parseFloat(element.style.height);
        });

        // Evento mousemove para redimensionar o arrastrar
        document.addEventListener('mousemove', (e) => {
            const containerRect = IDContainner.getBoundingClientRect();

            if (isResizing) {
                const newWidthPercentage = Math.max(1, startWidth + ((e.clientX - startX) / containerRect.width) * 100);
                const newHeightPercentage = Math.max(1, startHeight + ((e.clientY - startY) / containerRect.height) * 100);
                
                element.style.width = `${newWidthPercentage}%`;
                element.style.height = `${newHeightPercentage}%`;
            } else if (isDragging) {
                const newLeftPercentage = startLeft + ((e.clientX - startX) / containerRect.width) * 100;
                const newTopPercentage = startTop + ((e.clientY - startY) / containerRect.height) * 100;
                
                element.style.left = `${newLeftPercentage}%`;
                element.style.top = `${newTopPercentage}%`;
            }
        });

        // Evento mouseup para detener ambas operaciones
        document.addEventListener('mouseup', () => {
            isResizing = false;
            isDragging = false;
        });
    }

    function initializeDiv(divElement) {
        const containerRect = IDContainner.getBoundingClientRect();
        const divRect = divElement.getBoundingClientRect();
        
        const initialLeft = ((divRect.left - containerRect.left) / containerRect.width) * 100;
        const initialTop = ((divRect.top - containerRect.top) / containerRect.height) * 100;
        const initialWidth = (divRect.width / containerRect.width) * 100;
        const initialHeight = (divRect.height / containerRect.height) * 100;

        divElement.style.left = `${initialLeft}%`;
        divElement.style.top = `${initialTop}%`;
        divElement.style.width = `${initialWidth}%`;
        divElement.style.height = `${initialHeight}%`;
    }

     /*******Efecto de tamaño par cuador creados por render***********/

/******************CREAR GENERADOR DE AREAS****************************/
  IDContainner.addEventListener('click', (event) => {
      
      // Evita la creación de un nuevo div si se hace clic en un div redimensionable existente
      if (event.target.closest('.resizable-div')) {
          return;
      }

      const newDiv = document.createElement('div');
      newDiv.className = 'resizable-div';
      const uniqueId = `resizable-div-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      newDiv.id = uniqueId;

      // Obtener las dimensiones del contenedor para el cálculo de porcentajes
      const containerRect = IDContainner.getBoundingClientRect();

      // Calcular la posición y el tamaño inicial en porcentaje
      const clickX = event.clientX - containerRect.left;
      const clickY = event.clientY - containerRect.top;
      const initialWidth = 0.25 * containerRect.width; // 15% del ancho del contenedor
      const initialHeight = 0.35 * containerRect.height; // 20% del alto del contenedor
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
      newDiv.dataset.height = heightPercentage;

      let ColorAleatorio = getRandomColor();

      // Asignar un color aleatorio inicial
      newDiv.style.background = ColorAleatorio
      newDiv.style.backgroundSize = 'cover';
      newDiv.style.backgroundPosition = 'center';
      newDiv.style.backgroundRepeat = 'no-repeat';

      // Crear y añadir el "mango" de redimensionamiento
      const resizeHandle = document.createElement('div');
      resizeHandle.className = 'resize-handle';
      newDiv.appendChild(resizeHandle);

        //Contenedor de controles
        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'controls';

        const colorControls = document.createElement('div');
        colorControls.className = 'Hide_Color_select';
        colorControls.id = `containner_color_select-${uniqueId}`;
        colorControls.innerHTML = `
          <div class="slider-group">
            <label for="hueRange-${uniqueId}">Matiz (Hue): <span id="hueLabel-${uniqueId}">${hexToHSL(ColorAleatorio).h}</span></label>
            <input type="range" id="hueRange-${uniqueId}" min="0" max="360" value="${hexToHSL(ColorAleatorio).h}" oninput="updateColor('${uniqueId}')">
          </div>
          <div class="slider-group">
            <label for="alphaRange-${uniqueId}">Alpha: <span id="alphaLabel-${uniqueId}">1</span></label>
            <input type="range" id="alphaRange-${uniqueId}" min="0" max="1" step="0.01" value="1" oninput="updateAlpha('${uniqueId}')">
          </div>
          <div class="color-plane" id="colorPlane-${uniqueId}" onclick="ColorPanel(event,'${uniqueId}')" style="background:linear-gradient(to right, white, transparent), linear-gradient(to top, black, transparent), hsl(${hexToHSL(ColorAleatorio).h}, 100%, 50%)"></div>`;

          controlsDiv.appendChild(colorControls);

      // Botón de Borrar
      const deleteButton = document.createElement('button');
      deleteButton.textContent = '❌'; // Usa un emoji para un mejor diseño
      deleteButton.className = 'delete-btn';
      deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            newDiv.remove();
      });

      // Botón para seleccionar imagen
      const imageButton = document.createElement('button');
      imageButton.className = 'image-btn icon-images';
      imageButton.addEventListener('click', (e) => {
          e.stopPropagation();
         
          Pos_Select_id_square = newDiv.id; // Ejemplo de cómo usar una variable global
          console.log("Elemento seleccionado:  ", newDiv.id);
          api.send("Select-Imagen-product");
   
      });

      // Botón para cambiar el color (toggle de los controles de color)
        const colorButton = document.createElement('button');
        colorButton.textContent = '🎨';
        colorButton.className = 'color-btn';
        colorButton.onclick = (e) => {
          e.stopPropagation();
          const controlsContainer = document.getElementById(`containner_color_select-${uniqueId}`);
          if (controlsContainer) {
              controlsContainer.classList.toggle("Show_Color_select");
              controlsContainer.classList.toggle("Hide_Color_select");
          }
        };

      // Añadir botones a controlsDiv
      controlsDiv.appendChild(imageButton);
      controlsDiv.appendChild(colorButton); // Botón para mostrar/ocultar controles de color
      controlsDiv.appendChild(deleteButton);
      newDiv.appendChild(controlsDiv);

      IDContainner.appendChild(newDiv);

      // Asumiendo que makeResizableAndDraggable está definida en tu script
      makeResizableAndDraggable(newDiv);
  });
/******************CREAR GENERADOR DE AREAS****************************/


}

let saturation = 100;
let lightness = 50;
let alpha = 1;
let hue = 0;

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

          //targetDiv.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;
          //targetDiv.style.opacity = alpha;
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
      /*
      const alpha = parseFloat(alphaRange.value);
      targetDiv.style.opacity = alpha;
      alphaLabel.textContent = alpha.toFixed(2);
      */
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

function tieneImagenDeFondo(elemento) {
  const estilos = window.getComputedStyle(elemento);
  const backgroundImage = estilos.backgroundImage;
  return backgroundImage.startsWith('url(');
}
/*-------------------------------------------------------------*/
/************COLOR GRADIENT CONTAINNER**********************/

function showSystemColor(element,containner){

    const controlesGradiente = document.getElementsByClassName(element)[0];

    //console.log(controlesGradiente.style)
    const isVisible = controlesGradiente.style.display === 'flex';
    controlesGradiente.style.display = isVisible ? 'none' : 'flex';

    // Obtener los elementos del DOM
    const gradienteType = document.getElementById('gradientType');
    const gradienteAngle = document.getElementById('gradientAngle');

    const gradienteColor1 = document.getElementById('gradientColor1');
    const gradienteColor2 = document.getElementById('gradientColor2');
    // Agregar un "event listener" al input

    /*------------------------------------------------------*/
    let color1=gradienteColor1.value; 
    let color2=gradienteColor2.value;
    let angle=gradienteAngle.value+"deg";
    /*-------------------------------------------------------------*/
    if (gradienteType.value === 'linear') {

      document.getElementById('angleLabel').innerHTML = gradienteAngle.value+" angle";
      document.getElementById(containner).style.background ='';
      document.getElementById(containner).style.background =`linear-gradient(${gradienteAngle.value+"deg"}, ${color1}, ${color2})`;

    }
    if (gradienteType.value === 'radial') {

      document.getElementById(containner).style.background ='';
      document.getElementById(containner).style.background =`radial-gradient(circle, ${color1}, ${color2})`;

    }
    /*-------------------------------------------------------------*/

    gradienteType.addEventListener('change', function(){

        if (gradienteType.value === 'linear') {
           
            gradienteAngle.style.display = 'block';
            angleLabel.style.display = 'block';
            angle=gradienteAngle.value+"deg";
            /*-------------------------------------------------*/
            document.getElementById('angleLabel').innerHTML = gradienteAngle.value+" angle";
            document.getElementById(containner).style.background ='';
            document.getElementById(containner).style.background =`linear-gradient(${gradienteAngle.value+"deg"}, ${color1}, ${color2})`;


        } 
        if (gradienteType.value === 'radial') {

            gradienteAngle.style.display = 'none';
            angleLabel.style.display = 'none';
            angle='circle';
            /*---------------------------------------------*/
            document.getElementById(containner).style.background ='';
            document.getElementById(containner).style.background =`radial-gradient(circle, ${color1}, ${color2})`;
        }

    });
    
    gradienteAngle.addEventListener('input', function(){

        if (gradienteType.value === 'linear') {

            angle=gradienteAngle.value+"deg";
            document.getElementById('angleLabel').innerHTML = gradienteAngle.value+" angle";
            document.getElementById(containner).style.background ='';
            document.getElementById(containner).style.background =`linear-gradient(${angle}, ${color1}, ${color2})`;

        }
    });

    gradienteColor1.addEventListener('input', function() {


      if (gradienteType.value === 'linear') {


        color1=gradienteColor1.value;
        console.log(angle, color1, color2)
        document.getElementById(containner).style.background ='';
        document.getElementById(containner).style.background =`linear-gradient(${angle}, ${color1}, ${color2})`;
      
      } 

      if (gradienteType.value === 'radial') {

        color1=gradienteColor1.value
        document.getElementById(containner).style.background ='';
        document.getElementById(containner).style.background =`radial-gradient(${angle}, ${color1}, ${color2})`;
      
      }

    });
    
    gradienteColor2.addEventListener('input', function() {

      if(gradienteType.value === 'linear') {
          color2=gradienteColor2.value;
          document.getElementById(containner).style.background ='';
          document.getElementById(containner).style.background =`linear-gradient(${angle}, ${color1}, ${color2})`;
        //console.log(angle, color1, color2)
      } 

      if(gradienteType.value === 'radial') {
            color2=gradienteColor2.value;
            document.getElementById(containner).style.background ='';
            document.getElementById(containner).style.background =`radial-gradient(${angle}, ${color1}, ${color2})`;
      }

    });

}

/************COLOR GRADIENT CONTAINNER**********************/
/*--------------------------------------------------------*/
function makeResizableAndDraggable(element){

 // console.log("Element Resie",element.childNodes[1])

    //console.log("Element Resie",element.childNodes[1].children[0].className)

        let isResizing = false;
        let isDragging = false;
        let startX, startY;
        let startWidth, startHeight, startLeft, startTop;

        element.addEventListener('mousedown', (e) => {
          if(element.childNodes[1].children[0].className=="Hide_Color_select"){

                if (e.target.tagName === 'BUTTON') {
                    return;
                }

                const rect = element.getBoundingClientRect();

                if (e.clientX > rect.right - 10 || e.clientY > rect.bottom - 10) {

                    isResizing = true;
                    startX = e.clientX;
                    startY = e.clientY;
                    // Almacenar el tamaño inicial en porcentaje
                    startWidth = parseFloat(element.dataset.width);
                    startHeight = parseFloat(element.dataset.height);
                    e.stopPropagation();

                } else {

                    isDragging = true;
                    startX = e.clientX;
                    startY = e.clientY;
                    // Almacenar la posición inicial en porcentaje
                    startLeft = parseFloat(element.dataset.left);
                    startTop = parseFloat(element.dataset.top);
                    e.stopPropagation();
                }
            }
        });

        document.addEventListener('mousemove', (e) => {
            if(element.childNodes[1].children[0].className=="Hide_Color_select"){

                if (isResizing) {

                    const containerRect = element.parentElement.getBoundingClientRect();
                    const newWidthPercentage = Math.max(1, startWidth + ((e.clientX - startX) / containerRect.width) * 100);
                    const newHeightPercentage = Math.max(1, startHeight + ((e.clientY - startY) / containerRect.height) * 100);

                    element.style.width = `${newWidthPercentage}%`;
                    element.style.height = `${newHeightPercentage}%`;
                    element.dataset.width = newWidthPercentage;
                    element.dataset.height = newHeightPercentage;
                } 
                else 
                  if (isDragging) {

                    const containerRect = element.parentElement.getBoundingClientRect();
                    const newLeftPercentage = startLeft + ((e.clientX - startX) / containerRect.width) * 100;
                    const newTopPercentage = startTop + ((e.clientY - startY) / containerRect.height) * 100;

                    element.style.left = `${newLeftPercentage}%`;
                    element.style.top = `${newTopPercentage}%`;
                    element.dataset.left = newLeftPercentage;
                    element.dataset.top = newTopPercentage;
                }
            }
        });


        /*desactiva las funciones*/
        document.addEventListener('mouseup', () => {
            if(element.childNodes[1].children[0].className=="Hide_Color_select"){
                isResizing = false;
                isDragging = false;
            }
        });
      
        /*-----------------------------------------*/
        window.addEventListener('keydown', (event) => {
            if(element.childNodes[1].children[0].className=="Hide_Color_select"){

              if (event.code === 'Space') {  
                  console.log('Estado de animación alternado.');
                  isResizing = false;
                  isDragging = false;
              }
            }
        });
}
/*--------------------------------------------------------*/
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
/*---------------------COLOR RANDOM PARA CUADORS-----------------------*/
/**********************************************************************/
function Render_data_select(data,pos_array){

      document.getElementById("SectionControl_Select_Section").innerHTML="";

       document.getElementById("SectionControl_Select_Section").innerHTML+=`<option value="${data[pos_array].id}">${data[pos_array].name_area}</option>`;

      data.forEach((element,index)=>{

          if(index!=(pos_array)){

              document.getElementById("SectionControl_Select_Section").innerHTML+=`<option value="${element.id}">${element.name_area}</option>`;
       
          }

      })

}

function Selectror_de_areas(){

    var selectElement = document.getElementById("SectionControl_Select_Section");

    api.send("Search-area-select",selectElement.value)

}

/*--------------------------Funciones de area---------------------------------*/

function Open_Image_Select_area(){

    api.send("Select-Imagen-area")

}

api.receive("Imagen-select-section",(event,data)=>{

    document.getElementsByClassName("Containner-work-area")[0].style.backgroundImage = `url('${data}')`;
    Guardar()
})

function Adding_area(){

  Estado_action="nuevo";

  api.send("Adding_area")

}

function Borrar_area(id){


  Estado_action="Borrar";

  api.send("Borrar-area-select",id)
 
}

/*--------------------------Funciones de area---------------------------------*/
/**--------------------Systema de guardado-------------------------**/
function Guardar(){

    //console.log("guardar")
    /*-----------------------------------------------------------------*/
     let background = document.getElementsByClassName("Containner-work-area")[0].style.background;
    // console.log(background)

        let Data = {
            "id":document.getElementsByClassName("Containner-work-area")[0].id,
            "name_area":document.getElementById('SectionControl_TitleArea').value,
            "background":background,
            "product":[]
        }

    /*----------------------------------------------------------------------*/
    let elements = document.querySelectorAll(".resizable-div");
       if(elements.length>0){
     
              elements.forEach((element,index)=>{

                 console.log(element.id)

                    let ElementStyle = element.style;

                    Data["product"].push({
                          "id":element.id,
                          "width":ElementStyle.width,
                          "height":ElementStyle.height,
                          "top":ElementStyle.top,
                          "left":ElementStyle.left,
                          "right":ElementStyle.right,
                          "down":ElementStyle.down,
                          "background":ElementStyle.background

                    })
              })
        }
  
         console.log("save_area",Data)

        Estado_action="Guardar";

          api.send("save_area",Data)

}   
/**--------------------Systema de guardado-------------------------**/
api.receive("Imagen-select-product",(event,data)=>{

  console.log("Imagen-select-product",Pos_Select_id_square);

  document.getElementById(Pos_Select_id_square).style.backgroundImage=`url('${data}')`;

  Guardar()

})
/**-------------------------funciones de imagen------------------------------**/
