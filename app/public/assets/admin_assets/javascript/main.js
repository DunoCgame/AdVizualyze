
let Data_area;
let Area_trabajo_seleccionada;

api.send('Data-System')


api.receive("Send-data-server",(event,server)=>{

  document.getElementById("servidor").innerHTML=server;
  
})

api.receive("Send-data-default",(event,data)=>{

    Data_area=data;

    Area_trabajo_seleccionada = data[0].id
    
    document.getElementById("SectionControl_Select_Section").innerHTML=""
     
    data.forEach((element,index)=>{

          document.getElementById("SectionControl_Select_Section").innerHTML+=`<option value="${element.id}">${element.name_area}</option>`;

    })

    setTimeout(Render_data_app, 1000);
 
})

api.receive("Render_Data_search",(event,data)=>{

  Data_area=data;

  Render_data_app()

})

api.receive("Render_Data",(event,data)=>{

  console.log("**********reload***********",data)
  console.log(Area_trabajo_seleccionada)

        setTimeout(function(){
        
              if(Area_trabajo_seleccionada=="borrar"&& Area_trabajo_seleccionada!="new"){

                      Data_area=[data[0]]  
                  
                          document.getElementById("SectionControl_Select_Section").innerHTML="";

                          data.forEach((element,index)=>{

                              document.getElementById("SectionControl_Select_Section").innerHTML+=`<option value="${element.id}">${element.name_area}</option>`;

                          })
                          
                      Render_data_app()   

              }


              if(Area_trabajo_seleccionada!="borrar" && Area_trabajo_seleccionada!="new"){
                     
                     Data_area=data.filter(element => element.id === Area_trabajo_seleccionada) ?? -1


                          document.getElementById("SectionControl_Select_Section").innerHTML="";

                          data.forEach((element,index)=>{

                              document.getElementById("SectionControl_Select_Section").innerHTML+=`<option value="${element.id}">${element.name_area}</option>`;

                          })
                          
                      Render_data_app() 

              }

              if(Area_trabajo_seleccionada=="new" && Area_trabajo_seleccionada!="borrar"){

                Data_area=data.filter(element => element.id === data[(data.length-1)].id) ?? -1

                          document.getElementById("SectionControl_Select_Section").innerHTML="";

                     
                              document.getElementById("SectionControl_Select_Section").innerHTML+=`<option value="${Data_area[0].id}">${Data_area[0].name_area}</option>`;

          
                         data.forEach((element,index)=>{

                              if(index!=(data.length-1)){

                                 document.getElementById("SectionControl_Select_Section").innerHTML+=`<option value="${element.id}">${element.name_area}</option>`;

                              }

                           })
                          Render_data_app()
              } 
          },1400);

})


