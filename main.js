const {app, BrowserWindow, Menu, MenuItem, ipcMain, dialog} = require('electron')
const path = require('path')
const fs = require('fs')
const os = require('os')
const Server_System = require('./Server');
const Data_Product = require(path.join(__dirname,"./public/data_app/data.json"))
const time = require(path.join(__dirname,"./public/data_app/time.json"))
const New_Update_section = require('./new_update_section.js');
const New_Update_Product = require('./new_update_product.js');


let  mainWindow;

function createWindow(){

    mainWindow = new BrowserWindow({
            width: 900,
            height: 600,
            autoHideMenuBar:true,  
             icon:path.join(__dirname,'/favicon.ico'),
            webPreferences: {
              nodeIntegration: false,
              contextIsolation: true, 
              preload:path.join(__dirname,'preload.js')

            }

});

  // Cidar el archivo HTML principal
  mainWindow.loadFile('public/admin.html');

 //mainWindow.webContents.openDevTools() 

  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault(); // Evita que se abran nuevas ventanas
  });

  // Evento cuando se cierra la ventana
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  Server_System()
}


function resetApp(){

  const contenido = '[]';


  fs.writeFile(path.join(__dirname,"./public/data_app/data.json"),contenido, (err) => {
            if (err) throw err;
            console.log('clear key file!');
  });


  const carpeta_upload = path.join(__dirname,'/public/upload');

          fs.readdir(carpeta_upload, (err, archivos) => {
            if (err) {
              console.error('Error al leer la carpeta:', err);
              return;
            }

              archivos.forEach((archivo) => {
                fs.unlink(`${carpeta_upload}/${archivo}`, (err) => {
                  if (err) {
                    console.error(`Error al eliminar el archivo ${archivo}:`, err);
                  } else {
                    console.log(`Archivo ${archivo} eliminado correctamente.`);
                  }
                });
              });
          });


}


fs.watch(path.join(__dirname,"./public/data_app/data.json"), (eventType, filename) => { 
     mainWindow.send("Render-data",Data_Product)
  });


/*------------------------------------------------------------------*/
ipcMain.on('data-system',(event, id) => {
    mainWindow.send("Render-data",Data_Product)
})
/*---------------------------------------------------------------------------------------------*/

ipcMain.on('Open_new_update_area',(event, id) => {

  New_Update_section(id)

})

ipcMain.on('Delete_area',(event, id) => {

    Delect_area(id,Data_Product)
    
})
/***************************************************************/

ipcMain.on('Open_new_update_product',(event, id) => {

    New_Update_Product(id)

})

ipcMain.on('Delete_product',(event, id) => {

 Delect_product(id,Data_Product)
    
})

function Delect_product(id,db){

  for (let i = 0; i < db.length; i++){

    let categoria = db[i].product;

      for (let j = 0; j < categoria.length; j++) {

          if(categoria[j].id===id){
                  categoria.splice(j, 1);
                  break;
          }
      }
  }
  /*----------------------------------------------------------------*/
       /*save product generate fichero*/
    let data_save = JSON.stringify(db); /*informacion conversion*/

    fs.writeFile(path.join(__dirname,'./public/data_app/data.json'), 
      data_save,{
              encoding: "utf8",
              flag: "w",
              mode: 0o666
            },
      (err) => {
                    if (err){
                  /*console.log(err);*/
                    }
                  else {
                    console.log("delet successfully\n");
                  }
    });



}
function Delect_area(id,db){

  for (let i = 0; i < db.length; i++){

      if(db[i].id===id){
        db.splice(i, 1);
          break;
      }
  }
  /*----------------------------------------------------------------*/
      /*save product generate fichero*/
     
    let data_save = JSON.stringify(db); 

    fs.writeFile(path.join(__dirname,'./public/data_app/data.json'), 
      data_save,{
              encoding: "utf8",
              flag: "w",
              mode: 0o666
            },
      (err) => {
                  if (err){
                        console.log(err);
                    }
                  else{
                    console.log("delet successfully\n");
                  }
    });
}

/*************************************************************************/
ipcMain.on('Open_Select_music',(event, id) => {

  Open_Select_music()

})

function Open_Select_music(){


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
   
              copy_music(filePaths)
        }

  }).catch(err => {
    console.log(err);
  });

}

let array2=[]

function copy_music(filePaths){


  array2=[]



const carpeta = path.join(__dirname,'public/musica');

fs.readdirSync(carpeta).forEach((archivo) => {
  const archivoPath = `${carpeta}/${archivo}`;
  if (path.extname(archivoPath) === '.mp3') {
      fs.unlinkSync(archivoPath,(err => {
        if (err) {
           dialog.showMessageBox({
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

        fs.copyFile(addres_music.toString(),path.join(__dirname,'public/musica/'+path.basename(addres_music.toString())),(err) => {
             if(err){
                    dialog.showMessageBox({
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
                  });

              } else {
                        
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
                      });

                }
        });


        array2.push("http://"+IP["address"]+":"+"3000"+"/"+path.basename(addres_music.toString()))

})

        //console.log(array2)
        mainWindow.send("Select-music-send",array2)

}
/*---------------------------------------------------------------------------------------------*/
/*

ipcMain.on('data-time-get',(event, id) => {

  mainWindow.send("data-time-send",time)

})



ipcMain.on('save-time',(event, time_data) => {

  Time(time_data)

})
*/

/*
function Time(time_data){

    let conten = {"time_limit":time_data}

    fs.writeFile(path.join(__dirname,"./public/data_app/time.json"),JSON.stringify (conten), (err)=> {
                        if (err) throw err;
                        console.log('save timer-count');
    });

}

*/
ipcMain.on("quit",(event,data)=>{

       app.quit()

})

/*---------------------------------------------------------------------------------------------*/
// Evento cuando la app está lista para crear ventanas
app.on('ready', createWindow);

// Evento cuando todas las ventanas están cerradas
app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') {
          app.quit();
    }
});

// Evento cuando la app se activa (solo en macOS)
app.on('activate', () => {
    if(BrowserWindow.getAllWindows().length === 0) {
              createWindow();
    }
});
