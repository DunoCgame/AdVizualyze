const {app, BrowserWindow, Menu, MenuItem, ipcMain, dialog} = require('electron')
const path = require('path')
const fs = require('fs')
const os = require('os')
const { v4: uuidv4 } = require('uuid');
const Server_System = require('./Server');

const {Open_Image_Select} = require('./Group_Image_Select.js');
const {Open_Select_music} = require('./Group_Music_Select.js');

const PathDB = require(path.join(__dirname,'Path_db.js'));

const App_config = require(PathDB.App_config)
const Data_App = require(PathDB.Data)
const time = require(PathDB.time)

//console.log(Data_App)
/****
console.log(PathDB["musica"])
console.log(PathDB["upload"])
*****************************/
/********************************************/

let  mainWindow;

   
function createWindow(){


     if(App_config.status==false){

             Install_App()
             //Clear_folder()
      }
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

                  mainWindow.loadFile(path.join(__dirname,'public/admin.html'));

                 mainWindow.webContents.openDevTools() 
Server_System()

}


/*-------------------------------------------------------------------------------------------*/
function Install_App(){

    console.log("Install ...App")
    const val = Object.values(os.networkInterfaces());
    const dataOs = val.flat().find(objeto => objeto.internal === false && objeto.family === 'IPv4');

    const info = {
            "status": true,
            "date": new Date().toString(), 
            "machine": {
                "hostname":os.hostname(),
                "platform":os.platform(),
                "cpu":os.cpus()[0].model
          },
          "server":{
            "ip":dataOs["address"],
            "port":"3000"
          }
      };

    fs.writeFile(PathDB.App_config,JSON.stringify(info), function (err) {
        if (err) throw err;
        console.log('App config Saved!');
    });


    fs.writeFile(PathDB.Data,JSON.stringify([]), (err) => {
              if (err) throw err;
              console.log('Clear file!');
    });

    const contenido = [
              {
                "id":uuidv4(),
                "name_area":"Default-"+Data_App.length,
                "image_background":"http://"+dataOs["address"]+":3000/default2.png",
                "section":["2","2"],
                "product":[
                      {
                        "id":uuidv4(),
                        "name_article":"Default1",
                        "image":"http://"+dataOs["address"]+":3000/default.png",
                        "pos":"1 / 1 / 2 / 2"
                      },
                      {
                        "id":uuidv4(),
                        "name_article":"Default2",
                        "image":"http://"+dataOs["address"]+":3000/default.png",
                        "pos":"1 / 2 / 2 / 3"
                      },
                      {
                        "id":uuidv4(),
                        "name_article":"Default3",
                        "image":"http://"+dataOs["address"]+":3000/default.png",
                        "pos":"2 / 1 / 3 / 2"
                      },
                      {
                        "id":uuidv4(),
                        "name_article":"Default4",
                        "image":"http://"+dataOs["address"]+":3000/default.png",
                        "pos":"2 / 2 / 3 / 3"
                      }   
                  ],
              }];

    fs.writeFile(PathDB.Data,JSON.stringify(contenido), (err) => {
              if (err) throw err;
              console.log('Reset data Ok!');
    });

    /**************************************/

 
          if (!fs.existsSync(PathDB["upload"])) {

                console.log('carpeta no upload existe.');

                fs.mkdir(PathDB["upload"],(err) => {
                    if (err) {
                       return console.error(err);
                    }
                     console.log('Se ha creado la carpeta products correctamente.');
                });
          }
          else {

            console.log('La carpeta Products ya existe.');
          } 


          if (!fs.existsSync(PathDB["musica"])) {

                 console.log('carpeta no musica existe.');
                     
                      fs.mkdir(PathDB["musica"],(err) => {
                              if (err) {
                                 return console.error(err);
                              }
                               console.log('Se ha creado la carpeta users correctamente.');
                          });
            
          } else {
           console.log('La carpeta users ya existe.');
          }
        

}


