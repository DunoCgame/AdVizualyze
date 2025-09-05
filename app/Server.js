
const path = require('path')
const fs = require('fs')
const os = require('os')


module.exports = function Server_system(){

            const express = require('express');
            const app = express();
            const http = require('http');
            const server = http.createServer(app);
            const { Server } = require("socket.io");
            const io = new Server(server,{
                            cors: { origin: '*' }
                    });

            const PathDB = require(path.join(__dirname,'Path_db.js'));
            const App_config = require(PathDB.App_config)
            const Data_App = require(PathDB.Data)
            const time = require(PathDB.time)

            const val = Object.values(os.networkInterfaces());
            const dataOs = val.flat().find(objeto => objeto.internal === false && objeto.family === 'IPv4');

            const PORT = 3000;
           // const IP = "172.168.4.4"

            app.use(express.static(path.join(PathDB.data_app)));
            app.use(express.static(path.join(PathDB["musica"])));
            app.use(express.static(path.join(PathDB["upload"])));
            app.use(express.static(path.join(__dirname,'public/')));
            app.use(express.static(path.join(__dirname,'public/default')));

            // Manejo de rutas
            app.get(PathDB.data_app, (req, res) => {
              res.sendFile(PathDB.Data);

              /*const data = { message: 'Hello, world!', value: 42 };
                    res.json(data);*/
            });

            // Manejo de errores 404
           app.use((req, res, next) => {
                res.status(404).send('404 Not Found');
            });

            // Manejo de errores 500
            app.use((err, req, res, next) => {
                console.error(err.stack);
                res.status(500).send('500 Internal Server Error');
            });


/*************************************************************/
io.on('connection', (socket) => {
    
    console.log('Un usuario se ha conectado');

   io.emit("data-publish",Data_App);

    socket.on('Select-Musica', (mensaje) => {
       
            //console.log('Mensaje recibido: ' + mensaje); 
            io.emit('Select-Musica', mensaje);  

    });

    socket.on('Play', (mensaje) => {
        
            console.log('Mensaje recibido: ' + mensaje);
            io.emit('Play');
    });


    socket.on('Pause', (mensaje) => {

        io.emit('Pause');

    });

        socket.on("Volumen", (data) => {

            io.emit('Volumen',data);


        })

        fs.watch(PathDB.Data,(eventType, filename) => { 
                
                    fs.readFile(PathDB.Data,(err, data) => {
                                    
                                    if (err) throw err;

                                io.emit("data-publish",JSON.parse(data));
                    })

        });


    // Manejo de la desconexión
    socket.on('disconnect', () => {
        console.log('Un usuario se ha desconectado');
    });
});

/*************************************************************/
            // Iniciar el servidor
            server.listen(PORT,() => {
                console.log(`Servidor escuchando en http://localhost:${PORT}`);
                console.log("Servidor escuchando en "+"http://"+dataOs["address"]+":"+PORT);
            });

}