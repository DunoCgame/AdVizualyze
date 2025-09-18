const path = require('path')
const fs = require('fs')
const os = require('os')
const PathDB = require(path.join(__dirname,'Path_db.js'));

function Get_data_time(){
      try {
            const data = fs.readFileSync(path.join(PathDB.Time_Trial).toString(), 'utf8');
            const datos = JSON.parse(data);
            return datos;
      } catch (error) {
            console.error(error);
            return null;
      }
}

function Save_data_init_time(data){

    fs.writeFile(path.join(PathDB.Time_Trial).toString(),JSON.stringify(data),
                  {
                    encoding: "utf8",
                    flag: "w",
                    mode: 0o666
                  },
                  (err) => {
                    if (err){
                     //console.log("err ",err);
                    }
                    else {
                      console.log("File Update successfully\n");
                       console.log(Get_data_time());
                    }
    });

}

module.exports = {
	Get_data_time:Get_data_time,
	Save_data_init_time:Save_data_init_time
};