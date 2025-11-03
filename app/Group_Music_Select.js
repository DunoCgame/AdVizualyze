const {app, BrowserWindow, Menu, MenuItem, ipcMain, dialog} = require('electron')
const path = require('path')
const fs = require('fs')
const os = require('os')
const PathDB = require(path.join(__dirname,'Path_db.js'));


function Open_Select_music_reproductor(mainWindow){

 // Configuración del diálogo
  const options = {
      title: 'Seleccionar Musica',
      filters: [
        { name: 'Musica', extensions: ['mp3','wav'] }
      ],
      properties: ['openFile','multiSelections']
  }

  // Mostrar el diálogo
    dialog.showOpenDialog(options).then(result => {

    	const filePaths = result.filePaths;
    
        if(result.canceled==true){
           
        }

        if(result.canceled==false){
   
              Process_copy_music(filePaths,mainWindow)
         
        }

	}).catch(err => {

		    console.log(err);

	});

}

function Process_copy_music(filePaths,mainWindow){

	let Arrar_select_music=[]

	const carpeta_music_dest = PathDB["musica"];

	/*GESTOR DE LECTURA PARA LIMPIADO*/
	fs.readdirSync(carpeta_music_dest).forEach((archivo) =>{

	      const archivoPath = `${carpeta_music_dest}/${archivo}`;

		  if(path.extname(archivoPath) === '.mp3'){
		  	
		  	/*LIMPIAR SOLO ARCHIVOS .MP3*/
		  		
		  }
	});

	/*GESTOR DE COPIADO*/

	/**copia los .mp3 a un segundo array para pasarlo a verificacion**/
	filePaths.forEach((music_name,index)=>{

		Arrar_select_music.push(music_name.toString())

	})

	Verificacion_archivos_reproductor(Arrar_select_music,carpeta_music_dest,mainWindow)

}

function Verificacion_archivos_reproductor(archivos,carpetaDestino,mainWindow) {
  if (!fs.existsSync(carpetaDestino)){

    fs.mkdirSync(carpetaDestino, { recursive: true });
    
  }

  archivos.forEach((archivo) => {
    const nombreArchivo = path.basename(archivo);
    const destino = path.join(carpetaDestino, nombreArchivo);

    if (path.extname(nombreArchivo).toLowerCase() !== '.mp3') {

      console.log(`Omitido: ${nombreArchivo} no es un archivo .mp3`);
      return;

    }

    if (fs.existsSync(destino)) {
     
      console.log(`Ya existe: ${nombreArchivo}`);
        const Ip_addres = Object.values(os.networkInterfaces()); 
		const IP = Ip_addres.flat().find(objeto => objeto.internal === false && objeto.family === 'IPv4');
		mainWindow.send("Select-music-update","http://"+IP["address"]+":"+"3000"+"/"+path.basename(archivo)); 

    } 
    else{

    	console.log("No Existe en el folder iniciando copiado...")

    		/**como no existe el .mp3 lo copia y envia**/

	    	let dest = path.join(PathDB["musica"],path.basename(archivo.toString()))

	    	fs.copyFile(archivo.toString(),dest,(err) => {
	         
		            if(err){

			            console.log(err);
		            }
		            else {

		                const Ip_addres = Object.values(os.networkInterfaces()); 
						const IP = Ip_addres.flat().find(objeto => objeto.internal === false && objeto.family === 'IPv4');
						mainWindow.send("Select-music-update","http://"+IP["address"]+":"+"3000"+"/"+path.basename(archivo)); 
		            }
	        });   
   	}
  
  });
}


/********************************/
function Open_select_music_area(mainWindow){

	const carpeta_music_dest = PathDB["musica"];

	const options = {
	      title: 'Seleccionar Musica',
	      filters: [
	        { name: 'Musica', extensions: ['mp3','wav'] }
	      ],
	      properties: ['openFile']
	}

  	// Mostrar el diálogo
    dialog.showOpenDialog(options).then(result => {

    	const file = result.filePaths;
    
        if(result.canceled==true){
           
        }

        if(result.canceled==false){
   
              //console.log(file[0])
              Verificacion_archivo_slide(file[0],carpeta_music_dest,mainWindow)
         
        }

	}).catch(err => {

		    console.log(err);

	});



}