/*************************************************************************************/
function Render_data_app(){
      
    console.log("Render_Data",Data_area)  

    document.getElementById("container_area").innerHTML="";
    
    /*************************AREA 1 SELECTRO CUADRICULA*****************************************/
     document.getElementById("container_area").innerHTML=`<div class="Containner-Área-de-imágenes"> 
     <div class="Containner-Área-de-imágenes-btn"> 
              <button id="btn_add_image_section" class="icon-image" onclick="Open_Image_Select_area()" >Agregar Imagen</button> 
              <span class="NameAreacontainner">Nombre del Area: <input type="text" id="SectionControl_TitleArea" class="nombre-area" value='${Data_area[0].name_area}'>
            </span> 
              <span class="containner-btn-square">columnas 
                  <div class="number-input">
                       <button onclick="this.parentNode.querySelector('input[type=number]').stepDown(); Col_data('${Data_area[0].id}')" ></button>
                        <input id="SectionControl_col" class="col"  type="number" min="1" name="" value='${Data_area[0].section[0]}'  placeholder="Col" oninput="Col_data('${Data_area[0].id}');">
                        <button onclick="this.parentNode.querySelector('input[type=number]').stepUp(); Col_data('${Data_area[0].id}')" class="plus"></button>
                  </div>
              </span> 
              <span class="containner-btn-square">filas
                  <div class="number-input">
                        <button onclick="this.parentNode.querySelector('input[type=number]').stepDown(); Row_data('${Data_area[0].id}')" ></button>
                        <input id="SectionControl_row" class="row"  type="number" min="1"  name="" value='${Data_area[0].section[1]}' placeholder="Row" oninput="Row_data('${Data_area[0].id}'); ">
                        <button onclick="this.parentNode.querySelector('input[type=number]').stepUp(); Row_data('${Data_area[0].id}')" class="plus"></button>
                  </div>
              </span> 
            <button id="update_area" class="update_area" onclick="Guardar()">Guardar</button>
            <button id="delet_area" class="delet_area" onclick="Borrar_area('${Data_area[0].id}')">Borrar</button> 
    </div> 
    <div class="Containner-work-area"> 
      <div class="Containner-square" id="containner_square" style="grid-template-columns:repeat(${Data_area[0].section[0]}, 1fr); grid-template-rows:repeat(${Data_area[0].section[1]}, 1fr); "></div> 
        <div class="Containner-imagenes" id="containner_imagenes" style="grid-template-columns:repeat(${Data_area[0].section[0]}, 1fr); grid-template-rows:repeat(${Data_area[0].section[1]}, 1fr); background-image:url('${Data_area[0].image_background}');"></div>
      </div>
    </div>`
    
    /****************************************************************/
        for (let row = 0; row < document.getElementsByClassName("row")[0].value; row++){
              for (let col = 0; col <document.getElementsByClassName("col")[0].value; col++){
                 
                  document.getElementById("containner_square").innerHTML+=`
                    <div class="item-square" id="item_square" ></div>`
              
              }
        }
    /*************************AREA 1 SELECTROR IMAGENES********************icon-spinner3*********************/

    Data_area[0].product.forEach((product,index)=>{

    document.getElementById("containner_imagenes").innerHTML+=`
      <div class="img-article" id="item_imagene"  style="background-image:url('${product.image}'); grid-area:${product.pos};">
           <div class="containner-btn">
                <button class="btn_show_section_article icon-image" onclick="Update_imagen_product('${index}')"></button>
                <button class="btn_show_section_article icon-bin" onclick="Delete_imagen_product('${product.id}')"></button>
          </div> 
      </div>`              
      })


    /*******************************************************************************************/
    /***********************************CREAR GENERADOR DE AREAS***************************************************/

        const gridContainer = document.querySelector('.Containner-square');
        let startRow, startColumn, endRow, endColumn; //variables pos

        gridContainer.addEventListener('mousedown', (event) => {
            const rect = gridContainer.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const columnWidth = rect.width / getComputedStyle(gridContainer).gridTemplateColumns.split(' ').length;
            const rowHeight = rect.height / getComputedStyle(gridContainer).gridTemplateRows.split(' ').length;

            startColumn = Math.floor(x / columnWidth);
            startRow = Math.floor(y / rowHeight);
            
            // Reiniciar la posición final
            endRow = startRow;
            endColumn = startColumn;
        });

        gridContainer.addEventListener('mousemove', (event) => {
            if (startRow !== undefined && startColumn !== undefined) {
                  const rect = gridContainer.getBoundingClientRect();
                  const x = event.clientX - rect.left;
                  const y = event.clientY - rect.top;

                  const columnWidth = rect.width / getComputedStyle(gridContainer).gridTemplateColumns.split(' ').length;
                  const rowHeight = rect.height / getComputedStyle(gridContainer).gridTemplateRows.split(' ').length;

                  // Actualizar la posición final
                  endRow = Math.floor(y / rowHeight);
                  endColumn = Math.floor(x / columnWidth);
                
                // Mostrar el área seleccionada (opcional)
               console.log(`Desde Fila: ${startRow}, Columna: ${startColumn} Hasta Fila: ${endRow}, Columna: ${endColumn}`);
            }
        });

        gridContainer.addEventListener('mouseup', (event) => {

            if(startRow !== undefined && startColumn !== undefined && endRow !== undefined && endColumn !== undefined) {

                // Validar si ya existe un elemento en el área seleccionada
            if (!isAreaOccupied(startRow+ 1, startColumn+ 1, endRow+2, endColumn+2)) {
                
              // Crear un nuevo elemento
             let color=getRandomColor()

                  document.querySelector('.Containner-imagenes').innerHTML+=`<div class="item-void" id="item_void" style="background:${color}; grid-area:${startRow + 1} / ${startColumn + 1} / ${endRow + 2} / ${endColumn + 2};">
                   <div class="containner-btn">
                    <button class="btn_show_section_article icon-spinner3" onclick="Nuevo_imagen_product('${startRow + 1} / ${startColumn + 1} / ${endRow + 2} / ${endColumn + 2}')">Nuevo</button> 
                   </div> 
                   </div>`

               } else {
                   
                    alert('Ya existe un elemento en el área seleccionada.');
               }

                // Reiniciar las variables
                startRow = undefined;
                startColumn = undefined;
                endRow = undefined;
                endColumn = undefined;
            }
        });

}

/*************************************************************************************/

function isAreaOccupied(startRow, startColumn, endRow, endColumn) {

  let Info=startRow+" / "+startColumn+" / "+endRow+" / "+endColumn;

    const elements = document.querySelector('.Containner-imagenes').children; // Obtener todos los elementos hijos del contenedor

    for (let element of elements) {

        if(element.style.gridArea.toString()==Info){
            return true
        }
    }

    return false;
}

function getRandomColor() {

    const letters = '0123456789ABCDEF';

    let color = '#';

    for (let i = 0; i < 6; i++) {

        color += letters[Math.floor(Math.random() * 16)];

    }

    return color;
}

