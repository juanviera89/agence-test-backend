const bodyParser = require('body-parser');
const connection = require('../databases/connection');
//const routes = require('../api/routes/routes');
var express = require('express');

const boot = function (app){
    app.use(bodyParser.json());
    app.use((req,res,next)=>{
        // used for Dev test on localhost
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, x-access-token');
      if ('OPTIONS' == req.method) {
        res.sendStatus(200);
      }
      else {
        next();
      }
    });
    connection(app);
    //routes(app);

}

module.exports = boot;