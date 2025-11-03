/***********************music***************************************/

function Search_music(){

    api.send("Open_Select_music_reproductor")
}

//JavaScript para controlar el reproductor
var audio = document.getElementById('audio');
var playPauseButton = document.getElementById('play-pause');
var previoButton = document.getElementById('previo');
var siguienteButton = document.getElementById('siguiente');

var Progreso = document.getElementById('Progreso');
var volumenControl = document.getElementById('volumen');
var volumenControl_externo = document.getElementById('volumen_externo');

var barraProgreso = document.getElementById('progress-bar-line');
const progresoBarra = document.getElementById('progresoBarra');
const tiempoActualSpan = document.getElementById('tiempoActual');
const duracionTotalSpan = document.getElementById('duracionTotal');
// Lista de canciones

var canciones;

api.receive("music-data-folder",(event,data)=>{

    canciones=data;

    console.log(canciones)

    setTimeout(function(){

        var select = document.getElementById("name_select_music");

        select.innerHTML="";          
        
        if(canciones.length>0){

            for (var i = 0; i < canciones.length; i++){
             
              var option = document.createElement("option");
                  option.value = canciones[i];
                  option.innerHTML= api.path().basename(canciones[i]);
                  option.id = api.path().basename(canciones[i]);
                  select.appendChild(option);        

            }
        }
        if(canciones.length==0){

            var option = document.createElement("option");
            option.value = "null";
            option.innerHTML= "Seleccionar Musica";
            select.appendChild(option);
        }

    },250)

})

api.receive("Select-music-update",(event,new_music)=>{

    console.log("music guardada",canciones)
    console.log("music-update",typeof new_music)

    let verificacion = canciones.includes(new_music)
    console.log(verificacion)

    if(verificacion==false){

      /*no existe*/

      canciones.push(new_music);
      
      setTimeout(function(){

          var select = document.getElementById("name_select_music");

          if(canciones.length>0){

            select.innerHTML+=`<option id="${api.path().basename(new_music)}" value="${api.path().basename(new_music)}" selected>${api.path().basename(new_music)}</option>`;

            cargarCancion(canciones[(canciones.length-1)])
          
          }
          if(canciones.length==0){

              var option = document.createElement("option");
              option.value = "null";
              option.innerHTML= "Seleccionar Musica";
              select.appendChild(option);
          
          }

      },250)

    }
    if(verificacion==true){
      
      /**existe**/
      eliminarOpcionPorId(api.path().basename(new_music))

      setTimeout(function(){

            var select = document.getElementById("name_select_music");

            if(canciones.length>0){

              select.innerHTML+=`<option id="${api.path().basename(new_music)}" value="${api.path().basename(new_music)}" selected>${api.path().basename(new_music)}</option>`;

              cargarCancion(canciones[(canciones.length-1)])
            
            }
            if(canciones.length==0){

                var option = document.createElement("option");
                option.value = "null";
                option.innerHTML= "Seleccionar Musica";
                select.appendChild(option);
            
            }

      },250)
    }
})

function eliminarOpcionPorId(idElemento) {
    // 1. Obtener la opción
    const opcionAEliminar = document.getElementById(idElemento);

    // 2. Verificar si el elemento existe
    if (opcionAEliminar) {
        // 3. Obtener el elemento padre (el <select>)
        // La propiedad 'parentElement' nos da acceso directo al <select>
        const selectPadre = opcionAEliminar.parentElement;

        // 4. Eliminar el hijo (la opción) del padre (el select)
        if (selectPadre) {
            selectPadre.removeChild(opcionAEliminar);
            console.log(`Elemento con ID "${idElemento}" eliminado con éxito.`);
        } else {
            console.error(`Error: El elemento con ID "${idElemento}" no tiene un padre (select) para ser eliminado.`);
        }
    } else {
        console.error(`Error: No se encontró ningún elemento con ID "${idElemento}".`);
    }
}



/*----------------------------------------------------------------*/


var posicionActual = 0;

function cargarCancion(Value) {
    socket.emit('Select-Musica',Value);
    audio.src = Value;
    audio.load();
    reproducir()
}

function Select_music_option(){

  var selectElement = document.getElementById("name_select_music");
  cargarCancion(selectElement.value);

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
      reproducir();
}

