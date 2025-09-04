const {app, BrowserWindow, Menu, MenuItem, ipcMain, dialog} = require('electron')
const path = require('path')
const fs = require('fs')
const os = require('os')

const { v4: uuidv4 } = require('uuid');
//uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'


const Data_Product= require(path.join(__dirname,"./public/data_app/data.json"))

let window_New_update_product;


module.exports = function New_Update_Product(info){

                window_New_update_product = new BrowserWindow({
                                        /*parent: mainWindow,*/
                                        width:800,
                                        height:230,
                                        resizable:false,             
                                        modal:true,
                                        show:true,
                                        frame: false,
                                        autoHideMenuBar:true,  
                                        webPreferences: {
                                        nodeIntegration: false, // is default value after Electron v5
                                        contextIsolation: true, // protect against prototype pollution
                                        enableRemoteModule: false, // turn off remote
                                        preload:path.join(__dirname,'preload.js')
                                        }
                                })
                window_New_update_product.loadFile('public/new_update_product.html');
              
               //window_New_update_product.webContents.openDevTools()                  
               
                window_New_update_product.once('ready-to-show',() => {

                        window_New_update_product.show()      

                })  
    send_area();

  if(info.action=="new"){

    window_New_update_product.send("Type-action-area",info.action)

  } 



  if(info.action=="update"){

      console.log(info.id)

        const elementosEncontrados = Data_Product.flatMap(item => item.product.filter(cat => cat.id === info.id));
         
         console.log(elementosEncontrados[0])

          window_New_update_product.send("select-product-data-update",elementosEncontrados[0])
           window_New_update_product.send("Type-action-area",info.action)
            
  }
}

/*----------------------------------------------*/



/*----------------------------------------------*/

function send_area(){

        window_New_update_product.send("select-name-area",Data_Product.map(item => item.name_area))

}


ipcMain.on("Select_imagen_save_product",(event,data)=>{

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
}



function Saving_image(addres){

        const Ip_addres = Object.values(os.networkInterfaces());
        const IP = Ip_addres.flat().find(objeto => objeto.internal === false && objeto.family === 'IPv4');


             fs.copyFile(addres.toString(),path.join(__dirname,'public/upload/'+path.basename(addres.toString())), (err) => {
                if (err) {
                  
                  //console.log('Error al copiar la imagen:', err);
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
                 

                  window_New_update_product.send("Imagen-select-product","http://"+IP["address"]+":"+"3000"+"/"+path.basename(addres.toString()))    


                      //  console.log("http://"+IP["address"]+":"+"3000"+"/"+path.basename(addres.toString()))
                }
              });

}



/************************************/

ipcMain.on("Save_data_product",(event,product)=>{

    Saving_datas_json(product)

})


function Saving_datas_json(product){

    Data_Product.forEach((data,index)=>{

      if(product.area==data.name_area){

                      console.log("son iguasles")


                      product.id=uuidv4();

              data.product.push(product)
                    
           fs.writeFile(path.join(__dirname,'public/data_app/data.json'), JSON.stringify(Data_Product), (err) => {
                  if (err) throw err;
                  console.log('The "data to append" was appended to file!');
        });
      }
    })
     
}

/*************************************************************/
ipcMain.on("Update_data_product",(event,data)=>{

    Update_data(data)
 
})

function Update_data(product){

  for (let i = 0; i < Data_Product.length; i++){

    let select = Data_Product[i].product;

      for (let j = 0; j < select.length; j++) {

          if(select[j].id===product.id){
              console.log("iguals")
                  select.splice(j,1,product) ///ejecuta
                  break;
          }
      }
  }
  /*----------------------------------------------------------------*/
      /*save product generate fichero*/
    let data_save = JSON.stringify(Data_Product); /*informacion conversion*/

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
                    console.log("  update successfully\n");
                  }
    });
}



/******************************************************************/

ipcMain.on("Cancelar",(event,data)=>{

       app.quit()

})

