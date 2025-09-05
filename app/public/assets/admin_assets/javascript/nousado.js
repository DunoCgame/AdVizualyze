api.send("data-system")

let Info_Render;

api.receive("Add_data_select",(event,data)=>{

   Add_data_al_selector(data)

})

api.receive("Render_Data_search",(event,data)=>{

   Render_Data_search(data)

})


function Render_Data_search(data){

  console.log("Render_Data",data)

  data.forEach((element,index)=>{

      document.getElementById('SectionControl_TitleArea').value=element.name_area
      document.getElementById('SectionControl_col').value=element.section[0]
      document.getElementById('SectionControl_row').value=element.section[1]
      document.getElementById("container_area").innerHTML=""
      document.getElementById("container_area").innerHTML+=`<div class="Área-de-imágenes" id="containner_imagenes" style=" grid-template-columns:repeat(${element.section[0]}, 1fr); grid-template-rows:repeat(${element.section[1]}, 1fr);"></div>`
      
      Create_square_imagen(element.section[0],element.section[1])
  })
}

function Add_data_al_selector(data){

    let Containner_Area = document.getElementById("SectionControl_Select_Section")
    Containner_Area.innerHTML=""

    data.forEach((element,index)=>{

      Containner_Area.innerHTML+=`<option value="${element.id}">${element.name_area}</option>`;

    })
 
    document.getElementById('SectionControl_TitleArea').value=data[0].name_area
    document.getElementById('SectionControl_col').value=data[0].section[0]
    document.getElementById('SectionControl_row').value=data[0].section[1]
    document.getElementById("container_area").innerHTML=`<div class="Área-de-imágenes" id="containner_imagenes" style=" grid-template-columns:repeat(${data[0].section[0]}, 1fr); grid-template-rows:repeat(${data[0].section[1]}, 1fr);"> </div>`

    Create_square_imagen(data[0].section[0],data[0].section[1])
}

function Create_square_imagen(col,row){

  console.log("hlhlhlhl")

    let containner = document.getElementById("containner_imagenes")

    containner.innerHTML="";

      for (let i = 0; i < row; i++) {
          for (let a = 0; a < col; a++) {
              const nuevaImagen = document.createElement('img');
              nuevaImagen.src = `C:/Users/Duno Castellano/Desktop/Proyectos/PublishTVproyect/PublishTVSystemv2/public/default/default.png`;
              nuevaImagen.style.width = '100%'; 
              nuevaImagen.style.height = 'auto'; 
              nuevaImagen.style.background = '#b3b31d';
              nuevaImagen.style.gridArea = `${i}/${a}`;
              containner.appendChild(nuevaImagen);
         }
      }




}



function Selectror_de_areas(){

  var selectElement = document.getElementById("SectionControl_Select_Section");
  api.send("Search-area-select",selectElement.value)

}



/*********************************************************************/
let Area_select=0
function Col_data(){

document.getElementById("containner_imagenes").style.gridTemplateColumns = `repeat(${document.getElementById('SectionControl_col').value}, 1fr)`;

Create_square_imagen(document.getElementById('SectionControl_col').value,document.getElementById('SectionControl_row').value)

}
function Row_data(){

document.getElementById("containner_imagenes").style.gridTemplateRows = `repeat(${document.getElementById('SectionControl_row').value}, 1fr)`;

Create_square_imagen(document.getElementById('SectionControl_col').value,document.getElementById('SectionControl_row').value)

}
/**********************************************************************/
function Select_Imagen_list(){

  api.send("Select-Imagen")

}
      
api.receive("Imagen-select-section",(event,Images)=>{

  document.getElementById("selector_image").innerHTML=""

  Images.forEach((element,index)=>{


  document.getElementById("selector_image").innerHTML+=`<img src="${element}" id="imagen_list" onclick="get_src("${index}")">`
     


  })

})

function get_src(id){

console.log(id)

}


/**************************Adding_New_Area**********************************/

function Adding_New_Area(){

    let Containner_Area = document.getElementById("container_area")
    Containner_Area.innerHTML+=`<div class="Área-de-imágenes">  </div>`


}

function Save(){api.send("Save-Data-section",data)}
function Update(data){api.send("Update-Data-section",data)}
function Delet(data){api.send("Delet-Data-section",data)}

/********************************************************************************/
 // Conectar con el servidor Socket.IO
const socket = io('http://localhost:3000/');

socket.on("connect",() => {

    console.log(`Connected to server`,socket.id);

});

/****************************************************/
