var express = require('express');
var bootstrap = require('./bootstrap/bootstrapApp');

const app = express();
bootstrap(app);


app.set('port', process.env.PORT);

const server = app.listen(app.get('port'), ()=>{
    console.log('Agence Server started in port --> '+ server.address().port);
})


