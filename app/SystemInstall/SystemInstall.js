const {app, BrowserWindow, Menu, MenuItem, ipcMain,ipcRenderer, dialog, Notification } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { v4: uuidv4 } = require('uuid');
const CryptoJS = require("crypto-js");

const PathDB = require(path.join(__dirname,'../Path_db.js'));
const App_config = require(PathDB.App_config);
const Data_App_Square = require(PathDB.data_square);

const {Save_data_init_time} = require('../Trial_time_app.js');

module.exports = function SystemInstall(mainWindow){

        window_SystemInstall = new BrowserWindow({
                /*parent: mainWindow,*/
                width:800,
                height:600,             
                modal:true,
                show:true, 
                icon:path.join(__dirname,'../favicon.ico'),
                webPreferences: {
                nodeIntegration: false, // is default value after Electron v5
                contextIsolation: true, // protect against prototype pollution
                enableRemoteModule: false, // turn off remote
                preload:path.join(__dirname,"../preload.js")
                }
        })

        window_SystemInstall.loadFile("app/SystemInstall/SystemInstall.html")


       //window_SystemInstall.webContents.openDevTools()   
        
        window_SystemInstall.once('ready-to-show',() => {

                window_SystemInstall.show()      

        })

        ClearDataSystemApp()
 
}

/*----------------------------------------------------------------*/
function ClearDataSystemApp(){

    /*--------------------------------------------------*/
    const info = {
            "status":false,
            "code":"",
            "date":"",
            "trial":false,
            "machine": {
                "hostname":"",
                "platform":"",
                "cpu":""
          },
          "server":{
            "ip":"",
            "port":"3000"
          }
    };

    fs.writeFile(PathDB.App_config,JSON.stringify(info), function (err) {
        if (err) throw err;
        console.log('reset App config Saved!');
    });
    /*--------------------------------------------------*/
    var fecha = new Date();
    var diaTexto = fecha.toLocaleDateString();
    let key="AdVizualyze"+diaTexto+"=";

    fs.writeFile(PathDB.KeyRegistre, JSON.stringify(key), (err) => {
        if (err) throw err;
        console.log('reset key file!');
    });
    /*--------------------------------------------------*/

    let date_time = {"TiempoInicial":"","TiempoFinal":""}

    fs.writeFile(PathDB.Time_Trial,JSON.stringify(date_time), function (err) {
        if (err) throw err;
        console.log('reset Time trial Saved!');
    });




}

/*----------------------------------------------------------------*/

ipcMain.on('code-app-activate',(event,code_app_recive) => {
  
    Read_key_code(code_app_recive)

})
/**********************************************************/

function Read_key_code(code_app_recive){

    /**********************************/
    let KeyApp_control = require(PathDB.KeyRegistre);
    
    /**********************************/
    console.log('code-app-activate',code_app_recive);

    let code_data = JSON.parse(code_app_recive);

    console.log(code_data)
 
    let key, id_app;
    key = code_data[0];
    id_app = code_data[1];

    // Desencriptar mensaje

    const password = "123647859AdVizualyze";
    const bytes = CryptoJS.AES.decrypt(key, password);
    const decryptedMessage = bytes.toString(CryptoJS.enc.Utf8);

    console.log("KeyApp_control",KeyApp_control)
    console.log("Mensaje decryptedMessage:", decryptedMessage);
    console.log("------------------")
    console.log(KeyApp_control)
    console.log(decryptedMessage);

    if(decryptedMessage === KeyApp_control){

        console.log("clave valida")
            Generate_key_app_admin(id_app)
    }
    else{

        console.log("clave invalida")
        app.quit();
    }
    
}

/**-------------------------------------------------------------------------------**/

