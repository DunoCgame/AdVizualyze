const path = require('path')
const fs = require('fs')
const os = require('os')
const Data_Product = require(path.join(__dirname,"./public/data_app/data.json"))
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server,{
                cors: { origin: '*' }
        });



// Configurar la dirección IP estática y el puerto
const ip = '192.168.1.70'; // Reemplaza con tu dirección IP estática
const port = 3000; // Reemplaza con el puerto que desees utilizar



module.exports = function Server_system(){


// Configurar la carpeta para cargar archivos estáticos
app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'public/upload')));
app.use(express.static(path.join(__dirname,'public/musica')));
//app.use(express.static(path.join('public/data_app/')));

// Configurar una ruta para enviar el index.html

app.get('public/data_app/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/data_app/app.json'));
});

// Ruta para manejar errores de navegación
app.use(function(req, res, next) {
  res.status(404).send('Error 404: Página no encontrada');
});

/****************************************************/

io.on('connection', (socket) => {
  console.log('Un usuario se ha conectado');

   io.emit("data-publish",Data_Product);


  socket.on('mensaje', (mensaje) => {
    console.log('Mensaje recibido: ' + mensaje);
    io.emit('mensaje', mensaje);
  }); 
/******************************************************************/
   socket.on('Select-Musica', (mensaje) => {
    console.log('Mensaje recibido: ' + mensaje);
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

fs.watch(path.join(__dirname,"./public/data_app/data.json"), (eventType, filename) => { 
     io.emit("data-publish",Data_Product);


  });
/*

socket.on("data-publish", (data) => {


})
*/
   /*



   socket.on('previe', (mensaje) => {
    console.log('Mensaje recibido: ' + mensaje);
    io.emit('Select-Musica', mensaje);
  }); 
    socket.on('next', (mensaje) => {
    console.log('Mensaje recibido: ' + mensaje);
    io.emit('Select-Musica', mensaje);
  });*/

/******************************************************************/
  socket.on('disconnect', () => {
    console.log('Un usuario se ha desconectado');


  });
});

server.listen(3000, () => {
  console.log('El servidor está escuchando en el puerto 3000');
});





}