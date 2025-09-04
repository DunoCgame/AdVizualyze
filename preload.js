const {contextBridge,ipcRenderer} = require("electron");

contextBridge.exposeInMainWorld(
    "api", {
        fs:()=>require('fs'),
        path:()=>require('path'),
        OpenSelectImage:(channel)=>{
        
             ipcRenderer.send(channel);
            
        },
        OpenWindow:(channel,data)=>{
                
                        ipcRenderer.send(channel,data); 
        },

        /*info*/
        send:(channel, data) => {
                                ipcRenderer.send(channel, data); 
        },
        receive:(channel, data) => {
                                ipcRenderer.on(channel,data);
        },
        /*comumicacion entre ventanas */
       
        Info_Windows_Send:(channel,data) => {
               ipcRenderer.send(channel,data); 
        },
        Info_Windows_Receive:(channel,data) => {
               ipcRenderer.on(channel,data);
        },
        
    }
);