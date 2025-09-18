let Pos_Select_id;
let Estado_action;
let pos_array=0;

console.clear();

api.send('Data-System') /**solicita la informacion al cargar la aplicacion**/

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
                  <button id="update_area" class="update_area btnEfect" onclick="Guardar()">Guardar</button>
                  <button id="delet_area" class="delet_area btnEfect" onclick="Borrar_area('${Data_area_render_info[pos_array].id}')">Borrar</button>
                   
                 <div class="gradiente-btn-container">
                    <button class="gradiente-btn" onclick="showSystemColor('controles-gradiente','Containner_work_area')">Opciones de Degradado</button>
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
                          <!---------"linear-gradient(to bottom, #003399 0%, #003397 0%, #660066 100%)",--------------------------------------------->
                    </div>
                </div>
            </div> 
            <div class="${Data_area_render_info[pos_array].id}" id="Containner_work_area"> </div>
          </div>`;

    document.getElementById("Containner_work_area").style.background = Data_area_render_info[pos_array].background;
    document.getElementById("Containner_work_area").style.backgroundSize = 'cover';
    document.getElementById("Containner_work_area").style.backgroundPosition = 'center';
    document.getElementById("Containner_work_area").style.backgroundRepeat = 'no-repeat';

    const container = document.getElementById('Containner_work_area');
  
    if(Data_area_render_info[pos_array].product.length>0){
          
        Data_area_render_info[pos_array].product.forEach((element,index)=>{

                    const newDiv = document.createElement('div');
                    newDiv.className = 'resizable-div';
                    newDiv.innerHTML = container.childNodes.length;
                    newDiv.id = index;
                    newDiv.style.left = element.left;
                    newDiv.style.top = element.top;
                    newDiv.style.width = element.width; // Tamaño inicial un poco más grande
                    newDiv.style.height = element.height;
                    newDiv.style.background = element.background;
                    newDiv.style.backgroundSize = 'contain';
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
                    deleteButton.className = 'delete-btn';
                    deleteButton.addEventListener('click', (e) => {
                        e.stopPropagation(); // Evita que el click en el botón afecte al padre
                        newDiv.remove();
                    });

                    const imageButton = document.createElement('button');
                    imageButton.textContent = '🖼️';
                    imageButton.className = 'image-btn';
                    imageButton.addEventListener('click', (e) => {
                        e.stopPropagation(); // Evita que el click en el botón afecte al padre
                        Pos_Select_id=newDiv.id;
                        console.log("creado por render")
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
                    container.appendChild(newDiv);

                    //Añadir funcionalidad de redimensionamiento y arrastre
                    makeResizableAndDraggable(newDiv) 
        })

    }

    /*-----------------------------------------------------------------------*/
    /*******Efecto de tamaño par cuador creados por render***********/
    function makeDraggableAndResizable(element) {
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
            const containerRect = container.getBoundingClientRect();

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
        const containerRect = container.getBoundingClientRect();
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

          container.addEventListener('click', (event) => {
                  if (event.target.closest('.resizable-div-color')) {
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
                  const initialWidth = 0.20 * containerRect.width; // 15% del ancho del contenedor
                  const initialHeight = 0.30 * containerRect.height; // 20% del alto del contenedor
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
                  
                  const controlsDiv = document.createElement('div');
                  controlsDiv.className = 'controls';

                  const imageButton = document.createElement('button');
                  imageButton.textContent = '🖼️';
                  imageButton.className = 'image-btn';
                  imageButton.addEventListener('click', (e) => {
                          e.stopPropagation();
                          Pos_Select_id=newDiv.id;
                          console.log("creado por click")
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
                      colorPicker.click();
                  });

                  const deleteButton = document.createElement('button');
                  deleteButton.textContent = '❌';
                  deleteButton.className = 'delete-btn';
                  deleteButton.addEventListener('click', (e) => {
                      e.stopPropagation();
                      newDiv.remove();
                  });

                  controlsDiv.appendChild(imageButton);
                  controlsDiv.appendChild(colorButton);
                  controlsDiv.appendChild(deleteButton);
                  newDiv.appendChild(controlsDiv);
                  container.appendChild(newDiv);
                  makeResizableAndDraggable(newDiv);
          });
          /******************CREAR GENERADOR DE AREAS****************************/


}





/************COLOR GRADIENT CONTAINNER**********************/
function ContainnerSelectroColor(classElement){

  document.getElementsByClassName(classElement)[0];

}

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
    let angle;
    //angle=gradienteAngle.value+"deg";

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


        color1=gradienteColor1.value
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
        
      } 

      if(gradienteType.value === 'radial') {
            color2=gradienteColor2.value;
            document.getElementById(containner).style.background ='';
            document.getElementById(containner).style.background =`radial-gradient(${angle}, ${color1}, ${color2})`;
          
      }

    });

}

function actualizarGradienteContenedor(containner,gradienteType,gradienteAngle,gradienteColor1,gradienteColor2,gradienteColor3) {

        const tipo = gradienteType;
        const colores = [gradienteColor1, gradienteColor2, gradienteColor3].filter(c => c);
        
        let direccion = '';
        if (tipo === 'linear') {
           
            const angulo = gradienteAngle;
            direccion = `${angulo}deg`;
            gradienteAngle.style.display = 'block';
            angleLabel.style.display = 'block';
            angleLabel.textContent = `Ángulo: ${angulo}°`;
        } 
        else if (tipo === 'radial') {
            direccion = 'circle';
            gradienteAngle.style.display = 'none';
            angleLabel.style.display = 'none';
        }

       //aplicarGradiente(containner, tipo, direccion, colores);
}


function aplicarGradiente(elemento, tipo, direccion, colores) {
    if (!elemento) {
        console.error("El elemento HTML proporcionado no existe.");
        return;
    }
    const listaColores = colores.join(', ');
    let gradienteCSS = '';
    if (tipo === 'linear') {
        gradienteCSS = `linear-gradient(${direccion}, ${listaColores})`;
    } else if (tipo === 'radial') {
        gradienteCSS = `radial-gradient(${direccion}, ${listaColores})`;
    } else {
        console.error("Tipo de gradiente no válido. Usa 'linear' o 'radial'.");
        return;
    }
    elemento.style.background = gradienteCSS;
    //elemento.style.background = 'transparent';
}
/************COLOR GRADIENT CONTAINNER**********************/
/*--------------------------------------------------------*/
function makeResizableAndDraggable(element){

        let isResizing = false;
        let isDragging = false;
        let startX, startY;
        let startWidth, startHeight, startLeft, startTop;

        element.addEventListener('mousedown', (e) => {
          
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
        });

        document.addEventListener('mousemove', (e) => {

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
        });


        /*desactiva las funciones*/
        document.addEventListener('mouseup', () => {
            isResizing = false;
            isDragging = false;
        });
      
        /*-----------------------------------------*/
        window.addEventListener('keydown', (event) => {
            if (event.code === 'Space') {
          
              console.log('Estado de animación alternado.');
            isResizing = false;
            isDragging = false;

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

    document.getElementById("Containner_work_area").style.backgroundImage = `url('${data}')`;
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
     let background = document.getElementById("Containner_work_area").style.background;
    // console.log(background)

        let Data = {
            "id":document.getElementById("Containner_work_area").className,
            "name_area":document.getElementById('SectionControl_TitleArea').value,
            "background":background,
            "product":[]
        }

    /*----------------------------------------------------------------------*/
    let elements = document.querySelectorAll(".resizable-div");
       if(elements.length>0){

              elements.forEach((element,index)=>{

                    let ElementStyle = element.style;

                    Data["product"].push({
                          "id":index,
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
  
       //  console.log("save_area",Data)

        Estado_action="Guardar";

          api.send("save_area",Data)

}   
/**--------------------Systema de guardado-------------------------**/
api.receive("Imagen-select-product",(event,data)=>{

    document.getElementById(Pos_Select_id).style.backgroundImage=`url('${data}')`;

    Guardar()

})
/**-------------------------funciones de imagen------------------------------**/