function Verificacion_archivo_slide(archivo,carpetaDestino,mainWindow){

	if(!fs.existsSync(carpetaDestino)){

	   	fs.mkdirSync(carpetaDestino, { recursive: true });
	    
	}
    const nombreArchivo = path.basename(archivo);
    const destino = path.join(carpetaDestino,nombreArchivo);

    if(path.extname(nombreArchivo).toLowerCase() !== '.mp3') {

      console.log(`Omitido: ${nombreArchivo} no es un archivo .mp3`);
      return;

    }

    if(fs.existsSync(destino)) {
     
        console.log(`Ya existe: ${nombreArchivo}`);
        const Ip_addres = Object.values(os.networkInterfaces()); 
		const IP = Ip_addres.flat().find(objeto => objeto.internal === false && objeto.family === 'IPv4');
		mainWindow.send("Select-music-area","http://"+IP["address"]+":"+"3000"+"/"+path.basename(archivo)); 

    } 
    else{
		console.log(`No Existe ${nombreArchivo} en el folder iniciando copiado...`)
		/**como no existe el .mp3 lo copia y envia**/
		let dest = path.join(PathDB["musica"],path.basename(archivo.toString()))

		fs.copyFile(archivo.toString(),dest,(err) => {

		if(err){

		    console.log(err);
		}
		else {

		    const Ip_addres = Object.values(os.networkInterfaces()); 
			const IP = Ip_addres.flat().find(objeto => objeto.internal === false && objeto.family === 'IPv4');
			mainWindow.send("Select-music-area","http://"+IP["address"]+":"+"3000"+"/"+path.basename(archivo)); 
		}
		});   
   	}
   
}


/*--------------------------------------------------------------*/

function Select_music_folderv2(mainWindow) {
	const archivosArray = [];
    const rutaCarpeta = PathDB["musica"];
    const Ip_addres = Object.values(os.networkInterfaces());
    const IP = Ip_addres.flat().find(objeto => objeto.internal === false && objeto.family === 'IPv4');

    fs.readdir(rutaCarpeta, (err, archivos) => {
        if (err) {
            return console.error('Error al leer la carpeta:', err);
        }

        const archivosConFecha = [];
        let pendientes = archivos.length;
        if (pendientes === 0) return;

        archivos.forEach(archivo => {
            const rutaArchivo = path.join(rutaCarpeta, archivo);

            fs.stat(rutaArchivo, (err, stats) => {
                if (err) {
                    console.error('Error al obtener información del archivo:', err);
                } else if (stats.isFile()) {
                    archivosConFecha.push({
                        nombre: archivo,
                        fecha: stats.mtime
                    });
                }

                pendientes--;
                if (pendientes === 0) {
                    // Ordenar por fecha ascendente (más antiguo primero)
                    archivosConFecha.sort((a, b) => a.fecha - b.fecha);

                    archivosConFecha.forEach(({ nombre }) => {
                        const url = `http://${IP.address}:3000/${path.basename(nombre)}`;
                        archivosArray.push(url);
                    });
                    setTimeout(() => {
			          
			            mainWindow.send("Select-music-update", archivosArray);

			       	}, 1000);
                }
            });
        });
    });
}

function Select_music_folderv1(mainWindow){ 
		const archivosArray = []; 	
		const rutaCarpeta = PathDB["musica"] 
		const Ip_addres = Object.values(os.networkInterfaces()); 
		const IP = Ip_addres.flat().find(objeto => objeto.internal === false && objeto.family === 'IPv4'); 
		fs.readdir(rutaCarpeta, (err, archivos) => { 
			if (err) { 

				return console.error('Error al leer la carpeta:', err); 

			}
			else{ 
				archivos.forEach(archivo => { 
					const rutaArchivo = path.join(rutaCarpeta, archivo); 
					fs.stat(rutaArchivo, (err, stats) => { 
							if (err) { 

								return console.error('Error al obtener información del archivo:', err); 
							} 
							if (stats.isFile()) {

							 archivosArray.push("http://"+IP["address"]+":"+"3000"+"/"+path.basename(archivo)); // Agregar el archivo al array
							  
							} 
						});
						       setTimeout(() => {
				          
				            		mainWindow.send("Select-music-send", archivosArray);

				       			}, 1000); 
				}); 
			} 
		}) 
}


function Clear_Folder_Music(archivoPath){

    fs.unlinkSync(archivoPath,(err => {
		        if (err) {
				            dialog.showMessageBox({
				                          type:'error',
				                          title:"carpeta_music_dest no pudo ser limpiada",
				                          message: err.toString(),
				                          icon: 'error',
				                          buttons: ['Aceptar', 'Cancelar'],
				                          defaultId: 0,
				                          cancelId: 1
				            }).then(result => {
				                        
				                    console.log(result.response);

				            }).catch(err => {
				                        
				                    console.log(err);
				            });
		        }

		        else {
		                dialog.showMessageBox({
		                                title:" ",
		                                message:"carpeta_music_dest limpia",
		                                type:'info',
		                                icon: 'info',
		                                 buttons: ['Aceptar'],
		                                defaultId: 0,
		                                cancelId: 1,
		                                noLink: true
		                }).then(result => {
		                                console.log(result.response);
		                }).catch(err => {
		                                console.log(err);
		                });

		        }
    }));

			
}

module.exports = {

      Open_Select_music_reproductor:Open_Select_music_reproductor,
      Open_select_music_area:Open_select_music_area
};