function Generate_key_app_admin(code){

 console.log("Install App....")

    let KeyApp_control = require(PathDB.KeyRegistre);

    fs.writeFile(PathDB.KeyRegistre, JSON.stringify(KeyApp_control+code), (err) => {
              if (err) throw err;
              console.log('The "data to append" was appended to file!');
    });

    /*----------------------------------------------*/
   
    const val = Object.values(os.networkInterfaces());
    const dataOs = val.flat().find(objeto => objeto.internal === false && objeto.family === 'IPv4');

    const info = {
            "status": true,
            "code":code,
            "date": new Date().toString(),
            "trial":false,
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

    /*--------------------------------------------------*/

    fs.writeFile(PathDB.data_square,JSON.stringify([]), (err) => {
              if (err) throw err;
              console.log('Clear file Data!');
    });

    const contenido = [
      {
        "id":uuidv4(),
        "name_area":"Default-"+(Data_App_Square.length+1),
        "background":"linear-gradient(0deg, #003399 0%, #660066 100%)",
        "product":[]
             
      }
    ];

    fs.writeFile(PathDB.data_square,JSON.stringify(contenido), (err) => {
              if (err) throw err;
              console.log('Data contenido app ok!');
    });

    /*--------------------------------------------------*/

    if (!fs.existsSync(PathDB["upload"])) {

            console.log('carpeta upload no existe.');

            fs.mkdir(PathDB["upload"],(err) => {
                if (err) {
                   return console.error(err);
                }
                 console.log('Se ha creado la carpeta upload correctamente.');
            });
    }
    else {
      console.log('La carpeta upload ya existe.');

       fs.readdir(PathDB["upload"], (err, files) => {
          if (err) {
            console.error('Error al leer el directorio:', err);
            return;
          }

          files.forEach((file) => {
            const filePath = path.join(PathDB["upload"], file);
            fs.unlink(filePath, (unlinkErr) => {
              if (unlinkErr) {
                console.error(`Error al borrar el archivo ${filePath}:`, unlinkErr);
              } else {
                console.log(`${filePath} borrado exitosamente.`);
              }
            });
          });
        });
    } 

    /*------------------------------------------------------*/

    if (!fs.existsSync(PathDB["musica"])) {

        console.log('carpeta musica no existe.');
         
        fs.mkdir(PathDB["musica"],(err) => {
              if (err) {
                 return console.error(err);
              }
               console.log('Se ha creado la carpeta musica correctamente.');
        });

    } 
    else {

       console.log('La carpeta musica ya existe.');
       fs.readdir(PathDB["musica"], (err, files) => {
          if (err) {
            console.error('Error al leer el directorio:', err);
            return;
          }

          files.forEach((file) => {
            const filePath = path.join(PathDB["musica"], file);
            fs.unlink(filePath, (unlinkErr) => {
              if (unlinkErr) {
                console.error(`Error al borrar el archivo ${filePath}:`, unlinkErr);
              } else {
                console.log(`${filePath} borrado exitosamente.`);
              }
            });
          });
        });

    }
    /*----------------------------------------------*/

    setTimeout(function(){
            
            app.relaunch();
            app.quit();

    },9000)

}


/**-------------------------------------------------------------------------------**/
ipcMain.on("App-trial-system",(event,code_app_recive) => {

    Install_App_trial();

})

function Install_App_trial(){

    console.log("Install Trial ...App")
    const val = Object.values(os.networkInterfaces());
    const dataOs = val.flat().find(objeto => objeto.internal === false && objeto.family === 'IPv4');

    const info = {
            "status": true,
            "code":"",
            "date": new Date().toString(),
            "trial":true,
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

    /*--------------------------------------------------*/

    fs.writeFile(PathDB.data_square,JSON.stringify([]), (err) => {
              if (err) throw err;
              console.log('Clear file!');
    });

    const contenido = [
              {
                "id":uuidv4(),
                "name_area":"Default-"+(Data_App_Square.length+1),
                "background":"linear-gradient(0deg, #003399 0%, #660066 100%)",
                "product":[]
                     
              }
    ];

    fs.writeFile(PathDB.data_square,JSON.stringify(contenido), (err) => {
              if (err) throw err;
              console.log('Data contenido app ok!');
    });

    /*--------------------------------------------------*/

    if (!fs.existsSync(PathDB["upload"])) {

            console.log('carpeta no upload existe.');

            fs.mkdir(PathDB["upload"],(err) => {
                if (err) {
                   return console.error(err);
                }
                 console.log('Se ha creado la carpeta upload correctamente.');
            });
    }
    else {
            console.log('La carpeta upload ya existe.');

       fs.readdir(PathDB["upload"], (err, files) => {
          if (err) {
            console.error('Error al leer el directorio:', err);
            return;
          }

          files.forEach((file) => {
            const filePath = path.join(PathDB["upload"], file);
            fs.unlink(filePath, (unlinkErr) => {
              if (unlinkErr) {
                console.error(`Error al borrar el archivo ${filePath}:`, unlinkErr);
              } else {
                console.log(`${filePath} borrado exitosamente.`);
              }
            });
          });
        });
    } 

    if (!fs.existsSync(PathDB["musica"])) {

             console.log('carpeta no musica existe.');
                 
                  fs.mkdir(PathDB["musica"],(err) => {
                          if (err) {
                             return console.error(err);
                          }
                           console.log('Se ha creado la carpeta musica correctamente.');
                      });
      
    } else {
             console.log('La carpeta musica ya existe.');
               fs.readdir(PathDB["musica"], (err, files) => {
                  if (err) {
                    console.error('Error al leer el directorio:', err);
                    return;
                  }

                  files.forEach((file) => {
                    const filePath = path.join(PathDB["musica"], file);
                    fs.unlink(filePath, (unlinkErr) => {
                      if (unlinkErr) {
                        console.error(`Error al borrar el archivo ${filePath}:`, unlinkErr);
                      } else {
                        console.log(`${filePath} borrado exitosamente.`);
                      }
                    });
                  });
                });
    }
  
    setTimeout(function(){
            
            app.relaunch();
            app.quit();

    },9000)
}
/**-------------------------------------------------------------------------------**/

ipcMain.on("Time-trial-system-activate",(event,data)=>{

    Save_data_init_time(data);
    
})