function Reset_App(){
    
    const val = Object.values(os.networkInterfaces());
    const dataOs = val.flat().find(objeto => objeto.internal === false && objeto.family === 'IPv4');

      const contenido = [
          {
            "id":uuidv4(),
            "name_area":"Default"+Data_App.length,
            "image_background":"http://"+dataOs["address"]+":3000/default2.png",
            "section":["2","2"],
            "product":[
                  {
                    "id":uuidv4(),
                    "name_article":"Default1",
                    "image":"http://"+dataOs["address"]+":3000/default.png",
                    "pos":"1 / 1 / 2 / 2"
                  },
                  {
                    "id":uuidv4(),
                    "name_article":"Default2",
                    "image":"http://"+dataOs["address"]+":3000/default.png",
                    "pos":"1 / 2 / 2 / 3"
                  },
                  {
                    "id":uuidv4(),
                    "name_article":"Default3",
                    "image":"http://"+dataOs["address"]+":3000/default.png",
                    "pos":"2 / 1 / 3 / 2"
                  },
                  {
                    "id":uuidv4(),
                    "name_article":"Default4",
                    "image":"http://"+dataOs["address"]+":3000/default.png",
                    "pos":"2 / 2 / 3 / 3"
                  }   
              ],
          }
      ];

    fs.writeFile(PathDB.Data,JSON.stringify(contenido), (err) => {
              if (err) throw err;
              console.log('clear  file!');
    });

}

/*----------------------------Reload of Data for change-----------------------*/

fs.watch(PathDB.Data, (eventType, filename) => {

        fs.readFile(PathDB.Data, (err, data) => {
                
                if (err) throw err;
                mainWindow.send("Render_Data",JSON.parse(data))           
        });
});
/**/
/*----------------------------Reload of Data for change--------------------------------*/

/*---------------------Enviar Informacioon de Render Dat-----------------*/
ipcMain.on('Data-System',(event,data) => {

    const Ip_addres = Object.values(os.networkInterfaces());
    const IP = Ip_addres.flat().find(objeto => objeto.internal === false && objeto.family === 'IPv4');

      fs.readFile(PathDB.Data, (err, data) => {
                
                if (err) throw err;

                mainWindow.send("Send-data-default",JSON.parse(data))           
                mainWindow.send("Send-data-server",App_config.server.ip+":"+App_config.server.port)           
      });

      const rutaCarpeta = PathDB["musica"]

const archivosArray = []; // Array para almacenar los nombres de los archivos

fs.readdir(rutaCarpeta, (err, archivos) => {
    if (err) {
        return console.error('Error al leer la carpeta:', err);
    }
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
    });

    // Esperar un momento para asegurarse de que todos los archivos se hayan procesado
    setTimeout(() => {
        //console.log('Archivos encontrados:', archivosArray);
        mainWindow.send("Select-music-send", archivosArray);
        // Aquí puedes enviar el array a donde necesites
    }, 1000); // Ajusta el tiempo según sea necesario
});
})

/*---------------------Enviar Informacioon de Render Data-------------------*/
/*---------------------------Search data------------------------------------*/
ipcMain.on("Search-area-select",(event, id) => {

		fs.readFile(PathDB.Data, (err, data) => {
		                
		                if (err) throw err;

		   mainWindow.send("Render_Data_search",JSON.parse(data).filter(element => element.id === id) ?? -1)

		})
})
/*---------------------------Funciones de Area-------------------------------*/
ipcMain.on("save_area",(event,data_area) => {

  fs.readFile(PathDB.Data, (err, data) => {
                 
      Save_new_data_area(data_area,JSON.parse(data))
  })

})

ipcMain.on("Borrar-area-select",(event,id) => {

    fs.readFile(PathDB.Data, (err, data) => {
      
        Borrar_area(id,JSON.parse(data))
    })

})

ipcMain.on("Adding_area",(event, id) => {

    fs.readFile(PathDB.Data, (err, data) => {
   
        Add_new_Area(JSON.parse(data))

    })




})

ipcMain.on("Select-Imagen-area",(event, id) => {

  Open_Image_Select(mainWindow,"area")

})
/*--------------------------funciones de Area -----------------------------------*/
/*--------------------------funciones de imaghenes -----------------------------------*/

ipcMain.on("Select-Imagen-product",(event, id) => {

   Open_Image_Select(mainWindow,"producto")

})

ipcMain.on("Add-product",(event,data_new)=>{

    fs.readFile(PathDB.Data,(err, data) => {

    	console.log(data_new,JSON.parse(data))
       
       Add_product(data_new,JSON.parse(data))

    })

})

ipcMain.on("Delete-product",(event,id)=>{
  
  fs.readFile(PathDB.Data,(err, data) => {
      
      Delet_product(id,JSON.parse(data))

  })

})

/*--------------------------funciones de imagenes -----------------------------------*/

/*******************************Section Musica********************************************/
/********Leer Carpeta******************/


/********Leer Carpeta******************/

/*******************************************************************/





/*******************************************************************/

ipcMain.on('Open_Select_music',(event, id) => {

    Open_Select_music(mainWindow)

})


ipcMain.on('data-time-get',(event, id) => {

  mainWindow.send("data-time-send",time)

})


ipcMain.on('save-time',(event, time_data) => {

  Time(time_data)

})
/**************************Section Musica************************************/


