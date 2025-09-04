let data = [
  { "id":0,
    "name_seccion": "cosmos",
    "categoria": [
      { "id":0, "name": "cosmos" },
      { "id":1, "name": "estrellas" }
    ]
  },
  {"id":1,
    "name_seccion": "votanica",
    "categoria": [
      { "id":0, "name": "flores" },
      { "id":1, "name": "catus" }
    ]
  }
];

function cambiarCategoriaPorId(id, nuevoObjeto) {
  for (let i = 0; i < data.length; i++) {
    let categoria = data[i].categoria;
    for (let j = 0; j < categoria.length; j++) {
      if (categoria[j].id === id) {
        categoria[j] = nuevoObjeto;
        break;
      }
    }
  }
}

function cambiarObjetoDataPorId(id, nuevoObjeto) {
  for (let i = 0; i < data.length; i++) {
    if (data[i].id === id) {
      data[i] = nuevoObjeto;
      break;
    }
  }
}

// Ejemplo de uso de las funciones
let nuevoObjetoCategoria = { "id": 1, "name": "nueva categoria" };
cambiarCategoriaPorId(1, nuevoObjetoCategoria);

let nuevoObjetoData = { "id": 0, "name_seccion": "nueva seccion", "categoria": [] };
cambiarObjetoDataPorId(0, nuevoObjetoData);

console.log(data);



console.log({
                                "name":document.getElementById("nombre").value,
                                "image":document.getElementById("image_product").src,
                                "price":document.getElementById("precio").value,
                                "type_money":document.getElementById("type_money").value,
                                "area":document.getElementById("select_area_option").value,
                                "area":document.getElementById("select_area_option").value,
                                "pos":[
                                        document.getElementById("col").value,
                                        document.getElementById("row").value
                                        ]
                })

/*****************************************/

  Data_Product.forEach((data,index)=>{

              if(product.area==data.name_area){

                  console.log("son iguasles")
                  

                  data.product.push({
                            "id":uuidv4(),
                            "name":product.name,
                            "image":product.image,
                            "price":product.price,
                            "type_money":product.type_money,
                            "area":product.area,
                            "pos":product.pos
                  })
                    console.log(JSON.stringify(Data_Product))

                    Saving_datas_json(Data_Product)

              }
      })




      const elemento = document.getElementById("miElemento");
if (elemento.childNodes.length > 0) {
  // El elemento tiene hijos
} else {
  // El elemento no tiene hijos
}



let fuentes = ["Arial", "Helvetica", "Times New Roman", "Verdana", "Courier New"];




/*********************************************************************************************/

const fs = require('fs');

// Eliminar un archivo
fs.unlink('ruta-del-archivo', (error) => {
  if (error) {
    console.error('Error al eliminar el archivo:', error);
  } else {
    console.log('Archivo eliminado correctamente');
  }
});

// Eliminar un directorio
fs.rmdir('ruta-del-directorio', { recursive: true }, (error) => {
  if (error) {
    console.error('Error al eliminar el directorio:', error);
  } else {
    console.log('Directorio eliminado correctamente');
  }
});
/***************************************************************************/
    const totalImagenes = col * row; 

    for(let i = 0; i < totalImagenes; i++){
        const nuevaImagen = document.createElement('img');
       /* nuevaImagen.src = `ruta/a/tu/imagen${i + 1}.jpg`;*/ 
        nuevaImagen.alt = `Imagen ${i + 1}`;
        nuevaImagen.style.width = '100%'; 
        nuevaImagen.style.height = 'auto'; 
        nuevaImagen.style.background = '#b3b31d';
        /*'rowStart / columnStart';*/
        nuevaImagen.style.gridArea=`1/2`;

        nuevaImagen.onclick=function(){
          console.log("sf")
        } 
        containner.appendChild(nuevaImagen);
    }


        for (var i = 0; i >= col; i++) {
      for (var a = 0; i >= row; i++) {
        const nuevaImagen = document.createElement('img');
       /* nuevaImagen.src = `ruta/a/tu/imagen${i + 1}.jpg`;*/ 
        nuevaImagen.alt = `Imagen ${i + 1}`;
        nuevaImagen.style.width = '100%'; 
        nuevaImagen.style.height = 'auto'; 
        nuevaImagen.style.background = '#b3b31d';
        /*'rowStart / columnStart';*/
        nuevaImagen.style.gridArea=`${4}/${4}`;

        nuevaImagen.onclick=function(){
          console.log("sf")
        } 
        containner.appendChild(nuevaImagen);
      }
    }

    /**************************************************************************************/
atraves del parametro addres de la siguiente funcion
function Saving_image(addres){

    addres.forEach((element) => {
        // Obtener el nombre del archivo desde la dirección actual
        let dest = path.join(__dirname, 'public/upload', path.basename(element));

        fs.copyFile(element, dest, (err) => {
            if (err) {
                console.log('Error al copiar la imagen:', err);
            } else {
                console.log("Archivo copiado exitosamente:", dest);
            }
        });
    });
}

estoy reciviendo un array que contienne la direccion de la imagenes seleccionadas para copiar las en el destino puedes correguirlo
/***********************************************************************************/
      for (let i = 0; i < row; i++) {
          for (let a = 0; a < col; a++) {
              const nuevaImagen = document.createElement('img');
             nuevaImagen.src = `C:/Users/Duno Castellano/Desktop/Proyectos/PublishTVproyect/PublishTVSystemv2/public/default/default.png`;
             //nuevaImagen.alt = `Imagen ${i + 1}`;
              nuevaImagen.style.width = '100%'; 
              nuevaImagen.style.height = 'auto'; 
              nuevaImagen.style.background = '#b3b31d';
              nuevaImagen.style.gridArea = `${i}/${a}`;
              containner.appendChild(nuevaImagen);
         }
      }
/****************************************************************************
      for (let i = 0; i < row; i++) {
          for (let a = 0; a < col; a++) {
              const nuevaImagen = document.createElement('img');
              nuevaImagen.src = `C:/Users/Duno Castellano/Desktop/Proyectos/PublishTVproyect/PublishTVSystemv2/public/default/default.png`;
              nuevaImagen.alt = `Imagen ${i + 1}`;
              nuevaImagen.style.width = '100%'; 
              nuevaImagen.style.height = 'auto'; 
              nuevaImagen.style.background = '#b3b31d';
              nuevaImagen.style.gridArea = `${i}/${a}`;
              nuevaImagen.onclick=function(){
                
                 api.send("Select-Imagen")

                 api.receive("Imagen-select-section",(event,Images)=>{


                    nuevaImagen.src=Images

                  })

              } 
              containner.appendChild(nuevaImagen);
         }
      }

/***********************************************************************************/
var fechaActual = new Date();
var año = fechaActual.getFullYear();
var mes = fechaActual.getMonth() + 1; // Los meses comienzan desde 0
var dia = fechaActual.getDate();
var hora = fechaActual.getHours();
var minutos = fechaActual.getMinutes();
var segundos = fechaActual.getSeconds();

console.log("Fecha y hora actual: " + dia + "/" + mes + "/" + año + " " + hora + ":" + minutos + ":" + segundos);