function Col_data(id){

    document.getElementById("containner_square").style.gridTemplateColumns = `repeat(${document.getElementById('SectionControl_col').value}, 1fr)`;
    document.getElementById("containner_imagenes").style.gridTemplateColumns = `repeat(${document.getElementById('SectionControl_col').value}, 1fr)`;
    Update_square()
  
}

function Row_data(id){

    document.getElementById("containner_square").style.gridTemplateRows = `repeat(${document.getElementById('SectionControl_row').value}, 1fr)`;
    document.getElementById("containner_imagenes").style.gridTemplateRows = `repeat(${document.getElementById('SectionControl_row').value}, 1fr)`;
    Update_square()

}


/*actualiza el area de todo cambios*/
function Update_square(){

    console.log("update")

    document.getElementById("containner_imagenes").innerHTML="";
    document.getElementById("containner_square").innerHTML="";

     for (let row = 0; row < document.getElementsByClassName("row")[0].value; row++) {
          for (let col = 0; col <document.getElementsByClassName("col")[0].value; col++) {
             
              document.getElementById("containner_square").innerHTML+=`<div class="item-square" id="item_square" ></div>`;
          }
      }

      Data_area[0].product.forEach((product,index)=>{

              document.getElementById("containner_imagenes").innerHTML+=`<div class="img-article" id="item_imagene" style="background-image:url('${product.image}'); grid-area:${product.pos};"> <div class="containner-btn"> <button class="btn_show_section_article icon-image" onclick="Update_imagen_product('${product.id})"></button> <button class="btn_show_section_article icon-bin" onclick="Delete_imagen_product('${product.id}')"></button> </div></div>`;
      })

      Guardar()
}


/***************
NOTA AGREGAR UNA VASE DE CONTENEDOR PARA  LA CUADRICULAS DE IMAGENES PARA HACER LOS CALCULOS
****************************/

function Selectror_de_areas(){

        var selectElement = document.getElementById("SectionControl_Select_Section");

        Area_trabajo_seleccionada = selectElement.value

        api.send("Search-area-select",selectElement.value)

}

/*--------------------------Funciones de area---------------------------------*/

function Open_Image_Select_area(){

    api.send("Select-Imagen-area")

}

api.receive("Imagen-select-section",(event,data)=>{

  document.getElementById("containner_imagenes").style.backgroundImage = `url('${data}')`;

  setTimeout(Guardar(),1000)

})


function Guardar(){

    const container = document.getElementById("containner_imagenes");

    const hijosConClaseImage = container.getElementsByClassName("img-article");

    if(hijosConClaseImage.length > 0) {

        let elements = document.querySelector('.Containner-imagenes').childNodes;

              let img1 = document.querySelector('.Containner-imagenes').style.backgroundImage
              const resultado1 = /url\("(http.*)"\)/.exec(img1);
              const grupoCapturado1 = resultado1 ? resultado1[1] : null; // Captura la URL

              let Data = {
                  "id":Data_area[0].id,
                  "name_area":document.getElementById('SectionControl_TitleArea').value,
                  "image_background":grupoCapturado1,
                  "section":[
                       document.getElementById('SectionControl_col').value,
                       document.getElementById('SectionControl_row').value
                  ],
                  "product":[]
              }

              /*----------------------------------------------------------------*/
              elements.forEach((element,index)=>{

                  let img2 = element.style.backgroundImage
                  const resultado2 = /url\("(http.*)"\)/.exec(img2);
                  const grupoCapturado2 = resultado2 ? resultado2[1] : null; // Captura la URL

                  Data["product"].push({
                    "id":Data_area[0].product[index].id,
                    "name_article":Data_area[0].product[index].name_article,
                    "image":grupoCapturado2,
                    "pos":element.style.gridArea
                  }) 

              })

              api.send("save_area",Data)
    }
        
}

function Adding_area(){

    api.send("Adding_area")
    Area_trabajo_seleccionada = "new"

}

function Borrar_area(id){

  api.send("Borrar-area-select",id)
  Area_trabajo_seleccionada = "borrar"

}

/*--------------------------Funciones de area---------------------------------*/


/*--------------------------Funciones de productos---------------------------------*/
function Nuevo_imagen_product(data){

    const elements = document.querySelector('.Containner-imagenes').children; // Obtener todos los elementos hijos del contenedor

    for(let element of elements){

        if(element.style.gridArea.toString()==data){
           
            element.remove();

                api.send("Add-product",{
                  name_area:document.querySelector('.Containner-Área-de-imágenes-btn').children[1].children[0].value,
                  pos:data
                })
        }
    }
}

let indexobj;


function Update_imagen_product(index){

    indexobj = index

    api.send("Select-Imagen-product")

}

api.receive("Imagen-select-product",(event,data)=>{

    document.getElementsByClassName("img-article")[indexobj].style.backgroundImage=`url('${data}')`;
    Guardar()

})

function Delete_imagen_product(id_area,id_producto){

    api.send("Delete-product",id_area)
}
/*--------------------------Funciones de productos---------------------------------*/