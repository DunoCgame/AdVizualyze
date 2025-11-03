let saturation = 100;
let lightness = 50;
let alpha = 1;
let hue = 0;

/*-----------------VERIFICACION SI TIENE IMAGEN EL CONTENEDOR----------------------*/
function tieneImagenDeFondo(elemento) {
  const estilos = window.getComputedStyle(elemento);
  const backgroundImage = estilos.backgroundImage;
  return backgroundImage.startsWith('url(');
}

/*------------------VERIFICACION SI TIENE IMAGEN EL CONTENEDOR---------------------*/
/*******************INSCRUSTAR VIDEO e imagen  EN CONTAINNER*******************/
/*
function InscrustarVideoNuevo(id){

    const input = document.getElementById('videoId').value.trim();
    const padre = document.getElementById(id).children[0];
   
    padre.innerHTML = ''; 

    let embedHTML = '';

   if (input.includes('youtube.com') || input.includes('youtu.be')) {

      const videoId = input.split('v=')[1]?.split('&')[0] || input.split('/').pop();
      embedHTML = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
    }
    else 
      if (input.includes('vimeo.com')) {

        const videoId = input.split('/').pop();
        embedHTML = `<iframe src="https://player.vimeo.com/video/${videoId}" width="560" height="315" frameborder="0" allowfullscreen></iframe>`;
        
      } 
    else 
      if (input.match(/\.(mp4|webm|ogg)$/)) {

        embedHTML = `<video width="100%" height="100%" controls><source src="${input}" type="video/mp4">Tu navegador no soporta el video.</video>`;

      } 
      else {

        embedHTML = `<p>Formato de video no reconocido.</p>`;

      }

    padre.innerHTML = embedHTML;

      padre.style.zIndex = '3'

}
*/
function InscrustarVideo(id,input){


    const padre = document.getElementById(id);
    //padre.innerHTML = ''; // Limpiar contenido anterior

    let embedHTML = '';

   if (input.includes('youtube.com') || input.includes('youtu.be')) {

      const videoId = input.split('v=')[1]?.split('&')[0] || input.split('/').pop();
      embedHTML = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
    }
    else 
      if (input.includes('vimeo.com')) {

        const videoId = input.split('/').pop();
        embedHTML = `<iframe src="https://player.vimeo.com/video/${videoId}" width="560" height="315" frameborder="0" allowfullscreen></iframe>`;
        
      } 
    else 
      if (input.match(/\.(mp4|webm|ogg)$/)) {

        embedHTML = `<video width="100%" height="100%" controls><source src="${input}" type="video/mp4">Tu navegador no soporta el video.</video>`;

      } 
      else {

        embedHTML = `<p>Formato de video no reconocido.</p>`;

      }

    padre.innerHTML = embedHTML;
      padre.style.zIndex = '3'

}



function InscrustarImg(id,url){

     document.getElementById(id).innerHTML=`<img class="imagen-area" src="${url}" width="100%" height="100%">`

}

