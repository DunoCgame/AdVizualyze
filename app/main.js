const {app, BrowserWindow, Menu, MenuItem, ipcMain, dialog} = require('electron')
const path = require('path')
const fs = require('fs')
const os = require('os')
const { v4: uuidv4 } = require('uuid');
const Server_System = require('./Server');

const {Open_Image_Select} = require('./Group_Image_Select.js');
const {Open_Select_music} = require('./Group_Music_Select.js');
const SystemInstall = require("./SystemInstall/SystemInstall.js");
const {Get_data_time,Update_data_time} = require('./Trial_time_app.js');
const PathDB = require(path.join(__dirname,'Path_db.js'));
const App_config = require(PathDB.App_config)
const Data_square = require(PathDB.data_square)

let Premiso_de_reload=false;

/********************************************/

let mainWindow;

function SelectSystemApp(){

    console.log("Select system install")
    

      if(App_config.status==false && App_config.code=="" && App_config.trial==false){

          SystemInstall();
      }  
     
       /*-------------------------------------------------------------------*/
      if(App_config.status==true && App_config.code!="" && App_config.trial==false){

        Premiso_de_reload=true;
        
        createWindow()

      } 
      if(App_config.status==true && App_config.code=="" && App_config.trial==true){

        Premiso_de_reload=true;
        
        createWindow()

      }
}
   
function createWindow(){

    mainWindow = new BrowserWindow({
        width: 1050,
        height: 700,
        autoHideMenuBar:true,  
        icon:path.join(__dirname,'/favicon.ico'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true, 
            preload:path.join(__dirname,'preload.js')
        }

    });

    mainWindow.loadFile(path.join(__dirname,'public/admin.html'));

   // mainWindow.webContents.openDevTools() 
    
    Server_System()

}

/*----------------------------Reload of Data for change-----------------------*/
fs.watch(PathDB.data_square, (eventType, filename) => {

    if(Premiso_de_reload==true){

      fs.readFile(PathDB.data_square, (err, data) => {
              if (err) throw err;
              mainWindow.send("Render-Data-reload-change",JSON.parse(data))           
      });

    }

});

/*----------------------------Reload of Data for change--------------------------------*/

/*---------------------Enviar Informacioon de Render Datos-----------------*/
ipcMain.on('Data-System',(event,data) => {

    const Ip_addres = Object.values(os.networkInterfaces());
    const IP = Ip_addres.flat().find(objeto => objeto.internal === false && objeto.family === 'IPv4');

    fs.readFile(PathDB.data_square, (err, data) => {
              
              if (err) throw err;

              mainWindow.send("Send-data-default",JSON.parse(data))           
              mainWindow.send("Send-data-server",App_config.server.ip+":"+App_config.server.port)
              mainWindow.send("data-time-counter",Get_data_time())
    });

    const rutaCarpeta = PathDB["musica"]

    const archivosArray = []; // Array para almacenar los nombres de los archivos

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
        });
                // Esperar un momento para asegurarse de que todos los archivos se hayan procesado
        setTimeout(() => {
          
            mainWindow.send("Select-music-send", archivosArray);

        }, 1000); 

       }
    });
})


ipcMain.on('app_version', (event) => {
  
    mainWindow.send('app_version', { name:app.getName(), version: app.getVersion() });

});
/*---------------------Enviar Informacioon de Render Data-------------------*/
/*---------------------------Search data------------------------------------*/
ipcMain.on("Search-area-select",(event, id) => {

		fs.readFile(PathDB.data_square, (err, data) => {
		                
		  if (err) throw err;

		  mainWindow.send("Render_Data_search",JSON.parse(data).filter(element => element.id === id) ?? -1)

		})
})
/*---------------------------Funciones de Area-------------------------------*/
ipcMain.on("save_area",(event,data_area) => {

  fs.readFile(PathDB.data_square, (err, data) => {
                 
      Save_new_data_area(data_area,JSON.parse(data))
  })

})

ipcMain.on("Borrar-area-select",(event,id) => {

    fs.readFile(PathDB.data_square, (err, data) => {
      
        Borrar_area(id,JSON.parse(data))
    })

})

ipcMain.on("Adding_area",(event, id) => {

    fs.readFile(PathDB.data_square, (err, data) => {
   
        Add_new_Area(JSON.parse(data))

    })

})

ipcMain.on("Select-Imagen-area",(event, id) => {

  Open_Image_Select(mainWindow,"area")

})
/*--------------------------funciones de Area -----------------------------------*/
/*--------------------------funciones de imaghenes --------------------------------*/

ipcMain.on("Select-Imagen-product",(event, id) => {

   Open_Image_Select(mainWindow,"producto")

})
/*--------------------------funciones de imagenes -----------------------------------*/

/*******************************Section Musica********************************************/

ipcMain.on('Open_Select_music',(event, id) => {

    Open_Select_music(mainWindow)

})

/**************************Section Musica************************************/
/************************Trial control function********************************/

ipcMain.on("cierre-de-aplicacion",(event,data)=>{

 
 
})

/************************Trial control function********************************/
/*--------------------------------funciones de uso---------------------------------*/

/*--------------systema de guardado-----------------*/
function Save_new_data_area(data,db){

  console.log("Save_new_data_area");

    let indice = db.findIndex(element => JSON.stringify(element.id) === JSON.stringify(data.id));
    
    db.splice(indice,1,data)
   
    let data_save = JSON.stringify(db);

    fs.writeFile(PathDB.data_square, 
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
/*--------------systema de guardado-----------------*/
/*---------------------------------------funciones de area-------------------------------------*/

function Add_new_Area(db){

    const val = Object.values(os.networkInterfaces());
    const dataOs = val.flat().find(objeto => objeto.internal === false && objeto.family === 'IPv4');

    let data = {
            "id":uuidv4(),
            "name_area":"Default"+"-"+(db.length+1),
            "background":"linear-gradient(0deg, #003399 0%, #660066 100%)",
            "product":[]
          }; 

    db.push(data)

    fs.writeFile(PathDB.data_square, 
      
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
}

function Borrar_area(id,db){

        let area = db.filter(obj => obj.id !== id);

        /*save product generate fichero*/
       let data = JSON.stringify(area); /*informacion conversion*/

        fs.writeFile(PathDB.data_square,data,
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

/*---------------------------------------funciones de producto------------------------------------------------------------*/

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

        fs.writeFile(PathDB.data_square, 
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

/*---------------------------------------funciones de producto-----------------------------------------------------------------------------*/

/*-------------------------------------------------------------------------------------------*/
app.on('will-quit', (event) => {
  console.log('La aplicacion esta a punto de cerrarse.');
  // Aquí puedes realizar acciones como:
  // - Guardar el estado de la aplicación
  // - Cerrar conexiones de red
  // - Liberar recursos
});


app.on('quit', (event, exitCode) => {
  /*
  Se dispara después de que la aplicación ha finalizado. Es más para 
  registro o acciones que no afectan el proceso de cierre en sí.*/

  console.log(`La aplicacion se ha cerrado con el codigo de salida: ${exitCode}`);
  // Este es el último punto de ejecución en el proceso principal
});


// Evento cuando la app está lista para crear ventanas
app.on('ready', SelectSystemApp,  Menu.setApplicationMenu(null));

// Evento cuando todas las ventanas están cerradas
app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') {
          app.quit();
    }
});

// Evento cuando la app se activa (solo en macOS)
app.on('activate', () => {
    if(BrowserWindow.getAllWindows().length === 0) {
             // createWindow();
             SelectSystemApp();
    }
});
