
const consutores = require('../controllers/consutores');

const routes = function(app,mySQLConnection){
    
        console.log('entrando en routes con conexion');
        console.log(mySQLConnection.threadId);
        
        app.route('/api/consultores')
        .get((req,res)=>{
            consutores.getNames(req,res,mySQLConnection)
        });
        
        app.route('/api/relatorio')
        .post((req,res)=>{
            consutores.getRelatorio(req,res,mySQLConnection)
        });
        
    }
    
    module.exports = routes;