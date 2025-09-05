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

                cargarCancion(canciones[0])

  },250)


})


function obtenerValor(){

    var selectElement = document.getElementById("name_select_music");
    console.log(selectElement.value);
    cargarCancion(selectElement.value);

}

    var posicionActual = 0;

    function cargarCancion(Value) {
        socket.emit('Select-Musica',Value);
        audio.src = Value;
        audio.load();
      //  reproducir()
    }

    function reproducir() {
          audio.play();
          socket.emit('Play');
          playPauseButton.classList.replace("icon-play3","icon-stop2");
    }

    function pausar() {
          audio.pause();
          socket.emit('Pause');
          playPauseButton.classList.replace("icon-stop2","icon-play3");
    }

    function reproducirAnterior(){
          
          if(posicionActual > 0){

               posicionActual--;

          }else{

               posicionActual = canciones.length - 1;

          }

          
          cargarCancion(canciones[posicionActual])
          selectMusic(canciones[posicionActual],canciones)
          reproducir();
    }

    function reproducirSiguiente() {
          if(posicionActual < canciones.length - 1){

            posicionActual++;

          }else {

            posicionActual = 0;

          }

           cargarCancion(canciones[posicionActual])
           selectMusic(canciones[posicionActual],canciones)
           reproducir();
    }

/*----------------------------------------------*/
    playPauseButton.addEventListener('click', function(){
        if(audio.paused){
             
              reproducir();

        }else{

              pausar();
        }
    });


    audio.addEventListener('timeupdate', function() {
        var porcentaje = (audio.currentTime / audio.duration) * 100;
        barraProgreso.style.width = porcentaje + '%';
    });


    audio.addEventListener('ended', function() {
       reproducirSiguiente();
    });


    previoButton.addEventListener('click', function() {
        reproducirAnterior();
    });

    siguienteButton.addEventListener('click', function() {
        reproducirSiguiente();
    });

    volumenControl.addEventListener('input', function() {
        audio.volume = volumenControl.value;
    });    

    volumenControl_externo.addEventListener('input', function() {
        socket.emit('Volumen',volumenControl_externo.value);
    });

  
function selectMusic(select,data){

        document.getElementById("name_select_music").innerHTML="";

        document.getElementById("name_select_music").innerHTML+=`<option value="${api.path().basename(select)}">${api.path().basename(select)}</option>`;

        data.forEach((element,index)=>{

        if(index!=(data.length-1)){

        document.getElementById("name_select_music").innerHTML+=`<option value="${api.path().basename(element)}">${api.path().basename(element)}</option>`;

        }
    })
}

/***********************music***************************************/