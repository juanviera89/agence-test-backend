var mysql = require('mysql');
const routes = require('../api/routes/routes');

var connect = function(app){
    
    console.log('Connecting to mySQL');
    
    /* var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : 'root',
        database: 'agence_db'
      }); */
      var connection = mysql.createConnection({
        host     : 'sql10.freesqldatabase.com',
        user     : 'sql10215721',
        password : 'Ti2I2i6Yfw', 
        database: 'sql10215721'
      });
      
      connection.connect(function(err) {
        if (err) {
          console.error('error connecting to MySQL: ' + err.stack);
          return;
        }
      
        console.log('connected to MySQL as id ' + connection.threadId);
        
        routes(app,connection)
      });  

   
}





module.exports = connect;