'use strict'

//cargar modulos 
var express = require('express')
var bodyParser= require('body-parser')



//ejecutar express
var app= express();

//cargar rutas
var article_routes=require('./routes/article');




//cargar Middleware

app.use(bodyParser.urlencoded({extended:false}))//cargar el body parse
app.use(bodyParser.json());

//cors acceso cruzado entre dominios
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});



//añadir prefijos rutas / cargar rutas
app.use('/api',article_routes); 

/* ruta de prueba
app.post('/datos-curso',(req,res)=>{
var hola= req.query.hola
  return res.status(200).send(
    {
        curso:'Master en Framework Js',
        autor:'Rodrigo Sancho',
        hola
      
    }
    
   )

}) */

//exportar modulo 
module.exports =app;