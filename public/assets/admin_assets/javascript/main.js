/**********************************/



function Obtain_data_saving(){

        api.send("data-system")
        api.send("data-time-get")
        api.receive("data-time-send",(event,data)=>{


        //console.log( new Date(data.time_limit))
            if(data.time_limit==""){
                 let  fechaActual = new Date();

            let time_limit =  new Date(fechaActual.getTime() + 24 * 60 * 60 * 1000);
            api.send("save-time",time_limit)

            }
                if(data.time_limit!==""){


         let  fechaActual = new Date();
         let fechaObjetivo = new Date(data.time_limit)

         //console.log(fechaActual)

                    /************************************************************************/

                   let diferencia = fechaObjetivo - fechaActual;

                  //  console.log(diferencia)
                    if (diferencia <= 0) {
                         console.log("cerrar")

                             setTimeout(function(){

                                api.send("quit")


        },5000)            
                    }

                }

        })




}

Obtain_data_saving();

api.receive("Render-data",(event,data)=>{

    Render_data(data)

})


let Contain_areas = document.getElementById("containner_areas");

function Render_data(data){


        Contain_areas.innerHTML="";


        data.forEach(function(area,index){
                                
           Contain_areas.innerHTML+=`
           <section class="section">
                        <header class="area_head">
                                <h3 class="title_area">${area.name_area}</h3>
                                <div>
                                    <label>Fila:<span>${area.section[0]}</span></label>
                                    <label>Columna:<span>${area.section[1]}</span></label>
                                </div>
                                <div>
                                    <button class="btn_show_section_article icon-spinner3" onclick="Update_area('${area.id}')"></button>
                                   <button class="btn_show_section_article icon-bin" onclick="Delete_area('${area.id}')"></button>
                                   <button class="btn_show_section_article btn_hide_show icon-menu4"></button>
                                </div>
                        </header>
                        <section class="section_article" id="area_article" style="background-image: url('${area.image_background}')">
                                             
                        </section>
                </section>`;

        let area_product =  document.getElementsByClassName("section_article")[index];

                area.product.forEach(function(product,index){

                area_product.innerHTML+=`<article class="article" id="article">
                            <img src="${product.image}" alt="Descripción de la imagen" class="imagen" id="imagen">
                            <h2 class="titulo-article" id="titulo_article">${product.name}</h2>
                            <div class="containner_select_position">
                                <span>fila
                                    <span>${product.pos[0]}</span>
                                </span>
                                <span>columna
                                     <span>${product.pos[1]}</span>
                                </span>
                            </div>
                            <div class="containner_btn">
                                <button class="btn btn-update" onclick=Update_product('${product.id}')>update</button>
                                <button class="btn btn-delete" onclick=Delete_product('${product.id}')>Delete</button>
                            </div>
                        </article> `;
               })

        });

/**************************/
let listproduct = document.querySelectorAll(".section_article")

    let btn = document.querySelectorAll(".btn_hide_show")

    btn.forEach(function(element,index){

        element.onclick=function(){

            if (listproduct[index].className === 'hidden') {
                
                 listproduct[index].classList.replace("hidden","section_article");
                 btn[index].classList.replace("icon-menu4","icon-menu3");

            } else {

                 listproduct[index].classList.replace("section_article","hidden");
                 btn[index].classList.replace("icon-menu3","icon-menu4");

            }
        }

    })
}
/**********************************/

/****FUNCIONES DEL DASBOARD***/


function New_product(id){

    if (Contain_areas.childNodes.length > 0) {
      // El elemento tiene hijos
       api.send("Open_new_update_product",{"id":"id","action":"new"})
    } else {
      // El elemento no tiene hijos
      alert("no hay area disponible")
    }

}
function Update_product(id){

    console.log("product id",id)
   
    api.send("Open_new_update_product",{"id":id,"action":"update"})
}

function Delete_product(id){
    api.send("Delete_product",id)
}
/**********************************************/

/****************************************/
function New_area(){
        api.send("Open_new_update_area",{"id":"id","action":"new"})
}
function Update_area(id){


console.log("update ara id",id)
    api.send("Open_new_update_area",{"id":id,"action":"update"})
}

function Delete_area(id){
    console.log(id)
    api.send("Delete_area",id)
}

/****************************************************/
  // Conectar con el servidor Socket.IO
const socket = io('http://localhost:3000/');

socket.on("connect",() => {

    console.log(`Connected to server`,socket.id);

});

/****************************************************/
/***********************music***************************************/


function select_song(){

    console.log("song select")
  api.send("Open_Select_music")

}

//JavaScript para controlar el reproductor
var audio = document.getElementById('audio');
var playPauseButton = document.getElementById('play-pause');
var previoButton = document.getElementById('previo');
var siguienteButton = document.getElementById('siguiente');
var barraProgreso = document.getElementById('progress-bar');
var volumenControl = document.getElementById('volumen');
var volumenControl_externo = document.getElementById('volumen_externo');
// Lista de canciones
//var canciones = ['C:/Users/Public/Music/Sample Music/Kalimba.mp3', 'C:/Users/Public/Music/Sample Music/Sleep Away.mp3'];
var canciones;


api.receive("Select-music-send",(event,data)=>{

canciones=[]
canciones=data;

cargarCancion(canciones[0])

 setTimeout(function(){

                var select = document.getElementById("name_select_music");           
                
                /*while(select.hasChildNodes()){
                                        
                    select.removeChild(select.firstChild);
                                
                }*/
                select.innerHTML = "";

                for (var i = 0; i < canciones.length; i++){

                          var option = document.createElement("option");

                          option.value = canciones[i];
                          option.innerHTML= api.path().basename(canciones[i]);
                          option.id = api.path().basename(canciones[i]);
                          // Append the option element to the select element
                          select.appendChild(option);
                }
        },250)
})


function obtenerValor() {
  var selectElement = document.getElementById("name_select_music");
  console.log(selectElement.value);
  cargarCancion(selectElement.value);
}

    var posicionActual = 0;

    function cargarCancion(Value) {
        socket.emit('Select-Musica',Value);
        audio.src = Value;
        audio.load();
        reproducir()
    }

    function reproducir() {
      audio.play();
       socket.emit('Play');
      playPauseButton.classList.replace("icon-play3","icon-stop2");;
    }

    function pausar() {
      audio.pause();
       socket.emit('Pause');
      playPauseButton.classList.replace("icon-stop2","icon-play3");;
    }

    function reproducirAnterior() {
          if (posicionActual > 0) {
            posicionActual--;
          } else {
            posicionActual = canciones.length - 1;
          }
          cargarCancion();
          reproducir();
    }

    function reproducirSiguiente() {
          if (posicionActual < canciones.length - 1) {
            posicionActual++;
          } else {
            posicionActual = 0;
          }
          cargarCancion();
          reproducir();
    }

    playPauseButton.addEventListener('click', function() {
      if (audio.paused) {
        reproducir();
      } else {
        pausar();
      }
    });

    previoButton.addEventListener('click', function() {
      reproducirAnterior();
    });

    siguienteButton.addEventListener('click', function() {
      reproducirSiguiente();
    });

    audio.addEventListener('timeupdate', function() {
      var porcentaje = (audio.currentTime / audio.duration) * 100;
      barraProgreso.style.width = porcentaje + '%';
    });

    volumenControl.addEventListener('input', function() {
      audio.volume = volumenControl.value;
    });    

 volumenControl_externo.addEventListener('input', function() {
      socket.emit('Volumen',volumenControl_externo.value);
    });

    
/***********************music***************************************/
/************************************/


