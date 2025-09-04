const {app, BrowserWindow, Menu, MenuItem, ipcMain, dialog} = require('electron')
const path = require('path')
const fs = require('fs')
const os = require('os')

const { v4: uuidv4 } = require('uuid');


const Data_Product= require(path.join(__dirname,"./public/data_app/data.json"))

let window_New_update_section;


module.exports = function New_Update_section(info){

                window_New_update_section = new BrowserWindow({
                                        /*parent: mainWindow,*/
                                        width:800,
                                        height:400,
                                        resizable:false,             
                                        modal:true,
                                        show:true,
                                        autoHideMenuBar:true,  
                                        frame: false,
                                        webPreferences: {
                                        nodeIntegration: false, // is default value after Electron v5
                                        contextIsolation: true, // protect against prototype pollution
                                        enableRemoteModule: false, // turn off remote
                                        preload:path.join(__dirname,'preload.js')
                                        }
                                })
                window_New_update_section.loadFile('public/new_update_section.html');
              //  window_New_update_section.webContents.openDevTools()                  
                window_New_update_section.once('ready-to-show',() => {

                        window_New_update_section.show()      

                }) 


/*-----------------------------------------------*/

/*-----------------------------------------------*/




  if(info.action=="new"){

     window_New_update_section.send("Type-action-area",info.action)
  } 

  if(info.action=="update"){

    const elementosEncontrados = Data_Product.find(item => item.id === info.id);
 
 window_New_update_section.send("select-area-data-update",elementosEncontrados)
 window_New_update_section.send("Type-action-area",info.action)


  }    


}



/*--------------------------------------------------------------*/
ipcMain.on("Select_imagen_save",(event,data)=>{

       openImageDialog()

})

// Función para abrir el diálogo de selección de imágenes
function openImageDialog() {
  // Configuración del diálogo
  const options = {
    title: 'Seleccionar Imágenes',
    filters: [
      { name: 'Imágenes', extensions: ['jpg', 'png', 'gif', 'bmp', 'svg'] }
    ],
    properties: ['openFile']
  }

  // Mostrar el diálogo
  dialog.showOpenDialog(options).then(result => {
    // Obtener la ruta de las imágenes seleccionadas
    const filePaths = result.filePaths;
    
        if(result.canceled==true){  

                        
        }

        if(result.canceled==false){ 

                        Saving_image(filePaths)

        }

  }).catch(err => {
    console.log(err);
  });
/*******************************/
}

function Saving_image(addres){

        const Ip_addres = Object.values(os.networkInterfaces());
        const IP = Ip_addres.flat().find(objeto => objeto.internal === false && objeto.family === 'IPv4');


             fs.copyFile(addres.toString(),path.join(__dirname,'public/upload/'+path.basename(addres.toString())), (err) => {
                if (err) {

                 // console.log('Error al copiar la imagen:', err);
                  dialog.showMessageBox({
                          type:'error',
                          title:"Error al copiar la imagen:",
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
          message:"Imagen copiada exitosamente",
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


                  window_New_update_section.send("Imagen-select-section","http://"+IP["address"]+":"+"3000"+"/"+path.basename(addres.toString()))    

                      //  console.log("http://"+IP["address"]+":"+"3000"+"/"+path.basename(addres.toString()))
                }
              });

}

/*********************************************************************************/
ipcMain.on("Save_data_area",(event,data)=>{

    Saving_datas_json(data)

})

function Saving_datas_json(data){

        data.id=uuidv4(),

        Data_Product.push(data)

        fs.writeFile(path.join(__dirname,'public/data_app/data.json'), JSON.stringify(Data_Product), (err) => {
                  if (err) throw err;
                  console.log('The "data to append" was appended to file!');
        });

}

/****************************************************************************/

ipcMain.on("Update_data_area",(event,data)=>{

    Update_data(data)
 
})

function Update_data(area){

/******************************************************/
 for (let i = 0; i < Data_Product.length; i++){
      if(Data_Product[i].id===area.id){
        Data_Product.splice(i,1,area) ///ejecuta
          break;
      }
  }
  /*----------------------------------------------------------------*/
      /*save product generate fichero*/
     
    let data_save = JSON.stringify(Data_Product); 

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


ipcMain.on("Cancelar",(event,data)=>{
})