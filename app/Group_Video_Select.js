const {app, BrowserWindow, Menu, MenuItem, ipcMain, dialog} = require('electron')
const path = require('path')
const fs = require('fs')
const os = require('os')

const PathDB = require(path.join(__dirname,'Path_db.js'));

function Open_Video_Select(mainWindow,action){

				  const options = {
				    title: 'Seleccionar Video',
				    filters: [
				      { name: 'Video', extensions: ['mp4', 'mov', 'avi', 'mk', 'wmv'] }
				    ],
				   properties:['openFile','showHiddenFiles','promptToCreate'] 
				  }

				  dialog.showOpenDialog(options).then(result => {
				   
						const filePaths = result.filePaths;

				        if(result.canceled==true){  

				                        
				        }
				        else{

				        	Saving(filePaths[0],mainWindow) 

				        }

				  }).catch(err => {
				    console.log(err);
				  });
				/*******************************/
}


function Saving(addres,mainWindow){

	const Ip_addres = Object.values(os.networkInterfaces());
	const IP = Ip_addres.flat().find(objeto => objeto.internal === false && objeto.family === 'IPv4');

	    let dest = path.join(PathDB["upload"], path.basename(addres.toString()));

	    fs.copyFile(addres, dest, (err) => {
	        if (err) {
	            console.log('Error al copiar la imagen:', err);
	        } else {
	            console.log("Archivo copiado exitosamente:", dest);

	            	mainWindow.send("video-seleccionado","http://"+IP["address"]+":"+"3000"+"/"+path.basename(addres.toString()))  
	                		
	        }
	    });	
}

module.exports = {
       Open_Video_Select:Open_Video_Select,
};
