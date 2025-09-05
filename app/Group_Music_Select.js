const {app, BrowserWindow, Menu, MenuItem, ipcMain, dialog} = require('electron')
const path = require('path')
const fs = require('fs')
const os = require('os')
const PathDB = require(path.join(__dirname,'Path_db.js'));


function Open_Select_music(mainWindow){


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
    // Obtener la ruta de las imágenes seleccionadas
    const filePaths = result.filePaths;
    
        if(result.canceled==true){  

                        
        }

        if(result.canceled==false){ 
   
              copy_music(filePaths,mainWindow)
        }

  }).catch(err => {
    console.log(err);
  });

}

let array2=[]

function copy_music(filePaths,mainWindow){

	array2=[]

	const carpeta = PathDB["musica"];

	fs.readdirSync(carpeta).forEach((archivo) =>{

	      const archivoPath = `${carpeta}/${archivo}`;

		  if(path.extname(archivoPath) === '.mp3'){

				    fs.unlinkSync(archivoPath,(err => {
						        if (err) {

								            dialog.showMessageBox({
								                          type:'error',
								                          title:"limpiar carpeta",
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
						                                message:"carpeta limpia",
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
	});



    const Ip_addres = Object.values(os.networkInterfaces());
    const IP = Ip_addres.flat().find(objeto => objeto.internal === false && objeto.family === 'IPv4');


	filePaths.forEach((addres_music,index)=>{

		console.log(path.join(PathDB["musica"],path.basename(addres_music.toString())))

        fs.copyFile(addres_music.toString(),path.join(PathDB["musica"],path.basename(addres_music.toString())),(err) => {
         
            if(err){
                
	               /* dialog.showMessageBox({
	                          type:'error',
	                          title:"Error al copiar la musica",
	                          message: err.toString(),
	                          icon: 'error',
	                          buttons: ['Aceptar', 'Cancelar'],
	                          defaultId: 0,
	                          cancelId: 1
	                    }).then(result => {
	                        
	                          console.log(result.response);

	                    }).catch(err => {
	                        
	                        console.log(err);
	                });*/

            }
            else {
                        /*
                      dialog.showMessageBox({
                                title:" ",
                                message:"musica copiada exitosamente",
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
                      });*/

            }
        });

	    array2.push("http://"+IP["address"]+":"+"3000"+"/"+path.basename(addres_music.toString()))

	})

        
        mainWindow.send("Select-music-send",array2)

}

module.exports = {
      Open_Select_music:Open_Select_music,
};
