var express = require('express');
var bootstrap = require('./bootstrap/bootstrapApp');

const app = express();
bootstrap(app);


app.set('port', 3001);

const server = app.listen(app.get('port'), ()=>{
    console.log('Agence Server started in port --> '+ server.address().port);
})


