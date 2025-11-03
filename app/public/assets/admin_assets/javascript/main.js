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

    console.log(data)

    Render_data_app(data, pos_array);  
    
    document.getElementById("SectionControl_Select_Section").innerHTML=""
     
    data.forEach((element,index)=>{

        document.getElementById("SectionControl_Select_Section").innerHTML+=`<option value="${element.id}">${element.name_area}</option>`;

    })
 
})

api.receive("Render_Data_search",(event,data)=>{

  Render_data_app(data,0);

})

/**la funcion obtiene la informacion nueva al guardar o agregar nueva data***/
api.receive("Render-Data-reload-change",(event,data)=>{

    if(Estado_action=="nuevo"){
        //console.log("Nueva")            
        pos_array=data.length-1;
        Render_data_app(data, pos_array);
        Render_selector_area(data, pos_array);
        pos_array=0;

    }

    if(Estado_action=="Borrar"){

        // console.log("Borrar")
        pos_array=data.length-1;
        Render_data_app(data, pos_array);
        Render_selector_area(data, pos_array);
        pos_array=0;      
    }

    if(Estado_action=="Guardar"){

        Render_selector_area(data, pos_array);

    }

});

/**la funcion obtiene la informacion nueva al guardar o agregar nueva data***/
let Containner_work_area
let ContainnerBackground;
let ContainnerSquare;

