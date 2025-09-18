const path = require('path')
const fs = require('fs')
const os = require('os')
const PathDB = require(path.join(__dirname,'../Path_db.js'));
const TimeAppData = require(PathDB.Time_Trial)

console.log(TimeAppData);

 let TiempoInicial;
 let TiempoFinal;
 let TiempoTransCurrido;

 function buscarPorClave(objeto, clave) {
  if (objeto.hasOwnProperty(clave)) {
    return objeto[clave];
  } else {
    return null; // O podrías devolver undefined, o lanzar un error, según prefieras.
  }
}

class Tiempo_Trial_App{

	constructor(){

		TiempoInicial = new Date();
		console.log(TiempoInicial )
		//TiempoFinal = new Date(TiempoInicial.getTime() + 24 * 60 * 60 * 1000);
		//Save_Time_Transcurrido("TiempoInicial",TiempoInicial)

	}


	Tiempo_Inicial(){

		return TiempoInicial;

	}
	Tiempo_Final(){

		return TiempoFinal;

	}
	Tiempo_Trans_Currido(){

		return TiempoTransCurrido;
	}

	GetData_Time_Trial(){



	}

	Save_Time_Transcurrido(clave, nuevoValor) {

	let dataSearch =  buscarPorClave(TimeAppData,clave);
		console.log("trt",dataSearch)

	}
}

module.exports = Tiempo_Trial_App;