function reproducirSiguiente() {
      if(posicionActual < canciones.length - 1){

        posicionActual++;

      }else {

        posicionActual = 0;

      }

       cargarCancion(canciones[posicionActual])
       add_option_select_music(canciones[posicionActual],canciones)
       reproducir();
}


function add_option_select_music(select,data){

        document.getElementById("name_select_music").innerHTML="";

        document.getElementById("name_select_music").innerHTML+=`<option value="${api.path().basename(select)}" selected>${api.path().basename(select)}</option>`;

        data.forEach((element,index)=>{

            if(index!=(data.length-1)){

              document.getElementById("name_select_music").innerHTML+=`<option value="${api.path().basename(element)}">${api.path().basename(element)}</option>`;

            }
        })
}


function timeToMinute(times){
    var result = '00:00:00';
    var hour,minute,second
    if (times > 0) {
      hour = Math.floor(times / 3600);
      if (hour < 10) {
        hour = "0"+hour;
      }
      minute = Math.floor((times - 3600 * hour) / 60);
      if (minute < 10) {
        minute = "0"+minute;
      }
 
      second = Math.floor((times - 3600 * hour - 60 * minute) % 60);
      if (second < 10) {
        second = "0"+second;
      }
      if (hour == '00') {
        result = minute+':'+second;
      } else if (minute == '00'){
        result = hour+':'+minute+':'+second;
      } else {
        result = second;
      }
    }
    // console.log("result",result);
    return result;  
  
}


/*----------------------------------------------*/
    playPauseButton.addEventListener('click', function(){
        if(audio.paused){
             
              reproducir();

        }else{

              pausar();
        }
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

/***********************music***************************************/

        let isDragging = false; // Bandera para controlar si el usuario está arrastrando el "pulgar"

        /**
         * Función auxiliar para formatear segundos a 'm:ss'
         */
        function formatTime(secs) {
            const minutes = Math.floor(secs / 60);
            const seconds = Math.floor(secs % 60);
            return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        }

        // =================================================================
        // 1. Manejo de la Duración (loadedmetadata)
        // =================================================================
        audio.addEventListener('loadedmetadata', () => {
            // Establece el valor máximo de la barra al tiempo total del audio.
            // Usamos la duración en segundos y no en porcentaje, para mayor precisión.
            progresoBarra.max = audio.duration;
            duracionTotalSpan.textContent = formatTime(audio.duration);
        });
        
        // =================================================================
        // 2. Actualización de la Barra y el Tiempo (timeupdate)
        // =================================================================
        audio.addEventListener('timeupdate', () => {
            // Solo actualiza la barra si el usuario NO la está arrastrando (isDragging)
            if (!isDragging) {
                barraProgreso.style.width = ((audio.currentTime / audio.duration) * 100)+"%";
                progresoBarra.value = audio.currentTime;
            }
            tiempoActualSpan.textContent = formatTime(audio.currentTime);
        });
/*--------------------------------*/
  // Evento 1: Cuando el usuario comienza a interactuar con la barra.
        progresoBarra.addEventListener('mousedown', () => {
            isDragging = true;
            audio.pause(); // Opcional: pausar mientras se arrastra para evitar saltos.
        });

        // Evento 2: Mientras el usuario mueve el "pulgar".
        progresoBarra.addEventListener('input', () => {
            // Actualiza visualmente el tiempo actual mientras se arrastra.
            tiempoActualSpan.textContent = formatTime(progresoBarra.value);
        });

        // Evento 3: Cuando el usuario suelta el "pulgar".
        const handleMouseUp = () => {
            if (isDragging) {
                isDragging = false;
                // Establece el nuevo tiempo de reproducción del audio al valor de la barra.
                audio.currentTime = progresoBarra.value;
                
                // Si estaba reproduciéndose, reanuda la reproducción.
                if (playPauseButton.textContent === 'Pausar' || progresoBarra.value > 0) {
                    audio.play();
                }
            }
        };

        progresoBarra.addEventListener('mouseup', handleMouseUp);
        // También considera el evento 'change' en caso de un solo clic sin arrastrar
        progresoBarra.addEventListener('change', handleMouseUp);