/*******************INSCRUSTAR VIDEO e imagen  EN CONTAINNER*******************/
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
      document.getElementById(containner).children[0].style.background ='';
      document.getElementById(containner).children[0].style.background =`linear-gradient(${gradienteAngle.value+"deg"}, ${color1}, ${color2})`;

    }
    if (gradienteType.value === 'radial') {

      document.getElementById(containner).children[0].style.background ='';
      document.getElementById(containner).children[0].style.background =`radial-gradient(circle, ${color1}, ${color2})`;

    }
    /*-------------------------------------------------------------*/

    gradienteType.addEventListener('change', function(){

        if (gradienteType.value === 'linear') {
           
            gradienteAngle.style.display = 'block';
            angleLabel.style.display = 'block';
            angle=gradienteAngle.value+"deg";
            /*-------------------------------------------------*/
            document.getElementById('angleLabel').innerHTML = gradienteAngle.value+" angle";
            document.getElementById(containner).children[0].style.background ='';
            document.getElementById(containner).children[0].style.background =`linear-gradient(${gradienteAngle.value+"deg"}, ${color1}, ${color2})`;


        } 
        if (gradienteType.value === 'radial') {

            gradienteAngle.style.display = 'none';
            angleLabel.style.display = 'none';
            angle='circle';
            /*---------------------------------------------*/
            document.getElementById(containner).children[0].style.background ='';
            document.getElementById(containner).children[0].style.background =`radial-gradient(circle, ${color1}, ${color2})`;
        }

    });
    
    gradienteAngle.addEventListener('input', function(){

        if (gradienteType.value === 'linear') {

            angle=gradienteAngle.value+"deg";
            document.getElementById('angleLabel').innerHTML = gradienteAngle.value+" angle";
            document.getElementById(containner).children[0].style.background ='';
            document.getElementById(containner).children[0].style.background =`linear-gradient(${angle}, ${color1}, ${color2})`;

        }
    });

    gradienteColor1.addEventListener('input', function() {


      if (gradienteType.value === 'linear') {


        color1=gradienteColor1.value;
        document.getElementById(containner).children[0].style.background ='';
        document.getElementById(containner).children[0].style.background =`linear-gradient(${angle}, ${color1}, ${color2})`;
      
      } 

      if (gradienteType.value === 'radial') {

        color1=gradienteColor1.value
        document.getElementById(containner).children[0].style.background ='';
        document.getElementById(containner).children[0].style.background =`radial-gradient(${angle}, ${color1}, ${color2})`;
      
      }

    });
    
    gradienteColor2.addEventListener('input', function() {

      if(gradienteType.value === 'linear') {
          color2=gradienteColor2.value;
          document.getElementById(containner).children[0].style.background ='';
          document.getElementById(containner).children[0].style.background =`linear-gradient(${angle}, ${color1}, ${color2})`;
        //console.log(angle, color1, color2)
      } 

      if(gradienteType.value === 'radial') {
            color2=gradienteColor2.value;
            document.getElementById(containner).children[0].style.background ='';
            document.getElementById(containner).children[0].style.background =`radial-gradient(${angle}, ${color1}, ${color2})`;
      }

    });

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

/************COLOR GRADIENT CONTAINNER**********************/

/*--------------------------Funciones de area------------------*/

function Open_Image_Select_area(){

    api.send("Select-Imagen-area")

}


api.receive("Imagen-select-section",(event,data)=>{


  document.getElementsByClassName("Containner-work-area")[0].children[0].innerHTML=`<img class="imagen-area" src="${data}" width="100%" height="100%">`

    Guardar()

})

/*-------------------------------------------------------------*/

function SeleccionrVideoenPC(){

  api.send("select-url-video-pc");

}

api.receive("video-seleccionado",(event,data)=>{

  console.log("video-seleccionado ",data)


  document.getElementsByClassName("Containner-work-area")[0].children[0].innerHTML=`<video width="100%" height="100%" controls><source src="${data}" type="video/mp4">Tu navegador no soporta el video.</video>`
  document.getElementsByClassName("Containner-work-area")[0].children[0].style.zIndex = '3'

    Guardar()

})

/*--------------------------------------------------*/

/*---------------------------------------------*/

function Seleccionar_sound_area(){

  api.send("seleccionar_sonido_area")

}

/**********sound area**********/
api.receive("Select-music-area",(event,new_music)=>{

  //console.log(document.getElementsByClassName("audio_area")[0].children[0].src)
  /*
  console.log(document.getElementsByClassName("audio")[0])
  document.getElementsByClassName("audio_area")[0].children[0].src=new_music;
  document.getElementsByClassName("audio_area")[0].play()*/
  //Guardar()
  //const audio = document.querySelector('.audio_area');
/*
    const audio = document.getElementsByClassName("audio_area")[0];
    audio.src=new_music;
    audio.play();
    */

    let con = document.getElementsByClassName("sub_containner_sound_controls")[0]
    con.innerHTML='';
    const audio = document.createElement('audio');
    audio.src=new_music;
    audio.id = `media`;
    audio.className="sound_area";
    audio.controls = "true";
    con.appendChild(audio);

    Guardar()
})

function showSystemSound(element,containner){

    const controlesGradiente = document.getElementsByClassName(element)[0];
    const isVisible = controlesGradiente.style.display === 'flex';
    controlesGradiente.style.display = isVisible ? 'none' : 'flex';

}




/*--------------------------------------------------*/

function Adding_area(){

  Estado_action="nuevo"

  api.send("Adding_area")

}

function Borrar_area(id){

  Estado_action="Borrar";

  api.send("Borrar-area-select",id)
 
}

function milisegundosASegundos(ms) {
  
  return ms / 1000;
}

function segundosAMilisegundos(seg) {
  
  return seg * 1000;
}

/*--------------------------Funciones de area---------------------------------*/

