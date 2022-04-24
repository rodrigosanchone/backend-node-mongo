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

//cors


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