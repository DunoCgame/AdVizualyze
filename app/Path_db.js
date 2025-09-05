const path = require('path')
/****/
let URL = {
	"App_config":path.join(__dirname,'../data_app/.App_config.json'),
	"Data":path.join(__dirname,'../data_app/Data.json'),
	"time":path.join(__dirname,'../data_app/time.json'),
	"data_app":path.join(__dirname,'../data_app/'),
	"musica":path.join(__dirname,'../data_app/musica'),
	"upload":path.join(__dirname,'../data_app/upload')
}

/********PARA USO COMPILADO ***

let URL = {
	"App_config":path.join(__dirname,'../../data_app/.App_config.json'),
	"Data":path.join(__dirname,'../../data_app/Data.json'),
	"time":path.join(__dirname,'../../data_app/time.json'),
	"data_app":path.join(__dirname,'../../data_app/'),
	"musica":path.join(__dirname,'../../data_app/musica'),
	"upload":path.join(__dirname,'../../data_app/upload')
}
***/

module.exports = URL;