function Render_data_app(Data_area_render_info,pos){

  
  /*************************AREA 1 SELECTRO CUADRICULA*****************************************/
  document.getElementById("container_area").innerHTML="";
  document.getElementById("container_area").innerHTML=`
  <div class="Containner-Área-de-imágenes">
     <!------------------------------------->
          <div class="Containner-Área-de-imágenes-btn">
                <!----------------------------------------->
                  <span class="NameAreacontainner">Nombre del Area: <input type="text" id="SectionControl_TitleArea" class="nombre-area" value='${Data_area_render_info[pos].name_area}'>
                  </span> 
                  <button id="update_area" class="update_area ButtonAction  btnEfect icon-floppy-disk" onclick="Guardar('${Data_area_render_info[pos].id}')">Guardar</button>
                  <button id="delet_area" class="delet_area ButtonAction  btnEfect icon-bin" onclick="Borrar_area('${Data_area_render_info[pos].id}')">Borrar</button>
                <!--------------image------------------>
                  <button id="btn_add_image_section" class="ButtonAction add_imgbackground icon-image btnEfect" onclick="Open_Image_Select_area()" >Imagen</button> 
                  <!--------------gradiente------------------>
                  <div class="gradiente-btn-container">
                        <button class="gradiente-btn ButtonAction" onclick="showSystemColor('controles-gradiente','${Data_area_render_info[pos].id}')">🎨Color</button>
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
                <!------------video-------------->
                  <div class="container-video-inser">
                      <button id="SelectEnPCBtn" class="video-btn ButtonAction icon-film" onclick="SeleccionrVideoenPC('${Data_area_render_info[pos].id}')">Video</button>
                  </div>
                <!------------sound------------------>
                  <div class="Sound-btn-container">
                    <button id="SelectEnPCBtn" class="sound-btn ButtonAction icon-music" onclick="showSystemSound('containner_sound_controls','${Data_area_render_info[pos].id}')">Sonido</button>
                    <div class="containner_sound_controls" style="display:none;">
                        <div class="sub_containner_sound_controls"> </div> 
                        <button id="SelectEnPCBtn" class="sound-btn ButtonAction" onclick="Seleccionar_sound_area()">Seleccionar</butto>
                    </div>
                  </div>
                <!-----------duration---------------->
                  <div class="container-duration">
                    <h3>Duración</h3>
                    <div class="number-input">
                         <button onclick="this.parentNode.querySelector('input[type=number]').stepDown();" ></button>
                         <input id="duration" class="Timeduration"  type="number" min="1" max="50" value="${Data_area_render_info[pos].duration/1000}">
                         <button onclick="this.parentNode.querySelector('input[type=number]').stepUp();" class="plus"></button>
                    </div>
                    <h3>Seg</h3>
                  </div>
                <!------------------------------------->
          </div> 
    <!------------------------------------->
          <div class="Containner-work-area" id="${Data_area_render_info[pos].id}">
              <div class="containner-background"  id="${Data_area_render_info[pos].id+1}"></div>
              <div class="containner-item-square" id="${Data_area_render_info[pos].id+2}"></div>
          </div>
    <!------------------------------------->
  </div>`;
  Containner_work_area = document.getElementById(`${Data_area_render_info[pos].id}`);
  ContainnerBackground = document.getElementById(`${Data_area_render_info[pos].id}`).children[0];
  ContainnerBackground.style.background = Data_area_render_info[pos].background;

  /*-----------------------*/
  ContainnerSquare = document.getElementById(`${Data_area_render_info[pos].id}`).children[1];

  /*-----------------select type background --------------*/
      if(Data_area_render_info[pos].background!=""){
          //console.log("color")
          let ColorExtraido = extraerColoresDeGradiente(ContainnerBackground.style.background);
          const hexColor1 = rgbToHex(ColorExtraido[0]);
          const hexColor2 = rgbToHex(ColorExtraido[1]);
          document.getElementById("gradientColor1").value = hexColor2;
          document.getElementById("gradientColor2").value = hexColor1;
      }
    
      if(Data_area_render_info[pos].video!=""){
          // console.log("video")
          InscrustarVideo(ContainnerBackground.id,Data_area_render_info[pos].video)
     
      }
      if(Data_area_render_info[pos].imageURL!=""){
          //console.log("IMgURL")
          InscrustarImg(ContainnerBackground.id,Data_area_render_info[pos].imageURL)

      }

      if(Data_area_render_info[pos].sound!=""){
        
          let con = document.getElementsByClassName("sub_containner_sound_controls")[0];
            const audio = document.createElement('audio');
            audio.src=Data_area_render_info[pos].sound;
            audio.id = `media`;
            audio.className="sound_area";
            audio.controls = "true";
          con.appendChild(audio);

      }
  /*-----------------select type background -----------------------*/
  /*------------------RENDER DE SQUARE GUARDADO-----------------------*/
  if(Data_area_render_info[pos].product.length>0){
        
          Data_area_render_info[0].product.forEach((element,index)=>{

            /*---------------------------------------*/
             // Referencias al panel de edición de texto
            const textEditorPanel = document.getElementById('text-editor-panel');
            const textEditorArea = document.getElementById('text-editor-area'); 
            const formatButtons = document.querySelectorAll('.text-format-buttons button');
            const saveTextBtn = document.getElementById('save-text-btn');/*jkjk*/
            const closeTextEditorBtn = document.getElementById('close-text-editor');
            let currentDivForText = null; 

            // --- Controles de texto y posicionamiento ---
            const fontSizeSelect = document.getElementById('font-size-select');
            const fontFamilySelect = document.getElementById('font-family-select');
            const fontColorInput = document.getElementById('font-color-input');
            const fontColorLabel = document.getElementById('font-color-label');
            
            // NUEVOS CONTROLES DE POSICIONAMIENTO
            const verticalAlignSlider = document.getElementById('vertical-align-slider');
            const horizontalAlignSlider = document.getElementById('horizontal-align-slider');
            
            // Mapeo de valores de Slider (0, 1, 2) a valores CSS Flexbox
            const flexValues = ['flex-start', 'center', 'flex-end'];


            // --- Lógica del Editor WYSIWYG ---

            function executeCommand(command, value = null) {
                if (command === 'createLink') {
                    const url = prompt('Introduce la URL del enlace:');
                    if (url) {
                         document.execCommand(command, false, url);
                    }
                } 
                else if (command !== 'createLink') {
                    document.execCommand(command, false, value);
                }
                
                textEditorArea.focus(); 
                updateButtonStates(); 
            }

            // 1. Manejo de botones de formato
            formatButtons.forEach(button => {
                const command = button.dataset.command;
                const value = button.dataset.value;

                if (command) {
                    button.addEventListener('mousedown', (e) => {
                        e.preventDefault(); 
                        executeCommand(command, value);
                    });
                }
            });

            // 2. Manejo de tamaño y tipo de fuente (Selects)
            fontSizeSelect.addEventListener('change', (e) => {

                executeCommand('fontSize', e.target.value);
            });
            
            fontFamilySelect.addEventListener('change', (e) => {

                executeCommand('fontName', e.target.value);
            });

            // 3. Manejo de color de fuente
            fontColorInput.addEventListener('input', (e) => {

                executeCommand('foreColor', e.target.value);
            });

            fontColorLabel.addEventListener('click', (e) => {
                if (e.target !== fontColorInput) {
                    textEditorArea.focus();
                }
            });
            
            // 4. Lógica de Posicionamiento (Slidders)
            function updateDivPosition() {
                if (!currentDivForText) return;
                
                const vIndex = verticalAlignSlider.value;
                const hIndex = horizontalAlignSlider.value;

                const vAlign = flexValues[vIndex];
                const hAlign = flexValues[hIndex];

                // Aplica los estilos Flexbox al div principal
                currentDivForText.style.alignItems = vAlign;
                currentDivForText.style.justifyContent = hAlign;
                
                // Guarda la configuración en data-attributes para cargarla en futuras ediciones
                currentDivForText.dataset.vAlign = vAlign;
                currentDivForText.dataset.hAlign = hAlign;
            }

            verticalAlignSlider.addEventListener('input', updateDivPosition);
            horizontalAlignSlider.addEventListener('input', updateDivPosition);
          /*--------------------------------------------*/
            // Función para actualizar el estado "activo" de los botones
            function updateButtonStates() {
                formatButtons.forEach(button => {
                    const command = button.dataset.command;
                    const value = button.dataset.value;

                    if (command && command !== 'undo' && command !== 'redo' && command !== 'removeFormat') {
                        let isActive = false;

                        if (command === 'formatBlock' && value === 'h4') {
                            isActive = document.queryCommandValue('formatBlock') === value;
                        } else {
                            isActive = document.queryCommandState(command);
                        }
                        
                        button.setAttribute('data-active', isActive);
                    }
                });
                
                // Actualizar selects (Font Size, Font Name, Color)
                try {
                    fontSizeSelect.value = document.queryCommandValue('fontSize') || '3';
                } catch (e) {}

                try {
                    const currentFontName = document.queryCommandValue('fontName').replace(/"/g, '').toLowerCase();
                    let matched = false;
                    fontFamilySelect.querySelectorAll('option').forEach(option => {
                        if (option.value.toLowerCase().includes(currentFontName.split(',')[0])) {
                            fontFamilySelect.value = option.value;
                            matched = true;
                        }
                    });
                    if (!matched) {
                        fontFamilySelect.value = 'Arial, sans-serif'; 
                    }
                } catch (e) {}

                try {
                    const currentColor = document.queryCommandValue('foreColor');
                    if (currentColor && currentColor !== 'transparent') {
                        fontColorInput.value = rgbToHex(currentColor);
                    } 
                } catch (e) { }
            }

            // Función auxiliar para convertir RGB(x, y, z) a #RRGGBB
            function rgbToHex(rgb) {
                const parts = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
                if (!parts) return '#000000'; 
                
                function hex(x) {
                    return ("0" + parseInt(x).toString(16)).slice(-2);
                }
                return "#" + hex(parts[1]) + hex(parts[2]) + hex(parts[3]);
            }

            // Event Listeners para actualizar estados
            textEditorArea.addEventListener('mouseup', updateButtonStates);
            textEditorArea.addEventListener('keyup', updateButtonStates);
            textEditorArea.addEventListener('focus', updateButtonStates);

            function initializeEditor(div) {
               
                formatButtons.forEach(btn => btn.removeAttribute('data-active'));
                textEditorArea.focus();
                fontSizeSelect.value = '3'; 
                fontFamilySelect.value = 'Arial, sans-serif';
                fontColorInput.value = '#000000'; 

                // Carga los valores de posicionamiento
                const vAlign = div.dataset.vAlign || 'flex-start';
                const hAlign = div.dataset.hAlign || 'flex-start';

                verticalAlignSlider.value = flexValues.indexOf(vAlign);
                horizontalAlignSlider.value = flexValues.indexOf(hAlign);

                // Aplica los valores cargados inmediatamente
                div.style.alignItems = vAlign;
                div.style.justifyContent = hAlign;
                
                setTimeout(updateButtonStates, 50); 
            }

            // Cierra el panel de edición
            closeTextEditorBtn.addEventListener('click', () => {
                textEditorPanel.style.display = 'none';
                currentDivForText = null;
            });

            // Evento Guardar Texto
            saveTextBtn.addEventListener('click', (e) => {
                if (!currentDivForText) return;

                const bodyHTML = textEditorArea.innerHTML.trim();

                let textContentDiv = currentDivForText.querySelector('.text-content');
                if (!textContentDiv) {
                    textContentDiv = document.createElement('div');
                    textContentDiv.className = 'text-content';
                    currentDivForText.appendChild(textContentDiv);
                }
                
                let finalHTML = '';
  
                if (bodyHTML) {
                     finalHTML += bodyHTML;
                }

                textContentDiv.innerHTML = finalHTML;
                Guardar()
                textEditorPanel.style.display = 'none';
                currentDivForText = null;
            });
        
            /*---------------------------------------*/
           
                      const newDiv = document.createElement('div');
                      newDiv.className = 'resizable-div';

                      newDiv.id = element.id;
                      newDiv.style.left = element.left;
                      newDiv.style.top = element.top;
                      newDiv.style.width = element.width; // Tamaño inicial un poco más grande
                      newDiv.style.height = element.height;
                      newDiv.style.background = element.background;
                      newDiv.addEventListener('click', (e) => {
                        /*------------------------------------------------------*/
                        if(newDiv.querySelector(".resize-handle")){

                        }else{
                            // Asegurarse de que el div inicialice correctamente
                            initializeDiv(ContainnerSquare,newDiv);

                            // Aplicar la funcionalidad al div inicial
                            makeDraggableAndResizableSquare(ContainnerSquare,newDiv);
                            /*------------------------------------------------------*/
                        }

                      })

                      /*-----------------------sub containner-----------------------*/
                      const Divsub = document.createElement('div');
                      Divsub.className = 'sub-div-containner';
                      Divsub.style.width = "100%";
                      Divsub.style.height = "100%";
                      Divsub.style.background = newDiv.style.background
                       /*-----------------------sub containner-----------------------*/

                      /*-------------Imagen Background------------------------------*/
                         const imageUrlValue = element.imageURL;
                        if (imageUrlValue=="") {
                            // Lógica si está vacío
                            //console.log("¡El imageURl está vacío! 🚫");
                        } else {
                 
                           const imgElement = document.createElement('img');
                           imgElement.src = element.imageURL;
                           imgElement.className="imagen-square";
                           imgElement.id="imagen_square";
                                             
                           Divsub.appendChild(imgElement);
                        } 
                      /*-------------Imagen Background------------------------------*/
                        const textvalue = element.Text;
                        const isEmpty2 = textvalue === "undefined";
                        if (isEmpty2) {
                            // Lógica si está vacío
                            //console.log("¡El imageURl está vacío! 🚫");
                        } else {
                            RenderTextenDiv(Divsub, textvalue)
                        }
                      /*--------------------------------------------------*/
                      //Contenedor de controles
                      const controlsDiv = document.createElement('div');
                      controlsDiv.className = 'controls';

                      /*---------------------------------------------*/
                      const colorControls = document.createElement('div');
                      colorControls.className = 'Hide_Color_select';
                      colorControls.id = `containner_color_select-${element.id}`;
                      colorControls.innerHTML = `
                        <div class="slider-group">
                          <label for="hueRange-${element.id}">Matiz (Hue): <span id="hueLabel-${element.id}">${rgbaToHsl(element.background).h}</span></label>
                          <input class="hue" type="range" id="hueRange-${element.id}" min="0" max="360" value="${rgbaToHsl(element.background).h}" oninput="updateColor('${element.id}')">
                        </div>
                        <div class="slider-group">
                          <label for="alphaRange-${element.id}">Alpha: <span id="alphaLabel-${element.id}">1</span></label>
                          <input  class="alpha" type="range" id="alphaRange-${element.id}" min="0" max="1" step="0.01" value="1" oninput="updateAlpha('${element.id}')">
                        </div>
                        <div class="color-plane" id="colorPlane-${element.id}" onclick="ColorPanel(event,'${element.id}')" style="background:linear-gradient(to right, white, transparent), linear-gradient(to top, black, transparent), hsl(${rgbaToHsl(element.background).h}, 100%, 50%)"></div>`;
                      controlsDiv.appendChild(colorControls);
                      /*---------------------------------------------*/
                      // Botón para seleccionar imagen
                      const imageButton = document.createElement('button');
                      imageButton.className = 'image-btn icon-images';
                      imageButton.addEventListener('click', (e) => {
                        
                             e.stopPropagation();
                             const imgElement = document.createElement('img');
                             imgElement.src = "file:///C:/Users/Duno%20Castellano/Desktop/Proyectos/PublishTVproyect/AdVizualyze/build/systempublish_nw.png";
                             imgElement.className="imagen-square";
                             imgElement.id="imagen_square";
                             imgElement.style.width='-webkit-fill-available';
                             imgElement.style.height='-webkit-fill-available';
                       
                             Divsub.appendChild(imgElement);

                             Pos_Select_id_square = element.id;
                             api.send("Select-Imagen-product");
                   
                      });

                      // Botón para cambiar el color (toggle de los controles de color)
                      const colorButton = document.createElement('button');
                      colorButton.textContent = '🎨';
                      colorButton.className = 'color-btn';
                      colorButton.addEventListener('click', (e) => {

                          e.stopPropagation();

                          Pos_Select_id_square = element.id;
                          const controlsContainer = document.getElementById(`containner_color_select-${element.id}`);
                         
                          if (controlsContainer) {
                              controlsContainer.classList.toggle("Show_Color_select");
                              controlsContainer.classList.toggle("Hide_Color_select");
                          }

                      });

                      const textButton = document.createElement('button');
                      textButton.textContent = 'T';
                      textButton.className = 'text-btn';
                      textButton.addEventListener('click', (e) => {
                          e.stopPropagation();

                          if (currentDivForText === Divsub) {
                              textEditorPanel.style.display = 'none';
                              currentDivForText = null;
                              return;
                          }

                          currentDivForText = Divsub;
                                                
                          const textContentDiv = Divsub.querySelector('.text-content');
                          let title = '';
                          let bodyHtml = '';
                          
                          if (textContentDiv) {
                              const h3 = textContentDiv.querySelector('h3');
                              
                              if (h3) {
                                  title = h3.textContent;
                                  const clone = textContentDiv.cloneNode(true);
                                  if(clone.querySelector('h3')) clone.querySelector('h3').remove();
                                  bodyHtml = clone.innerHTML.trim();
                              } else {
                                  bodyHtml = textContentDiv.innerHTML.trim();
                              }
                          } else {
                               const imgElement = Divsub.querySelector('img');
                               if(imgElement) imgElement.remove();
                          }
                          
                         
                          textEditorArea.innerHTML = bodyHtml;
                          textEditorPanel.style.display = 'flex';
                          initializeEditor(Divsub); // Pasa el div para cargar la posición RENDER
                      });

                      const deleteButton = document.createElement('button');
                      deleteButton.textContent = '❌'; // Usa un emoji para un mejor diseño
                      deleteButton.className = 'delete-btn ';
                      deleteButton.addEventListener('click', (e) => {
                          e.stopPropagation();
                          newDiv.remove();
                      });

                      controlsDiv.appendChild(imageButton);
                      controlsDiv.appendChild(colorButton); // Añade el nuevo botón de color
                      controlsDiv.appendChild(textButton);
                      controlsDiv.appendChild(deleteButton);

                      newDiv.appendChild(controlsDiv);
                      newDiv.appendChild(Divsub);
                      /*-*/
                      ContainnerSquare.appendChild(newDiv);
          })

  }
  /*------------------RENDER DE SQUARE GUARDADO-----------------------*/
  /*---------------------------------------------------------*/
  /******************CREAR GENERADOR DE square AREAS****************************/
  /********Duno******/
  ContainnerSquare.addEventListener('click', (event) => {

            // Referencias al panel de edición de texto
            const textEditorPanel = document.getElementById('text-editor-panel');
            
            const textEditorArea = document.getElementById('text-editor-area'); 
            const formatButtons = document.querySelectorAll('.text-format-buttons button');
            const saveTextBtn = document.getElementById('save-text-btn');
            const closeTextEditorBtn = document.getElementById('close-text-editor');
            let currentDivForText = null; 

            // --- Controles de texto y posicionamiento ---
            const fontSizeSelect = document.getElementById('font-size-select');
            const fontFamilySelect = document.getElementById('font-family-select');
            const fontColorInput = document.getElementById('font-color-input');
            const fontColorLabel = document.getElementById('font-color-label');
            
            // NUEVOS CONTROLES DE POSICIONAMIENTO
            const verticalAlignSlider = document.getElementById('vertical-align-slider');
            const horizontalAlignSlider = document.getElementById('horizontal-align-slider');
            
            // Mapeo de valores de Slider (0, 1, 2) a valores CSS Flexbox
            const flexValues = ['flex-start', 'center', 'flex-end'];


            // --- Lógica del Editor WYSIWYG ---

            function executeCommand(command, value = null) {
                if (command === 'createLink') {
                    const url = prompt('Introduce la URL del enlace:');
                    if (url) {
                         document.execCommand(command, false, url);
                    }
                } 
                else if (command !== 'createLink') {
                    document.execCommand(command, false, value);
                }
                
                textEditorArea.focus(); 
                updateButtonStates(); 
            }

            // 1. Manejo de botones de formato
            formatButtons.forEach(button => {
                const command = button.dataset.command;
                const value = button.dataset.value;

                if (command) {
                    button.addEventListener('mousedown', (e) => {
                        e.preventDefault(); 
                        executeCommand(command, value);
                    });
                }
            });

            // 2. Manejo de tamaño y tipo de fuente (Selects)
            fontSizeSelect.addEventListener('change', (e) => {
                executeCommand('fontSize', e.target.value);
            });
            
            fontFamilySelect.addEventListener('change', (e) => {
                executeCommand('fontName', e.target.value);
            });

            // 3. Manejo de color de fuente
            fontColorInput.addEventListener('input', (e) => {
                executeCommand('foreColor', e.target.value);
            });

            fontColorLabel.addEventListener('click', (e) => {
                if (e.target !== fontColorInput) {
                    textEditorArea.focus();
                }
            });
            
            // 4. Lógica de Posicionamiento (Slidders)
            function updateDivPosition() {
                if (!currentDivForText) return;
                
                const vIndex = verticalAlignSlider.value;
                const hIndex = horizontalAlignSlider.value;

                const vAlign = flexValues[vIndex];
                const hAlign = flexValues[hIndex];

                // Aplica los estilos Flexbox al div principal
                currentDivForText.style.alignItems = vAlign;
                currentDivForText.style.justifyContent = hAlign;
                
                // Guarda la configuración en data-attributes para cargarla en futuras ediciones
                currentDivForText.dataset.vAlign = vAlign;
                currentDivForText.dataset.hAlign = hAlign;
            }

            verticalAlignSlider.addEventListener('input', updateDivPosition);
            horizontalAlignSlider.addEventListener('input', updateDivPosition);
          
            /*--------------------------------------------*/
            // Función para actualizar el estado "activo" de los botones
            function updateButtonStates() {
                formatButtons.forEach(button => {
                    const command = button.dataset.command;
                    const value = button.dataset.value;

                    if (command && command !== 'undo' && command !== 'redo' && command !== 'removeFormat') {
                        let isActive = false;

                        if (command === 'formatBlock' && value === 'h4') {
                            isActive = document.queryCommandValue('formatBlock') === value;
                        } else {
                            isActive = document.queryCommandState(command);
                        }
                        
                        button.setAttribute('data-active', isActive);
                    }
                });
                
                // Actualizar selects (Font Size, Font Name, Color)
                try {
                    fontSizeSelect.value = document.queryCommandValue('fontSize') || '3';
                } catch (e) {}

                try {
                    const currentFontName = document.queryCommandValue('fontName').replace(/"/g, '').toLowerCase();
                    let matched = false;
                    fontFamilySelect.querySelectorAll('option').forEach(option => {
                        if (option.value.toLowerCase().includes(currentFontName.split(',')[0])) {
                            fontFamilySelect.value = option.value;
                            matched = true;
                        }
                    });
                    if (!matched) {
                        fontFamilySelect.value = 'Arial, sans-serif'; 
                    }
                } catch (e) {}

                try {
                    const currentColor = document.queryCommandValue('foreColor');
                    if (currentColor && currentColor !== 'transparent') {
                        fontColorInput.value = rgbToHex(currentColor);
                    } 
                } catch (e) { }
            }

            // Función auxiliar para convertir RGB(x, y, z) a #RRGGBB
            function rgbToHex(rgb) {
                const parts = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
                if (!parts) return '#000000'; 
                
                function hex(x) {
                    return ("0" + parseInt(x).toString(16)).slice(-2);
                }
                return "#" + hex(parts[1]) + hex(parts[2]) + hex(parts[3]);
            }

            // Event Listeners para actualizar estados
            textEditorArea.addEventListener('mouseup', updateButtonStates);
            textEditorArea.addEventListener('keyup', updateButtonStates);
            textEditorArea.addEventListener('focus', updateButtonStates);

            function initializeEditor(div) {
                // Reinicia los controles del editor a los valores por defecto/cargados
                formatButtons.forEach(btn => btn.removeAttribute('data-active'));
                textEditorArea.focus();
                fontSizeSelect.value = '3'; 
                fontFamilySelect.value = 'Arial, sans-serif';
                fontColorInput.value = '#000000'; 

                // Carga los valores de posicionamiento
                const vAlign = div.dataset.vAlign || 'flex-start';
                const hAlign = div.dataset.hAlign || 'flex-start';

                verticalAlignSlider.value = flexValues.indexOf(vAlign);
                horizontalAlignSlider.value = flexValues.indexOf(hAlign);

                // Aplica los valores cargados inmediatamente
                div.style.alignItems = vAlign;
                div.style.justifyContent = hAlign;
                
                setTimeout(updateButtonStates, 50); 
            }

            // Cierra el panel de edición
            closeTextEditorBtn.addEventListener('click', () => {
                textEditorPanel.style.display = 'none';
                currentDivForText = null;
            });

            // Evento Guardar Texto /*ppooo*/
            saveTextBtn.addEventListener('click', (e) => {
                if (!currentDivForText) return;

                const bodyHTML = textEditorArea.innerHTML.trim();

                let textContentDiv = currentDivForText.querySelector('.text-content');
                if (!textContentDiv) {
                    textContentDiv = document.createElement('div');
                    textContentDiv.className = 'text-content';
                    currentDivForText.appendChild(textContentDiv);
                }
                
                let finalHTML = '';

                if (bodyHTML) {
                     finalHTML += bodyHTML;
                }

                textContentDiv.innerHTML = finalHTML;

                Guardar()

                textEditorPanel.style.display = 'none';
                currentDivForText = null;
            });
            
            // --- Lógica de Creación y Control de Divs ---
            /*------------------------------------------*/

                if (event.target.closest('.resizable-div')) {
                  
                    return;
                }

                const newDiv = document.createElement('div');
                newDiv.className = 'resizable-div';
                const uniqueId = `resizable-div-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                newDiv.id = uniqueId;

                /*----------------------------------------*/
                const containerRect = ContainnerSquare.getBoundingClientRect();

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

                // Asignar un color aleatorio inicial

                  let ColorAleatorio = getRandomColor();
                  newDiv.style.background = ColorAleatorio;

                // Crear y añadir el "mango" de redimensionamiento
                  const resizeHandle = document.createElement('div');
                  resizeHandle.className = 'resize-handle';
                  newDiv.appendChild(resizeHandle);

                  //Contenedor de controles
                  const controlsDiv = document.createElement('div');
                  controlsDiv.className = 'controls';

                  const colorControls = document.createElement('div');
                  colorControls.className = 'Hide_Color_select';
                  colorControls.id =`containner_color_select-${uniqueId}`;
                  colorControls.innerHTML =`
                        <div class="slider-group">
                          <label for="hueRange-${uniqueId}">Matiz (Hue): <span id="hueLabel-${uniqueId}">${hexToHSL(ColorAleatorio).h}</span></label>
                          <input class="hue" type="range" id="hueRange-${uniqueId}" min="0" max="360" value="${hexToHSL(ColorAleatorio).h}" oninput="updateColor('${uniqueId}')">
                        </div>
                        <div class="slider-group">
                          <label for="alphaRange-${uniqueId}">Alpha: <span id="alphaLabel-${uniqueId}">1</span></label>
                          <input  class="alpha" type="range" id="alphaRange-${uniqueId}" min="0" max="1" step="0.01" value="1" oninput="updateAlpha('${uniqueId}')">
                        </div>
                        <div class="color-plane" id="colorPlane-${uniqueId}" onclick="ColorPanel(event,'${uniqueId}')" style="background:linear-gradient(to right, white, transparent), linear-gradient(to top, black, transparent), hsl(${hexToHSL(ColorAleatorio).h}, 100%, 50%)"></div>`;

                  controlsDiv.appendChild(colorControls);

                /*-----------------------sub containner-----------------------*/
                  const Divsub = document.createElement('div');
                  Divsub.className = 'sub-div-containner';
                 Divsub.style.width = "100%";
                  Divsub.style.height = "100%";
                  Divsub.style.background = newDiv.style.background;         
                /*-----------------------sub containner-----------------------*/

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

                      const padre = document.getElementById(uniqueId).querySelector(".sub-div-containner");
                      const img = padre.querySelector('#imagen_square');

                      if(!img){

                         const imgElement = document.createElement('img');
                         imgElement.src = "file:///C:/Users/Duno%20Castellano/Desktop/Proyectos/PublishTVproyect/AdVizualyze/build/systempublish_nw.png";
                         imgElement.className="imagen-square";
                         imgElement.id="imagen_square";               
                         Divsub.appendChild(imgElement); 
                         Pos_Select_id_square = newDiv.id;
                         api.send("Select-Imagen-product");

                      }else{

                          img.remove();
                         const imgElement = document.createElement('img');
                         imgElement.src = "file:///C:/Users/Duno%20Castellano/Desktop/Proyectos/PublishTVproyect/AdVizualyze/build/systempublish_nw.png";
                         imgElement.className="imagen-square";
                         imgElement.id="imagen_square";               
                         Divsub.appendChild(imgElement); 
                         Pos_Select_id_square = newDiv.id;
                         api.send("Select-Imagen-product");


                      }
                  });

                  // Botón para cambiar el color (toggle de los controles de color)
                  const colorButton = document.createElement('button');
                  colorButton.textContent = '🎨';
                  colorButton.className = 'color-btn';
                  colorButton.addEventListener('click', (e) => {

                      e.stopPropagation();

                      Pos_Select_id_square = newDiv.id;
                      const controlsContainer = document.getElementById(`containner_color_select-${uniqueId}`);
                     
                      if (controlsContainer) {
                          controlsContainer.classList.toggle("Show_Color_select");
                          controlsContainer.classList.toggle("Hide_Color_select");
                      }

                  });

                  /************************/
                  const textButton = document.createElement('button');
                  textButton.textContent = 'T';
                  textButton.className = 'text-btn';
                  textButton.addEventListener('click', (e) => {
                      e.stopPropagation();

                      if (currentDivForText === Divsub) {
                          textEditorPanel.style.display = 'none';
                          currentDivForText = null;
                          return;
                      }

                      currentDivForText = Divsub;
                                            
                      const textContentDiv = Divsub.querySelector('.text-content');
                      let title = '';
                      let bodyHtml = '';
                      
                      if (textContentDiv) {
                          const h3 = textContentDiv.querySelector('h3');
                          
                          if (h3) {
                              title = h3.textContent;
                              const clone = textContentDiv.cloneNode(true);
                              if(clone.querySelector('h3')) clone.querySelector('h3').remove();
                              bodyHtml = clone.innerHTML.trim();
                          } else {
                              bodyHtml = textContentDiv.innerHTML.trim();
                          }
                      } else {
                           const imgElement = Divsub.querySelector('img');
                           if(imgElement) imgElement.remove();
                      }
                      
                     
                      textEditorArea.innerHTML = bodyHtml;
                      textEditorPanel.style.display = 'flex';
                      initializeEditor(Divsub); //zero Pasa el div para cargar la posición
                  });


                  // Añadir botones a controlsDiv
                  controlsDiv.appendChild(imageButton);
                  controlsDiv.appendChild(colorButton); // Botón para mostrar/ocultar controles de color
                  controlsDiv.appendChild(textButton);
                  controlsDiv.appendChild(deleteButton);
                  newDiv.appendChild(controlsDiv);
                  newDiv.appendChild(Divsub);

                  ContainnerSquare.appendChild(newDiv);

                  // Asumiendo que makeResizableAndDraggable está definida en tu script
                  makeResizableAndDraggable(newDiv);
  });

  /******************CREAR GENERADOR DE square AREAS****************************/


}
/*cierre funcion*/

/*-----------------System Redicionamiento square---------------*/
function initializeDiv(containner,square) {
 
        console.log("containner")

        const containerRect = containner.getBoundingClientRect();
        const divRect = square.getBoundingClientRect();
        
        const initialLeft = ((divRect.left - containerRect.left) / containerRect.width) * 100;
        const initialTop = ((divRect.top - containerRect.top) / containerRect.height) * 100;
        const initialWidth = (divRect.width / containerRect.width) * 100;
        const initialHeight = (divRect.height / containerRect.height) * 100;

        square.style.left = `${initialLeft}%`;
        square.style.top = `${initialTop}%`;
        square.style.width = `${initialWidth}%`;
        square.style.height = `${initialHeight}%`;
}

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

function makeDraggableAndResizableSquare(containner,square) {

        let isResizing = false;
        let isDragging = false;
        let startX, startY;
        let startLeft, startTop, startWidth, startHeight;

        // Crear el "mango" de redimensionamiento
        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'resize-handle';
        square.appendChild(resizeHandle);

        // Evento mousedown para arrastrar
        square.addEventListener('mousedown', (e) => {
            if (e.target.className === 'resize-handle') {
                isResizing = true;
            } else {
                isDragging = true;
            }
            e.stopPropagation();
            startX = e.clientX;
            startY = e.clientY;

            // Obtener dimensiones y posición iniciales en porcentajes
            startLeft = parseFloat(square.style.left);
            startTop = parseFloat(square.style.top);
            startWidth = parseFloat(square.style.width);
            startHeight = parseFloat(square.style.height);
        });

        // Evento mousemove para redimensionar o arrastrar
        document.addEventListener('mousemove', (e) => {
            const containerRect = containner.getBoundingClientRect();

            if (isResizing) {
                const newWidthPercentage = Math.max(1, startWidth + ((e.clientX - startX) / containerRect.width) * 100);
                const newHeightPercentage = Math.max(1, startHeight + ((e.clientY - startY) / containerRect.height) * 100);
                
                square.style.width = `${newWidthPercentage}%`;
                square.style.height = `${newHeightPercentage}%`;
            } else if (isDragging) {
                const newLeftPercentage = startLeft + ((e.clientX - startX) / containerRect.width) * 100;
                const newTopPercentage = startTop + ((e.clientY - startY) / containerRect.height) * 100;
                
                square.style.left = `${newLeftPercentage}%`;
                square.style.top = `${newTopPercentage}%`;
            }
        });

        // Evento mouseup para detener ambas operaciones
        document.addEventListener('mouseup', () => {
            isResizing = false;
            isDragging = false;
        });
}

/*-----------------System Redicionamiento square---------------*/

/*--------------------------------------------------------*/
function Render_selector_area(data,pos_array){

    console.log("Render_selector_area",data)

    document.getElementById("SectionControl_Select_Section").innerHTML="";

    data.forEach((element,index)=>{

        if(index!=(pos_array)){

          document.getElementById("SectionControl_Select_Section").innerHTML+=`<option value="${element.id}">${element.name_area}</option>`;
     
        }else{

          document.getElementById("SectionControl_Select_Section").innerHTML+=`<option value="${data[pos_array].id}" selected>${data[pos_array].name_area}</option>`;

        }
    })
}
/*--------------------------------------------------------*/
function Selectror_de_areas(){

    var selectElement = document.getElementById("SectionControl_Select_Section");

    pos_array=selectElement.selectedIndex

    api.send("Search-area-select",selectElement.value)

}
/*--------------------------------------------------------*/

/**--------------------Systema de guardado-------------------------**/

function Guardar(){

    /*--------------------------------------------------------------*/
      let Data = {
          "id":document.getElementsByClassName("Containner-work-area")[0].id,
          "name_area":document.getElementById('SectionControl_TitleArea').value,
          "background":ContainnerBackground.style.background,
          "imageURL":"",
          "video":"",
          "sound":"",
          "duration":document.getElementsByClassName("Timeduration")[0].value*1000,
          "product":[]
      }
        

    /*----------------------------------------------------------------*/
    if(!document.getElementsByClassName("sound_area")[0]){

      console.log("no existe")

    }else{

        console.log("existe")

        Data.sound = document.getElementsByClassName("sound_area")[0].src;

    }
    if(!ContainnerBackground.children[0]){

      //console.log("no hijos")

    }
    else{
       // console.log("hijos")
        if(document.getElementsByClassName("Containner-work-area")[0].children[0].children[0].tagName=="IFRAME"){

          Data.video=document.getElementsByClassName("Containner-work-area")[0].children[0].children[0].src

        }
        if(document.getElementsByClassName("Containner-work-area")[0].children[0].children[0].tagName=="VIDEO"){      

          Data.video=document.getElementsByClassName("Containner-work-area")[0].children[0].children[0].children[0].src

        }
        if(document.getElementsByClassName("Containner-work-area")[0].children[0].children[0].tagName=="IMG"){

          Data.imageURL=document.getElementsByClassName("Containner-work-area")[0].children[0].children[0].src

        }

    }

    /*----------------------------------------------------------------*/
    let elements = document.querySelectorAll(".resizable-div");
       if(elements.length>0){
              elements.forEach((element,index)=>{
        
                    let ElementStyle = element.style;

                    let subObjet={
                          "id":element.id,
                          "width":ElementStyle.width,
                          "height":ElementStyle.height,
                          "top":ElementStyle.top,
                          "left":ElementStyle.left,
                          "right":ElementStyle.right,
                          "down":ElementStyle.down,
                          "background":ElementStyle.background,
                          "imageURL":"",
                          "Text":"",
                    }
                    /*SE DEBE DETECTAR SI EXISTE EL ELEEMETO*/ 
                      const padre = document.getElementById(element.id).querySelector(".sub-div-containner");
                      /*-------------------------------------------*/
                      const img = padre.querySelector('#imagen_square');

                      if (img) {

                        subObjet.imageURL=img.src
                                       
                      } else {
                        
                        subObjet.imageURL=""; 

                      }
                      /*------------detextartext------------------*/
                    const texto = padre.querySelector('.text-content');

                      if (texto) {

                        subObjet.Text=capturarDatosDesdeDiv(padre)
                                       
                      }else{

                        subObjet.Text="";

                      }
                                                      
                      /*------------detextartext------------------*/
                    Data["product"].push(subObjet)

              })
        }

        Estado_action="Guardar";
        api.send("save_area",Data)

}   


/**--------------------Systema de guardado-------------------------**/


