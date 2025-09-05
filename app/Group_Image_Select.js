const {app, BrowserWindow, Menu, MenuItem, ipcMain, dialog} = require('electron')
const path = require('path')
const fs = require('fs')
const os = require('os')
let Group_Image = []

const PathDB = require(path.join(__dirname,'Path_db.js'));

let Type_action=""
function Open_Image_Select(mainWindow,action){

				console.log("Area ",action)
				Type_action=action;

				Group_Image = []
				  const options = {
				    title: 'Seleccionar Imágenes',
				    filters: [
				      { name: 'Imágenes', extensions: ['jpg', 'png', 'gif', 'bmp', 'svg'] }
				    ],
				   properties:['openFile','showHiddenFiles','promptToCreate'] 
				  }

				  dialog.showOpenDialog(options).then(result => {
				   
						const filePaths = result.filePaths;

				        if(result.canceled==true){  

				                        
				        }

				        if(result.canceled==false){ 

				              Saving_image(filePaths[0],mainWindow)
				        }

				  }).catch(err => {
				    console.log(err);
				  });
				/*******************************/
}

function Saving_image(addres,mainWindow){

	const Ip_addres = Object.values(os.networkInterfaces());
	const IP = Ip_addres.flat().find(objeto => objeto.internal === false && objeto.family === 'IPv4');

	    let dest = path.join(PathDB["upload"], path.basename(addres.toString()));

	    fs.copyFile(addres, dest, (err) => {
	        if (err) {
	            console.log('Error al copiar la imagen:', err);
	        } else {
	            console.log("Archivo copiado exitosamente:", dest);

	            if(Type_action=="producto"){

	            	mainWindow.send("Imagen-select-product","http://"+IP["address"]+":"+"3000"+"/"+path.basename(addres.toString()))        

	            }
	            if(Type_action=="area"){
	            		
	            	mainWindow.send("Imagen-select-section","http://"+IP["address"]+":"+"3000"+"/"+path.basename(addres.toString()))  
	            }      		
	        }
	    });	
}


function Saving_multi_image(addres,mainWindow){

	console.log("Array img",addres)

	const Ip_addres = Object.values(os.networkInterfaces());
	const IP = Ip_addres.flat().find(objeto => objeto.internal === false && objeto.family === 'IPv4');

     Clear_folder_Image()

	    addres.forEach((url) => {

	        let dest = path.join(PathDB["upload"],path.basename(url));

	        fs.copyFile(url, dest, (err) => {
	            if (err) {
	                console.log('Error al copiar la imagen:', err);
	            } else {
	                console.log("Archivo copiado exitosamente:", dest);

	               }
	        });

	      Group_Image.push("http://"+IP["address"]+":"+"3000"+"/"+path.basename(url))
	    });

	

		mainWindow.send("Imagen-select-section",Group_Image)    

}


function Clear_folder_Image(){

		const carpeta = PathDB["upload"];

        fs.readdir(carpeta, (err, archivos) => {
          if (err) {
            console.error('Error al leer la carpeta:', err);
            return;
          }

		          archivos.forEach((archivo) => {
		            fs.unlink(`${carpeta}/${archivo}`, (err) => {
		              if (err) {
		                console.error(`Error al eliminar el archivo ${archivo}:`, err);
		              } else {
		                console.log(`Archivo ${archivo} eliminado correctamente.`);
		              }
		            });
		          });
        });
}

function Reader_folder_Image(directorio){

	fs.readdir(directorio, (err, archivos) => {
		    if (err) {
		        return console.log('Error al leer el directorio:', err);
		    }
		    console.log('Archivos en el directorio:', archivos);
   });

}




module.exports = {
       Open_Image_Select:Open_Image_Select,
};