/*---------------------------------------funciones de area-----------------------------------------------------------------------------*/

function Save_new_data_area(data,db){

    let indice = db.findIndex(element => JSON.stringify(element.id) === JSON.stringify(data.id));
   
    /**actualizar**/
     db.splice(indice,1,data)
    /**actualizar**/

    let data_save = JSON.stringify(db);

    fs.writeFile(PathDB.Data, 
            data_save,{
                  encoding: "utf8",
                  flag: "w",
                  mode: 0o666
                },
            (err) => {
                if (err){
              console.log(err);
                }
              else {
                console.log(" update area successfully\n");
              }
    });




}

function Add_new_Area(db){

  console.log(db)

    const val = Object.values(os.networkInterfaces());
    const dataOs = val.flat().find(objeto => objeto.internal === false && objeto.family === 'IPv4');

    let data = {
            "id":uuidv4(),
            "name_area":"Default"+"-"+(db.length+1),
            "image_background":"http://"+dataOs["address"]+":3000/default2.png",
            "section":["3","3"],
            "product":[]
          }; 

    db.push(data)

    fs.writeFile(PathDB.Data, 
      
    JSON.stringify(db),{
            encoding: "utf8",
            flag: "w",
            mode: 0o666
          },
          (err) => {
                  if (err){
                        console.log(err);
                    }
                  else{
                    console.log("new area successfully\n");
                  }
    });

/**********************************************************/


}

function Borrar_area(id,db){

        let area = db.filter(obj => obj.id !== id);

        console.log(area)

        /*save product generate fichero*/
        let data = JSON.stringify(area); /*informacion conversion*/
         
        fs.writeFile(PathDB.Data,data,
              {
                encoding: "utf8",
                flag: "w",
                mode: 0o666
              },
              (err) => {
                if (err){
                  console.log(err);
                }
                else {
                  console.log("Delet area successfully")
                }
          });
}

/*---------------------------------------funciones de area-----------------------------------------------------------------------------*/

/*---------------------------------------funciones de producto-----------------------------------------------------------------------------*/

function Add_product(data,db){

    const val = Object.values(os.networkInterfaces());

    const dataOs = val.flat().find(objeto => objeto.internal === false && objeto.family === 'IPv4');

    let busqueda = db.find(element => element.name_area === data.name_area) ?? -1

    console.log(busqueda)

     let obj = {
        "id":uuidv4(),
        "name_article":"Default"+(busqueda.product.length+1),
        "image":"http://"+dataOs["address"]+":3000/default.png",
        "pos":data.pos
      }

        busqueda.product.push(obj)

        let data_save = JSON.stringify(db);

        fs.writeFile(PathDB.Data, 
          data_save,{
                  encoding: "utf8",
                  flag: "w",
                  mode: 0o666
                },
          (err) => {
                        if (err){
                      console.log(err);
                        }
                      else {
                        console.log(" add product successfully\n");
                      }
        });
}

function Update_product(id,db){

    for (let i = 0; i < db.length; i++){

    let select = db[i].product;

      for (let j = 0; j < select.length; j++) {

          if(select[j].id===product.id){
              console.log("iguals")
                  select.splice(j,1,product) 
                  break;
          }
      }
    }

    let data_save = JSON.stringify(db); 

    fs.writeFile(PathDB.Data, 
      data_save,{
              encoding: "utf8",
              flag: "w",
              mode: 0o666
            },
      (err) => {
                    if (err){
                  console.log(err);
                    }
                  else {
                    console.log("  update product successfully\n");
                  }
    });
}

function Delet_product(id,db){

 for (let i = 0; i < db.length; i++){

    let info = db[i].product;

      for (let j = 0; j < info.length; j++) {

          if(info[j].id===id){
                
                 info.splice(j, 1);
                  break;        
          }
      }
  }
  
     
    let data_save = JSON.stringify(db); 

    fs.writeFile(PathDB.Data, 
        data_save,{
                encoding: "utf8",
                flag: "w",
                mode: 0o666
              },
        (err) => {
                      if (err){
                    console.log(err);
                      }
                    else {
                      console.log("delet product successfully\n");
                    }
      });

}
/*---------------------------------------funciones de producto-----------------------------------------------------------------------------*/

function Time(time_data){

    let conten = {"time_limit":time_data}

    fs.writeFile(PathDB.time,JSON.stringify (conten), (err)=> {
                        if (err) throw err;
                        console.log('save timer-count');
    });
}

/*-------------------------------------------------------------------------------------------*/
ipcMain.on("quit",(event,data)=>{

      app.quit()

})
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
